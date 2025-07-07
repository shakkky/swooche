import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";
import { Modak } from "next/font/google";
import { ReactNode } from "react";

const modak = Modak({
  variable: "--font-modak",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Swooche",
  description: "Big business phone power for one-person businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={modak.variable}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
