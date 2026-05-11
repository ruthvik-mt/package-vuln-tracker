import { create } from 'zustand';
import { Package, RiskData, PackageStoreState } from '../types';
import { apiClient } from '../api/client';

export const usePackageStore = create<PackageStoreState>((set, get) => ({
  packages: [],
  riskData: {},
  loading: false,
  error: null,
  fetchPackages: async () => {
    set({ loading: true, error: null });
    try {
      const { data: packages } = await apiClient.get<Package[]>('/api/v1/packages/');
      set({ packages });

      const riskMap: Record<string, RiskData> = {};
      await Promise.all(
        packages.map(async (pkg) => {
          try {
            const { data } = await apiClient.get<RiskData>(`/api/v1/vulns/${pkg.name}/risk`);
            riskMap[pkg.name] = data;
          } catch (e) {
            riskMap[pkg.name] = { package_name: pkg.name, risk_score: 0, vulnerability_count: 0 };
          }
        })
      );
      set({ riskData: riskMap });
    } catch (err: any) {
      set({ error: 'Failed to fetch security telemetry' });
    } finally {
      set({ loading: false });
    }
  },
  deletePackage: async (id, name) => {
    try {
      await apiClient.delete(`/api/v1/packages/${id}`);
      await apiClient.delete(`/api/v1/vulns/package/${name}`);
      set((state) => ({
        packages: state.packages.filter((p) => p.id !== id),
      }));
    } catch (err) {
      throw new Error('Deletion failed');
    }
  },
}));
