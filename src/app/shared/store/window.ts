import { create } from 'zustand';
import { Windows } from '../constants/window';

interface WindowStore {
  window: keyof typeof Windows;
  setWindow: <T extends keyof typeof Windows>(window: T) => void;
}

export const useWindowStore = create<WindowStore>()((set) => ({
  window: 'directory-setup',
  setWindow: (window: WindowStore['window']) => set({ window }),
}));
