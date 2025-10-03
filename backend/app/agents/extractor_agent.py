# app/agents/extractor_agent.py
from typing import List, Dict
from app.sites import amazon, flipkart, myntra

SITE_PARSERS = {
    "amazon.in": amazon.parse_listings,
    "flipkart.com": flipkart.parse_listings,
    "myntra.com": myntra.parse_listings
}

class ExtractorAgent:
    def __init__(self):
        pass

    def extract(self, site: str, html: str, top_k: int = 10) -> List[Dict]:
        parser = None
        # find best matching parser (allow domain partial)
        for d, fn in SITE_PARSERS.items():
            if d in site:
                parser = fn
                break
        if parser is None:
            # last-resort: try amazon parser
            parser = amazon.parse_listings
        try:
            items = parser(html, top_k=top_k)
            return items
        except Exception as e:
            # return empty and let orchestrator continue
            print("Extractor error for", site, e)
            return []
