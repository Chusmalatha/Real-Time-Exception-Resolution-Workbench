from datetime import datetime
from typing import List, Optional
import pymongo
from fastapi import HTTPException
from app.database.database import get_database
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse

async def setup_indexes():
    db = get_database()
    transactions_collection = db["transactions"]
    await transactions_collection.create_index("transaction_id", unique=True)
    await transactions_collection.create_index("status")
    await transactions_collection.create_index("risk_level")
    await transactions_collection.create_index("created_at")

async def get_transactions(
    status: Optional[str] = None,
    risk: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    db = get_database()
    collection = db["transactions"]
    query = {}
    
    if status:
        query["status"] = status
    if risk:
        query["risk_level"] = risk
    if search:
        query["$or"] = [
            {"transaction_id": {"$regex": search, "$options": "i"}},
            {"customer_name": {"$regex": search, "$options": "i"}}
        ]
        
    cursor = collection.find(query).sort("created_at", pymongo.DESCENDING).skip(skip).limit(limit)
    transactions = await cursor.to_list(length=limit)
    
    total = await collection.count_documents(query)
    
    # Motor returns _id which is ObjectId, we don't necessarily need to return it if we have transaction_id
    # But TransactionResponse will ignore extra fields if configured or we just pass the dict.
    return {"transactions": transactions, "total": total}

async def get_transaction_by_id(transaction_id: str):
    db = get_database()
    collection = db["transactions"]
    txn = await collection.find_one({"transaction_id": transaction_id})
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return txn

async def create_transaction(txn_data: TransactionCreate):
    db = get_database()
    collection = db["transactions"]
    
    existing = await collection.find_one({"transaction_id": txn_data.transaction_id})
    if existing:
        raise HTTPException(status_code=409, detail="Transaction with this ID already exists")
        
    txn_dict = txn_data.model_dump()
    now = datetime.utcnow()
    txn_dict["created_at"] = now
    txn_dict["updated_at"] = now
    
    await collection.insert_one(txn_dict)
    
    # exclude _id if needed, but Pydantic handles it
    return await get_transaction_by_id(txn_data.transaction_id)

async def update_transaction(transaction_id: str, update_data: TransactionUpdate):
    db = get_database()
    collection = db["transactions"]
    
    existing = await collection.find_one({"transaction_id": transaction_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    update_dict = update_data.model_dump(exclude_unset=True)
    if not update_dict:
        return existing
        
    update_dict["updated_at"] = datetime.utcnow()
    
    await collection.update_one(
        {"transaction_id": transaction_id},
        {"$set": update_dict}
    )
    
    return await get_transaction_by_id(transaction_id)
