from app.db.session import db

class VulnRepository:
    async def get_by_package(self, package_name: str):
        query = "SELECT id, cve_id, package_name, version, severity, cvss_score, description FROM vulnerabilities WHERE package_name = $1"
        return await db.fetch(query, package_name)

    async def create(self, vuln_data: dict):
        query = """
            INSERT INTO vulnerabilities (cve_id, package_name, version, severity, cvss_score, description)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        """
        return await db.fetchval(
            query, 
            vuln_data['cve_id'], 
            vuln_data['package_name'], 
            vuln_data['version'], 
            vuln_data['severity'], 
            vuln_data['cvss_score'], 
            vuln_data['description']
        )

    async def delete(self, vuln_id: int):
        query = "DELETE FROM vulnerabilities WHERE id = $1"
        return await db.execute(query, vuln_id)

    async def delete_by_package(self, package_name: str):
        query = "DELETE FROM vulnerabilities WHERE package_name = $1"
        return await db.execute(query, package_name)
