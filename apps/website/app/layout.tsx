import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";
import { Yellowtail } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import { LightMode } from "@/components/ui/color-mode";

const yellowtail = Yellowtail({
  variable: "--font-yellowtail",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title:
    "Swooche - Share deliverables with your clients without paying for the things you don't need",
  description:
    "Share deliverables with your clients without paying for the things you don't need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={yellowtail.variable}>
        <Provider>
          <LightMode>{children}</LightMode>
        </Provider>
      </body>
    </html>
  );
}
