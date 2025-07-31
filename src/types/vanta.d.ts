declare module "vanta/dist/vanta.dots.min.js" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vanta: any;
  export default vanta;
}

declare module "vanta" {
  export interface VantaEffect {
    destroy: () => void;
    resize: () => void;
  }

  export interface VantaOptions {
    el: HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    THREE: any;
    mouseControls: boolean;
    touchControls: boolean;
    gyroControls: boolean;
    minHeight: number;
    minWidth: number;
    scale: number;
    scaleMobile: number;
    color: string;
    backgroundColor: string;
    size: number;
    spacing: number;
    showLines: boolean;
  }

  export const DOTS: (options: Partial<VantaOptions>) => VantaEffect;
}
