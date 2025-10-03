# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from playwright.async_api import async_playwright

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    mode: str = "search"
    preference: str = "default"

class ProductResult(BaseModel):
    name: str
    price: str
    rating: float
    specifications: List[str]
    link: str
    image: str

async def scrape_amazon(query: str) -> List[dict]:
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        search_url = f"https://www.amazon.in/s?k={query.replace(' ', '+')}"
        await page.goto(search_url)

        # Grab first 5 results
        items = await page.query_selector_all("div.s-main-slot div[data-asin]:has(h2)")
        for item in items[:5]:
            title = await item.query_selector_eval("h2 a span", "el => el.textContent") if await item.query_selector("h2 a span") else "N/A"
            price = await item.query_selector_eval(".a-price-whole", "el => el.textContent") if await item.query_selector(".a-price-whole") else "N/A"
            link = await item.query_selector_eval("h2 a", "el => el.href") if await item.query_selector("h2 a") else "#"
            image = await item.query_selector_eval("img.s-image", "el => el.src") if await item.query_selector("img.s-image") else ""
            results.append({
                "name": title.strip(),
                "price": f"₹{price.strip()}" if price != "N/A" else "N/A",
                "rating": 0,  # Amazon rating scraping can be added
                "specifications": [],
                "link": link,
                "image": image
            })
        await browser.close()
    return results

@app.post("/api/search")
async def search(req: SearchRequest):
    products = await scrape_amazon(req.query)
    return {"summary": f"Found {len(products)} products for {req.query}", "products": products}
