import React, { memo, useState, useRef, useEffect } from 'react';
import Cube from './components/Cube';
import './App.css';
import { GizmoHelper, GizmoViewcube, useCursor, Grid, AccumulativeShadows, Environment, RandomizedLight, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { useCubeStore } from './store';
import { useControls } from 'leva';
import EditableCube  from './components/cubeWithVertex'
import * as THREE from 'three';

export default function App() {
  const cubeVertices = [{}]
  const { target, setTarget, isDragging, setDragging } = useCubeStore();
  const orbitControlsRef = useRef<any>(null);  
  const transformRef = useRef<any>(null);  

  const Shadows = memo(() => (
    <AccumulativeShadows temporal frames={100} color="#9d4b4b" colorBlend={0.5} alphaTest={0.9} scale={20}>
      <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
    </AccumulativeShadows>
  ));

  const gridConfig = {
    cellSize: { value: 1, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: '#6f6f6f',
    sectionSize: { value: 5, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: '#9d7a7a',
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  };

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const { mode } = useControls({ mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } });

  useEffect(() => {
    if (transformRef.current) {
      const controls = transformRef.current;
      controls.addEventListener('dragging-changed', (event) => {
        setDragging(event.value);
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = !event.value;
        }
      });
    }
  }, [setDragging]);




    function multipleVertex( meshObject ) {
      console.log("Object : ", meshObject.object)
      console.log("Vertex osition", meshObject.object.getVertexPosition)
      console.log("applyColor", meshObject.object.geometry)
      const position = meshObject.object.geometry.attributes.position;

      for( let i=0 ; i< position.count ; i++ )
        {
          console.log("points", position.array[i])
          cubeVertices.push(i, i+1, i+2)
        }
        console.log(position.array)

  }
  useState
  const material = new THREE.PointsMaterial({
    color: 0x0000ff, // Blue color
    size: 0.5,                                                   // Size of the point
  });
  const geometry = new THREE.BufferGeometry();

  // Create a Float32Array for the single point
  const vertices = new Float32Array([0.5, 0.5, -0.5]);

  // Add the vertices to the geometry
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));


  return (
    <Canvas shadows camera={{ position: [10, 12, 12], fov: 25 }} onPointerMissed={() => setTarget(null)}>
{/*       <mesh
        onClick={(e) => setTarget(e.object)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Cube />
      </mesh> */}

    {/* <mesh onClick={(e) => setTarget(e.object)}  onDoubleClick={(e) => console.log('double click')}> */}
    <mesh 
     
     position={[0, 0, 0]}
     onClick={(e) => {
      //console.log('dsingle click' , e.object.geometry.attributes.position)
      console.log('dsingle click' , e)
      
      multipleVertex(e)
      }}  
     onDoubleClick={(e) => console.log('double click')}>
      <boxGeometry  args={[1, 1, 1]}
        
        />
      
      <meshLambertMaterial color="hotpink" /> 
    </mesh>
    
    <points geometry={geometry} material={material} />
    
    


{/* <mesh onClick={(e) => setTarget(e.object)}  onDoubleClick={(e) => console.log('double click')}>
<EditableCube />
</mesh>
     */}

      {target && <TransformControls object={target} mode={mode as 'translate' | 'rotate' | 'scale'} ref={transformRef}/>}
      <Environment preset="city" />
      <ambientLight intensity={0.9} />
      <pointLight position={[5, 5, -5]} castShadow shadow-mapSize={1024} />
    
        <OrbitControls makeDefault />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewcube />
      </GizmoHelper>
      <Grid
        position={[0, 0, 0]}
        args={[10.5, 10.5]}
        cellSize={gridConfig.cellSize.value}
        cellThickness={gridConfig.cellThickness.value}
        cellColor={gridConfig.cellColor}
        sectionSize={gridConfig.sectionSize.value}
        sectionThickness={gridConfig.sectionThickness.value}
        sectionColor={gridConfig.sectionColor}
        fadeDistance={gridConfig.fadeDistance.value}
        fadeStrength={gridConfig.fadeStrength.value}
        followCamera={gridConfig.followCamera}
        infiniteGrid={gridConfig.infiniteGrid}
      />
    </Canvas>
  );
}




// step 1 --> get vertices
// step 2 --> highlight vertices of cube
// step 3 --> move vertices and update cube
// step 4 --> update on mouse event