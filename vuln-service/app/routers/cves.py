from fastapi import APIRouter, Depends, HTTPException, status
import httpx
from typing import List
from ..database import db
from ..queries import CVEQueries
from ..schemas import CVE, CVECreate
from ..auth import get_current_user
from ..config import settings

router = APIRouter(prefix="/cves", tags=["cves"])

async def validate_package_exists(package_name: str, version: str):
    async with httpx.AsyncClient() as client:
        try:
            url = f"{settings.PACKAGE_SERVICE_URL}/packages/validate/{package_name}/{version}"
            response = await client.get(url, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                return data.get("valid", False)
            return False
        except Exception as e:
            # In production, log this error
            return False

@router.post("/", response_model=CVE, status_code=status.HTTP_201_CREATED)
async def create_cve(cve: CVECreate, current_user: str = Depends(get_current_user)):
    # Validate with Package Service
    is_valid = await validate_package_exists(cve.package_name, cve.version)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Package '{cve.package_name}' with version '{cve.version}' not found in Package Service"
        )
    
    row = await db.fetchrow(
        CVEQueries.create_cve(),
        cve.cve_id, cve.description, cve.severity, 
        cve.cvss_score, cve.package_name, cve.version
    )
    return dict(row)

@router.get("/{package_name}", response_model=List[CVE])
async def get_cves_by_package(package_name: str):
    rows = await db.fetch(CVEQueries.get_cves_by_package(), package_name)
    return [dict(r) for r in rows]
