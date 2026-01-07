import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: '',
  startLoading: (message) => set({ isLoading: true, message }),
  stopLoading: () => set({ isLoading: false, message: '' }),
}));