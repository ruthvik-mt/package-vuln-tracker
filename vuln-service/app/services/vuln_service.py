from ..repositories.vuln_repository import VulnRepository
import httpx
from ..core.config import settings
import redis
import json

class VulnService:
    def __init__(self):
        self.repo = VulnRepository()
        self.redis = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

    async def get_package_risk(self, package_name: str):
        # Try cache first
        cache_key = f"risk:{package_name}"
        try:
            cached = self.redis.get(cache_key)
            if cached:
                return json.loads(cached)
        except Exception:
            pass

        vulns = await self.repo.get_by_package(package_name)
        if not vulns:
            res = {"package_name": package_name, "risk_score": 0.0, "vulnerability_count": 0}
        else:
            avg_cvss = sum(v['cvss_score'] for v in vulns) / len(vulns)
            severity_weights = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 5}
            max_weight = max(severity_weights.get(v['severity'], 1) for v in vulns)
            
            risk_score = (avg_cvss * 0.6) + (max_weight * 0.8)
            res = {
                "package_name": package_name,
                "risk_score": min(risk_score, 10.0),
                "vulnerability_count": len(vulns),
                "avg_cvss": round(avg_cvss, 2)
            }
        
        # Save to cache for 1 hour
        try:
            self.redis.setex(cache_key, 3600, json.dumps(res))
        except Exception:
            pass
            
        return res

    async def validate_package_exists(self, package_name: str):
        async with httpx.AsyncClient() as client:
            try:
                url = f"{settings.PACKAGE_SERVICE_URL}/api/v1/packages/"
                response = await client.get(url)
                if response.status_code == 200:
                    packages = response.json()
                    exists = any(p['name'] == package_name for p in packages)
                    if not exists:
                        print(f"Package {package_name} not found in {packages}")
                    return exists
                else:
                    print(f"Failed to fetch packages: {response.status_code} from {url}")
            except Exception as e:
                print(f"Exception during package validation: {str(e)}")
                return False
        return False
