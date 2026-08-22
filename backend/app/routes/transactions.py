from fastapi import APIRouter, Query, status
from pydantic import BaseModel
from typing import Optional
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse, TransactionListResponse
from app.schemas.resolution import HumanResolutionRequest
from app.services import transaction_service
from app.services import resolution_service

router = APIRouter(prefix="/transactions", tags=["Transactions"])

class ExecuteResolutionRequest(BaseModel):
    action: str

@router.get("", response_model=TransactionListResponse)
async def get_transactions(
    status: Optional[str] = Query(None, description="Filter by transaction status"),
    risk: Optional[str] = Query(None, description="Filter by risk level"),
    search: Optional[str] = Query(None, description="Search by transaction ID or customer name"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    return await transaction_service.get_transactions(status=status, risk=risk, search=search, skip=skip, limit=limit)

@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(transaction_id: str):
    return await transaction_service.get_transaction_by_id(transaction_id)

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(transaction: TransactionCreate):
    return await transaction_service.create_transaction(transaction)

@router.patch("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(transaction_id: str, transaction: TransactionUpdate):
    return await transaction_service.update_transaction(transaction_id, transaction)

@router.post("/{transaction_id}/resolve", response_model=TransactionResponse)
async def resolve_transaction(transaction_id: str, request: HumanResolutionRequest):
    """
    Request a human resolution for a transaction.
    """
    return await resolution_service.process_human_resolution(transaction_id, request)

@router.get("/{transaction_id}/resolution")
async def get_resolution_record(transaction_id: str):
    """
    Get the resolution audit record for a transaction.
    """
    record = await resolution_service.get_resolution_record(transaction_id)
    if not record:
        return None
    record["_id"] = str(record["_id"])
    return record


@router.post("/{transaction_id}/execute-resolution", response_model=TransactionResponse)
async def execute_resolution(transaction_id: str, request: ExecuteResolutionRequest):
    """
    Execute an AI-recommended resolution action.
    """
    return await resolution_service.execute_ai_resolution(transaction_id, request.action)

@router.post("/{transaction_id}/auto-resolve")
async def auto_resolve_transaction(transaction_id: str):
    """
    Attempt to auto-resolve a transaction.
    """
    return await resolution_service.auto_resolve_transaction(transaction_id)
