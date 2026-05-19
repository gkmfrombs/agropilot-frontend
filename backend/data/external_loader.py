"""
Loads external agriculture datasets into text chunks for RAG embedding.

Datasets:
  - Crop_recommendation.csv  — NPK + weather conditions -> crop label
  - India_Agriculture_Crop_Production.csv — district-level yield data (Rabi focus)
"""
import os
import pandas as pd
from pathlib import Path

_EXTERNAL_DIR = Path(__file__).parent / "external"


def _path(filename: str) -> str:
    return str(_EXTERNAL_DIR / filename)


def crop_recommendation_docs() -> list[str]:
    """
    Columns: N, P, K, temperature, humidity, ph, rainfall, label
    Convert each row to a searchable text chunk.
    """
    fpath = _path("Crop_recommendation.csv")
    if not os.path.exists(fpath):
        return []
    df = pd.read_csv(fpath)
    docs = []

    # Also emit crop-level summary stats — more useful for RAG than individual rows
    crop_groups = df.groupby("label").agg({
        "N": "mean", "P": "mean", "K": "mean",
        "temperature": "mean", "humidity": "mean",
        "ph": "mean", "rainfall": "mean"
    }).round(1)

    for crop, row in crop_groups.iterrows():
        doc = (
            f"Crop recommendation for {crop}: "
            f"requires Nitrogen {row['N']} kg/ha, Phosphorus {row['P']} kg/ha, Potassium {row['K']} kg/ha. "
            f"Optimal temperature {row['temperature']} degrees C, humidity {row['humidity']}%, "
            f"soil pH {row['ph']}, rainfall {row['rainfall']} mm. "
            f"This dataset helps recommend {crop} cultivation for farmers with these soil and climate conditions."
        )
        docs.append(doc)

    # Rabi-relevant crop summaries explicitly
    rabi_crops = ["wheat", "chickpea", "mustard", "potato", "lentil", "peas"]
    for crop in rabi_crops:
        if crop in crop_groups.index:
            row = crop_groups.loc[crop]
            docs.append(
                f"Rabi crop {crop} soil requirements: N={row['N']}, P={row['P']}, K={row['K']} kg/ha. "
                f"Ideal temp={row['temperature']}C, pH={row['ph']}, rainfall={row['rainfall']}mm/season. "
                f"Use this to advise farmers on {crop} suitability for their fields."
            )

    return docs


def india_agri_production_docs() -> list[str]:
    """
    Columns: State, District, Crop, Year, Season, Area, Area Units,
             Production, Production Units, Yield
    Focus on Rabi crops relevant to Syngenta portfolio.
    """
    fpath = _path("India_Agriculture_Crop_Production.csv")
    if not os.path.exists(fpath):
        return []

    df = pd.read_csv(fpath, low_memory=False)
    docs = []

    # Filter to Rabi season + relevant crops only
    rabi_crops = ["Wheat", "Gram", "Mustard", "Rapeseed", "Potato", "Lentil", "Peas"]
    rabi_mask = df["Season"].str.contains("Rabi|Whole Year", case=False, na=False)
    crop_mask = df["Crop"].isin(rabi_crops)
    rabi_df = df[rabi_mask & crop_mask].dropna(subset=["Yield", "Production"])

    # State-level yield summaries (most useful for RAG)
    state_crop = rabi_df.groupby(["State", "Crop"]).agg({
        "Yield": "mean",
        "Area": "mean",
        "Production": "mean"
    }).round(2).reset_index()

    for _, row in state_crop.iterrows():
        doc = (
            f"Agricultural yield data: {row['Crop']} in {row['State']} (Rabi season). "
            f"Average yield: {row['Yield']} tonnes/hectare. "
            f"Average area: {row['Area']} hectares. "
            f"Average production: {row['Production']} tonnes. "
            f"Use this to benchmark farmer yield expectations and calculate realistic ROI for crop protection products."
        )
        docs.append(doc)

    # Top wheat-producing states — high priority for Syngenta field reps
    wheat_states = rabi_df[rabi_df["Crop"] == "Wheat"].groupby("State")["Production"].mean().sort_values(ascending=False).head(10)
    for state, prod in wheat_states.items():
        docs.append(
            f"Wheat production benchmark: {state} averages {round(prod, 0)} tonnes of wheat per season. "
            f"High production state — wheat fungicide and herbicide products (Tilt 250 EC, Topik 15 WP) have strong market potential here."
        )

    return docs


def load_all_external_docs() -> list[str]:
    """Returns all external dataset text chunks for RAG embedding."""
    docs = crop_recommendation_docs() + india_agri_production_docs()
    print(f"[External] Loaded {len(docs)} chunks from external datasets.")
    return docs
