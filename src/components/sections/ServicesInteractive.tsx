"use client";

import React from "react";
import { PricingCalculator, ConsultationBooking } from "@/components/ui";

const ServicesInteractive: React.FC = () => {
  const handleQuoteRequest = (quote: {
    selectedOptions: string[];
    addons: string[];
    totalPrice: number;
  }) => {
    // Handle quote request - could integrate with contact form or email service
    console.log("Quote requested:", quote);
    // In a real app, this would send the quote details to a contact form or email service
    window.location.href =
      "/contact?quote=" + encodeURIComponent(JSON.stringify(quote));
  };

  const handleBookingSubmit = (booking: {
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    projectType: string;
    message: string;
  }) => {
    // Handle booking submission - could integrate with calendar service
    console.log("Consultation booked:", booking);
    // In a real app, this would integrate with a calendar service like Calendly
    alert(
      "Thank you! Your consultation has been booked. You will receive a confirmation email shortly."
    );
  };

  return (
    <>
      {/* Pricing Calculator */}
      <section className="bg-brutalist-black py-20 border-b-5 border-brutalist-yellow">
        <div className="container mx-auto px-4">
          <PricingCalculator onQuoteRequest={handleQuoteRequest} />
        </div>
      </section>

      {/* Consultation Booking */}
      <section className="bg-white py-20 border-b-5 border-black">
        <div className="container mx-auto px-4">
          <ConsultationBooking onBookingSubmit={handleBookingSubmit} />
        </div>
      </section>
    </>
  );
};

export default ServicesInteractive;
