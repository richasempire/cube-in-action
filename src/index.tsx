import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import App from './App.tsx';
import App from './App copy.tsx';
// import Apptest from './Apptest.tsx';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* <Apptest /> */}
    <App />
  </React.StrictMode>
);



// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import Cube from './components/Cube';

// const container = document.getElementById('root')!;
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <Cube />
//   </React.StrictMode>
// );
