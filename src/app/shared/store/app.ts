import { create } from 'zustand';

interface AppStore {
  isCopyDone: boolean;
  isProcessing: boolean;
  setCopyDone: (isCopyDone: AppStore['isCopyDone']) => void;
  setIsProcessing: (isProcessing: AppStore['isProcessing']) => void;
}
export const useAppStore = create<AppStore>((set) => ({
  isCopyDone: false,
  isProcessing: false,
  setCopyDone: (isCopyDone: AppStore['isCopyDone']) => set({ isCopyDone }),
  setIsProcessing: (isProcessing: AppStore['isProcessing']) =>
    set({ isProcessing }),
}));

export function appFinishedCopying() {
  const state = useAppStore.getState();
  return state.isCopyDone || state.isProcessing;
}
