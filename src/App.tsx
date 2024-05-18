import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Cube from './components/Cube';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Cube />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default App;
