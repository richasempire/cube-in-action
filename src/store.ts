// store.ts
import { create } from 'zustand';
import * as THREE from 'three';

type Position = [number, number, number];

interface MeshState {
  positions: Position[];
  setPositions: (positions: (prev: Position[]) => Position[]) => void;
  selectedSphere: number | null;
  setSelectedSphere: (index: number | null) => void;
  selectedMesh: boolean;
  setSelectedMesh: (selected: boolean) => void;
  addCube: (position: Position) => void;
}

export const useMeshStore = create<MeshState>((set) => ({
  positions: [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1]
  ],
  setPositions: (update) => set((state) => ({ positions: update(state.positions) })),
  selectedSphere: null,
  setSelectedSphere: (index) => set({ selectedSphere: index }),
  selectedMesh: false,
  setSelectedMesh: (selected) => set({ selectedMesh: selected }),
  addCube: (position) => set((state) => {
    const offset = new THREE.Vector3(position[0], position[1], position[2]);
    const newCubePositions: Position[] = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ].map(([x, y, z]) => [x + offset.x, y + offset.y, z + offset.z] as Position);
    return { positions: [...state.positions, ...newCubePositions] };
  }),
}));
