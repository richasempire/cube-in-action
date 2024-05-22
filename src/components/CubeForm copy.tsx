import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { create } from 'zustand';
import { useCubeStore } from '../store.ts';


interface EditableCubeProps {
    position: [number, number, number];
    id: number;
  }

const EditableCube : React.FC<EditableCubeProps> = ({ position }) => {
    const vertices = useCubeStore(state => state.vertices);
    const geometryRef = useRef(new THREE.BufferGeometry());
  
  useEffect(() => {
    if (geometryRef.current) {
      const positions = new Float32Array(vertices.flatMap(v => [v.x, v.y, v.z]));
      const positionAttribute = new THREE.BufferAttribute(positions, 3);
      geometryRef.current.setAttribute('position', positionAttribute);

      const indices = [
        0, 1, 2, 1, 3, 2,
        4, 5, 6, 5, 7, 6,
        0, 1, 4, 1, 5, 4,
        2, 3, 6, 3, 7, 6,
        0, 2, 4, 2, 6, 4,
        1, 3, 5, 3, 7, 5
      ];
      geometryRef.current.setIndex(indices);
      geometryRef.current.computeVertexNormals();
    }
  }, [vertices]);

  return (
    <mesh geometry={geometryRef.current}>
      <meshStandardMaterial color="green" side={THREE.DoubleSide}/>
    </mesh>
  );
};


export default EditableCube;