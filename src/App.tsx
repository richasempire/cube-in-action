import React, { memo, useState } from 'react';
import Cube from './components/Cube';
import './App.css';
import { OrbitControls, GizmoHelper, GizmoViewcube, TransformControls, useCursor, Grid, AccumulativeShadows, Environment, RandomizedLight } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCubeStore } from './store';
import { useControls } from 'leva';

export default function App() {
  const { target, setTarget, isDragging } = useCubeStore();
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

  return (
    <Canvas shadows camera={{ position: [10, 12, 12], fov: 25 }}>
      <mesh
        castShadow
        onClick={(e) => setTarget(e.object)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Cube />
      </mesh>
      {target && <TransformControls object={target} mode={mode} />}
      <Environment preset="city" />
      <OrbitControls enabled={!isDragging} />
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
