# app/api/routes.py
from fastapi import APIRouter, HTTPException
from app.core.schemas import QueryRequest, QueryResponse
from app.pipeline.orchestrator import Orchestrator
import asyncio

router = APIRouter()
orchestrator = Orchestrator(concurrency=3)

@router.post("/query", response_model=QueryResponse)
async def handle_query(req: QueryRequest):
    try:
        payload = req.dict()
        result = await orchestrator.run(payload)
        # Pydantic conversion will be handled by response_model
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
