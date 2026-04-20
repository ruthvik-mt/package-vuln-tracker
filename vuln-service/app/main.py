from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
from .database import db
from .config import settings
from .auth import create_access_token, verify_password
from .schemas import Token
from .routers import cves, risk

app = FastAPI(title="Vulnerability Service", version="1.0.0")

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
        CREATE TABLE IF NOT EXISTS cves (
            id SERIAL PRIMARY KEY,
            cve_id VARCHAR(50) NOT NULL,
            description TEXT,
            severity VARCHAR(20),
            cvss_score NUMERIC(3, 1),
            package_name VARCHAR(255) NOT NULL,
            version VARCHAR(50),
            reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

app.include_router(cves.router)
app.include_router(risk.router)

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
