import { Metadata } from "next";
import SettingsPage from "@/components/enhanced/SettingsPage";

export const metadata: Metadata = {
  title: "Settings | Moses Mugisha - Developer Portfolio",
  description:
    "Customize your browsing experience with accessibility, theme, privacy, and performance settings.",
  keywords: [
    "settings",
    "accessibility",
    "customization",
    "preferences",
    "privacy",
  ],
};

export default function Settings() {
  return <SettingsPage />;
}
