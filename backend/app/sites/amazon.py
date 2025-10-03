# app/sites/amazon.py
from bs4 import BeautifulSoup
from typing import List, Dict
import re
from ..core import schemas
from ..core.schemas import Item

def search_url(term: str, price_max: int | None = None) -> str:
    from urllib.parse import quote_plus
    base = "https://www.amazon.in/s?k=" + quote_plus(term)
    if price_max:
        # Amazon price param in paise via p_36
        base += f"&rh=p_36%3A-{int(price_max)*100}"
    return base

def _parse_price(text: str) -> float:
    if not text: return 0.0
    text = text.replace(",", "").strip()
    m = re.search(r"(\d+(\.\d+)?)", text)
    return float(m.group(1)) if m else 0.0

def parse_listings(html: str, top_k: int = 10) -> List[Dict]:
    soup = BeautifulSoup(html, "lxml")
    cards = soup.select("div.s-result-item[data-component-type='s-search-result']") or []
    results = []
    for c in cards:
        title_el = c.select_one("h2 a span")
        if not title_el:
            title_el = c.select_one("span.a-size-medium")
        link_el = c.select_one("h2 a")
        price_whole = c.select_one("span.a-price-whole")
        price_frac = c.select_one("span.a-price-fraction")
        rating_el = c.select_one("span.a-icon-alt")
        reviews_el = c.select_one("span[aria-label*='ratings'], span.a-size-base")

        name = title_el.get_text(strip=True) if title_el else None
        link = None
        if link_el and link_el.get("href"):
            href = link_el.get("href")
            if href.startswith("/"):
                link = "https://www.amazon.in" + href
            else:
                link = href
        price_text = None
        if price_whole:
            price_text = price_whole.get_text(strip=True) + (price_frac.get_text(strip=True) if price_frac else "")
        elif c.select_one("span.a-price"):
            price_text = c.select_one("span.a-price").get_text(strip=True)
        rating = rating_el.get_text(strip=True) if rating_el else None
        reviews = reviews_el.get_text(strip=True) if reviews_el else None

        if not name or not link:
            continue
        try:
            price = _parse_price(price_text) if price_text else 0.0
        except:
            price = 0.0

        try:
            rating_val = float(rating.split(" out of")[0]) if rating else None
        except:
            rating_val = None

        try:
            import re
            reviews_val = int(re.sub(r"[^\d]", "", reviews)) if reviews else None
        except:
            reviews_val = None

        results.append({
            "name": name,
            "price": price,
            "rating": rating_val,
            "reviews": reviews_val,
            "link": link,
            "source": "amazon.in"
        })
        if len(results) >= top_k:
            break
    return results
