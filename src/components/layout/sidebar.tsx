"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Icon } from "@/components/ui/icon";

interface SidebarProps {
  userRole?: "ADMIN" | "CASHIER";
  userName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userRole = "ADMIN", userName = "Kasir", isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const navItems = [
    ...(userRole === "ADMIN"
      ? [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: "dashboard",
          },
        ]
      : []),
    {
      href: "/pos",
      label: "Kasir (POS)",
      icon: "point_of_sale",
    },
    ...(userRole === "ADMIN"
      ? [
          {
            href: "/products",
            label: "Produk",
            icon: "inventory_2",
          },
        ]
      : []),
    {
      href: "/transactions",
      label: "Transaksi",
      icon: "receipt_long",
    },
    ...(userRole === "ADMIN"
      ? [
          {
            href: "/reports",
            label: "Laporan",
            icon: "bar_chart",
          },
        ]
      : []),
  ];

  const bottomItems = [
    ...(userRole === "ADMIN"
      ? [
          {
            href: "/settings",
            label: "Pengaturan",
            icon: "settings",
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-text-primary/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-[240px] bg-surface border-r border-border-subtle z-50 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col">
          {/* Logo / Header Brand */}
          <div className="h-16 px-space-lg flex items-center justify-between border-b border-border-subtle">
            <Link href={userRole === "ADMIN" ? "/dashboard" : "/pos"} className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm font-bold">
                <Icon name="storefront" className="w-5 h-5 text-on-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-card text-title-card text-text-primary truncate font-bold">
                  BUMDes POS
                </span>
                <span className="font-caption-small text-[11px] text-text-secondary truncate">
                  Unit Karangsari
                </span>
              </div>
            </Link>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden text-text-secondary hover:text-text-primary p-1"
                aria-label="Tutup Menu"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-space-sm flex flex-col gap-1 mt-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard" || pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-container text-on-primary font-label-button text-label-button shadow-sm"
                      : "text-text-secondary hover:bg-surface-container-low hover:text-text-primary font-body-medium text-body-medium"
                  }`}
                >
                  <Icon name={item.icon} className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-space-sm flex flex-col gap-1 border-t border-border-subtle">
          {bottomItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-container text-on-primary font-label-button text-label-button shadow-sm"
                    : "text-text-secondary hover:bg-surface-container-low hover:text-text-primary font-body-medium text-body-medium"
                }`}
              >
                <Icon name={item.icon} className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-status-danger hover:bg-error-container/40 transition-colors font-body-medium text-body-medium cursor-pointer"
          >
            <Icon name="logout" className="w-5 h-5 shrink-0" />
            <span>Keluar</span>
          </button>

          {/* User profile card */}
          <div className="mt-2 p-space-sm rounded-xl bg-surface-container-low flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-caption-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-caption-medium text-caption-medium text-text-primary truncate">
                {userName}
              </span>
              <span className="font-caption-small text-[10px] text-text-secondary">
                {userRole === "ADMIN" ? "Administrator" : "Kasir Shift"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
