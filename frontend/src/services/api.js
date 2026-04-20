const PACKAGE_URL = "https://vtrack-package-service.onrender.com";
const VULN_URL = "https://vtrack-vuln-service.onrender.com";

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
    const response = await fetch(`${PACKAGE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
    if (!response.ok) throw new Error("Login failed");
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
