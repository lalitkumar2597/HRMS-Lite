import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "hrms_lite")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(MONGODB_URL)
    db.db = db.client[DATABASE_NAME]
    print("Connected to MongoDB")

    # Create indexes
    await db.db.employees.create_index("employee_id", unique=True)
    await db.db.employees.create_index("email", unique=True)
    await db.db.attendance.create_index([("employee_id", 1), ("date", 1)], unique=True)

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")  