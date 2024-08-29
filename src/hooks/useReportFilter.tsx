import { create } from 'zustand';

interface ReportFilterState {
  tipeFilter: string;
  caFilter: string;
  ropFilter: string;
  cabangFilter: string;
  startDate: Date | null;
  endDate: Date | null;
  setFilters: (filters: Partial<ReportFilterState>) => void;
  resetFilters: () => void;
}

const useReportFilter = create<ReportFilterState>((set) => ({
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

export default useReportFilter;
