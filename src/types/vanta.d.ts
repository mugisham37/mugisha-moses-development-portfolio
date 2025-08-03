declare module "vanta/dist/vanta.dots.min.js" {
  import * as THREE from "three";

  interface VantaEffect {
    destroy: () => void;
    resize: () => void;
  }

  interface VantaDotOptions {
    el: HTMLElement;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: string;
    backgroundColor?: string;
    size?: number;
    spacing?: number;
    showLines?: boolean;
  }

  interface VantaGlobal {
    DOTS: (options: Partial<VantaDotOptions>) => VantaEffect;
  }

  const VANTA: VantaGlobal;
  export default VANTA;
}

declare global {
  interface Window {
    VANTA?: {
      DOTS: (options: any) => any;
    };
  }
}
