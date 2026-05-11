from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.services.package_service import PackageService
from app.schemas import PackageCreate, PackageRead
from app.core.security import get_current_user

router = APIRouter()
package_service = PackageService()

@router.get("/", response_model=List[PackageRead])
async def get_packages():
    return await package_service.get_all_with_versions()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_package(
    package: PackageCreate,
    username: str = Depends(get_current_user)
):
    existing = await package_service.package_repo.get_by_name(package.name)
    if existing:
        raise HTTPException(status_code=400, detail="Package already exists")
    return await package_service.create_package(package.name, package.ecosystem)

@router.delete("/{package_id}")
async def delete_package(
    package_id: int,
    username: str = Depends(get_current_user)
):
    await package_service.delete_package(package_id)
    return {"message": "Package deleted"}
