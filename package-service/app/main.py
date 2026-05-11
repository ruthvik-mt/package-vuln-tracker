from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from app.api.v1.endpoints import packages, versions
from app.db.session import db
from app.core.config import settings
from common.auth import create_access_token, get_password_hash, verify_password
from common.logging import setup_logging
from prometheus_fastapi_instrumentator import Instrumentator
import datetime

logger = setup_logging(settings.APP_NAME)
app = FastAPI(title=settings.APP_NAME, version="1.0.0")

Instrumentator().instrument(app).expose(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await db.connect()
    logger.info("Connected to database")

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()
    logger.info("Disconnected from database")

# Include routers with prefix
app.include_router(packages.router, prefix="/api/v1/packages", tags=["packages"])
app.include_router(versions.router, prefix="/api/v1/versions", tags=["versions"])

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != settings.ADMIN_USERNAME:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # In a real app, we'd check the hashed password against the DB
    if not verify_password(form_data.password, settings.ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token_expires = datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username},
        secret_key=settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.datetime.utcnow()}
