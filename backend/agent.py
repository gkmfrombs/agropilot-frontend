import logging
from typing import TypedDict
from langchain_neo4j import GraphCypherQAChain
from langchain_core.prompts import PromptTemplate
from langgraph.graph import StateGraph, END

# Import initialized clients from config
from config import graph, llm

logger = logging.getLogger(__name__)

# ==========================================
# PROMPTS & GRAPH RAG CHAIN
# ==========================================

CYPHER_GENERATION_TEMPLATE = """
Task: Generate a Cypher query for a Neo4j graph based strictly on the provided schema.

CRITICAL RULES:
1. STRICT SCHEMA USE: ONLY use nodes and relationships in the Schema. NEVER invent nodes or labels.
2. FILTERING: Use toLower() and CONTAINS for text. Use mathematical operators (<, >) for inventory quantities.
3. ARROWS: NEVER use '>' or '<' in relationships. Use only '-'.
4. PROOF OF FILTER: You MUST return the property you are filtering by so the QA model can see it. 

=== SYNGENTA SCHEMA EXAMPLES ===
Q: Which farmers are in Tehsil Patna_T001?
MATCH (f:Farmer)-[:LIVES_IN]-(teh:Tehsil) 
WHERE toLower(teh.name) CONTAINS 'patna_t001'
RETURN f.id, teh.name

Q: Which retailers have low stock (less than 50) of Tilt 250 EC?
MATCH (r:Retailer)-[s:STOCKS]-(p:Product)
WHERE s.quantity < 50 AND toLower(p.name) CONTAINS 'tilt 250 ec'
RETURN r.id, p.name, s.quantity
=== END EXAMPLES ===

Schema: {schema}
Question: {question}
Cypher Query:"""

CYPHER_PROMPT = PromptTemplate(
    input_variables=["schema", "question"], 
    template=CYPHER_GENERATION_TEMPLATE
)

# Setup the specific chain for querying the graph
graph_chain = None
if graph and llm:
    try:
        graph_chain = GraphCypherQAChain.from_llm(
            graph=graph, 
            llm=llm, 
            verbose=True,
            cypher_prompt=CYPHER_PROMPT,          
            allow_dangerous_requests=True 
        )
    except Exception as e:
        logger.error(f"Failed to initialize GraphCypherQAChain: {str(e)}")

# ==========================================
# LANGGRAPH ROUTING ARCHITECTURE
# ==========================================

class AgentState(TypedDict):
    question: str
    response: str
    error: bool

def graph_node(state: AgentState):
    """Handles Syngenta internal database queries."""
    logger.info("Executing Node: GRAPH_DATABASE")
    if not graph_chain:
         return {
            "response": "I'm having trouble connecting to the Syngenta Knowledge Graph right now.", 
            "error": True
        }
    try:
        result = graph_chain.invoke({"query": state["question"]})
        return {"response": result["result"], "error": False}
    except Exception as e:
        logger.error(f"Graph query failed: {str(e)}")
        return {
            "response": "I'm having trouble connecting to the Syngenta Knowledge Graph right now.", 
            "error": True
        }

def general_node(state: AgentState):
    """Handles general agronomy and biology questions."""
    logger.info("Executing Node: GENERAL_AGRONOMY")
    if not llm:
        return {
            "response": "My core logic engine is currently unavailable.", 
            "error": True
        }
    try:
        prompt = f"You are the Syngenta Agri-Edge Co-Pilot. Answer this agronomy question professionally: {state['question']}"
        result = llm.invoke(prompt)
        return {"response": result.content, "error": False}
    except Exception as e:
        logger.error(f"LLM query failed: {str(e)}")
        return {
            "response": "My core logic engine is currently unavailable.", 
            "error": True
        }

def route_question(state: AgentState) -> str:
    """The intelligence router that classifies the user's intent."""
    if not llm:
        return "general_node"
    
    routing_prompt = f"""
    You are a routing agent for Syngenta. Read the user's question and classify it.
    - If the question asks about farmers, retailers, inventory levels, tehsils, or territories, output EXACTLY "GRAPH".
    - If the question asks about general agriculture, weather, crop diseases, or biology, output EXACTLY "GENERAL".
    
    Question: {state['question']}
    """
    try:
        decision = llm.invoke(routing_prompt).content.strip().upper()
        if "GRAPH" in decision:
            return "graph_node"
        return "general_node"
    except Exception as e:
        logger.error(f"Routing failed: {str(e)}")
        return "general_node" # Default to general if router fails

# Compile the LangGraph
workflow = StateGraph(AgentState)
workflow.add_node("graph_node", graph_node)
workflow.add_node("general_node", general_node)

workflow.set_conditional_entry_point(
    route_question,
    {"graph_node": "graph_node", "general_node": "general_node"}
)
workflow.add_edge("graph_node", END)
workflow.add_edge("general_node", END)

agri_agent = workflow.compile()
