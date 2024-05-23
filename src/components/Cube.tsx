import React, { useRef } from 'react';
import { useThree, useFrame, ThreeEvent } from '@react-three/fiber';
import { useDrag } from 'react-use-gesture';
import { useCubeStore } from '../store';
import * as THREE from 'three';
import EditableCube from './CubeForm';
// Box component:
const Box = ({ position, id }) => {
  const ref = useRef<THREE.Mesh>(null);

  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color="hotpink" />
    </mesh>
  );
};
export default function Cube() {
  const ref = useRef<THREE.Mesh>(null);
  const { addBox, boxes, setDragging } = useCubeStore();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const initialPosition = useRef<[number, number, number]>([0, 0, 0]);

  useFrame(() => {
    if (ref.current) {
      // Perform any necessary per-frame updates here
    }
  });

  const bind = useDrag(
    ({ offset: [x, y], last, memo, movement: [m, n] }) => {
      if (!memo) {
        const initialPos = ref.current?.position.toArray() || [0, 0, 0];
        initialPosition.current = initialPos;
        memo = initialPos;
      }

      if (last) {
        const [x1, y1, z1] = initialPosition.current;
        const newBoxPosition = [(m / aspect) + x1, (-n / aspect) + y1, z1];
        addBox(newBoxPosition as [number, number, number]);
        setDragging(false);
        return memo;
      } else {
        setDragging(true);
        if (ref.current) {
          const [x1, y1, z1] = initialPosition.current;
          ref.current.position.set((m / aspect) + x1, (-n / aspect) + y1, z1);
        }
        return memo;
      }
    },
    { pointerEvents: true }
  );

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    console.log('hover');
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    console.log('unhover');
  };

  return (
    <>
      {boxes.map((box) => (
        <Box key={box.id} position={box.position} id={box.id} />
        // <EditableCube key={box.id} position={box.position} id={box.id} />
      ))}
       <mesh
        position={[0, 0, 0]}
        {...bind()}
        ref={ref}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry attach="geometry" />
        <meshLambertMaterial attach="material" color="gray" />
        <ambientLight intensity={0.9} />
        <pointLight />
      </mesh>
    </>
  );
}