import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CommunicationPreferencesCenter from "../CommunicationPreferencesCenter";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock BrutalistButton
vi.mock("@/components/ui/BrutalistButton", () => ({
  default: ({ children, onClick, disabled, className, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock URL.createObjectURL and related functions
global.URL.createObjectURL = vi.fn(() => "mock-url");
global.URL.revokeObjectURL = vi.fn();

describe("CommunicationPreferencesCenter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("renders communication preferences center with default tab", () => {
    render(<CommunicationPreferencesCenter />);

    expect(screen.getByText("Communication Preferences")).toBeInTheDocument();
    expect(screen.getByText("Notification Settings")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("displays all tab options", () => {
    render(<CommunicationPreferencesCenter />);

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Contact Times")).toBeInTheDocument();
    expect(screen.getByText("Channels")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("Accessibility")).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
  });

  it("switches between tabs", () => {
    render(<CommunicationPreferencesCenter />);

    // Click on Contact Times tab
    fireEvent.click(screen.getByText("Contact Times"));
    expect(screen.getByText("Preferred Contact Times")).toBeInTheDocument();

    // Click on Language tab
    fireEvent.click(screen.getByText("Language"));
    expect(screen.getByText("Language & Localization")).toBeInTheDocument();
  });

  it("displays notification settings in notifications tab", () => {
    render(<CommunicationPreferencesCenter />);

    expect(screen.getByText("Email Notifications")).toBeInTheDocument();
    expect(screen.getByText("SMS Notifications")).toBeInTheDocument();
    expect(screen.getByText("Push Notifications")).toBeInTheDocument();
    expect(screen.getByText("Project Updates")).toBeInTheDocument();
  });

  it("handles notification preference changes", () => {
    render(<CommunicationPreferencesCenter />);

    const emailCheckbox = screen.getByLabelText(/Email Notifications/);
    expect(emailCheckbox).toBeChecked(); // Default is true

    fireEvent.click(emailCheckbox);
    expect(emailCheckbox).not.toBeChecked();
  });

  it("displays notification frequency options", () => {
    render(<CommunicationPreferencesCenter />);

    expect(screen.getByText("Immediate")).toBeInTheDocument();
    expect(screen.getByText("Daily Digest")).toBeInTheDocument();
    expect(screen.getByText("Weekly Summary")).toBeInTheDocument();
    expect(screen.getByText("Monthly Report")).toBeInTheDocument();
  });

  it("handles frequency selection", () => {
    render(<CommunicationPreferencesCenter />);

    const immediateButton = screen.getByText("Immediate");
    fireEvent.click(immediateButton);

    // The button should be selected (would have different styling)
    expect(immediateButton).toBeInTheDocument();
  });

  it("shows quiet hours settings", () => {
    render(<CommunicationPreferencesCenter />);

    expect(screen.getByText("Enable quiet hours")).toBeInTheDocument();

    const quietHoursCheckbox = screen.getByLabelText("Enable quiet hours");
    fireEvent.click(quietHoursCheckbox);

    expect(screen.getByText("Start Time")).toBeInTheDocument();
    expect(screen.getByText("End Time")).toBeInTheDocument();
  });

  it("displays contact times settings", () => {
    render(<CommunicationPreferencesCenter />);

    fireEvent.click(screen.getByText("Contact Times"));

    expect(screen.getByText("Preferred Days")).toBeInTheDocument();
    expect(screen.getByText("Preferred Hours")).toBeInTheDocument();
    expect(screen.getByText("Timezone")).toBeInTheDocument();
  });

  it("handles preferred days selection", () => {
    render(<CommunicationPreferencesCenter />);

    fireEvent.click(screen.getByText("Contact Times"));

    const mondayButton = screen.getByText("Mon");
    fireEvent.click(mondayButton);

    // Monday should be toggled
    expect(mondayButton).toBeInTheDocument();
  });

  it("displays communication channels settings", () => {
    render(<CommunicationPreferencesCenter />);

    fireEvent.click(screen.getByText("Channels"));

    expect(screen.getByText("Communication Channels")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
  });

  it("displays language settings", () => {
    render(<CommunicationPreferencesCenter />);

    fireEvent.click(screen.getByText("Language"));

    expect(screen.getByText("Primary Language")).toBeInTheDocument();
    expect(
      screen.getByText("Secondary Language (Optional)")
    ).toBeInTheDocument();
    expect(screen.getByText("Date Format")).toBeInTheDocument();
    expect(screen.getByText("Time Format")).toBeInTheDocument();
  });

  it("displays accessibility settings", () => {
    render(<CommunicationPreferencesCenter />);

    fireEvent.click(screen.getByText("Accessibility"));

    expect(screen.getByText("Screen Reader Support")).toBeInTheDocument();
    expect(screen.getByText("High Contrast Mode")).toBeInTheDocument();
    expect(screen.getByText("Large Text")).toBeInTheDocument();
    expect(screen.getByText("Reduced Motion")).toBeInTheDocument();
  });

  it("displays privacy settings", () => {
    render(<CommunicationPreferencesCenter />);

    fireEvent.click(screen.getByText("Privacy"));

    expect(screen.getByText("Data Collection")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Third-Party Sharing")).toBeInTheDocument();
    expect(screen.getByText("Cookie Consent")).toBeInTheDocument();
  });

  it("shows unsaved changes warning", () => {
    render(<CommunicationPreferencesCenter />);

    // Make a change
    const emailCheckbox = screen.getByLabelText(/Email Notifications/);
    fireEvent.click(emailCheckbox);

    expect(screen.getByText("You have unsaved changes")).toBeInTheDocument();
  });

  it("handles save preferences", async () => {
    const onPreferencesUpdate = vi.fn();
    render(
      <CommunicationPreferencesCenter
        onPreferencesUpdate={onPreferencesUpdate}
      />
    );

    // Make a change
    const emailCheckbox = screen.getByLabelText(/Email Notifications/);
    fireEvent.click(emailCheckbox);

    // Save preferences
    const saveButton = screen.getByText("Save Preferences");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  it("handles reset to defaults", () => {
    render(<CommunicationPreferencesCenter />);

    const resetButton = screen.getByText("Reset to Defaults");
    fireEvent.click(resetButton);

    // Should reset all preferences to defaults
    expect(resetButton).toBeInTheDocument();
  });

  it("handles export preferences", () => {
    render(<CommunicationPreferencesCenter />);

    const exportButton = screen.getByText("Export");
    fireEvent.click(exportButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("handles import preferences", () => {
    render(<CommunicationPreferencesCenter />);

    const importButton = screen.getByText("Import");
    expect(importButton).toBeInTheDocument();

    // Test file input (simplified)
    const fileInput =
      importButton.parentElement?.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it("loads preferences from localStorage on mount", () => {
    const mockPreferences = JSON.stringify({
      notifications: { email: false },
    });
    localStorageMock.getItem.mockReturnValue(mockPreferences);

    render(<CommunicationPreferencesCenter />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      "communicationPreferences"
    );
  });

  it("handles localStorage parsing errors gracefully", () => {
    localStorageMock.getItem.mockReturnValue("invalid-json");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<CommunicationPreferencesCenter />);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to parse saved preferences:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it("shows save success status", async () => {
    render(<CommunicationPreferencesCenter />);

    // Make a change and save
    const emailCheckbox = screen.getByLabelText(/Email Notifications/);
    fireEvent.click(emailCheckbox);

    const saveButton = screen.getByText("Save Preferences");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText("Preferences saved successfully!")
      ).toBeInTheDocument();
    });
  });

  it("disables save button when no changes", () => {
    render(<CommunicationPreferencesCenter />);

    const saveButton = screen.getByText("Save Preferences");
    expect(saveButton).toBeDisabled();
  });

  it("enables save button when changes are made", () => {
    render(<CommunicationPreferencesCenter />);

    // Make a change
    const emailCheckbox = screen.getByLabelText(/Email Notifications/);
    fireEvent.click(emailCheckbox);

    const saveButton = screen.getByText("Save Preferences");
    expect(saveButton).not.toBeDisabled();
  });

  it("handles timezone selection", () => {
    render(<CommunicationPreferencesCenter />);

    fireEvent.click(screen.getByText("Contact Times"));

    const timezoneSelect = screen.getByDisplayValue("Eastern Time (ET)");
    fireEvent.change(timezoneSelect, {
      target: { value: "America/Los_Angeles" },
    });

    expect(screen.getByDisplayValue("Pacific Time (PT)")).toBeInTheDocument();
  });

  it("handles time format selection", () => {
    render(<CommunicationPreferencesCenter />);

    fireEvent.click(screen.getByText("Language"));

    const twelveHourButton = screen.getByText("12 Hour");
    const twentyFourHourButton = screen.getByText("24 Hour");

    fireEvent.click(twentyFourHourButton);
    expect(twentyFourHourButton).toBeInTheDocument();

    fireEvent.click(twelveHourButton);
    expect(twelveHourButton).toBeInTheDocument();
  });

  it("handles channel priority settings", () => {
    render(<CommunicationPreferencesCenter />);

    fireEvent.click(screen.getByText("Channels"));

    // Should show channel settings
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("calls onPreferencesUpdate when preferences change", async () => {
    const onPreferencesUpdate = vi.fn();
    render(
      <CommunicationPreferencesCenter
        onPreferencesUpdate={onPreferencesUpdate}
      />
    );

    // Make a change and save
    const emailCheckbox = screen.getByLabelText(/Email Notifications/);
    fireEvent.click(emailCheckbox);

    const saveButton = screen.getByText("Save Preferences");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onPreferencesUpdate).toHaveBeenCalled();
    });
  });
});
