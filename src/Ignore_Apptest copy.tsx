import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, TransformControls } from '@react-three/drei';

const EditableCube = () => {
  const [vertices, setVertices] = useState([
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(1, 1, -1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(-1, 1, 1),
    new THREE.Vector3(-1, 1, -1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(-1, -1, -1),
  ]);

  const geometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const controlsRefs = useRef<(React.MutableRefObject<typeof TransformControls> | null)[]>([]);
  const [selectedVertexIndex, setSelectedVertexIndex] = useState<number | null>(null);

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

  const handleVertexChange = (index: number, newPos: THREE.Vector3) => {
    const newVertices = vertices.slice();
    newVertices[index] = new THREE.Vector3(newPos.x, newPos.y, newPos.z);
    setVertices(newVertices);
  };

  useFrame(() => {
    if (selectedVertexIndex !== null && controlsRefs.current[selectedVertexIndex]) {
      const position = controlsRefs.current[selectedVertexIndex]!.object.position;
      handleVertexChange(selectedVertexIndex, position);
    }
  });

  return (
    <>
      <mesh geometry={geometryRef.current}>
        <meshStandardMaterial color="orange" side={THREE.DoubleSide} />
      </mesh>
      {vertices.map((vertex, index) => (
        <TransformControls
          key={index}
          ref={el => (controlsRefs.current[index] = el ? { current: el } : null)}
          position={vertex}
          onMouseDown={() => setSelectedVertexIndex(index)}
          onMouseUp={() => setSelectedVertexIndex(null)}
        >
          <mesh position={vertex}>
            <sphereBufferGeometry args={[0.1, 32, 32]} />
            <meshBasicMaterial color="red" />
          </mesh>
        </TransformControls>
      ))}
    </>
  );
};

const Apptest = () => {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <EditableCube />
      <OrbitControls />
    </Canvas>
  );
};

export default Apptest;
