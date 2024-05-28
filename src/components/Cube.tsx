import React, { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, TransformControls } from '@react-three/drei';
import { useMeshStore } from '../store';
import * as THREE from 'three';

interface CubeProps {
  id: number;
  positions: [number, number, number][];
  mode: string;
}

const Cube: React.FC<CubeProps> = ({ id, positions, mode }) => {
  const { setPositions, setSelectedSphere, selectedSphere, setSelectedMesh, selectedMesh } = useMeshStore();
  
  // Create refs for spheres, group, mesh, control, and previous position
  const sphereRefs = useRef<React.MutableRefObject<THREE.Mesh | null>[]>(positions.map(() => React.createRef()));
  const groupRef = useRef<THREE.Group | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const controlRef = useRef<TransformControls>(null);
  // const previousMeshPosition = useRef(new THREE.Vector3());
  const selectedObject = useRef<THREE.Object3D | null>(null);

  // Function to compute the center of an object
  const getObjectCenter = (object: THREE.Object3D): THREE.Vector3 => {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    return center;
  };

  // Handle sphere click: set selected sphere and attach TransformControls
  const handleSphereClick = useCallback((index: number) => {
    setSelectedSphere(id, index);
    setSelectedMesh(null);
    selectedObject.current = sphereRefs.current[index]?.current || null;
    if (controlRef.current && selectedObject.current) {
      controlRef.current.attach(selectedObject.current);
      const center = getObjectCenter(selectedObject.current);
      console.log('Sphere center:', center);
    }
  }, [id, setSelectedSphere, setSelectedMesh]);

  // Handle mesh (cube) click: set selected mesh and attach TransformControls
  const handleMeshClick = useCallback(() => {
    setSelectedSphere(null, null);
    setSelectedMesh(id);
    

    groupRef.current?.parent?.children.forEach((child) => {
      
      if (child.type != 'Group'){
        console.log(child.type)
        console.log("Akshay",child)
        if (child instanceof THREE.Object3D){
          console.log("Child by ID -: ", child.id)
          console.log(child.getObjectById(child.id))
        }
        //return child.visible = !child.visible
      }

      child.children.forEach((innerChild) => {
          
          if (innerChild instanceof THREE.Mesh) {
            if(innerChild.geometry.type == "SphereGeometry"){
              return innerChild.visible = false;
            }
          }

          if (innerChild instanceof THREE.Object3D){
            console.log("INNER CHILD")
            console.log(innerChild)
            
              if(innerChild.type == "TransformControlPlane"){
                console.log("Setting TransformControlPlane - false")
                return innerChild.visible = ! innerChild.visible;
              }
              if(innerChild.type == "TransformControlsGizmo"){
                console.log("Setting TransformControlsGizmo - false")
                return innerChild.visible = ! innerChild.visible;
              }
            }
      })

      
  });

    groupRef.current?.parent?.children.forEach((child) => {
        child.children.forEach((innerChild) => {
            
            if (innerChild instanceof THREE.Mesh) {
              if(innerChild.geometry.type == "SphereGeometry"){
                return innerChild.visible = false;
              }
            }

            if (innerChild instanceof THREE.Object3D){
              //console.log("OBJECT CHILD")
              //console.log(innerChild)
              
                if(innerChild.type == "TransformControlPlane"){
                  console.log("Setting TransformControlPlane - false")
                  return innerChild.visible = ! innerChild.visible;
                }
                if(innerChild.type == "TransformControlsGizmo"){
                  console.log("Setting TransformControlsGizmo - false")
                  return innerChild.visible = ! innerChild.visible;
                }
              }
        })

        
    });

    

    groupRef.current?.children.forEach((child) => {
      //console.log(groupRef.current)
      if (child instanceof THREE.Mesh) {
        if(child.geometry.type == "SphereGeometry"){
          return child.visible = true;
        }
      }

    });

    selectedObject.current = groupRef.current;
    if (controlRef.current && selectedObject.current) {
      controlRef.current.attach(selectedObject.current);
      const center = getObjectCenter(selectedObject.current);
      console.log('Mesh center:', center);
    }
  }, [id, setSelectedSphere, setSelectedMesh]);

  // Update the cube's geometry when positions change
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

  // Handle frame updates: attach TransformControls and update positions
  // useFrame(() => {
  //   if (controlRef.current && selectedObject.current) {
  //     controlRef.current.attach(selectedObject.current);
  //     if (selectedMesh === id && groupRef.current) {
  //       const controlledObject = groupRef.current;
  //       const currentMeshPosition = controlledObject.position;
  //       const offset = currentMeshPosition.clone().sub(previousMeshPosition.current);
  //       previousMeshPosition.current.copy(currentMeshPosition);
  //       setPositions(id, (prev) =>
  //         prev.map((pos) => {
  //           const newPos = new THREE.Vector3(...pos).add(offset);
  //           return newPos.toArray() as [number, number, number];
  //         })
  //       );
  //     }
  //   }
  // });

  // Handle TransformControls events
  useEffect(() => {
    const control = controlRef.current;
    if (control) {
      // Update positions when a sphere is moved
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
      // Update position when the whole cube is moved
      control.addEventListener('objectChange', handleObjectChange);
      // Cleanup event listeners on component unmount
      return () => {
        control.removeEventListener('objectChange', handleObjectChange);
      };
    }
  }, [id, selectedSphere, setPositions, selectedMesh]);

  return (
    <>
      <group ref={groupRef} >
        {positions.map((pos, index) => (
          <Sphere key={index} position={pos} visible= {false} args={[0.05, 16, 16]} ref={sphereRefs.current[index]} onClick={() => handleSphereClick(index)} castShadow>
            <meshStandardMaterial attach="material" color={selectedSphere.cubeId === id && selectedSphere.sphereIndex === index ? 'royalblue' : 'white'} />
          </Sphere>
        ))}
        <mesh ref={meshRef} onClick={handleMeshClick} castShadow receiveShadow>
          <meshStandardMaterial color={selectedMesh === id ? 'green' : 'hotpink'} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {selectedObject.current && (
        <TransformControls mode={mode as 'translate' | 'rotate' | 'scale'} object={selectedObject.current} ref={controlRef} />
      )}
    </>
  );
};

export default Cube;