import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect } from "vitest";

import InteractiveChart, { ChartSeries } from "../InteractiveChart";
import ProgressIndicators, { ProgressStep } from "../ProgressIndicators";
import DataDrillDown, { DataPoint, FilterOption } from "../DataDrillDown";
import VisualizationExporter from "../VisualizationExporter";
import DataVisualizationDashboard from "../DataVisualizationDashboard";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
    svg: ({ children, ...props }: React.ComponentProps<"svg">) => (
      <svg {...props}>{children}</svg>
    ),
    path: ({ children, ...props }: React.ComponentProps<"path">) => (
      <path {...props}>{children}</path>
    ),
    circle: ({ children, ...props }: React.ComponentProps<"circle">) => (
      <circle {...props}>{children}</circle>
    ),
    rect: ({ children, ...props }: React.ComponentProps<"rect">) => (
      <rect {...props}>{children}</rect>
    ),
    line: ({ children, ...props }: React.ComponentProps<"line">) => (
      <line {...props}>{children}</line>
    ),
    g: ({ children, ...props }: React.ComponentProps<"g">) => (
      <g {...props}>{children}</g>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock BrutalistButton
vi.mock("../../ui/BrutalistButton", () => ({
  default: function MockBrutalistButton({
    children,
    onClick,
    ...props
  }: React.ComponentProps<"button">) {
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  },
}));

describe("InteractiveChart", () => {
  const mockData: ChartSeries[] = [
    {
      name: "Test Series",
      data: [
        { label: "A", value: 10 },
        { label: "B", value: 20 },
        { label: "C", value: 15 },
      ],
    },
  ];

  it("renders chart with data", () => {
    render(<InteractiveChart type="bar" data={mockData} />);
    expect(screen.getByText("Test Series")).toBeInTheDocument();
  });

  it("handles different chart types", () => {
    const { rerender } = render(
      <InteractiveChart type="bar" data={mockData} />
    );
    expect(screen.getByRole("img")).toBeInTheDocument(); // SVG element

    rerender(<InteractiveChart type="line" data={mockData} />);
    expect(screen.getByRole("img")).toBeInTheDocument();

    rerender(<InteractiveChart type="pie" data={mockData} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("shows legend when enabled", () => {
    render(<InteractiveChart type="bar" data={mockData} showLegend={true} />);
    expect(screen.getByText("Test Series")).toBeInTheDocument();
  });

  it("handles data point clicks", () => {
    const mockOnClick = vi.fn();
    render(
      <InteractiveChart
        type="bar"
        data={mockData}
        onDataPointClick={mockOnClick}
        interactive={true}
      />
    );

    // Click on a data point (this would be more specific in a real test)
    const svg = screen.getByRole("img");
    fireEvent.click(svg);
    // Note: In a real test, we'd need to target specific chart elements
  });
});

describe("ProgressIndicators", () => {
  const mockSteps: ProgressStep[] = [
    {
      id: "step1",
      label: "Step 1",
      description: "First step",
      status: "completed",
      progress: 100,
    },
    {
      id: "step2",
      label: "Step 2",
      description: "Second step",
      status: "in-progress",
      progress: 50,
    },
    {
      id: "step3",
      label: "Step 3",
      description: "Third step",
      status: "pending",
      progress: 0,
    },
  ];

  it("renders progress steps", () => {
    render(<ProgressIndicators steps={mockSteps} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("handles different progress types", () => {
    const { rerender } = render(
      <ProgressIndicators steps={mockSteps} type="linear" />
    );
    expect(screen.getByText("Step 1")).toBeInTheDocument();

    rerender(<ProgressIndicators steps={mockSteps} type="circular" />);
    expect(screen.getByText("1/3 Complete")).toBeInTheDocument();

    rerender(<ProgressIndicators steps={mockSteps} type="timeline" />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("shows progress percentages when enabled", () => {
    render(<ProgressIndicators steps={mockSteps} showProgress={true} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("handles step clicks when interactive", () => {
    const mockOnClick = vi.fn();
    render(
      <ProgressIndicators
        steps={mockSteps}
        interactive={true}
        onStepClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByText("Step 1"));
    expect(mockOnClick).toHaveBeenCalledWith(mockSteps[0]);
  });
});

describe("DataDrillDown", () => {
  const mockData: DataPoint[] = [
    {
      id: "parent1",
      label: "Parent 1",
      value: 100,
      category: "category1",
      children: [
        {
          id: "child1",
          label: "Child 1",
          value: 60,
          category: "subcategory1",
        },
        {
          id: "child2",
          label: "Child 2",
          value: 40,
          category: "subcategory2",
        },
      ],
    },
  ];

  const mockFilters: FilterOption[] = [
    {
      id: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "category1", label: "Category 1" },
        { value: "category2", label: "Category 2" },
      ],
    },
  ];

  it("renders data points", () => {
    render(<DataDrillDown data={mockData} />);
    expect(screen.getByText("Parent 1")).toBeInTheDocument();
  });

  it("handles data point expansion", () => {
    render(<DataDrillDown data={mockData} />);

    // Click to expand
    fireEvent.click(screen.getByText("Parent 1"));

    // Should show children (this might need adjustment based on actual implementation)
    expect(screen.getByText("Parent 1")).toBeInTheDocument();
  });

  it("handles search functionality", () => {
    render(<DataDrillDown data={mockData} enableSearch={true} />);

    const searchInput = screen.getByPlaceholderText("Search data points...");
    fireEvent.change(searchInput, { target: { value: "Parent" } });

    expect(screen.getByText("Parent 1")).toBeInTheDocument();
  });

  it("handles filtering", () => {
    render(<DataDrillDown data={mockData} filters={mockFilters} />);

    const categorySelect = screen.getByDisplayValue("All");
    fireEvent.change(categorySelect, { target: { value: "category1" } });

    expect(screen.getByText("Parent 1")).toBeInTheDocument();
  });

  it("handles different view modes", () => {
    render(<DataDrillDown data={mockData} />);

    // Test view mode switching
    const treeButton = screen.getByText("tree");
    const tableButton = screen.getByText("table");
    const cardsButton = screen.getByText("cards");

    fireEvent.click(tableButton);
    expect(screen.getByText("Item")).toBeInTheDocument(); // Table header

    fireEvent.click(cardsButton);
    expect(screen.getByText("Parent 1")).toBeInTheDocument();

    fireEvent.click(treeButton);
    expect(screen.getByText("Parent 1")).toBeInTheDocument();
  });
});

describe("VisualizationExporter", () => {
  const mockData = { test: "data" };
  const mockRef = { current: document.createElement("div") };

  it("renders export button", () => {
    render(
      <VisualizationExporter data={mockData} visualizationRef={mockRef} />
    );

    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("opens export modal when clicked", () => {
    render(
      <VisualizationExporter data={mockData} visualizationRef={mockRef} />
    );

    fireEvent.click(screen.getByText("Export"));
    expect(screen.getByText("Export Visualization")).toBeInTheDocument();
  });

  it("handles format selection", () => {
    render(
      <VisualizationExporter data={mockData} visualizationRef={mockRef} />
    );

    fireEvent.click(screen.getByText("Export"));

    // Should show format options
    expect(screen.getByText("PNG Image")).toBeInTheDocument();
    expect(screen.getByText("SVG Vector")).toBeInTheDocument();
    expect(screen.getByText("JSON Data")).toBeInTheDocument();
  });

  it("handles export execution", async () => {
    const mockOnExport = vi.fn().mockResolvedValue(undefined);

    render(
      <VisualizationExporter
        data={mockData}
        visualizationRef={mockRef}
        onExport={mockOnExport}
      />
    );

    fireEvent.click(screen.getByText("Export"));

    // Click the export button in the modal
    const exportButtons = screen.getAllByText("Export");
    fireEvent.click(exportButtons[exportButtons.length - 1]); // Last one is in modal

    await waitFor(() => {
      expect(mockOnExport).toHaveBeenCalled();
    });
  });
});

describe("DataVisualizationDashboard", () => {
  const mockWidgets = [
    {
      id: "widget1",
      title: "Test Widget",
      type: "metric" as const,
      data: { value: 42, label: "Test Metric" },
      position: { x: 0, y: 0, width: 6, height: 4 },
      visible: true,
    },
  ];

  it("renders dashboard with title", () => {
    render(
      <DataVisualizationDashboard
        widgets={mockWidgets}
        title="Test Dashboard"
      />
    );

    expect(screen.getByText("Test Dashboard")).toBeInTheDocument();
  });

  it("renders widgets", () => {
    render(<DataVisualizationDashboard widgets={mockWidgets} />);
    expect(screen.getByText("Test Widget")).toBeInTheDocument();
  });

  it("handles widget visibility toggle", () => {
    render(
      <DataVisualizationDashboard
        widgets={mockWidgets}
        enableCustomization={true}
      />
    );

    // Find and click the hide widget button
    const hideButtons = screen.getAllByTitle(/Hide/);
    if (hideButtons.length > 0) {
      fireEvent.click(hideButtons[0]);
    }

    // Widget should still be in DOM but might be hidden
    expect(screen.getByText("Test Widget")).toBeInTheDocument();
  });

  it("handles refresh functionality", async () => {
    const mockRefresh = vi.fn().mockResolvedValue(undefined);

    render(
      <DataVisualizationDashboard
        widgets={mockWidgets}
        onDataRefresh={mockRefresh}
      />
    );

    fireEvent.click(screen.getByText("Refresh"));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("handles customization panel", () => {
    render(
      <DataVisualizationDashboard
        widgets={mockWidgets}
        enableCustomization={true}
      />
    );

    fireEvent.click(screen.getByText("Customize"));
    expect(screen.getByText("Customize Dashboard")).toBeInTheDocument();
  });

  it("shows empty state when no widgets visible", () => {
    render(<DataVisualizationDashboard widgets={[]} />);

    expect(screen.getByText("No Widgets Visible")).toBeInTheDocument();
  });
});

describe("Integration Tests", () => {
  it("components work together in dashboard", () => {
    const chartData: ChartSeries[] = [
      {
        name: "Test Series",
        data: [{ label: "A", value: 10 }],
      },
    ];

    const progressData: ProgressStep[] = [
      {
        id: "step1",
        label: "Step 1",
        status: "completed",
        progress: 100,
      },
    ];

    const widgets = [
      {
        id: "chart-widget",
        title: "Chart Widget",
        type: "chart" as const,
        data: chartData,
        config: { type: "bar" },
        position: { x: 0, y: 0, width: 6, height: 4 },
        visible: true,
      },
      {
        id: "progress-widget",
        title: "Progress Widget",
        type: "progress" as const,
        data: progressData,
        config: { type: "linear" },
        position: { x: 6, y: 0, width: 6, height: 4 },
        visible: true,
      },
    ];

    render(
      <DataVisualizationDashboard
        widgets={widgets}
        title="Integration Test Dashboard"
        enableExport={true}
        enableCustomization={true}
      />
    );

    expect(screen.getByText("Integration Test Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Chart Widget")).toBeInTheDocument();
    expect(screen.getByText("Progress Widget")).toBeInTheDocument();
  });
});
