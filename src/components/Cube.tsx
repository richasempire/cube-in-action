import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, useCursor } from '@react-three/drei';
import { useControls } from 'leva';
import { DragControls } from'../utils/dragControls';
import { useDrag } from 'react-use-gesture';
import { useCubeStore } from '../store.ts';
import * as THREE from 'three';

// Zustand store setup
// const useStore = create((set) => ({
//   target: null,
//   setTarget: (target: any) => set({ target }),
//   selectedVertex: null,
//   setSelectedVertex: (vertex: any) => set({ selectedVertex: vertex }),
// }));

// Box component
// const Box = ({ vertices, setVertices }) => {
//   const meshRef = useRef();
//   const setTarget = useStore((state) => state.setTarget);
//   const [hovered, setHovered] = useState(false);
//   useCursor(hovered);

//   useEffect(() => {
//     const geometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(vertices.length * 3);
//     geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//     meshRef.current.geometry = geometry;
//     updateVertices();
//   }, [vertices]);

//   const updateVertices = () => {
//     const positions = meshRef.current.geometry.attributes.position.array;
//     vertices.forEach((vertex, i) => {
//       positions[i * 3] = vertex.x;
//       positions[i * 3 + 1] = vertex.y;
//       positions[i * 3 + 2] = vertex.z;
//     });
//     meshRef.current.geometry.attributes.position.needsUpdate = true;
//     meshRef.current.geometry.computeVertexNormals();
//   };

//   return (
//     <mesh
//       ref={meshRef}
//       onClick={(e) => setTarget(e.object)}
//       onPointerOver={() => setHovered(true)}
//       onPointerOut={() => setHovered(false)}
//     >
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'gray'} />
//     </mesh>
//   );
// };

// // EditableVertex component
// const EditableVertex = ({ position, index }) => {
//   const setSelectedVertex = useStore((state) => state.setSelectedVertex);
//   const [hovered, setHovered] = useState(false);
//   useCursor(hovered);

//   return (
//     <mesh
//       position={position.toArray()}
//       onClick={() => setSelectedVertex(index)}
//       onPointerOver={() => setHovered(true)}
//       onPointerOut={() => setHovered(false)}
//     >
//       <sphereGeometry args={[0.05, 16, 16]} />
//       <meshStandardMaterial color={hovered ? 'yellow' : 'blue'} />
//     </mesh>
//   );
// };

// Main Cube component
// export default function Cube() {
//   const { target, setTarget, selectedVertex, setSelectedVertex } = useStore();
//   const { mode } = useControls({ mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } });

//   const [vertices, setVertices] = useState([
//     new THREE.Vector3(-1, -1, -1),
//     new THREE.Vector3(1, -1, -1),
//     new THREE.Vector3(1, 1, -1),
//     new THREE.Vector3(-1, 1, -1),
//     new THREE.Vector3(-1, -1, 1),
//     new THREE.Vector3(1, -1, 1),
//     new THREE.Vector3(1, 1, 1),
//     new THREE.Vector3(-1, 1, 1),
//   ]);

//   const updateVertexPosition = (index, position) => {
//     const updatedVertices = vertices.map((vertex, i) => (i === index ? position.clone() : vertex));
//     setVertices(updatedVertices);
//   };

//   return (
//     <Canvas style={{ height: '100vh' }} onPointerMissed={() => setTarget(null)}>
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />
//       <Box vertices={vertices} setVertices={setVertices} />
//       {vertices.map((vertex, index) => (
//         <EditableVertex key={index} position={vertex} index={index} />
//       ))}
//       {selectedVertex !== null && (
//         <TransformControls
//           object={new THREE.Object3D().copy(vertices[selectedVertex])}
//           mode={mode}
//           onObjectChange={(e) => updateVertexPosition(selectedVertex, e.target.position)}
//         />
//       )}
//       <OrbitControls />
//     </Canvas>
//   );
// }



export default function Cube() {

    const colors = ['hotpink', 'red', 'blue', 'green', 'yellow'];
    const ref = useRef();
    const {colorIdx, setColorIdx, position, setPosition} = useCubeStore();
    
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    useFrame(() => {
        if (ref.current) {
            // Perform any necessary per-frame updates here
          }
      });

    const bind = useDrag(
        ({ offset: [x, y] }) => {
          const [, , z] = position;
          setPosition([x / aspect, -y / aspect, z]);
        },
        { pointerEvents: true }
      );


    return (
        <mesh position={position}
        {...bind()}
        ref={ref}
        onClick={(e) => {
        //   if (colorIdx === 4) {
        //     setColorIdx(0);
        //   } else {
        //     setColorIdx(colorIdx + 1);
        //   }
        }}
        onPointerOver={(e) => console.log('hover')}
        onPointerOut={(e) => console.log('unhover')}>
            <boxGeometry attach={"geometry"}/>
            <meshLambertMaterial attach="material" color={colors[colorIdx]} />
            {/* <OrbitControls/> */}
            <ambientLight intensity={0.9}/>
            <pointLight />
            {/* <meshStandardMaterial color = "grey" /> */}

        </mesh>
    )
};
