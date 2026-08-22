import asyncio
import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Add backend directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load .env file from backend directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

from app.database.database import connect_to_mongo, close_mongo_connection, get_database

mock_transactions = [
    {
        "transaction_id": "TXN001",
        "customer_name": "Rahul Kumar",
        "amount": 95000,
        "currency": "INR",
        "location": "Mumbai",
        "usual_location": "Hyderabad",
        "device": "Chrome on Windows",
        "usual_device": "Android Mobile",
        "transaction_time": datetime.utcnow() - timedelta(minutes=15),
        "average_transaction_amount": 12000,
        "flag_reasons": ["Unusual location", "Transaction amount significantly above average"],
        "risk_level": "HIGH",
        "confidence": 94,
        "status": "PENDING"
    },
    {
        "transaction_id": "TXN002",
        "customer_name": "Priya Singh",
        "amount": 150000,
        "currency": "INR",
        "location": "Bengaluru",
        "usual_location": "Bengaluru",
        "device": "iPhone",
        "usual_device": "iPhone",
        "transaction_time": datetime.utcnow() - timedelta(hours=1),
        "average_transaction_amount": 150000,
        "flag_reasons": ["Large transaction", "Multiple transactions in a short period"],
        "risk_level": "MEDIUM",
        "confidence": 72,
        "status": "HUMAN_REVIEW"
    },
    {
        "transaction_id": "TXN003",
        "customer_name": "Amit Patel",
        "amount": 2500,
        "currency": "INR",
        "location": "Chennai",
        "usual_location": "Ahmedabad",
        "device": "Safari on Mac",
        "usual_device": "Chrome on Windows",
        "transaction_time": datetime.utcnow() - timedelta(hours=2),
        "average_transaction_amount": 5000,
        "flag_reasons": ["Location mismatch", "New device detected"],
        "risk_level": "LOW",
        "confidence": 67,
        "status": "AUTO_RESOLVED"
    },
    {
        "transaction_id": "TXN004",
        "customer_name": "Sneha Reddy",
        "amount": 240000,
        "currency": "INR",
        "location": "Delhi",
        "usual_location": "Delhi",
        "device": "Android Mobile",
        "usual_device": "Android Mobile",
        "transaction_time": datetime.utcnow() - timedelta(hours=3),
        "average_transaction_amount": 15000,
        "flag_reasons": ["Transaction amount significantly above average", "Velocity anomaly"],
        "risk_level": "CRITICAL",
        "confidence": 97,
        "status": "ESCALATED"
    },
    {
        "transaction_id": "TXN005",
        "customer_name": "Vikram Sharma",
        "amount": 45000,
        "currency": "INR",
        "location": "Pune",
        "usual_location": "Mumbai",
        "device": "Chrome on Android",
        "usual_device": "Chrome on Android",
        "transaction_time": datetime.utcnow() - timedelta(minutes=5),
        "average_transaction_amount": 40000,
        "flag_reasons": ["Unusual location"],
        "risk_level": "MEDIUM",
        "confidence": 81,
        "status": "PENDING"
    },
    {
        "transaction_id": "TXN006",
        "customer_name": "Ananya Gupta",
        "amount": 7800,
        "currency": "INR",
        "location": "Kolkata",
        "usual_location": "Kolkata",
        "device": "iPhone",
        "usual_device": "iPhone",
        "transaction_time": datetime.utcnow() - timedelta(minutes=30),
        "average_transaction_amount": 5000,
        "flag_reasons": ["Multiple transactions in a short period"],
        "risk_level": "LOW",
        "confidence": 86,
        "status": "RESOLVED"
    },
    {
        "transaction_id": "TXN007",
        "customer_name": "Rajesh Kumar",
        "amount": 95000,
        "currency": "INR",
        "location": "Visakhapatnam",
        "usual_location": "Hyderabad",
        "device": "Chrome on Windows",
        "usual_device": "Safari on Mac",
        "transaction_time": datetime.utcnow() - timedelta(hours=4),
        "average_transaction_amount": 20000,
        "flag_reasons": ["Unusual location", "New device detected", "Amount above average"],
        "risk_level": "HIGH",
        "confidence": 91,
        "status": "HUMAN_REVIEW"
    }
]

