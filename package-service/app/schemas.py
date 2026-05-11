from pydantic import BaseModel
from typing import List, Optional

class VersionBase(BaseModel):
    version: str
    package_id: int

class VersionCreate(VersionBase):
    pass

class VersionRead(VersionBase):
    id: int

    class Config:
        from_attributes = True

class PackageBase(BaseModel):
    name: str
    ecosystem: str

class PackageCreate(PackageBase):
    pass

class PackageRead(PackageBase):
    id: int
    versions: List[VersionRead] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str
