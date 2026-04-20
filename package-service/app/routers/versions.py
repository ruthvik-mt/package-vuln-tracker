from fastapi import APIRouter, Depends, HTTPException, status
from ..database import db
from ..queries import PackageQueries
from ..schemas import Version, VersionCreate
from ..auth import get_current_user

router = APIRouter(prefix="/packages", tags=["versions"])

@router.post("/{package_id}/versions", response_model=Version, status_code=status.HTTP_201_CREATED)
async def create_version(package_id: int, version: VersionCreate, current_user: str = Depends(get_current_user)):
    # Check if package exists
    row = await db.fetchrow(PackageQueries.get_package_by_id(), package_id)
    if not row:
        raise HTTPException(status_code=404, detail="Package not found")
    
    try:
        row = await db.fetchrow(PackageQueries.create_version(), package_id, version.version)
        return dict(row)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Version already exists or invalid data")
