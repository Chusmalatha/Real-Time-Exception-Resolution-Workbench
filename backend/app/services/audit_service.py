from datetime import datetime
from typing import Optional, List
from app.database.database import get_database

async def create_audit_log(
    event_type: str,
    description: str,
    actor: str,
    transaction_id: Optional[str] = None,
    confidence: Optional[int] = None,
    threshold: Optional[int] = None,
    previous_status: Optional[str] = None,
    new_status: Optional[str] = None
) -> dict:
    db = get_database()
    now = datetime.utcnow()
    record = {
        "event_type": event_type,
        "description": description,
        "actor": actor,
        "timestamp": now
    }
    
    if transaction_id is not None:
        record["transaction_id"] = transaction_id
    if confidence is not None:
        record["confidence"] = confidence
    if threshold is not None:
        record["threshold"] = threshold
    if previous_status is not None:
        record["previous_status"] = previous_status
    if new_status is not None:
        record["new_status"] = new_status

    result = await db["audit_logs"].insert_one(record)
    record["_id"] = result.inserted_id
    return record

async def get_audit_logs(transaction_id: Optional[str] = None, event_type: Optional[str] = None, limit: int = 100) -> List[dict]:
    db = get_database()
    query = {}
    if transaction_id:
        query["transaction_id"] = transaction_id
    if event_type:
        query["event_type"] = event_type
        
    cursor = db["audit_logs"].find(query).sort("timestamp", -1).limit(limit)
    logs = await cursor.to_list(length=limit)
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs
