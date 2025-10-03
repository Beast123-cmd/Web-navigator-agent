# app/agents/parser_agent.py
import re
from typing import Dict, Any, List

DEFAULT_SITES = ["amazon.in", "flipkart.com", "myntra.com"]

class ParserAgent:
    def __init__(self, llm_integration=None):
        # llm_integration can be a LangChain/LangGraph wrapper (optional)
        self.llm = llm_integration

    def _extract_price_max(self, text: str) -> int | None:
        m = re.search(r"under\s*₹?(\d{1,3}(?:,?\d{3})*)", text.lower())
        if not m:
            m = re.search(r"under\s*(\d+)\s*k", text.lower())
        if m:
            num = m.group(1).replace(",", "")
            try:
                # If value is like '50k'
                if num.lower().endswith("k"):
                    return int(float(num[:-1]) * 1000)
                return int(float(num))
            except:
                return None
        return None

    def parse(self, query: str, override_sites: List[str] | None = None) -> Dict[str, Any]:
        # If we had an LLM: call it here to produce a Plan JSON with strict schema.
        # Fallback deterministic parse:
        sites = override_sites or DEFAULT_SITES
        price_max = self._extract_price_max(query) or None
        return {
            "sites": sites,
            "search_terms": query,
            "filters": {"price_max": price_max},
            "fields": ["name", "price", "rating", "reviews", "link"],
            "top_k": 5
        }
