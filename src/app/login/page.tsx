"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Icon } from "@/components/ui/icon";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"kasir" | "admin">("kasir");
  const [email, setEmail] = useState("kasir@bumdes.desa.id");
  const [password, setPassword] = useState("kasir123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRoleTabChange = (role: "kasir" | "admin") => {
    setActiveTab(role);
    setErrorMessage("");
    if (role === "kasir") {
      setEmail("kasir@bumdes.desa.id");
      setPassword("kasir123");
    } else {
      setEmail("admin@bumdes.desa.id");
      setPassword("admin123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Email atau kata sandi tidak valid.");
        setLoading(false);
        return;
      }

      // Check session to determine destination route based on role
      const session = await authClient.getSession();
      const rawUser = session?.data?.user;
      const userRole =
        rawUser && typeof rawUser === "object" && "role" in rawUser && typeof rawUser.role === "string"
          ? rawUser.role
          : "";

      if (userRole === "CASHIER") {
        router.push("/pos");
      } else {
        router.push("/dashboard");
      }
      setLoading(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center p-space-md bg-background relative overflow-hidden">
      <div className="flex flex-col w-full items-center justify-center py-space-xl px-space-md">
        <div className="relative w-full max-w-[460px]">
          {/* Subtle decorative glow */}
          <div className="absolute -top-10 -right-8 w-44 h-44 bg-surface-container-high rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-surface-variant rounded-full blur-2xl opacity-50 pointer-events-none" />

          <div className="relative w-full bg-surface rounded-2xl shadow-xl p-space-xl sm:p-space-2xl space-y-space-xl border border-border-subtle/50">
            {/* Header info */}
            <div className="flex flex-col items-center text-center space-y-space-sm">
              <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center text-primary-container shadow-sm mb-space-xs">
                <Icon name="point_of_sale" className="w-8 h-8 text-primary-container" />
              </div>
              <div className="space-y-space-xs">
                <div className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-low text-primary font-caption-medium text-caption-medium">
                  <Icon name="storefront" className="w-3.5 h-3.5 text-primary" />
                  BUMDes Mandiri Sejahtera
                </div>
                <h1 className="font-headline-page text-headline-page text-text-primary tracking-tight">
                  BUMDes POS
                </h1>
                <p className="font-caption-medium text-caption-medium text-text-secondary">
                  Sistem Kasir & Operasional Unit Usaha Desa
                </p>
              </div>
              <p className="font-body-regular text-body-regular text-text-secondary pt-space-xs leading-relaxed max-w-sm">
                Silakan masuk dengan akun Kasir atau Admin untuk memulai sesi operasional toko desa.
              </p>
            </div>

            {/* Role switch pill */}
            <div className="p-1 rounded-xl bg-surface-container-low flex gap-1" role="tablist">
              <button
                type="button"
                onClick={() => handleRoleTabChange("kasir")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-space-sm rounded-lg font-label-button text-label-button transition-all duration-150 ${
                  activeTab === "kasir"
                    ? "bg-surface text-primary-container shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon name="badge" className="w-4 h-4" />
                Kasir (Shift)
              </button>
              <button
                type="button"
                onClick={() => handleRoleTabChange("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-space-sm rounded-lg font-label-button text-label-button transition-all duration-150 ${
                  activeTab === "admin"
                    ? "bg-surface text-primary-container shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon name="admin_panel_settings" className="w-4 h-4" />
                Admin / Pengelola
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-caption-medium flex items-center gap-2">
                <Icon name="error" className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-space-lg">
              <div className="space-y-1.5 text-left">
                <label className="block font-label-button text-label-button text-text-primary" htmlFor="email-input">
                  {activeTab === "kasir" ? "Email / ID Kasir" : "Email Admin BUMDes"}
                </label>
                <div className="relative flex items-center">
                  <Icon name="person" className="w-5 h-5 absolute left-3.5 text-text-muted pointer-events-none" />
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@bumdes.desa.id"
                    className="w-full h-11 pl-11 pr-4 rounded-lg bg-surface border border-border-subtle text-text-primary font-body-regular text-body-regular placeholder:text-text-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
                  />
                </div>
                <p className="font-caption-small text-caption-small text-text-secondary">
                  {activeTab === "kasir"
                    ? "Gunakan akun kasir shift aktif (contoh: kasir@bumdes.desa.id)"
                    : "Akun pengelola penuh BUMDes (contoh: admin@bumdes.desa.id)"}
                </p>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="block font-label-button text-label-button text-text-primary" htmlFor="password-input">
                    Kata Sandi Keamanan
                  </label>
                  <span className="font-caption-small text-caption-small text-text-muted">Min. 6 Karakter</span>
                </div>
                <div className="relative flex items-center">
                  <Icon name="lock" className="w-5 h-5 absolute left-3.5 text-text-muted pointer-events-none" />
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full h-11 pl-11 pr-11 rounded-lg bg-surface border border-border-subtle text-text-primary font-body-regular text-body-regular placeholder:text-text-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-text-muted hover:text-text-primary p-1 focus:outline-none"
                    aria-label="Toggle password"
                  >
                    <Icon name={showPassword ? "visibility_off" : "visibility"} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg bg-primary-container text-on-primary font-label-button text-label-button flex items-center justify-center gap-2 shadow-md hover:bg-primary-hover active:bg-primary transition-all duration-150 focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem POS</span>
                    <Icon name="login" className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer notice */}
            <div className="space-y-space-md pt-space-xs text-center">
              <div className="p-space-sm rounded-lg bg-surface-container-low text-text-secondary font-caption-medium text-caption-medium flex items-center justify-center gap-1.5">
                <Icon name="help" className="w-4 h-4 text-text-muted" />
                <span>Lupa kata sandi? Hubungi Sekretaris atau Pengelola BUMDes</span>
              </div>
              <div className="space-y-1">
                <p className="font-caption-small text-caption-small text-text-secondary">
                  Terhubung ke <strong className="text-text-primary font-body-medium">Unit Toko Karangsari</strong> • Versi 1.0 (MVP)
                </p>
                <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container-lowest text-status-success font-caption-medium text-caption-medium shadow-sm border border-border-subtle">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                  <span>Sistem Operasional Siap Digunakan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
