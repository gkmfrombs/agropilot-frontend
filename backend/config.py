import os
import logging
import dotenv
from langchain_groq import ChatGroq
from langchain_neo4j import Neo4jGraph

# Configure professional logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
dotenv.load_dotenv()

# Strict Environment Validation
REQUIRED_ENV_VARS = ["NEO4J_URI", "NEO4J_USERNAME", "NEO4J_PASSWORD", "GROQ_API_KEY"]
for var in REQUIRED_ENV_VARS:
    if not os.getenv(var):
        logger.error(f"CRITICAL: Missing environment variable {var}. The application will fail.")

# ==========================================
# AI & DATABASE INITIALIZATION
# ==========================================

graph = None
llm = None

try:
    logger.info("Initializing Neo4j Graph Connection...")
    graph = Neo4jGraph(
        url=os.getenv("NEO4J_URI"), 
        username=os.getenv("NEO4J_USERNAME"), 
        password=os.getenv("NEO4J_PASSWORD")
    )

    logger.info("Initializing Groq Llama-3.3-70b Agent...")
    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"), 
        model_name="llama-3.3-70b-versatile",
        temperature=0 # Strict logic for database queries
    )
except Exception as e:
    logger.error(f"Failed to initialize core services: {str(e)}")
