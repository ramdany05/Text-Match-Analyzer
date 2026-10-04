import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Navigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginHeroIllustration } from "@/components/illustrations/login-hero";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      toast.success("Login berhasil! Selamat datang kembali.");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          form.setError("root", { message: error.response.data.message });
          toast.error(error.response.data.message);
        } else if (error.code === "ERR_NETWORK" || !error.response) {
          const msg = `Gagal terhubung ke API backend (${api.defaults.baseURL}). Pastikan backend aktif.`;
          form.setError("root", { message: msg });
          toast.error("Gagal terhubung ke server backend");
        } else {
          const msg = `Error ${error.response.status}: ${error.message}`;
          form.setError("root", { message: msg });
          toast.error(msg);
        }
      } else {
        form.setError("root", { message: "Terjadi kesalahan yang tidak terduga" });
        toast.error("Terjadi kesalahan yang tidak terduga");
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl border border-border rounded-xl bg-card overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
        {/* Kolom Kiri: Visual Illustration & Branding (55% on desktop) */}
        <div className="lg:col-span-7 bg-secondary/30 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded border border-border bg-foreground text-background flex items-center justify-center font-mono font-bold text-xs">
                TM
              </div>
              <span className="font-semibold text-sm tracking-tight text-foreground">
                Text Match Analyzer
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Analisis Kemiripan Teks Instan
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Hitung persentase kecocokan karakter, visualisasikan mapping per-huruf, dan simpan riwayat analisa Anda secara terstruktur.
              </p>
            </div>
          </div>

          {/* Center Illustration */}
          <div className="py-8 flex items-center justify-center">
            <LoginHeroIllustration />
          </div>

          {/* Footer Note */}
          <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between pt-2 border-t border-border/60">
            <span>Algoritma Karakter O(n + m)</span>
            <span>Case Sensitive / Insensitive</span>
          </div>
        </div>

        {/* Kolom Kanan: Login Form (45% on desktop) */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center bg-card">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Masuk ke Akun
              </h2>
              <p className="text-xs text-muted-foreground">
                Masukkan kredensial Anda untuk mengakses workspace.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {form.formState.errors.root && (
                <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  autoComplete="username"
                  autoFocus
                  placeholder="Masukkan username Anda..."
                  className="font-mono text-xs h-10 border-border bg-muted/20 focus:bg-background transition-colors"
                  {...form.register("username")}
                  aria-invalid={!!form.formState.errors.username}
                />
                {form.formState.errors.username && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi..."
                  className="font-mono text-xs h-10 border-border bg-muted/20 focus:bg-background transition-colors"
                  {...form.register("password")}
                  aria-invalid={!!form.formState.errors.password}
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-10 text-xs font-medium tracking-wide gap-2 font-mono"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sedang masuk...
                    </>
                  ) : (
                    <>
                      Masuk <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="text-center mt-6 text-xs text-muted-foreground font-mono flex items-center justify-center gap-3">
        <span>Crafted by Ramdany Suhandi</span>
        <span>·</span>
        <a
          href="https://github.com/ramdany05/Text-Match-Analyzer"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground underline transition-colors"
        >
          GitHub
        </a>
        <span>·</span>
        <a
          href="https://www.linkedin.com/in/suhandi-ramdany/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground underline transition-colors"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
