declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, MOUSE, Object3D, Vector3 } from 'three';

  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);

    object: Camera;
    domElement: HTMLElement | undefined;

    // API
    enabled: boolean;
    target: Vector3;

    // deprecated
    center: Vector3;
    noZoom: boolean;
    noRotate: boolean;
    noPan: boolean;
    noKeys: boolean;
    staticMoving: boolean;
    dynamicDampingFactor: number;

    minDistance: number;
    maxDistance: number;

    minZoom: number;
    maxZoom: number;

    minPolarAngle: number;
    maxPolarAngle: number;

    minAzimuthAngle: number;
    maxAzimuthAngle: number;

    enableDamping: boolean;
    dampingFactor: number;

    enableZoom: boolean;
    zoomSpeed: number;

    enableRotate: boolean;
    rotateSpeed: number;

    enablePan: boolean;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;

    autoRotate: boolean;
    autoRotateSpeed: number;

    keys: { LEFT: number; UP: number; RIGHT: number; BOTTOM: number };
    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };

    target0: Vector3;
    position0: Vector3;
    zoom0: number;

    saveState(): void;

    reset(): void;

    update(): boolean;

    dispose(): void;

    getPolarAngle(): number;

    getAzimuthalAngle(): number;

    // EventDispatcher mixins
    addEventListener(type: string, listener: (event: any) => void): void;

    hasEventListener(type: string, listener: (event: any) => void): boolean;

    removeEventListener(type: string, listener: (event: any) => void): void;

    dispatchEvent(event: { type: string; target: any }): void;
  }
}

declare module 'three/examples/jsm/controls/TransformControls' {
  import {
    Camera,
    Object3D,
    EventDispatcher,
    MOUSE,
    Vector3
  } from 'three';

  export class TransformControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);

    domElement: HTMLElement | undefined;

    // API
    enabled: boolean;
    axis: string | null;
    mode: 'translate' | 'rotate' | 'scale';
    translationSnap: number | null;
    rotationSnap: number | null;
    scaleSnap: number | null;
    space: 'world' | 'local';
    size: number;
    dragging: boolean;
    showX: boolean;
    showY: boolean;
    showZ: boolean;

    attach(object: Object3D): void;
    detach(): void;
    update(): void;
    reset(): void;
    dispose(): void;
  }
}
