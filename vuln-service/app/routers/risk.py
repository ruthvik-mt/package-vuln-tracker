from fastapi import APIRouter, HTTPException
from ..database import db
from ..queries import CVEQueries
from ..schemas import RiskScore

router = APIRouter(prefix="/risk", tags=["risk"])

SEVERITY_WEIGHTS = {
    "LOW": 1.0,
    "MEDIUM": 2.0,
    "HIGH": 3.0,
    "CRITICAL": 4.0
}

@router.get("/{package_name}", response_model=RiskScore)
async def get_risk_score(package_name: str):
    # Get basic metrics (average CVSS and count)
    metrics = await db.fetchrow(CVEQueries.get_risk_metrics(), package_name)
    
    if not metrics or metrics["cve_count"] == 0:
        return {
            "package_name": package_name,
            "risk_score": 0.0,
            "cve_count": 0,
            "average_cvss": 0.0
        }

    avg_cvss = float(metrics["avg_cvss"])
    cve_count = int(metrics["cve_count"])

    # Get severity counts for weighted addition
    # The requirement says: risk_score = average(CVSS scores) + severity_weight
    # I'll use the max severity weight among the CVEs to represent the package's risk,
    # or an average. Let's use the weight of the highest severity CVE found.
    
    sev_rows = await db.fetch(CVEQueries.get_severity_counts(), package_name)
    max_weight = 0.0
    for row in sev_rows:
        sev = row["severity"].upper()
        weight = SEVERITY_WEIGHTS.get(sev, 0.0)
        if weight > max_weight:
            max_weight = weight

    risk_score = avg_cvss + max_weight

    return {
        "package_name": package_name,
        "risk_score": round(risk_score, 2),
        "cve_count": cve_count,
        "average_cvss": round(avg_cvss, 2)
    }
