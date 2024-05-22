import {create} from 'zustand';
import * as THREE from 'three';

interface CubeState {
  boxes: { id: number; position: [number, number, number] }[];
  addBox: (position: [number, number, number]) => void;
  isDragging: boolean;
  setDragging: (isDragging: boolean) => void;
  target: THREE.Object3D | null;
  setTarget: (target: THREE.Object3D | null) => void;
  preset: string;
  setPreset: (preset: string) => void;
  vertices: THREE.Vector3[];
  setVertex: (index: number, newPos: THREE.Vector3) => void;
}

export const useCubeStore = create<CubeState>((set) => ({
  boxes: [{ id: 1, position: [0, 0, 0] }],
  addBox: (position) =>
    set((state) => ({
      boxes: [...state.boxes, { id: state.boxes.length + 1, position }],
    })),
  isDragging: false,
  setDragging: (isDragging) => set({ isDragging }),
  target: null,
  setTarget: (target) => set({ target }),
  preset: 'city',
  setPreset: (preset) => set({ preset }),
  vertices: [
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(1, 1, -1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(-1, 1, 1),
    new THREE.Vector3(-1, 1, -1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(-1, -1, -1),
  ],
  setVertex: (index, newPos) => set(state => {
    const newVertices = state.vertices.slice();
    newVertices[index] = newPos;
    return { vertices: newVertices };
  }),
}));
