const isProd = window.location.hostname !== 'localhost';
const PACKAGE_URL = isProd ? "https://package-vuln-tracker.onrender.com" : "http://localhost:8001";
const VULN_URL = isProd ? "https://package-vuln-tracker-1.onrender.com" : "http://localhost:8002";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    
    try {
        const response = await fetch(`${PACKAGE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });
        
        if (!response.ok) {
            if (response.status === 404) throw new Error(`Backend not found at ${PACKAGE_URL}`);
            throw new Error("Invalid credentials or server error");
        }
        return await response.json();
    } catch (err) {
        throw new Error(err.message || "Connection refused by Package Service");
    }
  },

  // Packages
  getPackages: async () => {
    try {
        const res = await fetch(`${PACKAGE_URL}/packages/`, { headers: getHeaders() });
        if (!res.ok) throw new Error(`Service Error: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("Fetch Error:", err);
        return []; // Return empty list rather than crashing
    }
  },

  addPackage: async (name, ecosystem) => {
    const res = await fetch(`${PACKAGE_URL}/packages/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, ecosystem }),
    });
    if (!res.ok) throw new Error("Failed to register asset");
    return res.json();
  },

  addVersion: async (packageId, version) => {
    const res = await fetch(`${PACKAGE_URL}/packages/${packageId}/versions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ version }),
    });
    if (!res.ok) throw new Error("Failed to update version");
    return res.json();
  },

  // Vulns
  getRisk: async (packageName) => {
    try {
        const res = await fetch(`${VULN_URL}/risk/${packageName}`, { headers: getHeaders() });
        if (!res.ok) return { risk_score: 0 };
        return await res.json();
    } catch (err) {
        return { risk_score: 0 };
    }
  },

  addCVE: async (cveData) => {
    const res = await fetch(`${VULN_URL}/cves/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(cveData),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.detail || "Access Denied: Vulnerability service authentication failed");
    }
    return data;
  },

  getCVEs: async (packageName) => {
    const res = await fetch(`${VULN_URL}/cves/${packageName}`, { headers: getHeaders() });
    return res.json();
  },

  deletePackage: async (packageId) => {
    const res = await fetch(`${PACKAGE_URL}/packages/${packageId}`, { 
      method: "DELETE",
      headers: getHeaders() 
    });
    return res.ok;
  },

  deleteVersion: async (versionId) => {
    const res = await fetch(`${PACKAGE_URL}/packages/versions/${versionId}`, { 
      method: "DELETE",
      headers: getHeaders() 
    });
    return res.ok;
  },

  deleteCVE: async (cveId) => {
    const res = await fetch(`${VULN_URL}/cves/${cveId}`, { 
      method: "DELETE",
      headers: getHeaders() 
    });
    return res.ok;
  },

  deleteCVEsByPackage: async (packageName) => {
    const res = await fetch(`${VULN_URL}/cves/package/${packageName}`, { 
      method: "DELETE",
      headers: getHeaders() 
    });
    return res.ok;
  }
};
