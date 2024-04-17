import { create } from 'zustand';

type Store = {
  logo: string;
  setLogo: (data: string) => void;
};

const useLogo = create<Store>((set) => ({
  logo: '',
  setLogo: (data: string) => set((state) => ({ logo: data })),
}));

export default useLogo;
