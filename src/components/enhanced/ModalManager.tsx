"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalConfig {
  id: string;
  title?: string;
  content: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  backdrop?: boolean;
  backdropClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  fullscreen?: boolean;
  className?: string;
  onClose?: () => void;
  onOpen?: () => void;
  zIndex?: number;
  lazy?: boolean;
  persistent?: boolean;
}

interface ModalState extends ModalConfig {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  stackIndex: number;
  openedAt: Date;
}

interface ModalContextType {
  modals: ModalState[];
  openModal: (config: ModalConfig) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  minimizeModal: (id: string) => void;
  maximizeModal: (id: string) => void;
  restoreModal: (id: string) => void;
  bringToFront: (id: string) => void;
  isModalOpen: (id: string) => boolean;
  getActiveModal: () => ModalState | null;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
  maxModals?: number;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({
  children,
  maxModals = 10,
}) => {
  const [modals, setModals] = useState<ModalState[]>([]);
  const [stackCounter, setStackCounter] = useState(1000);
  const focusTracker = useRef<HTMLElement[]>([]);

  // Focus management
  const trapFocus = useCallback((modalElement: HTMLElement) => {
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modalElement.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      modalElement.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  // Restore focus when modal closes
  const restoreFocus = useCallback(() => {
    const lastFocused = focusTracker.current.pop();
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
    }
  }, []);

  const openModal = useCallback(
    (config: ModalConfig) => {
      // Store current focus
      if (document.activeElement instanceof HTMLElement) {
        focusTracker.current.push(document.activeElement);
      }

      setModals((prev) => {
        // Check if modal already exists
        const existingIndex = prev.findIndex((m) => m.id === config.id);
        if (existingIndex !== -1) {
          // Bring existing modal to front
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            isOpen: true,
            stackIndex: stackCounter,
          };
          setStackCounter((c) => c + 1);
          return updated;
        }

        // Remove oldest modal if at max capacity
        let newModals = prev;
        if (prev.length >= maxModals) {
          newModals = prev.slice(1);
        }

        const newModal: ModalState = {
          ...config,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          stackIndex: stackCounter,
          openedAt: new Date(),
          size: config.size || "md",
          closable: config.closable !== false,
          backdrop: config.backdrop !== false,
          backdropClosable: config.backdropClosable !== false,
          keyboard: config.keyboard !== false,
          centered: config.centered !== false,
          scrollable: config.scrollable !== false,
          zIndex: config.zIndex || stackCounter,
        };

        setStackCounter((c) => c + 1);

        // Call onOpen callback
        config.onOpen?.();

        return [...newModals, newModal];
      });
    },
    [maxModals, stackCounter]
  );

  const closeModal = useCallback(
    (id: string) => {
      setModals((prev) => {
        const modal = prev.find((m) => m.id === id);
        if (modal) {
          modal.onClose?.();
          restoreFocus();
        }
        return prev.filter((m) => m.id !== id);
      });
    },
    [restoreFocus]
  );

  const closeAllModals = useCallback(() => {
    setModals((prev) => {
      prev.forEach((modal) => modal.onClose?.());
      return [];
    });
    restoreFocus();
  }, [restoreFocus]);

  const minimizeModal = useCallback((id: string) => {
    setModals((prev) =>
      prev.map((modal) =>
        modal.id === id
          ? { ...modal, isMinimized: true, isMaximized: false }
          : modal
      )
    );
  }, []);

  const maximizeModal = useCallback((id: string) => {
    setModals((prev) =>
      prev.map((modal) =>
        modal.id === id
          ? { ...modal, isMaximized: true, isMinimized: false }
          : modal
      )
    );
  }, []);

  const restoreModal = useCallback((id: string) => {
    setModals((prev) =>
      prev.map((modal) =>
        modal.id === id
          ? { ...modal, isMinimized: false, isMaximized: false }
          : modal
      )
    );
  }, []);

  const bringToFront = useCallback(
    (id: string) => {
      setModals((prev) =>
        prev.map((modal) =>
          modal.id === id ? { ...modal, stackIndex: stackCounter } : modal
        )
      );
      setStackCounter((c) => c + 1);
    },
    [stackCounter]
  );

  const isModalOpen = useCallback(
    (id: string) => {
      return modals.some((modal) => modal.id === id && modal.isOpen);
    },
    [modals]
  );

  const getActiveModal = useCallback(() => {
    return (
      modals
        .filter((modal) => modal.isOpen && !modal.isMinimized)
        .sort((a, b) => b.stackIndex - a.stackIndex)[0] || null
    );
  }, [modals]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeModal = getActiveModal();
      if (!activeModal || !activeModal.keyboard) return;

      if (e.key === "Escape") {
        e.preventDefault();
        if (activeModal.closable) {
          closeModal(activeModal.id);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [getActiveModal, closeModal]);

  // Body scroll lock
  useEffect(() => {
    const openModals = modals.filter(
      (modal) => modal.isOpen && !modal.isMinimized
    );
    if (openModals.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modals]);

  const contextValue: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    minimizeModal,
    maximizeModal,
    restoreModal,
    bringToFront,
    isModalOpen,
    getActiveModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <ModalRenderer
        modals={modals}
        onClose={closeModal}
        onMinimize={minimizeModal}
        onMaximize={maximizeModal}
        onRestore={restoreModal}
        onBringToFront={bringToFront}
        trapFocus={trapFocus}
      />
    </ModalContext.Provider>
  );
};

interface ModalRendererProps {
  modals: ModalState[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onRestore: (id: string) => void;
  onBringToFront: (id: string) => void;
  trapFocus: (element: HTMLElement) => () => void;
}

const ModalRenderer: React.FC<ModalRendererProps> = ({
  modals,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onBringToFront,
  trapFocus,
}) => {
  const modalRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Set up focus trapping for each modal
  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    modals.forEach((modal) => {
      if (modal.isOpen && !modal.isMinimized) {
        const modalElement = modalRefs.current.get(modal.id);
        if (modalElement) {
          const cleanup = trapFocus(modalElement);
          cleanupFunctions.push(cleanup);
        }
      }
    });

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [modals, trapFocus]);

  const getSizeClasses = (size: string, isMaximized: boolean) => {
    if (isMaximized) return "w-full h-full max-w-none max-h-none";

    switch (size) {
      case "sm":
        return "max-w-md";
      case "md":
        return "max-w-2xl";
      case "lg":
        return "max-w-4xl";
      case "xl":
        return "max-w-6xl";
      case "full":
        return "w-full h-full max-w-none max-h-none";
      default:
        return "max-w-2xl";
    }
  };

  return (
    <>
      {/* Modal Overlays */}
      <AnimatePresence>
        {modals
          .filter((modal) => modal.isOpen && !modal.isMinimized)
          .sort((a, b) => a.stackIndex - b.stackIndex)
          .map((modal) => (
            <motion.div
              key={modal.id}
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{ zIndex: modal.zIndex }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Backdrop */}
              {modal.backdrop && (
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    if (modal.backdropClosable && modal.closable) {
                      onClose(modal.id);
                    }
                  }}
                />
              )}

              {/* Modal Content */}
              <motion.div
                ref={(el) => {
                  if (el) modalRefs.current.set(modal.id, el);
                }}
                className={cn(
                  "relative bg-white border-3 border-black shadow-lg",
                  getSizeClasses(modal.size!, modal.isMaximized),
                  modal.centered ? "mx-auto" : "",
                  modal.scrollable ? "overflow-auto" : "",
                  modal.className
                )}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => onBringToFront(modal.id)}
                role="dialog"
                aria-modal="true"
                aria-labelledby={
                  modal.title ? `modal-title-${modal.id}` : undefined
                }
              >
                {/* Modal Header */}
                {(modal.title || modal.closable) && (
                  <div className="flex items-center justify-between p-4 border-b-3 border-black">
                    {modal.title && (
                      <h2
                        id={`modal-title-${modal.id}`}
                        className="text-xl font-black uppercase tracking-wider font-mono"
                      >
                        {modal.title}
                      </h2>
                    )}

                    <div className="flex items-center gap-2">
                      {/* Minimize Button */}
                      <button
                        onClick={() => onMinimize(modal.id)}
                        className="p-2 hover:bg-gray-100 transition-colors duration-300"
                        title="Minimize"
                      >
                        <Minimize2 size={16} />
                      </button>

                      {/* Maximize/Restore Button */}
                      <button
                        onClick={() =>
                          modal.isMaximized
                            ? onRestore(modal.id)
                            : onMaximize(modal.id)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors duration-300"
                        title={modal.isMaximized ? "Restore" : "Maximize"}
                      >
                        <Maximize2 size={16} />
                      </button>

                      {/* Close Button */}
                      {modal.closable && (
                        <button
                          onClick={() => onClose(modal.id)}
                          className="p-2 hover:bg-gray-100 transition-colors duration-300"
                          title="Close"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Modal Body */}
                <div
                  className={cn("p-6", modal.scrollable ? "overflow-auto" : "")}
                >
                  {modal.lazy
                    ? modal.isOpen
                      ? modal.content
                      : null
                    : modal.content}
                </div>
              </motion.div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Minimized Modals Bar */}
      {modals.some((modal) => modal.isMinimized) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-3 border-black p-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            {modals
              .filter((modal) => modal.isMinimized)
              .map((modal) => (
                <button
                  key={modal.id}
                  onClick={() => onRestore(modal.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-2 border-black hover:bg-gray-200 transition-colors duration-300 whitespace-nowrap"
                >
                  <span className="font-mono font-bold text-sm">
                    {modal.title || modal.id}
                  </span>
                  {modal.closable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose(modal.id);
                      }}
                      className="p-1 hover:bg-gray-300 rounded"
                    >
                      <X size={12} />
                    </button>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

// Utility hook for common modal patterns
export const useModalActions = () => {
  const { openModal, closeModal } = useModal();

  const confirm = useCallback(
    (message: string, onConfirm: () => void, onCancel?: () => void) => {
      const modalId = `confirm-${Date.now()}`;

      openModal({
        id: modalId,
        title: "Confirm Action",
        size: "sm",
        content: (
          <div className="text-center">
            <p className="font-mono mb-6">{message}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  onConfirm();
                  closeModal(modalId);
                }}
                className="px-4 py-2 bg-red-600 text-white border-2 border-black font-mono font-bold hover:bg-red-700 transition-colors duration-300"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  onCancel?.();
                  closeModal(modalId);
                }}
                className="px-4 py-2 bg-gray-200 border-2 border-black font-mono font-bold hover:bg-gray-300 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
      });
    },
    [openModal, closeModal]
  );

  const alert = useCallback(
    (message: string, title?: string) => {
      const modalId = `alert-${Date.now()}`;

      openModal({
        id: modalId,
        title: title || "Alert",
        size: "sm",
        content: (
          <div className="text-center">
            <p className="font-mono mb-6">{message}</p>
            <button
              onClick={() => closeModal(modalId)}
              className="px-4 py-2 bg-brutalist-yellow border-2 border-black font-mono font-bold hover:bg-yellow-400 transition-colors duration-300"
            >
              OK
            </button>
          </div>
        ),
      });
    },
    [openModal, closeModal]
  );

  return { confirm, alert };
};

export default ModalProvider;
