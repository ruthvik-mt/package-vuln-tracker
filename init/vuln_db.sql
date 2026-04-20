CREATE TABLE IF NOT EXISTS cves (
    id SERIAL PRIMARY KEY,
    cve_id TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL,
    cvss_score NUMERIC(3, 1) NOT NULL,
    package_name TEXT NOT NULL,
    version TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
