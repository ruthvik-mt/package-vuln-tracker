class CVEQueries:
    @staticmethod
    def create_cve():
        return "INSERT INTO cves (cve_id, description, severity, cvss_score, package_name, version) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"

    @staticmethod
    def get_cves_by_package():
        return "SELECT * FROM cves WHERE package_name = $1"

    @staticmethod
    def get_risk_metrics():
        return "SELECT AVG(cvss_score) as avg_cvss, COUNT(id) as cve_count FROM cves WHERE package_name = $1"

    @staticmethod
    def get_severity_counts():
        return "SELECT severity, COUNT(id) as count FROM cves WHERE package_name = $1 GROUP BY severity"

    @staticmethod
    def delete_cve():
        return "DELETE FROM cves WHERE id = $1"
    
    @staticmethod
    def delete_cves_by_package():
        return "DELETE FROM cves WHERE package_name = $1"
