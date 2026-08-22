from fastapi import APIRouter, Query
from typing import List, Optional
from app.schemas.audit import AuditLogResponse
from app.services import audit_service

router = APIRouter(prefix="/audit-logs", tags=["Audit"])

@router.get("", response_model=List[AuditLogResponse])
async def get_audit_logs(
    transaction_id: Optional[str] = Query(None, description="Filter by transaction ID"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    limit: int = Query(100, ge=1, le=1000)
):
    """
    Get audit logs, sorted newest first.
    """
    return await audit_service.get_audit_logs(transaction_id=transaction_id, event_type=event_type, limit=limit)
