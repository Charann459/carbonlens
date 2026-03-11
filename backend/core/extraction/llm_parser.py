"""
llm_parser.py — Document extraction using Groq API (free tier)

Uses llama-3.3-70b-versatile via Groq's OpenAI-compatible endpoint.
Free tier: 30 requests/min, 14,400 requests/day — more than enough for hackathon.

Requires: GROQ_API_KEY in environment (get free key at console.groq.com)
"""

import json
import logging
import os
import re

import requests

logger = logging.getLogger(__name__)

# ── Config ───────────────────────────────────────────────────────────────────
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL   = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
GROQ_TIMEOUT = 30  # seconds — Groq is fast, 30s is generous

# ── Prompt ───────────────────────────────────────────────────────────────────
SYSTEM_PROMPT = (
    "You are a data extraction assistant for a carbon accounting system. "
    "You extract structured factory data from documents. "
    "You always respond with ONLY valid JSON — no explanation, no markdown, no code fences."
)

USER_PROMPT = """Extract information from the factory document below.
Return ONLY a valid JSON object with these exact fields.
Use null for any field you cannot find.

{{
  "energy": {{
    "total_kwh": <number or null>,
    "billing_period_days": <number or null>
  }},
  "materials": [
    {{
      "type": "<material name>",
      "quantity_kg": <number or null>,
      "quantity_raw": "<exact text from document>"
    }}
  ],
  "machines": [
    {{
      "name": "<machine name>",
      "rated_kw": <number or null>,
      "count": <number or null>
    }}
  ],
  "products": [
    {{
      "description": "<product name>",
      "hs_code": "<6-digit HS/CN code as string, or empty string if not found>",
      "quantity_units": <number or null>,
      "unit_weight_kg": <number or null>,
      "process_hint": "<forging|casting|stamping|machining|unknown>",
      "material": "<mild_steel|alloy_steel|aluminium|cast_iron|unknown>"
    }}
  ],
  "extraction_confidence": "<high|medium|low>",
  "extraction_notes": "<warnings or ambiguities, or empty string>"
}}

Document:
{document_text}"""


# ── Helpers ──────────────────────────────────────────────────────────────────

def _call_groq(document_text: str) -> str:
    """Call Groq chat completions API. Returns raw text response."""
    if not GROQ_API_KEY:
        raise RuntimeError(
            "GROQ_API_KEY is not set. "
            "Get a free key at https://console.groq.com and add it to your .env file."
        )

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": USER_PROMPT.format(document_text=document_text[:8000])},
        ],
        "temperature": 0.0,
        "max_tokens": 1024,
    }

    try:
        resp = requests.post(GROQ_URL, headers=headers, json=payload, timeout=GROQ_TIMEOUT)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]
    except requests.exceptions.HTTPError as e:
        status = e.response.status_code if e.response else "?"
        body   = e.response.text[:300] if e.response else ""
        raise RuntimeError(f"Groq API error {status}: {body}") from e
    except requests.exceptions.Timeout:
        raise RuntimeError("Groq request timed out. Check your internet connection.")
    except Exception as e:
        raise RuntimeError(f"Groq API call failed: {e}") from e


def _parse_json_response(raw: str) -> dict:
    """Parse JSON from LLM response. Strips markdown fences if present."""
    text = raw.strip()

    # Strip markdown fences
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text.strip()).strip()

    # Direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Fallback: extract first { ... } block
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    logger.error(f"Failed to parse JSON from Groq response:\n{raw[:500]}")
    raise ValueError("Groq did not return valid JSON. Check logs for raw response.")


def _extract_pdf_text(pdf_bytes: bytes) -> str:
    """Extract text from a digital PDF using pdfminer.six."""
    try:
        from pdfminer.high_level import extract_text
        import io
        return extract_text(io.BytesIO(pdf_bytes))
    except ImportError:
        raise RuntimeError(
            "pdfminer.six not installed. Run: pip install pdfminer.six"
        )
    except Exception as e:
        raise RuntimeError(f"PDF text extraction failed: {e}")


# ── Public API ────────────────────────────────────────────────────────────────

def extract_from_text(document_text: str) -> dict:
    """
    Extract structured factory data from plain text using Groq/llama-3.3-70b.

    Args:
        document_text: Raw text (electricity bill, CSV, production log)

    Returns:
        Structured dict with energy, materials, machines, products
    """
    raw = _call_groq(document_text)
    return _parse_json_response(raw)


def extract_from_pdf_bytes(pdf_bytes: bytes) -> dict:
    """
    Extract structured factory data from a digital PDF.
    Text is extracted first via pdfminer, then sent to Groq.

    Args:
        pdf_bytes: Raw bytes of uploaded PDF

    Returns:
        Structured dict with energy, materials, machines, products
    """
    logger.info("Extracting text from PDF...")
    text = _extract_pdf_text(pdf_bytes)

    if not text or len(text.strip()) < 50:
        logger.warning(
            "PDF text extraction returned very little content — "
            "may be a scanned/image PDF. Results may be poor."
        )

    logger.info(f"PDF text extracted ({len(text)} chars), sending to Groq...")
    return extract_from_text(text)


def check_groq_health() -> dict:
    """
    Check if Groq API is reachable and API key is valid.
    Returns dict with 'ok' bool and 'message' string.
    Used by /health/llm endpoint.
    """
    if not GROQ_API_KEY:
        return {
            "ok": False,
            "message": "GROQ_API_KEY not set. Get a free key at https://console.groq.com"
        }
    try:
        # Minimal test call
        headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
        payload = {
            "model": GROQ_MODEL,
            "messages": [{"role": "user", "content": "ping"}],
            "max_tokens": 5,
        }
        resp = requests.post(GROQ_URL, headers=headers, json=payload, timeout=10)
        if resp.status_code == 401:
            return {"ok": False, "message": "Invalid GROQ_API_KEY — check your key."}
        resp.raise_for_status()
        return {"ok": True, "message": f"Groq reachable, model: {GROQ_MODEL}"}
    except Exception as e:
        return {"ok": False, "message": f"Groq unreachable: {e}"}