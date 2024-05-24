import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

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

  const handleVertexChange = (index, newPos) => {
    const newVertices = vertices.slice();
    newVertices[index] = newPos;
    setVertices(newVertices);
  };

  return (
    <mesh geometry={geometryRef.current}>
      <meshStandardMaterial color="orange" side={THREE.DoubleSide}/>
    </mesh>
  );
};


export default EditableCube;