"use client";

import ConsultationBooking from "@/components/ui/ConsultationBooking";

export default function BookingSection() {
  const handleBookingSubmit = (booking: unknown) => {
    console.log("Booking submitted:", booking);
    // Handle booking submission
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50 border-b-5 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ConsultationBooking onBookingSubmit={handleBookingSubmit} />
      </div>
    </section>
  );
}
