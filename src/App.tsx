import React from 'react';
import Cube from './components/Cube';
import './App.css'; 
import { OrbitControls, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useCubeStore } from "./store.ts"


// const App: React.FC = () => {
//   return (
//     <div className="App">

//       <canvas>
//       <Sky/>

//       </canvas>
   
     

//     </div>
//   );
// };




export default function App() {

  const isDragging = useCubeStore((state) => state.isDragging)
  return (
      <Canvas>
          <mesh>
            <Sky/>
    
            <Cube/>
            <OrbitControls enabled= {!isDragging} />
          </mesh>
          
      </Canvas>
  )
};


// export default App;
