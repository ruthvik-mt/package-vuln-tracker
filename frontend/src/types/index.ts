export interface Package {
  id: number;
  name: string;
  ecosystem: string;
  versions: PackageVersion[];
}

export interface PackageVersion {
  id: number;
  package_id: number;
  version: string;
}

export interface Vulnerability {
  id: number;
  cve_id: string;
  package_name: string;
  version: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  cvss_score: number;
  description: string;
}

export interface RiskData {
  package_name: string;
  risk_score: number;
  vulnerability_count: number;
  avg_cvss?: number;
}

export interface PackageStoreState {
  packages: Package[];
  riskData: Record<string, RiskData>;
  loading: boolean;
  error: string | null;
  fetchPackages: () => Promise<void>;
  deletePackage: (id: number, name: string) => Promise<void>;
}

export interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}
