# app/sites/myntra.py
from bs4 import BeautifulSoup
from typing import List, Dict
import re

def search_url(term: str, price_max: int | None = None) -> str:
    from urllib.parse import quote_plus
    base = "https://www.myntra.com/" + quote_plus(term)
    return base

def _parse_price(text: str) -> float:
    if not text: return 0.0
    t = text.replace("₹", "").replace(",", "").strip()
    m = re.search(r"(\d+(\.\d+)?)", t)
    return float(m.group(1)) if m else 0.0

def parse_listings(html: str, top_k: int = 10) -> List[Dict]:
    soup = BeautifulSoup(html, "lxml")
    cards = soup.select("li.product-base")
    if not cards:  # fallback new layout
        cards = soup.select("div.product")
    results = []
    for c in cards[:top_k]:
        name_el = c.select_one("h4.product-product") or c.select_one("h3.product-brand")
        price_el = c.select_one("span.product-discountedPrice") or c.select_one("span.price")
        link_el = c.select_one("a")
        if not (name_el and link_el):
            continue
        name = name_el.get_text(strip=True)
        href = link_el.get("href")
        link = "https://www.myntra.com" + href if href and href.startswith("/") else href
        price = _parse_price(price_el.get_text(strip=True)) if price_el else 0.0
        results.append({
            "name": name, "price": price, "rating": None, "reviews": None, "link": link, "source": "myntra.com"
        })
    return results
