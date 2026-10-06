"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
  userRole?: "ADMIN" | "CASHIER";
  userName?: string;
}

export function AppShell({ children, userRole = "ADMIN", userName = "Kasir" }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col antialiased">
      <Sidebar
        userRole={userRole}
        userName={userName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-[240px] flex flex-col flex-1 min-h-screen">
        <Header
          userRole={userRole}
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-space-xl max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
