from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.services.vuln_service import VulnService
from app.schemas import VulnerabilityCreate, VulnerabilityRead
from app.core.security import get_current_user

router = APIRouter()
vuln_service = VulnService()

@router.get("/{package_name}")
async def get_vulnerabilities(package_name: str, username: str = Depends(get_current_user)):
    return await vuln_service.repo.get_by_package(package_name)

@router.get("/{package_name}/risk")
async def get_risk(package_name: str):
    # Risk endpoint is public (or internal)
    return await vuln_service.get_package_risk(package_name)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_vulnerability(
    vuln: VulnerabilityCreate,
    username: str = Depends(get_current_user)
):
    # Cross-service validation
    exists = await vuln_service.validate_package_exists(vuln.package_name)
    if not exists:
        raise HTTPException(status_code=404, detail="Target package not registered in system")
    
    return await vuln_service.repo.create(vuln.dict())

@router.delete("/{vuln_id}")
async def delete_vulnerability(
    vuln_id: int,
    username: str = Depends(get_current_user)
):
    await vuln_service.repo.delete(vuln_id)
    return {"message": "Vulnerability record removed"}

@router.delete("/package/{package_name}")
async def delete_by_package(
    package_name: str,
    username: str = Depends(get_current_user)
):
    await vuln_service.repo.delete_by_package(package_name)
    return {"message": f"All records for {package_name} removed"}
