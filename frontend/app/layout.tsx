import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AskUni - AI-Powered University Assistant",
  description: "Get instant answers to all your university questions with our intelligent AI assistant. Available 24/7 for courses, admissions, deadlines, and more.",
  keywords: "university, AI, assistant, education, student help, admissions, courses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={`${inter.className} min-h-screen antialiased text-white`}>
        {/* Premium Background */}
        <div className="gradient-bg" />
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />

        {/* Main Content */}
        <Providers>
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

