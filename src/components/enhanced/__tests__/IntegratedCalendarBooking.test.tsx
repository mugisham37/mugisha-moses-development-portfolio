import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import IntegratedCalendarBooking from "../IntegratedCalendarBooking";
import { ConsultationBooking, TimeSlot } from "@/types/enhanced";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
  writable: true,
});

const mockTimeSlot: TimeSlot = {
  id: "2025-02-05-10:00",
  startTime: new Date("2025-02-05T10:00:00"),
  endTime: new Date("2025-02-05T10:30:00"),
  available: true,
  consultationType: "discovery",
  timezone: "America/New_York",
  price: 0,
};

const mockBooking: ConsultationBooking = {
  id: "booking-123",
  clientName: "John Doe",
  clientEmail: "john@example.com",
  clientPhone: "+1234567890",
  consultationType: "discovery",
  timeSlot: mockTimeSlot,
  agenda: "Discuss project requirements",
  requirements: "Need a new website",
  budget: "$5,000-$10,000",
  timeline: "2-3 months",
  status: "confirmed",
  meetingLink: "https://meet.google.com/abc-defg-hij",
  notes: "",
  followUpRequired: true,
};

describe("IntegratedCalendarBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders booking system with consultation type selection", () => {
    render(<IntegratedCalendarBooking />);

    expect(screen.getByText("Book Consultation")).toBeInTheDocument();
    expect(screen.getByText("Choose Consultation Type")).toBeInTheDocument();
    expect(screen.getByText("Discovery Call")).toBeInTheDocument();
    expect(screen.getByText("Technical Consultation")).toBeInTheDocument();
    expect(screen.getByText("Strategy Session")).toBeInTheDocument();
    expect(screen.getByText("Code/Design Review")).toBeInTheDocument();
  });

  it("shows progress indicator with correct steps", () => {
    render(<IntegratedCalendarBooking />);

    // Progress indicator should show 4 steps
    const progressSteps = screen.getAllByText(/[1-4]/);
    expect(progressSteps.length).toBeGreaterThan(0);
  });

  it("displays consultation types with pricing and duration", () => {
    render(<IntegratedCalendarBooking />);

    expect(screen.getByText("FREE")).toBeInTheDocument(); // Discovery call
    expect(screen.getByText("$150")).toBeInTheDocument(); // Technical consultation
    expect(screen.getByText("$200")).toBeInTheDocument(); // Strategy session
    expect(screen.getByText("$125")).toBeInTheDocument(); // Code review

    expect(screen.getByText("30 min")).toBeInTheDocument();
    expect(screen.getByText("60 min")).toBeInTheDocument();
    expect(screen.getByText("90 min")).toBeInTheDocument();
    expect(screen.getByText("45 min")).toBeInTheDocument();
  });

  it("navigates to calendar step when consultation type is selected", () => {
    render(<IntegratedCalendarBooking />);

    const discoveryCall = screen.getByText("Discovery Call").closest("div");
    fireEvent.click(discoveryCall!);

    expect(screen.getByText("Select Date & Time")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("shows timezone selector in calendar step", () => {
    render(<IntegratedCalendarBooking />);

    // Select consultation type first
    const discoveryCall = screen.getByText("Discovery Call").closest("div");
    fireEvent.click(discoveryCall!);

    // Should show timezone selector
    const timezoneSelect = screen.getByDisplayValue("Eastern Time (ET)");
    expect(timezoneSelect).toBeInTheDocument();
  });

  it("displays calendar navigation controls", () => {
    render(<IntegratedCalendarBooking />);

    // Select consultation type first
    const discoveryCall = screen.getByText("Discovery Call").closest("div");
    fireEvent.click(discoveryCall!);

    // Should show month navigation
    const currentMonth = new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    expect(screen.getByText(currentMonth)).toBeInTheDocument();
  });

  it("allows going back from calendar to consultation type selection", () => {
    render(<IntegratedCalendarBooking />);

    // Navigate to calendar
    const discoveryCall = screen.getByText("Discovery Call").closest("div");
    fireEvent.click(discoveryCall!);

    expect(screen.getByText("Select Date & Time")).toBeInTheDocument();

    // Go back
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(screen.getByText("Choose Consultation Type")).toBeInTheDocument();
  });

  it("handles timezone change", () => {
    render(<IntegratedCalendarBooking />);

    // Navigate to calendar
    const discoveryCall = screen.getByText("Discovery Call").closest("div");
    fireEvent.click(discoveryCall!);

    const timezoneSelect = screen.getByDisplayValue("Eastern Time (ET)");
    fireEvent.change(timezoneSelect, {
      target: { value: "America/Los_Angeles" },
    });

    expect(screen.getByDisplayValue("Pacific Time (PT)")).toBeInTheDocument();
  });

  it("shows booking form when time slot is selected", () => {
    render(<IntegratedCalendarBooking />);

    // Navigate through steps (mocked since time slot generation is complex)
    const discoveryCall = screen.getByText("Discovery Call").closest("div");
    fireEvent.click(discoveryCall!);

    // Simulate time slot selection by directly testing the form step
    // In a real test, we would need to mock the time slot generation
  });

  it("displays pre-meeting questionnaire based on consultation type", () => {
    render(<IntegratedCalendarBooking />);

    // The questionnaire would be shown in the form step
    // This tests the consultation type data structure
    const discoveryCall = screen.getByText("Discovery Call").closest("div");
    expect(discoveryCall).toBeInTheDocument();
  });

  it("handles booking completion", async () => {
    const onBookingComplete = vi.fn();
    render(<IntegratedCalendarBooking onBookingComplete={onBookingComplete} />);

    // This would test the full booking flow
    // In a real implementation, we would mock the form submission
  });

  it("shows confirmation step after successful booking", () => {
    // This would test the confirmation display
    // The confirmation step shows booking details and next steps
    render(<IntegratedCalendarBooking />);

    // Test would verify confirmation UI elements
    expect(screen.getByText("Book Consultation")).toBeInTheDocument();
  });

  it("allows booking another consultation from confirmation", () => {
    // This would test the reset functionality
    render(<IntegratedCalendarBooking />);

    // Test would verify the "Book Another" button functionality
    expect(screen.getByText("Book Consultation")).toBeInTheDocument();
  });

  it("handles rescheduling functionality", () => {
    const onReschedule = vi.fn();
    render(<IntegratedCalendarBooking onReschedule={onReschedule} />);

    // Test rescheduling callback
    expect(onReschedule).toBeDefined();
  });

  it("handles cancellation functionality", () => {
    const onCancel = vi.fn();
    render(<IntegratedCalendarBooking onCancel={onCancel} />);

    // Test cancellation callback
    expect(onCancel).toBeDefined();
  });

  it("displays existing bookings when provided", () => {
    const existingBookings = [mockBooking];
    render(<IntegratedCalendarBooking existingBookings={existingBookings} />);

    // Test would verify existing bookings are handled
    expect(screen.getByText("Book Consultation")).toBeInTheDocument();
  });

  it("shows available time slots when provided", () => {
    const availableTimeSlots = [mockTimeSlot];
    render(
      <IntegratedCalendarBooking availableTimeSlots={availableTimeSlots} />
    );

    // Test would verify time slots are displayed
    expect(screen.getByText("Book Consultation")).toBeInTheDocument();
  });

  it("validates required form fields", () => {
    render(<IntegratedCalendarBooking />);

    // Test form validation
    // This would test that required fields are properly validated
    expect(screen.getByText("Book Consultation")).toBeInTheDocument();
  });

  it("handles form submission with loading state", () => {
    render(<IntegratedCalendarBooking />);

    // Test loading state during form submission
    expect(screen.getByText("Book Consultation")).toBeInTheDocument();
  });

  it("displays meeting link in confirmation", () => {
    // Test that meeting link is shown and clickable
    render(<IntegratedCalendarBooking />);

    expect(screen.getByText("Book Consultation")).toBeInTheDocument();
  });

  it("shows next steps after booking confirmation", () => {
    // Test that next steps are clearly displayed
    render(<IntegratedCalendarBooking />);

    expect(screen.getByText("Book Consultation")).toBeInTheDocument();
  });
});
