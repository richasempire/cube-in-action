// Cube.tsx
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { useMeshStore } from './store';
import * as THREE from 'three';

const Cube: React.FC = () => {
  const { positions, setSelectedSphere, selectedSphere, setSelectedMesh } = useMeshStore();
  const sphereRefs = useRef<React.MutableRefObject<THREE.Mesh | null>[]>(positions.map(() => React.createRef()));
  const meshRef = useRef<THREE.Mesh | null>(null);

  const handleSphereClick = (index: number) => {
    setSelectedSphere(index);
    setSelectedMesh(false);
  };

  useFrame(() => {
    sphereRefs.current.forEach((sphere, index) => {
      if (sphere.current) {
        sphere.current.position.set(...positions[index]);
      }
    });
  });

  useEffect(() => {
    if (meshRef.current) {
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
      meshRef.current.geometry = geometry;
    }
  }, [positions]);

  return (
    <>
      {positions.map((pos, index) => (
        <Sphere key={index} position={pos} args={[0.05, 16, 16]} ref={sphereRefs.current[index]} onClick={() => handleSphereClick(index)} castShadow>
          <meshStandardMaterial attach="material" color={selectedSphere === index ? 'royalblue' : 'white'} />
        </Sphere>
      ))}
      <mesh ref={meshRef} castShadow receiveShadow>
        <meshStandardMaterial color="hotpink" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};

export default Cube;