import random

cities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Visakhapatnam"]
devices = ["Android Mobile", "iPhone", "Chrome on Windows", "Safari on Mac", "Chrome on Android", "Firefox on Windows"]
first_names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Ananya", "Rajesh", "Kavya", "Suresh", "Neha", "Arjun", "Meera", "Rohan", "Pooja"]
last_names = ["Kumar", "Singh", "Patel", "Reddy", "Sharma", "Gupta", "Nair", "Iyer", "Rao", "Jain", "Deshmukh", "Verma"]

for i in range(8, 21):  # Generate exactly 20 transactions total
    avg_txn = random.randint(2, 50) * 1000  # Average transaction between 2k and 50k
    
    # Decide if it's anomalous amount
    is_high_amount = random.random() > 0.4
    if is_high_amount:
        amount = avg_txn * random.uniform(2.5, 8.0)
    else:
        amount = avg_txn * random.uniform(0.5, 1.5)
        
    amount = round(amount)
    
    usual_city = random.choice(cities)
    is_location_anomalous = random.random() > 0.7
    location = random.choice([c for c in cities if c != usual_city]) if is_location_anomalous else usual_city
    
    usual_device = random.choice(devices)
    is_device_anomalous = random.random() > 0.8
    device = random.choice([d for d in devices if d != usual_device]) if is_device_anomalous else usual_device
    
    flag_reasons = []
    if is_high_amount:
        flag_reasons.append("Transaction amount significantly above average")
    if is_location_anomalous:
        flag_reasons.append("Unusual location")
    if is_device_anomalous:
        flag_reasons.append("New device detected")
        
    # Introduce some random velocity flags
    if random.random() > 0.85:
        flag_reasons.append("Multiple transactions in a short period")
        
    if not flag_reasons:
        flag_reasons.append("Minor behavioral deviation")
        
    # Calculate confidence and risk based on anomalies
    anomaly_score = len(flag_reasons)
    
    if is_high_amount and (is_location_anomalous or is_device_anomalous):
        risk_level = "CRITICAL"
        confidence = random.randint(90, 99)
        status = "ESCALATED" if random.random() > 0.3 else "PENDING"
    elif anomaly_score >= 2 or (is_high_amount and amount > 100000):
        risk_level = "HIGH"
        confidence = random.randint(80, 94)
        status = random.choice(["PENDING", "HUMAN_REVIEW", "PENDING"])
    elif anomaly_score == 1:
        risk_level = "MEDIUM"
        confidence = random.randint(65, 85)
        status = random.choice(["PENDING", "RESOLVED", "PENDING"])
    else:
        risk_level = "LOW"
        confidence = random.randint(50, 75)
        status = "AUTO_RESOLVED" if random.random() > 0.2 else "RESOLVED"
        
    # Create the transaction
    mock_transactions.append({
        "transaction_id": f"TXN{i:03d}",
        "customer_name": f"{random.choice(first_names)} {random.choice(last_names)}",
        "amount": amount,
        "currency": "INR",
        "location": location,
        "usual_location": usual_city,
        "device": device,
        "usual_device": usual_device,
        "transaction_time": datetime.utcnow() - timedelta(minutes=random.randint(1, 1440)),
        "average_transaction_amount": avg_txn,
        "flag_reasons": flag_reasons,
        "risk_level": risk_level,
        "confidence": confidence,
        "status": status
    })

async def seed():
    await connect_to_mongo()
    db = get_database()
    collection = db["transactions"]
    
    print("Dropping existing transactions and audit_logs collections...")
    await collection.drop()
    await db["audit_logs"].drop()
    
    print("Creating indexes...")
    await collection.create_index("transaction_id", unique=True)
    await collection.create_index("status")
    await collection.create_index("risk_level")
    await collection.create_index("created_at")
    
    print(f"Inserting {len(mock_transactions)} transactions...")
    now = datetime.utcnow()
    for txn in mock_transactions:
        txn["created_at"] = now
        txn["updated_at"] = now
    
    await collection.insert_many(mock_transactions)
    print("Seed complete!")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed())
