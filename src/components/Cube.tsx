import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCubeStore } from '../store';
import * as THREE from 'three';
import { snapToGrid } from '../utils/snapToGrid';

const Cube: React.FC = () => {
  const vertices = useCubeStore((state) => state.vertices);
  const selectVertex = useCubeStore((state) => state.selectVertex);
  const updateVertex = useCubeStore((state) => state.updateVertex);
  const selectedVertex = useCubeStore((state) => state.selectedVertex);

  const meshRef = useRef<THREE.Mesh>(null);
  const vertexRefs = useRef<(THREE.Mesh | null)[]>([]);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(vertices.length * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      const positions = geometry.attributes.position.array as Float32Array;
      vertices.forEach((vertex, i) => {
        positions[i * 3] = vertex.x;
        positions[i * 3 + 1] = vertex.y;
        positions[i * 3 + 2] = vertex.z;
      });
      geometry.attributes.position.needsUpdate = true;
    }
  }, [vertices, geometry]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  const handleVertexDrag = (index: number, event: any) => {
    const { x, y, z } = event.point;
    updateVertex(index, { x: snapToGrid(x), y: snapToGrid(y), z: snapToGrid(z) });
  };

  const handleMeshClick = (event: any) => {
    event.stopPropagation();
    selectVertex(null);
  };

  return (
    <>
      <mesh ref={meshRef} geometry={geometry} onClick={handleMeshClick}>
        <meshStandardMaterial color={selectedVertex === null ? 'orange' : 'gray'} />
      </mesh>
      {vertices.map((vertex, index) => (
        <mesh
          key={index}
          ref={(el) => (vertexRefs.current[index] = el)}
          position={[vertex.x, vertex.y, vertex.z]}
          onPointerDown={(event) => selectVertex(index)}
          onPointerMove={(event) => {
            if (selectedVertex === index) handleVertexDrag(index, event);
          }}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={selectedVertex === index ? 'red' : 'blue'} />
        </mesh>
      ))}
    </>
  );
};

export default Cube;
