// App.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, GizmoHelper, Grid, GizmoViewcube } from '@react-three/drei';
import { useControls } from 'leva';
import { useMeshStore } from './store';
import Cube from './Cube';
import * as THREE from 'three';


const Scene: React.FC = () => {
  const { mode } = useControls({ mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } });
  const { setPositions, setSelectedSphere, setSelectedMesh, addCube, selectedMesh } = useMeshStore();

  const groupRef = useRef<THREE.Group | null>(null);
  const controlRef = useRef<TransformControls>(null);
  const previousMeshPosition = useRef(new THREE.Vector3());
  const [shiftPressed, setShiftPressed] = useState(false);

  const handleMeshClick = () => {
    setSelectedSphere(null);
    setSelectedMesh(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const control = controlRef.current;
    const group = groupRef.current;
    if (!control || !group) return;

    const handleTransformEnd = () => {
      if (shiftPressed && selectedMesh) {
        const newCubePosition = group.position.toArray() as [number, number, number];
        addCube(newCubePosition);
      }
    };

    control.addEventListener('mouseUp', handleTransformEnd);

    if (selectedMesh) {
      const controlledObject = group;
      const currentMeshPosition = controlledObject.position;
      const offset = currentMeshPosition.clone().sub(previousMeshPosition.current);
      offset.set(offset.x / 2, offset.y / 2, offset.z / 2);
      previousMeshPosition.current.copy(currentMeshPosition);
      setPositions((prev) =>
        prev.map((pos) => {
          const newPos = new THREE.Vector3(...pos).add(offset);
          return newPos.toArray() as [number, number, number];
        })
      );
    }

    return () => {
      control.removeEventListener('mouseUp', handleTransformEnd);
    };
  });

  return (
    <>
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
        <Cube />
        {/* <mesh onClick={handleMeshClick} castShadow receiveShadow>
          <meshStandardMaterial color="hotpink" side={THREE.DoubleSide} />
        </mesh> */}
      </group>
      <TransformControls mode={mode as 'translate' | 'rotate' | 'scale'} ref={controlRef} />
      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewcube />
      </GizmoHelper>
      </>
  )
};

const App: React.FC = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
};

export default App;
