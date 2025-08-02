import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalProvider, useModal, useModalActions } from "../ModalManager";
import React from "react";

// Test component that uses the modal context
const TestModalComponent: React.FC = () => {
  const { openModal, closeModal, modals, isModalOpen } = useModal();
  const { confirm, alert } = useModalActions();

  return (
    <div>
      <button
        onClick={() =>
          openModal({
            id: "test-modal",
            title: "Test Modal",
            content: <div>Test Content</div>,
          })
        }
      >
        Open Modal
      </button>

      <button onClick={() => closeModal("test-modal")}>Close Modal</button>

      <button
        onClick={() => confirm("Are you sure?", () => console.log("confirmed"))}
      >
        Show Confirm
      </button>

      <button onClick={() => alert("Alert message")}>Show Alert</button>

      <div data-testid="modal-count">{modals.length}</div>
      <div data-testid="modal-open">{isModalOpen("test-modal").toString()}</div>
    </div>
  );
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ModalProvider>{children}</ModalProvider>
);

describe("ModalManager", () => {
  beforeEach(() => {
    // Clear any existing modals
    document.body.innerHTML = "";
  });

  describe("ModalProvider", () => {
    it("should provide modal context to children", () => {
      render(
        <TestWrapper>
          <TestModalComponent />
        </TestWrapper>
      );

      expect(screen.getByText("Open Modal")).toBeInTheDocument();
      expect(screen.getByTestId("modal-count")).toHaveTextContent("0");
      expect(screen.getByTestId("modal-open")).toHaveTextContent("false");
    });

    it("should open and close modals", async () => {
      render(
        <TestWrapper>
          <TestModalComponent />
        </TestWrapper>
      );

      // Open modal
      fireEvent.click(screen.getByText("Open Modal"));

      await waitFor(() => {
        expect(screen.getByTestId("modal-count")).toHaveTextContent("1");
        expect(screen.getByTestId("modal-open")).toHaveTextContent("true");
        expect(screen.getByText("Test Modal")).toBeInTheDocument();
        expect(screen.getByText("Test Content")).toBeInTheDocument();
      });

      // Close modal
      fireEvent.click(screen.getByText("Close Modal"));

      await waitFor(() => {
        expect(screen.getByTestId("modal-count")).toHaveTextContent("0");
        expect(screen.getByTestId("modal-open")).toHaveTextContent("false");
      });
    });

    it("should close modal when clicking backdrop", async () => {
      render(
        <TestWrapper>
          <TestModalComponent />
        </TestWrapper>
      );

      // Open modal
      fireEvent.click(screen.getByText("Open Modal"));

      await waitFor(() => {
        expect(screen.getByText("Test Modal")).toBeInTheDocument();
      });

      // Click backdrop (the overlay div)
      const backdrop = document.querySelector(
        ".fixed.inset-0 > .absolute.inset-0"
      );
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      await waitFor(() => {
        expect(screen.getByTestId("modal-count")).toHaveTextContent("0");
      });
    });

    it("should close modal when pressing Escape key", async () => {
      render(
        <TestWrapper>
          <TestModalComponent />
        </TestWrapper>
      );

      // Open modal
      fireEvent.click(screen.getByText("Open Modal"));

      await waitFor(() => {
        expect(screen.getByText("Test Modal")).toBeInTheDocument();
      });

      // Press Escape key
      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(screen.getByTestId("modal-count")).toHaveTextContent("0");
      });
    });

    it("should handle multiple modals", async () => {
      const MultiModalComponent: React.FC = () => {
        const { openModal, modals } = useModal();

        return (
          <div>
            <button
              onClick={() =>
                openModal({
                  id: "modal-1",
                  title: "Modal 1",
                  content: <div>Content 1</div>,
                })
              }
            >
              Open Modal 1
            </button>

            <button
              onClick={() =>
                openModal({
                  id: "modal-2",
                  title: "Modal 2",
                  content: <div>Content 2</div>,
                })
              }
            >
              Open Modal 2
            </button>

            <div data-testid="modal-count">{modals.length}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <MultiModalComponent />
        </TestWrapper>
      );

      // Open first modal
      fireEvent.click(screen.getByText("Open Modal 1"));

      await waitFor(() => {
        expect(screen.getByTestId("modal-count")).toHaveTextContent("1");
        expect(screen.getByText("Modal 1")).toBeInTheDocument();
      });

      // Open second modal
      fireEvent.click(screen.getByText("Open Modal 2"));

      await waitFor(() => {
        expect(screen.getByTestId("modal-count")).toHaveTextContent("2");
        expect(screen.getByText("Modal 2")).toBeInTheDocument();
      });
    });

    it("should handle modal minimization and restoration", async () => {
      const MinimizeTestComponent: React.FC = () => {
        const { openModal, minimizeModal, restoreModal, modals } = useModal();

        return (
          <div>
            <button
              onClick={() =>
                openModal({
                  id: "minimize-test",
                  title: "Minimize Test",
                  content: <div>Test Content</div>,
                })
              }
            >
              Open Modal
            </button>

            <button onClick={() => minimizeModal("minimize-test")}>
              Minimize Modal
            </button>

            <button onClick={() => restoreModal("minimize-test")}>
              Restore Modal
            </button>

            <div data-testid="is-minimized">
              {modals
                .find((m) => m.id === "minimize-test")
                ?.isMinimized?.toString() || "false"}
            </div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <MinimizeTestComponent />
        </TestWrapper>
      );

      // Open modal
      fireEvent.click(screen.getByText("Open Modal"));

      await waitFor(() => {
        expect(screen.getByText("Minimize Test")).toBeInTheDocument();
        expect(screen.getByTestId("is-minimized")).toHaveTextContent("false");
      });

      // Minimize modal
      fireEvent.click(screen.getByText("Minimize Modal"));

      await waitFor(() => {
        expect(screen.getByTestId("is-minimized")).toHaveTextContent("true");
      });

      // Restore modal
      fireEvent.click(screen.getByText("Restore Modal"));

      await waitFor(() => {
        expect(screen.getByTestId("is-minimized")).toHaveTextContent("false");
      });
    });
  });

  describe("useModalActions", () => {
    it("should show confirm dialog", async () => {
      render(
        <TestWrapper>
          <TestModalComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText("Show Confirm"));

      await waitFor(() => {
        expect(screen.getByText("Confirm Action")).toBeInTheDocument();
        expect(screen.getByText("Are you sure?")).toBeInTheDocument();
        expect(screen.getByText("Confirm")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
      });
    });

    it("should show alert dialog", async () => {
      render(
        <TestWrapper>
          <TestModalComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText("Show Alert"));

      await waitFor(() => {
        expect(screen.getByText("Alert")).toBeInTheDocument();
        expect(screen.getByText("Alert message")).toBeInTheDocument();
        expect(screen.getByText("OK")).toBeInTheDocument();
      });
    });

    it("should handle confirm dialog actions", async () => {
      const mockConfirm = vi.fn();
      const mockCancel = vi.fn();

      const ConfirmTestComponent: React.FC = () => {
        const { confirm } = useModalActions();

        return (
          <button
            onClick={() => confirm("Test message", mockConfirm, mockCancel)}
          >
            Show Confirm
          </button>
        );
      };

      render(
        <TestWrapper>
          <ConfirmTestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText("Show Confirm"));

      await waitFor(() => {
        expect(screen.getByText("Test message")).toBeInTheDocument();
      });

      // Click confirm
      fireEvent.click(screen.getByText("Confirm"));

      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalled();
      });
    });
  });

  describe("Modal Configuration", () => {
    it("should respect modal configuration options", async () => {
      const ConfigTestComponent: React.FC = () => {
        const { openModal } = useModal();

        return (
          <button
            onClick={() =>
              openModal({
                id: "config-test",
                title: "Config Test",
                content: <div>Test Content</div>,
                size: "lg",
                closable: false,
                backdrop: false,
              })
            }
          >
            Open Configured Modal
          </button>
        );
      };

      render(
        <TestWrapper>
          <ConfigTestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText("Open Configured Modal"));

      await waitFor(() => {
        expect(screen.getByText("Config Test")).toBeInTheDocument();

        // Should not have close button (closable: false)
        expect(screen.queryByTitle("Close")).not.toBeInTheDocument();

        // Should not have backdrop (backdrop: false)
        expect(
          document.querySelector(".absolute.inset-0.bg-black")
        ).not.toBeInTheDocument();
      });
    });

    it("should handle lazy loading", async () => {
      const LazyTestComponent: React.FC = () => {
        const { openModal } = useModal();

        return (
          <button
            onClick={() =>
              openModal({
                id: "lazy-test",
                title: "Lazy Test",
                content: <div>Lazy Content</div>,
                lazy: true,
              })
            }
          >
            Open Lazy Modal
          </button>
        );
      };

      render(
        <TestWrapper>
          <LazyTestComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText("Open Lazy Modal"));

      await waitFor(() => {
        expect(screen.getByText("Lazy Test")).toBeInTheDocument();
        expect(screen.getByText("Lazy Content")).toBeInTheDocument();
      });
    });
  });

  describe("Focus Management", () => {
    it("should manage focus properly", async () => {
      const FocusTestComponent: React.FC = () => {
        const { openModal } = useModal();

        return (
          <div>
            <button
              data-testid="trigger-button"
              onClick={() =>
                openModal({
                  id: "focus-test",
                  title: "Focus Test",
                  content: (
                    <div>
                      <button data-testid="modal-button">Modal Button</button>
                      <input data-testid="modal-input" />
                    </div>
                  ),
                })
              }
            >
              Open Modal
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <FocusTestComponent />
        </TestWrapper>
      );

      const triggerButton = screen.getByTestId("trigger-button");
      triggerButton.focus();
      expect(document.activeElement).toBe(triggerButton);

      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText("Focus Test")).toBeInTheDocument();
      });

      // Focus should move to the first focusable element in the modal
      await waitFor(() => {
        const modalButton = screen.getByTestId("modal-button");
        expect(document.activeElement).toBe(modalButton);
      });
    });
  });

  describe("Body Scroll Lock", () => {
    it("should lock body scroll when modal is open", async () => {
      render(
        <TestWrapper>
          <TestModalComponent />
        </TestWrapper>
      );

      // Initially, body should not have overflow hidden
      expect(document.body.style.overflow).not.toBe("hidden");

      // Open modal
      fireEvent.click(screen.getByText("Open Modal"));

      await waitFor(() => {
        expect(screen.getByText("Test Modal")).toBeInTheDocument();
        expect(document.body.style.overflow).toBe("hidden");
      });

      // Close modal
      fireEvent.click(screen.getByText("Close Modal"));

      await waitFor(() => {
        expect(document.body.style.overflow).not.toBe("hidden");
      });
    });
  });
});
