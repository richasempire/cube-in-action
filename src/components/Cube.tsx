import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, useCursor } from '@react-three/drei';
import { useControls } from 'leva';
import { create } from 'zustand';

// Box component
const Box = (props: JSX.IntrinsicElements['mesh']) => {
    return (
      <mesh {...props}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    );
  };
  
  // Main Cube component
  export default function Cube() {
    return (
      <Canvas style={{ height: '100vh' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} />
        <OrbitControls />
      </Canvas>
    );
  }