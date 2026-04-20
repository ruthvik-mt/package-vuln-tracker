from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
from .database import db
from .config import settings
from .auth import create_access_token, verify_password, settings as auth_settings
from .schemas import Token
from .routers import packages, versions

app = FastAPI(title="Package Service", version="1.0.0")

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
    # Auto-bootstrap tables for Neon/External DB compatibility
    await db.execute("""
        CREATE TABLE IF NOT EXISTS packages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            ecosystem VARCHAR(50) NOT NULL,
            UNIQUE(name, ecosystem)
        )
    """)
    await db.execute("""
        CREATE TABLE IF NOT EXISTS versions (
            id SERIAL PRIMARY KEY,
            package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
            version VARCHAR(50) NOT NULL,
            UNIQUE(package_id, version)
        )
    """)

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

app.include_router(packages.router)
app.include_router(versions.router)

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != settings.ADMIN_USERNAME or not verify_password(form_data.password, settings.ADMIN_PASSWORD_HASH):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
