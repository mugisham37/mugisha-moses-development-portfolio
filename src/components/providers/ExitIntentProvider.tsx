"use client";

import dynamic from "next/dynamic";

const ExitIntentModal = dynamic(
  () => import("@/components/ui/ExitIntentModal"),
  {
    ssr: false,
  }
);

interface ExitIntentProviderProps {
  children: React.ReactNode;
}

export default function ExitIntentProvider({
  children,
}: ExitIntentProviderProps) {
  const handleConsultationRequest = (
    method: "calendar" | "email" | "phone"
  ) => {
    // Handle consultation request
    console.log(`Consultation requested via: ${method}`);

    // You can integrate with your booking system here
    if (method === "calendar") {
      // Redirect to calendar booking
      window.open("https://calendly.com/your-calendar", "_blank");
    } else if (method === "email") {
      // Open email client
      window.location.href =
        "mailto:your-email@example.com?subject=Free Consultation Request";
    } else if (method === "phone") {
      // Show phone number or initiate call
      window.location.href = "tel:+1234567890";
    }
  };

  return (
    <>
      {children}
      <ExitIntentModal onConsultationRequest={handleConsultationRequest} />
    </>
  );
}
