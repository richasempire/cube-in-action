import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, TransformControls, GizmoHelper, Grid , GizmoViewcube } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';
import { create } from 'zustand';

type Position = [number, number, number];

interface MeshState {
  positions: Position[];
  setPositions: (positions: (prev: Position[]) => Position[]) => void;
  selectedSphere: number | null;
  setSelectedSphere: (index: number | null) => void;
  selectedMesh: boolean;
  setSelectedMesh: (selected: boolean) => void;
}

const gridConfig = {
  cellSize: { value: 1, min: 0, max: 10, step: 0.1 },
  cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
  cellColor: '#6f6f6f',
  sectionSize: { value: 5, min: 0, max: 10, step: 0.1 },
  sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
  sectionColor: '#9d7a7a',
  fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
  fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
  followCamera: false,
  infiniteGrid: true,
};

const useMeshStore = create<MeshState>((set) => ({
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
  setSelectedMesh: (selected) => set({ selectedMesh: selected })
}));

const Mesha: React.FC = () => {
  const { mode } = useControls({ mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } });
  const { positions, setPositions, selectedSphere, setSelectedSphere, selectedMesh, setSelectedMesh } = useMeshStore();

  const sphereRefs = useRef<React.MutableRefObject<THREE.Mesh | null>[]>(positions.map(() => React.createRef()));
  const meshRef = useRef<THREE.Mesh | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const controlRef = useRef<TransformControls>(null);
  const previousMeshPosition = useRef(new THREE.Vector3());

  const handleSphereClick = (index: number) => {
    setSelectedSphere(index);
    setSelectedMesh(false);
  };

  const handleMeshClick = () => {
    setSelectedSphere(null);
    setSelectedMesh(true);
  };

  useEffect(() => {
    const control = controlRef.current;
    if (!control) return;  // Ensure control is defined
    const controlledObject = selectedMesh ? groupRef.current : sphereRefs.current[selectedSphere ?? 0]?.current;
    if (controlledObject) {
      control.attach(controlledObject);
      const handleUpdate = () => {
        if (selectedMesh) {
          const currentMeshPosition = controlledObject.position;
          const offset = currentMeshPosition.clone().sub(previousMeshPosition.current);
          offset.set(offset.x / 2, offset.y / 2, offset.z / 2);
          previousMeshPosition.current.copy(currentMeshPosition);
          setPositions((prev: Position[]) =>
            prev.map((pos) => {
              const newPos = new THREE.Vector3(...pos).add(offset);
              return newPos.toArray() as Position;
            })
          );
        } else {
          const newPosition = controlledObject.position.toArray() as Position;
          setPositions((prev: Position[]) => {
            const newPositions = [...prev];
            newPositions[selectedSphere!] = newPosition;
            return newPositions;
          });
        }
      };
      control.addEventListener('objectChange', handleUpdate);
      return () => control.removeEventListener('objectChange', handleUpdate);
    }
  }, [selectedSphere, selectedMesh, setPositions]);

  useEffect(() => {
    if (meshRef.current) {
      previousMeshPosition.current.copy(meshRef.current.position);
    }
  }, [selectedMesh]);

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(positions.flat());
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex([
    0, 1, 2, 0, 2, 3, // front
    4, 6, 5, 4, 7, 6, // back
    0, 4, 1, 1, 4, 5, // bottom
    2, 6, 3, 3, 6, 7, // top
    0, 3, 4, 3, 7, 4, // left
    1, 5, 2, 2, 5, 6  // right
  ]);
  geometry.computeVertexNormals();

  return (
    <Canvas shadows>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />
      <directionalLight 
        castShadow 
        position={[5, 5, 5]} 
        intensity={0.5} 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
        shadow-camera-far={50} 
        shadow-camera-left={-10} 
        shadow-camera-right={10} 
        shadow-camera-top={10} 
        shadow-camera-bottom={-10}
      />
      <group ref={groupRef}>
        {positions.map((pos, index) => (
          <Sphere key={index} position={pos} args={[0.05, 16, 16]} ref={sphereRefs.current[index]} onClick={() => handleSphereClick(index)} castShadow>
            <meshStandardMaterial attach="material" color={selectedSphere === index ? 'royalblue' : 'white'} />
          </Sphere>
        ))}
        <mesh ref={meshRef} geometry={geometry} onClick={handleMeshClick} castShadow receiveShadow>
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </group>
      <TransformControls mode={mode as 'translate' | 'rotate' | 'scale'} ref={controlRef} />
      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewcube />
      </GizmoHelper>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, -5]} castShadow shadow-mapSize={1024} />
      <Grid
        position={[0, 0, 0]}
        args={[10.5, 10.5]}
        cellSize={gridConfig.cellSize.value}
        cellThickness={gridConfig.cellThickness.value}
        cellColor={gridConfig.cellColor}
        sectionSize={gridConfig.sectionSize.value}
        sectionThickness={gridConfig.sectionThickness.value}
        sectionColor={gridConfig.sectionColor}
        fadeDistance={gridConfig.fadeDistance.value}
        fadeStrength={gridConfig.fadeStrength.value}
        followCamera={gridConfig.followCamera}
        infiniteGrid={gridConfig.infiniteGrid}
      />
    </Canvas>
  );
}

const App: React.FC = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Mesha />
    </div>
  );
}

export default App;
