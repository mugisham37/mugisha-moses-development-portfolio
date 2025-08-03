"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Download,
  FileImage,
  FileText,
  Database,
  Settings,
  X,
  Check,
  Copy,
  Share2,
  Printer,
  Mail,
  ExternalLink,
} from "lucide-react";
import BrutalistButton from "../ui/BrutalistButton";

export interface ExportOptions {
  format: "png" | "svg" | "pdf" | "json" | "csv" | "xlsx";
  quality?: "low" | "medium" | "high" | "ultra";
  dimensions?: {
    width: number;
    height: number;
  };
  includeMetadata?: boolean;
  includeTimestamp?: boolean;
  customFilename?: string;
  backgroundColor?: string;
  transparent?: boolean;
}

export interface VisualizationExporterProps {
  data: any;
  visualizationRef: React.RefObject<HTMLDivElement | null>;
  title?: string;
  subtitle?: string;
  className?: string;
  defaultOptions?: Partial<ExportOptions>;
  onExport?: (options: ExportOptions, data: any) => Promise<void>;
  onShare?: (url: string, options: ExportOptions) => void;
  enableSharing?: boolean;
  enablePrint?: boolean;
  enableEmail?: boolean;
}

const VisualizationExporter: React.FC<VisualizationExporterProps> = ({
  data,
  visualizationRef,
  title,
  subtitle,
  className,
  defaultOptions = {},
  onExport,
  onShare,
  enableSharing = true,
  enablePrint = true,
  enableEmail = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "png",
    quality: "high",
    dimensions: { width: 1200, height: 800 },
    includeMetadata: true,
    includeTimestamp: true,
    transparent: false,
    backgroundColor: "#ffffff",
    ...defaultOptions,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Format options
  const formatOptions = [
    {
      value: "png",
      label: "PNG Image",
      icon: FileImage,
      description: "High quality raster image",
    },
    {
      value: "svg",
      label: "SVG Vector",
      icon: FileImage,
      description: "Scalable vector graphics",
    },
    {
      value: "pdf",
      label: "PDF Document",
      icon: FileText,
      description: "Portable document format",
    },
    {
      value: "json",
      label: "JSON Data",
      icon: Database,
      description: "Raw data export",
    },
    {
      value: "csv",
      label: "CSV Spreadsheet",
      icon: FileText,
      description: "Comma-separated values",
    },
    {
      value: "xlsx",
      label: "Excel File",
      icon: FileText,
      description: "Microsoft Excel format",
    },
  ];

  const qualityOptions = [
    { value: "low", label: "Low (72 DPI)", description: "Small file size" },
    {
      value: "medium",
      label: "Medium (150 DPI)",
      description: "Balanced quality",
    },
    { value: "high", label: "High (300 DPI)", description: "Print quality" },
    {
      value: "ultra",
      label: "Ultra (600 DPI)",
      description: "Maximum quality",
    },
  ];

  // Handle export option changes
  const updateOption = useCallback((key: keyof ExportOptions, value: any) => {
    setExportOptions((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Generate filename
  const generateFilename = useCallback(() => {
    if (exportOptions.customFilename) {
      return exportOptions.customFilename;
    }

    const baseTitle = title || "visualization";
    const timestamp = exportOptions.includeTimestamp
      ? `-${new Date().toISOString().split("T")[0]}`
      : "";

    return `${baseTitle.toLowerCase().replace(/\s+/g, "-")}${timestamp}.${exportOptions.format
      }`;
  }, [exportOptions, title]);

  // Convert element to canvas
  const elementToCanvas = useCallback(
    async (element: HTMLElement): Promise<HTMLCanvasElement> => {
      // This is a simplified implementation - in a real app you'd use html2canvas or similar
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not get canvas context");

      // Set canvas dimensions
      canvas.width = exportOptions.dimensions?.width || element.offsetWidth;
      canvas.height = exportOptions.dimensions?.height || element.offsetHeight;

      // Set background
      if (!exportOptions.transparent) {
        ctx.fillStyle = exportOptions.backgroundColor || "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // For SVG elements, we'd serialize and draw them
      // For other elements, we'd use html2canvas or similar library
      // This is a placeholder implementation
      ctx.fillStyle = "#000000";
      ctx.font = "16px monospace";
      ctx.fillText("Visualization Export", 20, 40);
      ctx.fillText(`Format: ${exportOptions.format}`, 20, 70);
      ctx.fillText(`Quality: ${exportOptions.quality}`, 20, 100);

      return canvas;
    },
    [exportOptions]
  );

  // Export as PNG
  const exportAsPNG = useCallback(
    async (element: HTMLElement) => {
      const canvas = await elementToCanvas(element);

      return new Promise<void>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = generateFilename();
              link.click();
              URL.revokeObjectURL(url);
            }
            resolve();
          },
          "image/png",
          exportOptions.quality === "ultra" ? 1 : 0.9
        );
      });
    },
    [elementToCanvas, generateFilename, exportOptions.quality]
  );

  // Export as SVG
  const exportAsSVG = useCallback(
    async (element: HTMLElement) => {
      const svgElement = element.querySelector("svg");
      if (!svgElement) {
        throw new Error("No SVG element found");
      }

      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgElement);

      // Add metadata if requested
      if (exportOptions.includeMetadata) {
        const metadata = `
        <!-- Generated by Visualization Exporter -->
        <!-- Title: ${title || "Untitled"} -->
        <!-- Export Date: ${new Date().toISOString()} -->
        <!-- Format: SVG -->
      `;
        svgString = svgString.replace("<svg", metadata + "<svg");
      }

      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = generateFilename();
      link.click();
      URL.revokeObjectURL(url);
    },
    [exportOptions, generateFilename, title]
  );

  // Export as JSON
  const exportAsJSON = useCallback(async () => {
    const exportData = {
      title: title || "Untitled Visualization",
      subtitle,
      data,
      exportOptions,
      timestamp: exportOptions.includeTimestamp
        ? new Date().toISOString()
        : undefined,
      metadata: exportOptions.includeMetadata
        ? {
          format: exportOptions.format,
          quality: exportOptions.quality,
          dimensions: exportOptions.dimensions,
        }
        : undefined,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = generateFilename();
    link.click();
    URL.revokeObjectURL(url);
  }, [data, exportOptions, generateFilename, title, subtitle]);

  // Export as CSV
  const exportAsCSV = useCallback(async () => {
    if (!Array.isArray(data)) {
      throw new Error("Data must be an array for CSV export");
    }

    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : String(value);
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = generateFilename();
    link.click();
    URL.revokeObjectURL(url);
  }, [data, generateFilename]);

  // Main export function
  const handleExport = useCallback(async () => {
    if (!visualizationRef.current) {
      setExportStatus("error");
      return;
    }

    setIsExporting(true);
    setExportStatus("idle");

    try {
      if (onExport) {
        await onExport(exportOptions, data);
      } else {
        // Default export implementations
        switch (exportOptions.format) {
          case "png":
            await exportAsPNG(visualizationRef.current);
            break;
          case "svg":
            await exportAsSVG(visualizationRef.current);
            break;
          case "json":
            await exportAsJSON();
            break;
          case "csv":
            await exportAsCSV();
            break;
          default:
            throw new Error(
              `Export format ${exportOptions.format} not implemented`
            );
        }
      }

      setExportStatus("success");
      setTimeout(() => setExportStatus("idle"), 3000);
    } catch (error) {
      console.error("Export failed:", error);
      setExportStatus("error");
      setTimeout(() => setExportStatus("idle"), 3000);
    } finally {
      setIsExporting(false);
    }
  }, [
    visualizationRef,
    exportOptions,
    data,
    onExport,
    exportAsPNG,
    exportAsSVG,
    exportAsJSON,
    exportAsCSV,
  ]);

  // Handle print
  const handlePrint = useCallback(() => {
    if (!visualizationRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const element = visualizationRef.current;
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title || "Visualization"}</title>
          <style>${styles}</style>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, [visualizationRef, title]);

  // Handle share
  const handleShare = useCallback(async () => {
    if (!onShare) return;

    // Generate a shareable URL (this would typically involve uploading to a service)
    const shareableUrl = `${window.location.origin
      }/shared-visualization/${Date.now()}`;
    setShareUrl(shareableUrl);
    onShare(shareableUrl, exportOptions);
  }, [onShare, exportOptions]);

  // Copy share URL
  const copyShareUrl = useCallback(async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      // Show success feedback
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  }, [shareUrl]);

  return (
    <>
      {/* Export Button */}
      <BrutalistButton
        onClick={() => setIsOpen(true)}
        variant="secondary"
        size="sm"
        className={className}
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </BrutalistButton>

      {/* Export Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white border-5 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-3 border-black">
                <div>
                  <h2 className="text-xl font-black font-mono uppercase tracking-wider">
                    Export Visualization
                  </h2>
                  {title && (
                    <p className="font-mono text-sm text-gray-600 mt-1">
                      {title}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Format Selection */}
                <div>
                  <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                    Export Format
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {formatOptions.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => updateOption("format", format.value)}
                        className={cn(
                          "p-3 border-2 border-black text-left transition-colors duration-200",
                          exportOptions.format === format.value
                            ? "bg-brutalist-yellow"
                            : "bg-white hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <format.icon className="w-5 h-5" />
                          <div>
                            <div className="font-mono font-bold text-sm">
                              {format.label}
                            </div>
                            <div className="font-mono text-xs text-gray-600">
                              {format.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Settings (for image formats) */}
                {["png", "pdf"].includes(exportOptions.format) && (
                  <div>
                    <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                      Quality Settings
                    </h3>
                    <div className="space-y-2">
                      {qualityOptions.map((quality) => (
                        <label
                          key={quality.value}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="quality"
                            value={quality.value}
                            checked={exportOptions.quality === quality.value}
                            onChange={(e) =>
                              updateOption("quality", e.target.value)
                            }
                            className="w-4 h-4"
                          />
                          <div>
                            <div className="font-mono font-bold text-sm">
                              {quality.label}
                            </div>
                            <div className="font-mono text-xs text-gray-600">
                              {quality.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dimensions (for image formats) */}
                {["png", "svg", "pdf"].includes(exportOptions.format) && (
                  <div>
                    <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                      Dimensions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-sm mb-1">
                          Width (px)
                        </label>
                        <input
                          type="number"
                          value={exportOptions.dimensions?.width || 1200}
                          onChange={(e) =>
                            updateOption("dimensions", {
                              ...exportOptions.dimensions,
                              width: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-black font-mono text-sm focus:outline-none focus:bg-brutalist-yellow"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-sm mb-1">
                          Height (px)
                        </label>
                        <input
                          type="number"
                          value={exportOptions.dimensions?.height || 800}
                          onChange={(e) =>
                            updateOption("dimensions", {
                              ...exportOptions.dimensions,
                              height: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-black font-mono text-sm focus:outline-none focus:bg-brutalist-yellow"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Options */}
                <div>
                  <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-3">
                    Additional Options
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeMetadata}
                        onChange={(e) =>
                          updateOption("includeMetadata", e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="font-mono text-sm">
                        Include metadata
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeTimestamp}
                        onChange={(e) =>
                          updateOption("includeTimestamp", e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="font-mono text-sm">
                        Include timestamp in filename
                      </span>
                    </label>

                    {["png", "svg"].includes(exportOptions.format) && (
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportOptions.transparent}
                          onChange={(e) =>
                            updateOption("transparent", e.target.checked)
                          }
                          className="w-4 h-4"
                        />
                        <span className="font-mono text-sm">
                          Transparent background
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Custom Filename */}
                <div>
                  <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-2">
                    Custom Filename (optional)
                  </label>
                  <input
                    type="text"
                    value={exportOptions.customFilename || ""}
                    onChange={(e) =>
                      updateOption("customFilename", e.target.value)
                    }
                    placeholder={generateFilename()}
                    className="w-full px-3 py-2 border-2 border-black font-mono text-sm focus:outline-none focus:bg-brutalist-yellow"
                  />
                </div>

                {/* Preview Filename */}
                <div className="p-3 bg-gray-50 border-2 border-gray-300">
                  <div className="font-mono text-sm">
                    <span className="text-gray-600">Preview filename: </span>
                    <span className="font-bold">{generateFilename()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t-3 border-black bg-gray-50">
                <div className="flex items-center space-x-2">
                  {enablePrint && (
                    <BrutalistButton
                      onClick={handlePrint}
                      variant="secondary"
                      size="sm"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </BrutalistButton>
                  )}

                  {enableSharing && (
                    <BrutalistButton
                      onClick={handleShare}
                      variant="secondary"
                      size="sm"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </BrutalistButton>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <BrutalistButton
                    onClick={() => setIsOpen(false)}
                    variant="secondary"
                    size="sm"
                  >
                    Cancel
                  </BrutalistButton>

                  <BrutalistButton
                    onClick={handleExport}
                    disabled={isExporting}
                    size="sm"
                    variant="primary"
                  >
                    {isExporting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </>
                    )}
                  </BrutalistButton>
                </div>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {exportStatus !== "idle" && (
                  <motion.div
                    className={cn(
                      "p-4 border-t-3 border-black flex items-center space-x-3",
                      exportStatus === "success" &&
                      "bg-green-100 text-green-800",
                      exportStatus === "error" && "bg-red-100 text-red-800"
                    )}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {exportStatus === "success" && (
                      <Check className="w-5 h-5" />
                    )}
                    {exportStatus === "error" && <X className="w-5 h-5" />}
                    <span className="font-mono font-bold text-sm">
                      {exportStatus === "success" &&
                        "Export completed successfully!"}
                      {exportStatus === "error" &&
                        "Export failed. Please try again."}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Share URL */}
              <AnimatePresence>
                {shareUrl && (
                  <motion.div
                    className="p-4 border-t-3 border-black bg-blue-50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono font-bold text-sm mb-1">
                          Shareable URL:
                        </div>
                        <div className="font-mono text-sm text-blue-600 break-all">
                          {shareUrl}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={copyShareUrl}
                          className="p-2 hover:bg-white rounded"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white rounded"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VisualizationExporter;
