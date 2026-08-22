"""
resolution_service.py

Handles Resolve and Escalate actions for transactions.

Business rules enforced HERE (server-side), never trusted from the frontend:
  - Resolve: transaction confidence must meet AUTO_RESOLUTION_THRESHOLD.
  - Escalate: transaction must be in a pending/review state.

The threshold is defined once in this module so a future Settings API
can replace the constant without touching route code.
"""

import os
from datetime import datetime
from fastapi import HTTPException
from app.database.database import get_database
from app.services import settings_service, audit_service
from app.schemas.resolution import HumanResolutionRequest

# Statuses from which a transaction can be resolved or escalated

# Statuses from which a transaction can be resolved or escalated
RESOLVABLE_STATUSES = {"PENDING", "HUMAN_REVIEW"}


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _get_transaction(transaction_id: str) -> dict:
    """Fetch a transaction by ID; raise 404 if not found."""
    db = get_database()
    txn = await db["transactions"].find_one({"transaction_id": transaction_id})
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return txn


async def _apply_status(transaction_id: str, new_status: str, action: str = None, resolution_type: str = None, resolved_by: str = None) -> dict:
    """Update transaction status and updated_at; return the updated document."""
    db = get_database()
    now = datetime.utcnow()
    
    update_data = {"status": new_status, "updated_at": now}
    if action:
        update_data["resolution_action"] = action
    if resolution_type:
        update_data["resolution_type"] = resolution_type
    if resolved_by:
        update_data["resolved_by"] = resolved_by
        
    await db["transactions"].update_one(
        {"transaction_id": transaction_id},
        {"$set": update_data},
    )
    return await _get_transaction(transaction_id)


async def get_resolution_record(transaction_id: str) -> dict:
    db = get_database()
    return await db["audit_logs"].find_one({"transaction_id": transaction_id, "event_type": {"$in": ["HUMAN_RESOLUTION", "AUTO_RESOLUTION", "ESCALATION"]}}, sort=[("timestamp", -1)])

# ── Public API ────────────────────────────────────────────────────────────────

async def process_human_resolution(transaction_id: str, request: HumanResolutionRequest) -> dict:
    """
    Process a human reviewer's resolution action.
    """
    txn = await _get_transaction(transaction_id)

    current_status = txn.get("status", "")
    if current_status not in RESOLVABLE_STATUSES:
        raise HTTPException(
            status_code=409,
            detail=f"Transaction is already '{current_status}' and cannot be resolved again."
        )

    action = request.action.upper()
    if action not in ["APPROVE", "BLOCK", "REQUEST_VERIFICATION", "ESCALATE"]:
        raise HTTPException(status_code=400, detail=f"Invalid action: {action}")

    if action in ["APPROVE", "BLOCK"]:
        new_status = "RESOLVED"
    elif action == "REQUEST_VERIFICATION":
        new_status = "HUMAN_REVIEW"
    elif action == "ESCALATE":
        new_status = "ESCALATED"

    confidence: int = txn.get("confidence", 0)
    threshold = await settings_service.get_auto_resolution_threshold()

    await audit_service.create_audit_log(
        event_type="HUMAN_RESOLUTION" if new_status != "ESCALATED" else "ESCALATION",
        description=f"Transaction was {action.lower()} by {request.reviewer}. Reason: {request.reason}",
        actor=request.reviewer,
        transaction_id=transaction_id,
        confidence=confidence,
        threshold=threshold,
        previous_status=current_status,
        new_status=new_status
    )

    return await _apply_status(
        transaction_id=transaction_id,
        new_status=new_status,
        action=action,
        resolution_type="HUMAN",
        resolved_by=request.reviewer
    )

async def execute_ai_resolution(transaction_id: str, action: str) -> dict:
    """
    Execute the AI-recommended action if business rules allow.
    
    Rules:
      1. Transaction must be in a resolvable state.
      2. AI confidence must be >= AUTO_RESOLUTION_THRESHOLD.
      
    Status mapping:
      APPROVE, BLOCK, REQUEST_VERIFICATION -> AUTO_RESOLVED
      ESCALATE -> ESCALATED
    """
    txn = await _get_transaction(transaction_id)

    current_status = txn.get("status", "")
    if current_status not in RESOLVABLE_STATUSES:
        raise HTTPException(
            status_code=409,
            detail=f"Transaction is already '{current_status}'."
        )

    confidence: int = txn.get("confidence", 0)
    threshold = await settings_service.get_auto_resolution_threshold()
    
    if confidence < threshold:
        raise HTTPException(
            status_code=422,
            detail=(
                f"Auto-resolution rejected: AI confidence is {confidence}%, "
                f"below threshold of {threshold}%. "
                f"HUMAN APPROVAL REQUIRED."
            )
        )

    if action == "ESCALATE":
        new_status = "ESCALATED"
    elif action in ["APPROVE", "BLOCK", "REQUEST_VERIFICATION"]:
        new_status = "AUTO_RESOLVED"
    else:
        raise HTTPException(status_code=400, detail=f"Invalid action: {action}")

    await audit_service.create_audit_log(
        event_type="AUTO_RESOLUTION" if new_status != "ESCALATED" else "ESCALATION",
        description=f"AI Auto Resolution: {action}",
        actor="System",
        transaction_id=transaction_id,
        confidence=confidence,
        threshold=threshold,
        previous_status=current_status,
        new_status=new_status
    )

    return await _apply_status(
        transaction_id=transaction_id,
        new_status=new_status,
        action=action,
        resolution_type="AI_AUTO",
        resolved_by="AI Employee"
    )

async def auto_resolve_transaction(transaction_id: str) -> dict:
    """
    Attempt to auto-resolve a transaction.
    If confidence >= threshold, sets status to AUTO_RESOLVED.
    If confidence < threshold, returns HUMAN_REVIEW_REQUIRED without changing DB.
    """
    txn = await _get_transaction(transaction_id)
    confidence: int = txn.get("confidence", 0)
    threshold = await settings_service.get_auto_resolution_threshold()
    risk_level: str = txn.get("risk_level", "")

    if confidence >= threshold and risk_level != "CRITICAL":
        current_status = txn.get("status", "")
        await audit_service.create_audit_log(
            event_type="AUTO_RESOLUTION",
            description="Transaction automatically resolved. Confidence met threshold.",
            actor="System",
            transaction_id=transaction_id,
            confidence=confidence,
            threshold=threshold,
            previous_status=current_status,
            new_status="AUTO_RESOLVED"
        )
        await _apply_status(
            transaction_id=transaction_id,
            new_status="AUTO_RESOLVED",
            action="AUTO_RESOLVE",
            resolution_type="AI_AUTO",
            resolved_by="AI Employee"
        )
        return {
            "success": True,
            "status": "AUTO_RESOLVED",
            "confidence": confidence,
            "threshold": threshold
        }
    else:
        return {
            "success": False,
            "status": "HUMAN_REVIEW_REQUIRED",
            "confidence": confidence,
            "threshold": threshold
        }
