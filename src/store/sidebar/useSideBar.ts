import { create } from 'zustand';

interface SidebarState {
  expanded: boolean;
  toggle: () => void;
  setExpanded: (value: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  expanded: false,
  toggle: () => set((state) => ({ expanded: !state })),
  setExpanded: (value) => set({ expanded: value }),
}));