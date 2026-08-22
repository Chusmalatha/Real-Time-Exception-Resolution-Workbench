from contextlib import asynccontextmanager
from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv(override=True)
from fastapi.middleware.cors import CORSMiddleware
from .routes import health, transactions, ai, settings, audit
from .database.database import connect_to_mongo, close_mongo_connection
from .services import transaction_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to MongoDB, then set up indexes
    await connect_to_mongo()
    await transaction_service.setup_indexes()
    yield
    # Shutdown: close MongoDB connection
    await close_mongo_connection()

app = FastAPI(title="Real-Time Exception Resolution Workbench", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://frontend-gules-psi-my0adssh9h.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(audit.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Exception Resolution Workbench API"}
