"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Image,
  FileText,
  Video,
  MessageSquare,
  Layers,
  Maximize2,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useModal, useModalActions } from "./ModalManager";
import AccessibleModal, { ConfirmModal, AlertModal } from "./AccessibleModal";
import BrutalistButton from "../ui/BrutalistButton";
import { EnhancedInput, EnhancedTextarea } from "./EnhancedInput";
import { cn } from "@/lib/utils";

export interface ModalExamplesProps {
  className?: string;
}

const ModalExamples: React.FC<ModalExamplesProps> = ({ className }) => {
  const { openModal, closeModal, modals } = useModal();
  const { confirm, alert } = useModalActions();

  // State for accessible modals
  const [showAccessibleModal, setShowAccessibleModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalVariant, setModalVariant] = useState<
    "success" | "warning" | "error" | "info"
  >("info");

  // Form state for modal forms
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sample content components
  const ImageGalleryContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 border-2 border-black flex items-center justify-center"
          >
            <Image size={32} className="text-gray-400" />
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="font-mono text-sm opacity-80">
          Click on any image to view full size
        </p>
      </div>
    </div>
  );

  const VideoPlayerContent = () => (
    <div className="space-y-4">
      <div className="aspect-video bg-black border-2 border-gray-300 flex items-center justify-center">
        <Video size={64} className="text-white" />
      </div>
      <div className="flex items-center justify-center gap-4">
        <BrutalistButton size="sm" variant="primary">Play</BrutalistButton>
        <BrutalistButton size="sm" variant="secondary">
          Pause
        </BrutalistButton>
        <BrutalistButton size="sm" variant="secondary">
          Stop
        </BrutalistButton>
      </div>
    </div>
  );

  const SettingsContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-mono font-bold mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono">Dark Mode</span>
            <input type="checkbox" className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono">Notifications</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono">Auto-save</span>
            <input type="checkbox" className="w-4 h-4" defaultChecked />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-mono font-bold mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono">Analytics</span>
            <select className="p-2 border-2 border-black font-mono">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono">Cookies</span>
            <select className="p-2 border-2 border-black font-mono">
              <option>Essential Only</option>
              <option>All Cookies</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactFormContent = () => (
    <form className="space-y-4">
      <EnhancedInput
        label="Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        fullWidth
      />
      <EnhancedInput
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        fullWidth
      />
      <EnhancedTextarea
        label="Message"
        value={formData.message}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, message: e.target.value }))
        }
        rows={4}
        fullWidth
      />
      <div className="flex items-center justify-end gap-3 pt-4">
        <BrutalistButton
          type="button"
          variant="secondary"
          size="md"
          onClick={() => closeModal("contact-form")}
        >
          Cancel
        </BrutalistButton>
        <BrutalistButton type="submit" variant="primary" size="md">Send Message</BrutalistButton>
      </div>
    </form>
  );

  const DocumentViewerContent = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 border-2 border-gray-300 p-8 min-h-96">
        <div className="space-y-4">
          <h1 className="text-2xl font-black font-mono">Sample Document</h1>
          <p className="font-mono">
            This is a sample document viewer modal. In a real application, this
            would display PDF files, Word documents, or other file types.
          </p>
          <p className="font-mono">
            The modal is scrollable and can handle large documents with proper
            pagination and zoom controls.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white border-2 border-black p-4">
              <h3 className="font-mono font-bold mb-2">Section 1</h3>
              <p className="font-mono text-sm">Content for section 1...</p>
            </div>
            <div className="bg-white border-2 border-black p-4">
              <h3 className="font-mono font-bold mb-2">Section 2</h3>
              <p className="font-mono text-sm">Content for section 2...</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrutalistButton size="sm" variant="secondary">
            Zoom In
          </BrutalistButton>
          <BrutalistButton size="sm" variant="secondary">
            Zoom Out
          </BrutalistButton>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );

  const openImageGallery = () => {
    openModal({
      id: "image-gallery",
      title: "Image Gallery",
      content: <ImageGalleryContent />,
      size: "lg",
    });
  };

  const openVideoPlayer = () => {
    openModal({
      id: "video-player",
      title: "Video Player",
      content: <VideoPlayerContent />,
      size: "lg",
      backdrop: true,
    });
  };

  const openSettings = () => {
    openModal({
      id: "settings",
      title: "Settings",
      content: <SettingsContent />,
      size: "md",
    });
  };

  const openContactForm = () => {
    openModal({
      id: "contact-form",
      title: "Contact Us",
      content: <ContactFormContent />,
      size: "md",
    });
  };

  const openDocumentViewer = () => {
    openModal({
      id: "document-viewer",
      title: "Document Viewer",
      content: <DocumentViewerContent />,
      size: "xl",
      scrollable: true,
    });
  };

  const openNestedModal = () => {
    openModal({
      id: "nested-parent",
      title: "Parent Modal",
      content: (
        <div className="space-y-4">
          <p className="font-mono">
            This is a parent modal. You can open child modals from here.
          </p>
          <div className="flex items-center gap-3">
            <BrutalistButton
              variant="primary"
              size="md"
              onClick={() =>
                openModal({
                  id: "nested-child-1",
                  title: "Child Modal 1",
                  content: (
                    <div>
                      <p className="font-mono mb-4">This is child modal 1.</p>
                      <BrutalistButton
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          openModal({
                            id: "nested-child-2",
                            title: "Child Modal 2",
                            content: (
                              <p className="font-mono">
                                This is child modal 2 (grandchild).
                              </p>
                            ),
                            size: "sm",
                          })
                        }
                      >
                        Open Grandchild Modal
                      </BrutalistButton>
                    </div>
                  ),
                  size: "md",
                })
              }
            >
              Open Child Modal 1
            </BrutalistButton>

            <BrutalistButton
              variant="secondary"
              size="md"
              onClick={() =>
                openModal({
                  id: "nested-child-2",
                  title: "Child Modal 2",
                  content: <p className="font-mono">This is child modal 2.</p>,
                  size: "sm",
                })
              }
            >
              Open Child Modal 2
            </BrutalistButton>
          </div>
        </div>
      ),
      size: "lg",
    });
  };

  const showConfirmDialog = () => {
    confirm(
      "Are you sure you want to delete this item? This action cannot be undone.",
      () => {
        alert("Item deleted successfully!", "Success");
      },
      () => {
        console.log("Delete cancelled");
      }
    );
  };

  const showAlertDialog = () => {
    alert("This is an alert message with important information.");
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider font-mono mb-4">
          Modal System Examples
        </h2>
        <p className="text-lg font-mono opacity-80">
          Comprehensive modal management with stacking, accessibility, and
          animations
        </p>
      </motion.div>

      {/* Modal Trigger Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Basic Modals */}
        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-black uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <Image size={20} />
            Basic Modals
          </h3>
          <div className="space-y-3">
            <BrutalistButton
              onClick={openImageGallery}
              className="w-full flex items-center gap-2"
              size="sm"
              variant="primary"
            >
              <Image size={16} />
              Image Gallery
            </BrutalistButton>

            <BrutalistButton
              onClick={openVideoPlayer}
              className="w-full flex items-center gap-2"
              size="sm"
              variant="primary"
            >
              <Video size={16} />
              Video Player
            </BrutalistButton>

            <BrutalistButton
              onClick={openDocumentViewer}
              className="w-full flex items-center gap-2"
              size="sm"
              variant="primary"
            >
              <FileText size={16} />
              Document Viewer
            </BrutalistButton>
          </div>
        </motion.div>

        {/* Interactive Modals */}
        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-black uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <Settings size={20} />
            Interactive
          </h3>
          <div className="space-y-3">
            <BrutalistButton
              onClick={openSettings}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <Settings size={16} />
              Settings Panel
            </BrutalistButton>

            <BrutalistButton
              onClick={openContactForm}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <MessageSquare size={16} />
              Contact Form
            </BrutalistButton>

            <BrutalistButton
              onClick={() => setShowAccessibleModal(true)}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <Maximize2 size={16} />
              Accessible Modal
            </BrutalistButton>
          </div>
        </motion.div>

        {/* Advanced Features */}
        <motion.div
          className="bg-white border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-black uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <Layers size={20} />
            Advanced
          </h3>
          <div className="space-y-3">
            <BrutalistButton
              onClick={openNestedModal}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <Layers size={16} />
              Nested Modals
            </BrutalistButton>

            <BrutalistButton
              onClick={showConfirmDialog}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <AlertTriangle size={16} />
              Confirm Dialog
            </BrutalistButton>

            <BrutalistButton
              onClick={showAlertDialog}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <Info size={16} />
              Alert Dialog
            </BrutalistButton>
          </div>
        </motion.div>
      </div>

      {/* Accessible Modal Variants */}
      <motion.div
        className="bg-white border-3 border-black p-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-black uppercase tracking-wider font-mono mb-4">
          Accessible Modal Variants
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <BrutalistButton
            onClick={() => {
              setModalVariant("success");
              setShowAccessibleModal(true);
            }}
            className="flex items-center gap-2"
            size="sm"
          >
            <CheckCircle size={16} />
            Success
          </BrutalistButton>

          <BrutalistButton
            onClick={() => {
              setModalVariant("warning");
              setShowAccessibleModal(true);
            }}
            className="flex items-center gap-2"
            size="sm"
          >
            <AlertTriangle size={16} />
            Warning
          </BrutalistButton>

          <BrutalistButton
            onClick={() => {
              setModalVariant("error");
              setShowAccessibleModal(true);
            }}
            className="flex items-center gap-2"
            size="sm"
          >
            <AlertTriangle size={16} />
            Error
          </BrutalistButton>

          <BrutalistButton
            onClick={() => {
              setModalVariant("info");
              setShowAccessibleModal(true);
            }}
            className="flex items-center gap-2"
            size="sm"
          >
            <Info size={16} />
            Info
          </BrutalistButton>
        </div>
      </motion.div>

      {/* Modal Status */}
      {modals.length > 0 && (
        <motion.div
          className="bg-brutalist-yellow border-3 border-black p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-black uppercase tracking-wider font-mono mb-4">
            Active Modals ({modals.length})
          </h3>
          <div className="space-y-2">
            {modals.map((modal) => (
              <div
                key={modal.id}
                className="flex items-center justify-between bg-white border-2 border-black p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">
                    {modal.title || modal.id}
                  </span>
                  <span className="text-xs font-mono opacity-60">
                    {modal.isMinimized
                      ? "Minimized"
                      : modal.isMaximized
                        ? "Maximized"
                        : "Normal"}
                  </span>
                </div>
                <BrutalistButton
                  onClick={() => closeModal(modal.id)}
                  size="sm"
                  variant="secondary"
                >
                  Close
                </BrutalistButton>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Accessible Modal */}
      <AccessibleModal
        isOpen={showAccessibleModal}
        onClose={() => setShowAccessibleModal(false)}
        title={`${modalVariant.charAt(0).toUpperCase() + modalVariant.slice(1)
          } Modal`}
        variant={modalVariant}
        size="md"
        returnFocus={buttonRef}
        footer={
          <div className="flex items-center justify-end gap-3">
            <BrutalistButton
              onClick={() => setShowAccessibleModal(false)}
              variant="secondary"
            >
              Close
            </BrutalistButton>
            <BrutalistButton>Action</BrutalistButton>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="font-mono">
            This is an accessible modal with the {modalVariant} variant. It
            includes proper ARIA attributes, focus management, and keyboard
            navigation.
          </p>
          <div className="bg-gray-50 border-2 border-gray-300 p-4">
            <h4 className="font-mono font-bold mb-2">
              Accessibility Features:
            </h4>
            <ul className="font-mono text-sm space-y-1">
              <li>• Focus trapping and restoration</li>
              <li>• Keyboard navigation (Tab, Shift+Tab, Escape)</li>
              <li>• ARIA attributes for screen readers</li>
              <li>• Proper semantic markup</li>
              <li>• Color contrast compliance</li>
            </ul>
          </div>
        </div>
      </AccessibleModal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          console.log("Confirmed!");
          setShowAlertModal(true);
        }}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        variant="warning"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Success"
        message="Action completed successfully!"
        variant="success"
      />
    </div>
  );
};

export default ModalExamples;
