import { create } from 'zustand';

interface RiwayatSayaFilterState {
  tipeFilter: string;
  caFilter: string;
  ropFilter: string;
  cabangFilter: string;
  startDate: Date | null;
  endDate: Date | null;
  setFilters: (filters: Partial<RiwayatSayaFilterState>) => void;
  resetFilters: () => void;
}

const useRiwayatSayaFilter = create<RiwayatSayaFilterState>((set) => ({
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

export default useRiwayatSayaFilter;
