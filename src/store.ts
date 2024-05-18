import { create } from 'zustand';

type Vertex = {
  x: number;
  y: number;
  z: number;
};

type CubeState = {
  vertices: Vertex[];
  selectedVertex: number | null;
  setVertices: (vertices: Vertex[]) => void;
  selectVertex: (index: number | null) => void;
  updateVertex: (index: number, vertex: Vertex) => void;
};

const initialVertices: Vertex[] = [
  { x: -1, y: -1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: 1 },
];

export const useCubeStore = create<CubeState>((set) => ({
  vertices: initialVertices,
  selectedVertex: null,
  setVertices: (vertices) => set({ vertices }),
  selectVertex: (index) => set({ selectedVertex: index }),
  updateVertex: (index, vertex) =>
    set((state) => ({
      vertices: state.vertices.map((v, i) => (i === index ? vertex : v)),
    })),
}));
