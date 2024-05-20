declare module 'three/examples/jsm/controls/DragControls' {
    import { Camera, EventDispatcher, Object3D } from 'three';
  
    class DragControls extends EventDispatcher {
      constructor(objects: Object3D[], camera: Camera, domElement: HTMLElement);
    }
  
    export { DragControls };
  }
  