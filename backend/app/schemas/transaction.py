from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional
from datetime import datetime

class TransactionStatus(str, Enum):
    PENDING = "PENDING"
    HUMAN_REVIEW = "HUMAN_REVIEW"
    RESOLVED = "RESOLVED"
    AUTO_RESOLVED = "AUTO_RESOLVED"
    ESCALATED = "ESCALATED"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class TransactionBase(BaseModel):
    transaction_id: str
    customer_name: str
    amount: float
    currency: str
    location: str
    usual_location: str
    device: str
    usual_device: str
    transaction_time: datetime
    average_transaction_amount: float
    flag_reasons: List[str]
    risk_level: RiskLevel
    confidence: int = Field(ge=0, le=100)
    status: TransactionStatus

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    status: Optional[TransactionStatus] = None
    risk_level: Optional[RiskLevel] = None
    confidence: Optional[int] = Field(None, ge=0, le=100)
    flag_reasons: Optional[List[str]] = None

class TransactionResponse(TransactionBase):
    created_at: datetime
    updated_at: datetime

class TransactionListResponse(BaseModel):
    transactions: List[TransactionResponse]
    total: int
