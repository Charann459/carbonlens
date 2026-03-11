# LLM-based document parser using Claude API
# Extracts structured factory data from unstructured bills/invoices

import os
import json
import anthropic

EXTRACTION_PROMPT = """You are a data extraction assistant for a carbon accounting system.

Extract the following information from the provided factory document(s).
Return ONLY a valid JSON object with no preamble or markdown.
If a field cannot be found, return null for that field.

Required JSON structure:
{
  "energy": {
    "total_kwh": <number or null>,
    "billing_period_days": <number or null>
  },
  "materials": [
    {
      "type": "<material description>",
      "quantity_kg": <number or null>,
      "quantity_raw": "<raw text from document>"
    }
  ],
  "machines": [
    {
      "name": "<machine name>",
      "rated_kw": <number or null>,
      "count": <number or null>
    }
  ],
  "products": [
    {
      "description": "<product description>",
      "quantity_units": <number or null>,
      "unit_weight_kg": <number or null>,
      "process_hint": "<forging|casting|stamping|machining|unknown>"
    }
  ],
  "extraction_confidence": "<high|medium|low>",
  "extraction_notes": "<any warnings or ambiguities found>"
}

Document content:
{document_text}
"""

def extract_from_text(document_text: str) -> dict:
    """
    Extract structured data from raw document text using Claude API.
    
    Args:
        document_text: Raw text content from uploaded document
        
    Returns:
        Structured dict with extracted factory data
    """
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": EXTRACTION_PROMPT.format(document_text=document_text)
            }
        ]
    )
    
    raw = message.content[0].text.strip()
    
    # Strip any accidental markdown fences
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    
    return json.loads(raw)


def extract_from_pdf_bytes(pdf_bytes: bytes) -> dict:
    """
    Extract structured data directly from PDF bytes using Claude's vision.
    Preferred over text extraction for scanned/image PDFs.
    """
    import base64
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
    pdf_b64 = base64.standard_b64encode(pdf_bytes).decode("utf-8")
    
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_b64
                        }
                    },
                    {
                        "type": "text",
                        "text": EXTRACTION_PROMPT.format(document_text="[See attached PDF]")
                    }
                ]
            }
        ]
    )
    
    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    
    return json.loads(raw)
