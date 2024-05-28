import React, { useEffect, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, Grid, GizmoViewcube, AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import { useControls } from 'leva';
import { useMeshStore } from './store';
import Cube from './components/Cube';

const Scene: React.FC = () => {
  const { cubes } = useMeshStore();
  const { mode } = useControls({ mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } });

  const handleTransformEnd = (position: [number, number, number]) => {
    console.log('Transform ended with position:', position);
  };

  return (
    <group>
      {cubes.map((cube) => (
        <Cube key={cube.id} id={cube.id} positions={cube.positions} mode={mode} />
      ))}
    </group>
  );
};

const App: React.FC = () => {
  const { duplicateCube } = useMeshStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'c') {
        duplicateCube();
        console.log('Duplicate cube created');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [duplicateCube]);
  const gridConfig = {
    cellSize: { value: 0.2, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: '#6f6f6f',
    sectionSize: { value: 2, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: '#9d7a7a',
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  };
  

  return (
    <div style={{ height: '100vh' }}>
      <Canvas shadows camera={{ position: [10, 12, 12], fov: 25 }}>
        <Scene />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, 10]} intensity={1} castShadow />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={1024}/>
        <OrbitControls makeDefault />
        {/* <Shadows/> */}
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewcube />
        </GizmoHelper>
        
        <Grid
        position={[-1, -1, -1]}
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
    </div>
  );
};

export default App;
