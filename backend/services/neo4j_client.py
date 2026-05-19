"""
Neo4j graph database client — lazy init, graceful fallback.

If NEO4J_URI is not set in .env, all query functions return empty
lists silently. The rest of the app continues using CSV/vector RAG.
"""
from __future__ import annotations
from config import get_settings

_driver = None
_available = None  # None = not yet checked


def _get_driver():
    global _driver, _available
    if _available is False:
        return None
    if _driver is not None:
        return _driver
    s = get_settings()
    if not s.neo4j_uri:
        _available = False
        return None
    try:
        from neo4j import GraphDatabase
        _driver = GraphDatabase.driver(s.neo4j_uri, auth=(s.neo4j_user, s.neo4j_pass))
        _driver.verify_connectivity()
        _available = True
        print("[Neo4j] Connected to AuraDB graph database.")
        return _driver
    except Exception as e:
        print(f"[Neo4j] Connection failed — graph features disabled: {e}")
        _available = False
        return None


def is_available() -> bool:
    return _get_driver() is not None


def run_query(cypher: str, params: dict | None = None) -> list[dict]:
    driver = _get_driver()
    if not driver:
        return []
    with driver.session() as session:
        result = session.run(cypher, params or {})
        return [dict(r) for r in result]


def close():
    global _driver
    if _driver:
        _driver.close()
        _driver = None
