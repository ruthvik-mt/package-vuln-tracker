from pydantic import BaseModel
from typing import List, Optional

class VersionBase(BaseModel):
    version: str

class VersionCreate(VersionBase):
    pass

class Version(VersionBase):
    id: int
    package_id: int

    class Config:
        from_attributes = True

class PackageBase(BaseModel):
    name: str
    ecosystem: str

class PackageCreate(PackageBase):
    pass

class Package(PackageBase):
    id: int
    versions: List[Version] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str
