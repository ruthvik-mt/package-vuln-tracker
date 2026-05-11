from fastapi import APIRouter, Depends, HTTPException, status
from app.services.package_service import PackageService
from app.schemas import VersionCreate
from app.core.security import get_current_user

router = APIRouter()
package_service = PackageService()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_version(
    version: VersionCreate,
    username: str = Depends(get_current_user)
):
    pkg = await package_service.package_repo.get_by_id(version.package_id)
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    return await package_service.version_repo.create(version.package_id, version.version)

@router.delete("/{version_id}")
async def delete_version(
    version_id: int,
    username: str = Depends(get_current_user)
):
    await package_service.version_repo.delete(version_id)
    return {"message": "Version deleted"}
