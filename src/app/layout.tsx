'use client';

import "./globals.css";
import { useState } from "react";
import Sidenav from "@/components/layout/Sidenav";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <body className={cn("transition-all duration-300", isOpen ? "pl-64" : "pl-16")}>
        <Sidenav isOpen={isOpen} setIsOpen={setIsOpen} />
        {children}
      </body>
    </html>
  );
}
