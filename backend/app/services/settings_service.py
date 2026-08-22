from fastapi import HTTPException
from app.database.database import get_database
from app.services import audit_service

async def get_auto_resolution_threshold() -> int:
    """Fetch the auto resolution threshold from MongoDB. Default to 90 if not found."""
    db = get_database()
    setting = await db["settings"].find_one({"key": "AUTO_RESOLUTION_THRESHOLD"})
    if setting and "value" in setting:
        return int(setting["value"])
    
    # If not found, create it with default 90
    await db["settings"].insert_one({
        "key": "AUTO_RESOLUTION_THRESHOLD",
        "value": 90
    })
    return 90

async def update_auto_resolution_threshold(new_value: int) -> int:
    """Update the auto resolution threshold in MongoDB."""
    db = get_database()
    await db["settings"].update_one(
        {"key": "AUTO_RESOLUTION_THRESHOLD"},
        {"$set": {"value": new_value}},
        upsert=True
    )
    
    # Create audit log
    await audit_service.create_audit_log(
        event_type="THRESHOLD_CHANGE",
        description=f"Auto-resolution threshold changed to {new_value}%",
        actor="Human Reviewer/Admin",
        threshold=new_value
    )
    
    return new_value
