import { create } from 'zustand';

type Position = [number, number, number];

interface CubeState {
  id: number;
  positions: Position[];
}

interface MeshState {
  cubes: CubeState[];
  addCube: (positions: Position[]) => void;
  setPositions: (id: number, positions: (prev: Position[]) => Position[]) => void;
  selectedSphere: { cubeId: number | null, sphereIndex: number | null };
  setSelectedSphere: (cubeId: number | null, sphereIndex: number | null) => void;
  selectedMesh: number | null;
  setSelectedMesh: (cubeId: number | null) => void;
  duplicateCube: () => void;
}

const initialPositions: Position[] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1]
];

const initialCube: CubeState = {
  id: 0,
  positions: initialPositions,
};

const useMeshStore = create<MeshState>((set) => ({
  cubes: [initialCube],
  addCube: (newPositions) =>
    set((state) => {
      const newCube: CubeState = {
        id: state.cubes.length,
        positions: newPositions,
      };
      console.log(`Cube added with ID: ${newCube.id}`);
      return { cubes: [...state.cubes, newCube] };
    }),
  setPositions: (id, update) =>
    set((state) => {
      const updatedCubes = state.cubes.map(cube =>
        cube.id === id ? { ...cube, positions: update(cube.positions) } : cube
      );
      //console.log(`Positions set for cube ${id}`);
      return { cubes: updatedCubes };
    }),
  selectedSphere: { cubeId: null, sphereIndex: null },
  setSelectedSphere: (cubeId, sphereIndex) =>
    set(() => {
      console.log(`Selected sphere: Cube ${cubeId}, Sphere ${sphereIndex}`);
      return { selectedSphere: { cubeId, sphereIndex } };
    }),
  selectedMesh: null,
  setSelectedMesh: (cubeId) =>
    set(() => {
      console.log(`Selected mesh: Cube ${cubeId}`);
      return { selectedMesh: cubeId };
    }),
  duplicateCube: () =>
    set((state) => {
      if (state.selectedMesh !== null) {
        const selectedCube = state.cubes.find(cube => cube.id === state.selectedMesh);
        if (selectedCube) {
          const offset = 2;
          const newPositions = selectedCube.positions.map((pos) => [pos[0] + offset, pos[1] + offset, pos[2] + offset] as Position);
          const newCube: CubeState = {
            id: state.cubes.length,
            positions: newPositions,
          };
          console.log(`Cube duplicated with ID: ${newCube.id}`);
          return { cubes: [...state.cubes, newCube] };
        }
      }
      return state;
    }),
}));

export { useMeshStore, initialPositions };
