import React from 'react';
import Cube from './components/Cube';
import './App.css'; 
import { OrbitControls, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';


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
  return (
      <Canvas>
          <mesh>
            <Sky/>
    
            <Cube/>
          </mesh>
          
      </Canvas>
  )
};


// export default App;
