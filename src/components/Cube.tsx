import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, TransformControls } from '@react-three/drei';
import { useMeshStore } from '../store';
import * as THREE from 'three';

interface CubeProps {
  id: number;
  positions: [number, number, number][];
  mode: string;
  onTransformEnd: (position: [number, number, number]) => void;
}

const Cube: React.FC<CubeProps> = ({ id, positions, mode, onTransformEnd }) => {
  const { setPositions, setSelectedSphere, selectedSphere, setSelectedMesh, selectedMesh } = useMeshStore();
  const sphereRefs = useRef<React.MutableRefObject<THREE.Mesh | null>[]>(positions.map(() => React.createRef()));
  const groupRef = useRef<THREE.Group | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const controlRef = useRef<THREE.TransformControls>(null);
  const previousMeshPosition = useRef(new THREE.Vector3());
  const selectedObject = useRef<THREE.Object3D | null>(null);

  const handleSphereClick = (index: number) => {
    setSelectedSphere(id, index);
    setSelectedMesh(null);
    selectedObject.current = sphereRefs.current[index]?.current || null;
    if (controlRef.current && selectedObject.current) {
      controlRef.current.attach(selectedObject.current);
    }
  };

  const handleMeshClick = () => {
    setSelectedSphere(null, null);
    setSelectedMesh(id);
    selectedObject.current = groupRef.current;
    if (controlRef.current && selectedObject.current) {
      controlRef.current.attach(selectedObject.current);
    }
  };

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

  useFrame(() => {
    const control = controlRef.current;
    if (!control) return;

    if (selectedObject.current) {
      control.attach(selectedObject.current);
      if (selectedMesh === id && groupRef.current) {
        const controlledObject = groupRef.current;
        const currentMeshPosition = controlledObject.position;
        const offset = currentMeshPosition.clone().sub(previousMeshPosition.current);
        offset.set(offset.x / 2, offset.y / 2, offset.z / 2);
        previousMeshPosition.current.copy(currentMeshPosition);
        setPositions(id, (prev) =>
          prev.map((pos) => {
            const newPos = new THREE.Vector3(...pos).add(offset);
            return newPos.toArray() as [number, number, number];
          })
        );
      }
    } else {
      control.detach();
    }
  });

  useEffect(() => {
    const control = controlRef.current;
    if (control) {
      const handleObjectChange = () => {
        if (selectedSphere.cubeId === id && selectedSphere.sphereIndex !== null && sphereRefs.current[selectedSphere.sphereIndex]?.current) {
          const newPosition = sphereRefs.current[selectedSphere.sphereIndex].current?.position.toArray() as [number, number, number];
          setPositions(id, (prev) => {
            const newPositions = [...prev];
            if (selectedSphere.sphereIndex !== null) {
              newPositions[selectedSphere.sphereIndex] = newPosition;
            }
            return newPositions;
          });
        }
      };
      control.addEventListener('objectChange', handleObjectChange);
      control.addEventListener('mouseUp', () => {
        if (selectedObject.current && groupRef.current && selectedMesh === id) {
          const newPosition = groupRef.current.position.toArray() as [number, number, number];
          onTransformEnd(newPosition);
        }
      });
      return () => {
        control.removeEventListener('objectChange', handleObjectChange);
        control.removeEventListener('mouseUp', () => {});
      };
    }
  }, [selectedSphere, setPositions, selectedMesh, onTransformEnd]);

  return (
    <>
      <group castShadow ref={groupRef}>
        {positions.map((pos, index) => (
          <Sphere key={index} position={pos} args={[0.05, 16, 16]} ref={sphereRefs.current[index]} onClick={() => handleSphereClick(index)} castShadow>
            <meshStandardMaterial attach="material" color={selectedSphere.cubeId === id && selectedSphere.sphereIndex === index ? 'royalblue' : 'white'} />
          </Sphere>
        ))}
        <mesh castShadow ref={meshRef} onClick={handleMeshClick} receiveShadow>
          <meshStandardMaterial color="hotpink" side={THREE.DoubleSide} />
        </mesh>
      </group>
      <TransformControls mode={mode as 'translate' | 'rotate' | 'scale'} ref={controlRef} />
    </>
  );
};

export default Cube;