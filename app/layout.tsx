import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Yakistore",
  description:
    "Discover premium products with an immersive, interactive shopping experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "'ClashGrotesk', system-ui, -apple-system, sans-serif" }}>
        <ThemeProvider>
          <ToastProvider>
            {/* Animated background */}
            <div className="animated-bg" aria-hidden="true" />
            <Navbar />
            <main className="flex-1 pt-16 sm:pt-20">{children}</main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
