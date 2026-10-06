"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Menu } from "lucide-react";

interface HeaderProps {
  userName?: string;
  userRole?: "ADMIN" | "CASHIER";
  onMenuClick?: () => void;
}

export function Header({ userName = "Kasir", userRole = "ADMIN", onMenuClick }: HeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const str = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
      setCurrentDateTime(str);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 px-4 lg:px-space-xl bg-surface border-b border-border-subtle flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-space-sm">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-container-low transition-colors"
            aria-label="Buka Menu"
          >
            <Menu className="w-6 h-6 text-text-secondary" />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-space-xs text-text-secondary font-caption-medium text-caption-medium">
          <Icon name="storefront" className="w-4 h-4 text-primary" />
          <span className="font-semibold text-text-primary">BUMDes Mandiri Sejahtera</span>
          <span>•</span>
          <span className="text-text-muted">Unit Toko Desa</span>
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        {currentDateTime && (
          <span className="hidden md:inline-block font-caption-small text-caption-small text-text-secondary">
            {currentDateTime}
          </span>
        )}

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success/10 text-status-success font-caption-medium text-caption-small">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span>{userRole === "ADMIN" ? "Mode Admin" : "Shift Aktif"}</span>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-caption-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-title-card text-[13px] text-text-primary leading-tight">
              {userName}
            </span>
            <span className="font-caption-small text-[10px] text-text-secondary">
              {userRole === "ADMIN" ? "Admin" : "Kasir"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
