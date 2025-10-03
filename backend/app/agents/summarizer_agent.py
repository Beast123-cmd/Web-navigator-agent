# app/agents/summarizer_agent.py
from typing import List, Dict, Any
import re

class SummarizerAgent:
    def __init__(self, llm=None):
        # llm can be an injected LLM client (ollama/langchain)
        self.llm = llm

    def _heuristic_pros_cons(self, name: str, specs: Dict | None = None):
        pros = []
        cons = []
        n = name.lower()
        if "ssd" in n or "nvme" in n:
            pros.append("NVMe/SSD storage (fast boot)")
        if re.search(r"\b(i5|ryzen 5|i7|ryzen 7)\b", n):
            pros.append("Strong CPU for price segment")
        if "battery" in (specs or {}) and "mAh" in str(specs.get("battery")):
            pros.append("Large battery")
        if "lightweight" in n or "light" in n:
            pros.append("Lightweight")
        # cons heuristics
        if "refurb" in n or "renewed" in n:
            cons.append("Refurbished/renewed product")
        if "notebook" in n and "integrated" in n:
            cons.append("Integrated graphics")
        return pros or ["Good value"], cons or ["Check exact specs on product page"]

    def summarize_items(self, items: List[Dict]) -> List[Dict]:
        for it in items:
            name = it.get("name", "")
            specs = it.get("specs")
            pros, cons = self._heuristic_pros_cons(name, specs)
            it["pros"] = pros
            it["cons"] = cons
            it["one_line"] = f"{name} — {', '.join(pros[:2])}."
        return items

    def overview(self, items: List[Dict]) -> str:
        if not items:
            return "No results found."
        top = items[0]
        return f"Top recommendation: {top['name']} (score {top.get('score')})."
