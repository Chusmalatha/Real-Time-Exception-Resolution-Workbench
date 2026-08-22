from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AuditLogCreate(BaseModel):
    transaction_id: Optional[str] = None
    event_type: str
    description: str
    actor: str
    confidence: Optional[int] = None
    threshold: Optional[int] = None
    previous_status: Optional[str] = None
    new_status: Optional[str] = None

class AuditLogResponse(BaseModel):
    id: str = Field(..., alias="_id")
    transaction_id: Optional[str] = None
    event_type: str
    description: str
    actor: str
    confidence: Optional[int] = None
    threshold: Optional[int] = None
    previous_status: Optional[str] = None
    new_status: Optional[str] = None
    timestamp: datetime

    class Config:
        populate_by_name = True
