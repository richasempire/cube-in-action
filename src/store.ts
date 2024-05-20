import { create } from 'zustand';
import * as THREE from 'three';

interface CubeState {
    boxes: { id: number; position: [number, number, number] }[];
    addBox: (position: [number, number, number]) => void;
    isDragging: boolean;
    setDragging: (isDragging: boolean) => void;
}

export const useCubeStore = create<CubeState>((set) => ({
    boxes: [{ id: 1, position: [0, 0, 0] }],
    addBox: (position) =>
       
      set((state) => ({
        boxes: [...state.boxes, { id: state.boxes.length + 1, position }],
  
      })),
      
      isDragging: false,
      setDragging: (isDragging) => set({ isDragging }),
      
}));

