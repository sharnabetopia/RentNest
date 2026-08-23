import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "RentNest",
  description: "Find and list rental properties with ease."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-72px)]">{children}</main>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
