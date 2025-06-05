import { create } from 'zustand';

type TData = {
  title: string;
  message: string;
  date: string;
};

type Store = {
  visible: boolean;
  toggle: () => void;
  data: TData;
  setNotif: (data: TData) => void;
};

const useNotif = create<Store>((set) => ({
  visible: false,
  toggle: () => set((state) => ({ visible: !state.visible })),
  data: {
    title: '',
    message: '',
    date: '',
  },
  setNotif: (data: TData) => set((state) => ({ data: data })),
}));

export default useNotif;
