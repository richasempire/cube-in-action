import { create } from 'zustand';

interface CubeState {
  colorIdx: number;
  setColorIdx: (idx: number) => void;
  position: [number, number, number];
  setPosition: (pos: [number, number, number]) => void;
}

export const useCubeStore = create<CubeState>((set) => ({
  colorIdx: 0,
  setColorIdx: (idx) => set({ colorIdx: idx }),
  position: [0, 0, 0],
  setPosition: (pos) => set({ position: pos }),
}));
