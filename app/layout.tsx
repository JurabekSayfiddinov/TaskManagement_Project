
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "./provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Task Management",
  description: "Employee Task Management System",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body
        className={`${inter.className} min-h-full flex flex-col antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
