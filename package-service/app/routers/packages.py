from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..database import db
from ..queries import PackageQueries
from ..schemas import Package, PackageCreate, Version
from ..auth import get_current_user

router = APIRouter(prefix="/packages", tags=["packages"])

@router.get("/", response_model=List[Package])
async def list_packages():
    rows = await db.fetch(PackageQueries.get_all_packages())
    packages = []
    for row in rows:
        pkg_data = dict(row)
        version_rows = await db.fetch(PackageQueries.get_versions_by_package_id(), pkg_data["id"])
        pkg_data["versions"] = [dict(v) for v in version_rows]
        packages.append(pkg_data)
    return packages

@router.get("/{package_id}", response_model=Package)
async def get_package(package_id: int):
    row = await db.fetchrow(PackageQueries.get_package_by_id(), package_id)
    if not row:
        raise HTTPException(status_code=404, detail="Package not found")
    
    pkg_data = dict(row)
    version_rows = await db.fetch(PackageQueries.get_versions_by_package_id(), package_id)
    pkg_data["versions"] = [dict(v) for v in version_rows]
    return pkg_data

@router.post("/", response_model=Package, status_code=status.HTTP_201_CREATED)
async def create_package(package: PackageCreate, current_user: str = Depends(get_current_user)):
    try:
        row = await db.fetchrow(PackageQueries.create_package(), package.name, package.ecosystem)
        pkg_data = dict(row)
        pkg_data["versions"] = []
        return pkg_data
    except Exception as e:
        print(f"DEBUG: Error creating package: {str(e)}")
        raise HTTPException(
            status_code=400, 
            detail=f"Failed to create package: {str(e)}" if "unique" not in str(e).lower() else "Package already exists"
        )

@router.get("/validate/{name}/{version}")
async def validate_package(name: str, version: str):
    pkg_row = await db.fetchrow(PackageQueries.get_package_by_name(), name)
    if not pkg_row:
        return {"valid": False}
    
    version_row = await db.fetchrow(PackageQueries.get_version_by_name_and_id(), pkg_row["id"], version)
    if not version_row:
        return {"valid": False}
    
    return {"valid": True}
