# app/agents/ranking_agent.py
import math
from typing import List, Dict

DEFAULT_WEIGHTS = {
    "rating": 0.5,
    "reviews": 0.25,
    "price": 0.25
}

def _normalize(v, vmin, vmax):
    if vmax == vmin:
        return 0.5
    return (v - vmin) / (vmax - vmin)

class RankingAgent:
    def __init__(self, weights: dict | None = None):
        self.weights = weights or DEFAULT_WEIGHTS

    def rank(self, items: List[Dict]) -> List[Dict]:
        if not items:
            return []

        prices = [it["price"] for it in items if it.get("price") is not None]
        ratings = [it["rating"] for it in items if it.get("rating") is not None]
        reviews = [it["reviews"] for it in items if it.get("reviews") is not None]

        pmin, pmax = (min(prices), max(prices)) if prices else (0, 1)
        rmin, rmax = (min(ratings), max(ratings)) if ratings else (0, 5)
        revmin, revmax = (min(reviews), max(reviews)) if reviews else (0, 1)

        for it in items:
            nr = _normalize(it.get("rating") or 0.0, rmin, rmax)
            # more reviews -> more confident
            nrev = (math.log1p(it.get("reviews") or 0) / (math.log1p(revmax) if revmax else 1)) if reviews else 0
            # lower price -> better
            nprice = 1 - _normalize(it.get("price") or 0.0, pmin, pmax)

            score = (
                self.weights["rating"] * nr +
                self.weights["reviews"] * nrev +
                self.weights["price"] * nprice
            )
            it["score"] = round(float(score), 4)
        return sorted(items, key=lambda x: x.get("score", 0), reverse=True)
