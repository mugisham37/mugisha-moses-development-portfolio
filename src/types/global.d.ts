declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: {
        event_category?: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
  }
}

export {};
