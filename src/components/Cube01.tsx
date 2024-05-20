import React, { useRef, useEffect } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { useCubeStore } from '../store';
import { OrbitControls, GizmoHelper, GizmoViewcube } from '@react-three/drei';
import { DragControls } from '@three/examples/jsm/controls/DragControls';
import * as THREE from 'three';

const Box = ({ position, id }) => {
    const ref = useRef<THREE.Mesh>(null);
  
    return (
      <mesh position={position} ref={ref}>
        <boxGeometry attach="geometry" />
        <meshLambertMaterial attach="material" color="hotpink" />
      </mesh>
    );
  };
export default function Cube() {
  const ref = useRef<THREE.Group>(null);
  const { camera, gl, scene } = useThree();
  const { addBox, boxes } = useCubeStore();
  const objects = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    if (ref.current) {
      objects.current = ref.current.children;
      const controls = new DragControls(objects.current, camera, gl.domElement);

      controls.addEventListener('dragend', (event) => {
        const { x, y, z } = event.object.position;
        addBox([x, y, z]);
      });

      return () => {
        controls.dispose();
      };
    }
  }, [camera, gl.domElement, addBox]);

  return (
    <group ref={ref}>
      {boxes.map((box) => (
        <Box key={box.id} position={box.position} id={box.id} />
      ))}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color="gray" />
      </mesh>
    </group>
  );
};