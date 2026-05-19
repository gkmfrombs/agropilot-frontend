import os
import pandas as pd
from neo4j import GraphDatabase
import dotenv

dotenv.load_dotenv()

URI = os.getenv("NEO4J_URI")
USER = os.getenv("NEO4J_USERNAME")
PWD = os.getenv("NEO4J_PASSWORD")

driver = GraphDatabase.driver(URI, auth=(USER, PWD))

def create_indexes():
    """Indexes make lookups instant, speeding up massive data loads."""
    with driver.session() as session:
        print("Creating Database Indexes for hyper-speed...")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (r:Retailer) REQUIRE r.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (f:Farmer) REQUIRE f.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (t:Territory) REQUIRE t.id IS UNIQUE")

def load_syngenta_data():
    with driver.session() as session:
        
        # 1. Load Reps and Territories
        print("Loading Reps Territory Data...")
        df_reps = pd.read_csv("data/reps_territory.csv").fillna("")
        query_reps = """
        UNWIND $rows AS row
        MERGE (rep:Rep {id: row.rep_id})
        MERGE (t:Territory {id: row.territory_id})
        SET t.name = row.territory_name, t.district = row.district, t.state = row.state
        MERGE (rep)-[:COVERS]->(t)
        """
        session.run(query_reps, parameters={"rows": df_reps.to_dict('records')})

        # 2. Load Retailers and their Locations
        print("Loading Retailers Data...")
        df_retailers = pd.read_csv("data/retailers.csv").fillna("")
        query_retailers = """
        UNWIND $rows AS row
        MERGE (r:Retailer {id: row.retailer_id})
        MERGE (t:Territory {id: row.territory_id})
        MERGE (r)-[:ASSIGNED_TO]->(t)
        MERGE (teh:Tehsil {name: row.tehsil})
        MERGE (r)-[:LOCATED_IN]->(teh)
        """
        session.run(query_retailers, parameters={"rows": df_retailers.to_dict('records')})

        # 3. Load Growers (Farmers)
        print("Loading Growers Data...")
        df_growers = pd.read_csv("data/growers.csv").fillna("")
        query_growers = """
        UNWIND $rows AS row
        MERGE (f:Farmer {id: row.grower_id})
        SET f.age = toInteger(row.grower_age), 
            f.farm_size = toFloat(row.grower_farm_size), 
            f.device = row.device_type
        MERGE (teh:Tehsil {name: row.tehsil})
        MERGE (f)-[:LIVES_IN]->(teh)
        """
        session.run(query_growers, parameters={"rows": df_growers.to_dict('records')})

        # 4. Load Retailer Inventory (Weekly)
        print("Loading Retailer Inventory (310k+ rows)...")
        df_inventory = pd.read_csv("data/retailer_inventory_weekly.csv").fillna("")
        query_inventory = """
        UNWIND $rows AS row
        MATCH (r:Retailer {id: row.retailer_id})
        MERGE (p:Product {id: row.sku_id})
        ON CREATE SET p.name = row.sku_name
        MERGE (r)-[s:STOCKS]->(p)
        SET s.quantity = toInteger(row.sku_qty), 
            s.last_updated = row.week_end_date
        """
        
        records = df_inventory.to_dict('records')
        chunk_size = 5000
        total_rows = len(records)
        
        for i in range(0, total_rows, chunk_size):
            chunk = records[i:i + chunk_size]
            session.run(query_inventory, parameters={"rows": chunk})
            # This prints exactly how far along we are!
            print(f"   -> Processed {min(i + chunk_size, total_rows)} / {total_rows} inventory records...")

        print("SUCCESS: Syngenta Data successfully injected into the Graph Brain!")

if __name__ == "__main__":
    create_indexes()
    load_syngenta_data()
    driver.close()