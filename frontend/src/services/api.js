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
    
    // Debugging logs for production troubleshooting
    console.log(`Connecting to Package Service at: ${PACKAGE_URL}`);
    
    const response = await fetch(`${PACKAGE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Connection Error: The Package Service URL is incorrect (${PACKAGE_URL})`);
        }
        throw new Error("Security Alert: Invalid credentials or connection refused.");
    }
    return response.json();
  },

  // Packages
  getPackages: async () => {
    const res = await fetch(`${PACKAGE_URL}/packages/`, { headers: getHeaders() });
    return res.json();
  },

  addPackage: async (name, ecosystem) => {
    const res = await fetch(`${PACKAGE_URL}/packages/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, ecosystem }),
    });
    return res.json();
  },

  addVersion: async (packageId, version) => {
    const res = await fetch(`${PACKAGE_URL}/packages/${packageId}/versions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ version }),
    });
    return res.json();
  },

  // Vulns
  getRisk: async (packageName) => {
    const res = await fetch(`${VULN_URL}/risk/${packageName}`, { headers: getHeaders() });
    return res.json();
  },

  addCVE: async (cveData) => {
    const res = await fetch(`${VULN_URL}/cves/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(cveData),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to add CVE");
    }
    return res.json();
  }
};
