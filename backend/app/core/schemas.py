# app/core/schemas.py
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
    sites: Optional[List[str]] = None  # override default sites
    headful: Optional[bool] = False    # open visible browser for debug

class Item(BaseModel):
    name: str
    price: float
    rating: Optional[float] = None
    reviews: Optional[int] = None
    link: str
    source: Optional[str] = None
    specs: Optional[Dict[str, Any]] = None
    pros: Optional[List[str]] = None
    cons: Optional[List[str]] = None
    score: Optional[float] = None

class QueryResponse(BaseModel):
    query: str
    items: List[Item]
    summary: Optional[str] = None
