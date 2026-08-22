from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from app.services import ai_service
from app.services.transaction_service import get_transaction_by_id

router = APIRouter(tags=["AI"])

class ExplainRequest(BaseModel):
    transaction_id: str

class ExplainResponse(BaseModel):
    explanation: str
    risk_factors: List[str]
    summary: str
    confidence: int
    recommendation: str

class ChatRequest(BaseModel):
    transaction_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

class SuggestResolutionRequest(BaseModel):
    transaction_id: str

class SuggestResolutionResponse(BaseModel):
    recommended_action: str
    reason: str
    confidence: int
    risk_factors: List[str]

@router.post("/ai/explain", response_model=ExplainResponse)
async def explain_transaction_api(request: ExplainRequest):
    try:
        txn = await get_transaction_by_id(request.transaction_id)
        # convert to dict and remove _id to make it cleaner for the LLM
        txn_dict = dict(txn)
        if "_id" in txn_dict:
            del txn_dict["_id"]
        
        result = await ai_service.explain_transaction(txn_dict)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/chat", response_model=ChatResponse)
async def chat_transaction_api(request: ChatRequest):
    try:
        txn = await get_transaction_by_id(request.transaction_id)
        txn_dict = dict(txn)
        if "_id" in txn_dict:
            del txn_dict["_id"]
            
        result = await ai_service.chat_about_transaction(txn_dict, request.message)
        return {"response": result}
    except ValueError as ve:
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/suggest-resolution", response_model=SuggestResolutionResponse)
async def suggest_resolution_api(request: SuggestResolutionRequest):
    try:
        txn = await get_transaction_by_id(request.transaction_id)
        txn_dict = dict(txn)
        if "_id" in txn_dict:
            del txn_dict["_id"]
            
        result = await ai_service.suggest_resolution(txn_dict)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=503, detail=str(ve))
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
