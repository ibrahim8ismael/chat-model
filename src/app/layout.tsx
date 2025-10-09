'use client';

import "./globals.css";
import { useState } from "react";
import Sidenav from "@/components/layout/Sidenav";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Sidenav isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className={cn("transition-all duration-300", isOpen ? "pl-64" : "pl-16")}>
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
