import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def run():
    client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGODB_URI'))
    db = client[os.getenv('MONGODB_DATABASE')]
    await db['transactions'].update_one({'transaction_id': 'TXN050'}, {'$set': {'status': 'ESCALATED'}})
    print("Fixed TXN050")

asyncio.run(run())
