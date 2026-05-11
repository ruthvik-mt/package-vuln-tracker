CREATE TABLE IF NOT EXISTS vulnerabilities (
    id SERIAL PRIMARY KEY,
    cve_id TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL,
    cvss_score FLOAT NOT NULL,
    package_name TEXT NOT NULL,
    version TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
