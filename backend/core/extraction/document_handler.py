# Document handler — receives uploaded files, routes to appropriate extractor

import io
from fastapi import UploadFile
from core.extraction.llm_parser import extract_from_pdf_bytes, extract_from_text

SUPPORTED_TYPES = {
    "application/pdf": "pdf",
    "text/csv": "csv",
    "text/plain": "text",
}

async def handle_upload(file: UploadFile) -> dict:
    """
    Accepts an uploaded file and returns extracted structured data.
    
    Args:
        file: FastAPI UploadFile object
        
    Returns:
        Extracted data dict from LLM parser
    """
    content_type = file.content_type
    file_bytes = await file.read()
    
    if content_type == "application/pdf":
        return extract_from_pdf_bytes(file_bytes)
    
    elif content_type in ("text/csv", "text/plain"):
        text = file_bytes.decode("utf-8", errors="replace")
        return extract_from_text(text)
    
    else:
        raise ValueError(f"Unsupported file type: {content_type}. Supported: PDF, CSV, TXT")


def merge_extractions(extractions: list[dict]) -> dict:
    """
    Merges multiple extracted documents into one factory input.
    e.g., electricity bill + material invoice + production log = one merged input
    """
    # TODO: implement merge logic — prefer non-null values, sum quantities where appropriate
    if len(extractions) == 1:
        return extractions[0]
    
    merged = extractions[0].copy()
    for ext in extractions[1:]:
        if ext.get("energy", {}).get("total_kwh") and not merged.get("energy", {}).get("total_kwh"):
            merged["energy"] = ext["energy"]
        if ext.get("materials"):
            merged.setdefault("materials", []).extend(ext["materials"])
        if ext.get("products"):
            merged.setdefault("products", []).extend(ext["products"])
    
    return merged
