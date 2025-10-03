# app/sites/flipkart.py
from bs4 import BeautifulSoup
from typing import List, Dict
import re

def search_url(term: str, price_max: int | None = None) -> str:
    from urllib.parse import quote_plus
    base = "https://www.flipkart.com/search?q=" + quote_plus(term)
    # Flipkart price filters are more complex; rely on UI for now
    return base

def _parse_price(text: str) -> float:
    if not text: return 0.0
    text = text.replace("₹", "").replace(",", "").strip()
    m = re.search(r"(\d+(\.\d+)?)", text)
    return float(m.group(1)) if m else 0.0

def parse_listings(html: str, top_k: int = 10) -> List[Dict]:
    soup = BeautifulSoup(html, "lxml")
    # Most product pages have cards under div._1AtVbE or div._2kHMtA
    cards = soup.select("div._1AtVbE div._2kHMtA") or soup.select("a._1fQZEK") or []
    results = []
    # Two common card shapes: grid & list
    # First try list-style:
    list_cards = soup.select("a._1fQZEK")
    if list_cards:
        for c in list_cards[:top_k]:
            name_el = c.select_one("div._4rR01T")
            price_el = c.select_one("div._30jeq3")
            rating_el = c.select_one("div._3LWZlK")
            reviews_el = c.select_one("span._2_R_DZ")
            name = name_el.get_text(strip=True) if name_el else None
            link = "https://www.flipkart.com" + c.get("href") if c.get("href") else None
            price = _parse_price(price_el.get_text(strip=True)) if price_el else 0.0
            rating = float(rating_el.get_text(strip=True)) if rating_el else None
            reviews = None
            if reviews_el:
                import re
                reviews = int(re.sub(r"[^\d]", "", reviews_el.get_text()))
            if name and link:
                results.append({
                    "name": name, "price": price, "rating": rating, "reviews": reviews, "link": link, "source": "flipkart.com"
                })
    else:
        # Fallback: try grid cards
        grid = soup.select("div._2kHMtA")
        for c in grid[:top_k]:
            name_el = c.select_one("a.s1Q9rs")
            price_el = c.select_one("div._30jeq3")
            rating_el = c.select_one("div._3LWZlK")
            link_el = c.select_one("a")
            name = name_el.get_text(strip=True) if name_el else None
            link = "https://www.flipkart.com" + (link_el.get("href") if link_el else "")
            price = _parse_price(price_el.get_text(strip=True)) if price_el else 0.0
            rating = float(rating_el.get_text(strip=True)) if rating_el else None
            results.append({
                "name": name, "price": price, "rating": rating, "reviews": None, "link": link, "source": "flipkart.com"
            })
    return results[:top_k]
