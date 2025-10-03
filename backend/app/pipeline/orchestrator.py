# app/pipeline/orchestrator.py
import asyncio
from typing import List, Dict
from ..agents.parser_agent import ParserAgent
from ..agents.navigator_agent import NavigatorAgent
from ..agents.extractor_agent import ExtractorAgent
from ..agents.ranking_agent import RankingAgent
from ..agents.summarizer_agent import SummarizerAgent
from ..sites import amazon, flipkart, myntra
from ..core.schemas import Item

# site -> search_url mapping
SITE_URL_BUILDERS = {
    "amazon.in": amazon.search_url,
    "flipkart.com": flipkart.search_url,
    "myntra.com": myntra.search_url
}

# site -> wait selector (used to wait before extracting)
SITE_WAIT_SELECTORS = {
    "amazon.in": "div.s-result-item[data-component-type='s-search-result']",
    "flipkart.com": "div._1AtVbE",  # general container
    "myntra.com": "li.product-base"
}

class Orchestrator:
    def __init__(self, concurrency: int = 3):
        self.parser = ParserAgent()
        self.extractor = ExtractorAgent()
        self.ranker = RankingAgent()
        self.summarizer = SummarizerAgent()
        self.semaphore = asyncio.Semaphore(concurrency)

    async def _fetch_and_extract(self, nav: NavigatorAgent, site: str, term: str, price_max: int | None, top_k_per_site: int):
        url_builder = SITE_URL_BUILDERS.get(site)
        url = url_builder(term, price_max) if url_builder else term
        wait_selector = SITE_WAIT_SELECTORS.get(site)
        async with self.semaphore:
            try:
                html = await nav.fetch_listing_html(url, wait_for_selector=wait_selector)
            except Exception as e:
                print(f"Navigator failed for {site}: {e}")
                return []
        items = self.extractor.extract(site, html, top_k=top_k_per_site)
        return items

    async def run(self, request: dict):
        query = request["query"]
        top_k = request.get("top_k", 5)
        parsed = self.parser.parse(query, override_sites=request.get("sites"))
        term = parsed["search_terms"]
        price_max = parsed["filters"].get("price_max")

        sites = parsed.get("sites", ["amazon.in", "flipkart.com", "myntra.com"])
        per_site_k = max(8, top_k * 2)  # fetch more then reduce

        # Navigator context
        headless = not request.get("headful", False)
        nav = NavigatorAgent(headless=headless, user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        results = []
        async with nav:
            tasks = [ self._fetch_and_extract(nav, s, term, price_max, per_site_k) for s in sites ]
            done = await asyncio.gather(*tasks, return_exceptions=True)
            for res in done:
                if isinstance(res, Exception):
                    print("site task error", res)
                else:
                    results.extend(res)

        # dedupe by link
        seen = set()
        unique = []
        for it in results:
            link = it.get("link")
            key = link or it.get("name")
            if not key or key in seen:
                continue
            seen.add(key)
            unique.append(it)

        ranked = self.ranker.rank(unique)
        trimmed = ranked[:top_k]
        summarized = self.summarizer.summarize_items(trimmed)
        summary_text = self.summarizer.overview(summarized)
        return {
            "query": query,
            "items": summarized,
            "summary": summary_text
        }
