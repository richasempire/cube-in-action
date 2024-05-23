import React, { memo, useState, useRef, useEffect } from 'react';
import Cube from './components/Cube';
import './App.css';
import { GizmoHelper, GizmoViewcube, useCursor, Grid, AccumulativeShadows, Environment, RandomizedLight, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { useCubeStore } from './store';
import { useControls } from 'leva';
import * as THREE from 'three';

export default function App() {
  const { target, setTarget, isDragging, setDragging } = useCubeStore();
  const orbitControlsRef = useRef<any>(null);  
  const transformRef = useRef<any>(null);  

  const Shadows = memo(() => (
    <AccumulativeShadows temporal frames={100} color="#9d4b4b" colorBlend={0.5} alphaTest={0.9} scale={20}>
      <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
    </AccumulativeShadows>
  ));

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

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const { mode } = useControls({ mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } });

  useEffect(() => {
    if (transformRef.current) {
      const controls = transformRef.current;
      controls.addEventListener('dragging-changed', (event) => {
        setDragging(event.value);
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = !event.value;
        }
      });
    }
  }, [setDragging]);

  return (
    <Canvas shadows camera={{ position: [10, 12, 12], fov: 25 }} onPointerMissed={() => setTarget(null)}>
      <mesh
        onClick={(e) => setTarget(e.object)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Cube />
      </mesh>
      {target && <TransformControls object={target} mode={mode as 'translate' | 'rotate' | 'scale'} ref={transformRef}/>}
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, -5]} castShadow shadow-mapSize={1024} />
      {/* <OrbitControls
        ref={orbitControlsRef}
        enabled={!isDragging}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN, // Assign left button to pan
          RIGHT: THREE.MOUSE.ROTATE // Assign right button to rotate/orbit
        }}      />*/}
        <OrbitControls makeDefault />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewcube />
      </GizmoHelper>
      <Grid
        position={[0, -0.5, 0]}
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