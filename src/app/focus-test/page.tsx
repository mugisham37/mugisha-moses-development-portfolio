import FocusTestComponent from "@/components/ui/FocusTestComponent";

export default function FocusTestPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <FocusTestComponent />
    </main>
  );
}

export const metadata = {
  title: "Focus Indicator Test - Developer Portfolio",
  description:
    "Test page for validating focus indicators and keyboard navigation accessibility",
};
