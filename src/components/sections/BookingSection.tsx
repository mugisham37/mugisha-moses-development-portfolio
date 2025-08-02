"use client";

import IntegratedCalendarBooking from "@/components/enhanced/IntegratedCalendarBooking";
import { ConsultationBooking } from "@/types/enhanced";

export default function BookingSection() {
  const handleBookingComplete = (booking: ConsultationBooking) => {
    console.log("Booking completed:", booking);
    // Handle booking completion - send confirmation email, save to database, etc.
  };

  const handleReschedule = (bookingId: string, newTimeSlot: any) => {
    console.log("Rescheduling booking:", bookingId, newTimeSlot);
    // Handle rescheduling logic
  };

  const handleCancel = (bookingId: string) => {
    console.log("Cancelling booking:", bookingId);
    // Handle cancellation logic
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50 border-b-5 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IntegratedCalendarBooking
          onBookingComplete={handleBookingComplete}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
        />
      </div>
    </section>
  );
}
