from pydantic import BaseModel
from typing import List, Optional

class CVEBase(BaseModel):
    cve_id: str
    description: str
    severity: str
    cvss_score: float
    package_name: str
    version: str

class CVECreate(CVEBase):
    pass

class CVE(CVEBase):
    id: int

    class Config:
        from_attributes = True

class RiskScore(BaseModel):
    package_name: str
    risk_score: float
    cve_count: int
    average_cvss: float

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str
