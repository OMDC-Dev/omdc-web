import { create } from 'zustand';

interface AdminFilterState {
  tipeFilter: string;
  caFilter: string;
  ropFilter: string;
  cabangFilter: string;
  startDate: Date | null;
  endDate: Date | null;
  setFilters: (filters: Partial<AdminFilterState>) => void;
  resetFilters: () => void;
}

const useAdminFilter = create<AdminFilterState>((set) => ({
  tipeFilter: '',
  caFilter: '',
  ropFilter: '',
  cabangFilter: '',
  startDate: null,
  endDate: null,
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  resetFilters: () =>
    set({
      tipeFilter: '',
      caFilter: '',
      ropFilter: '',
      cabangFilter: '',
      startDate: null,
      endDate: null,
    }),
}));

export default useAdminFilter;
