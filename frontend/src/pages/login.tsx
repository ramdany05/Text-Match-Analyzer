import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();

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
      navigate("/", { replace: true });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          form.setError("root", { message: error.response.data.message });
        } else if (error.code === "ERR_NETWORK" || !error.response) {
          form.setError("root", {
            message: `Gagal terhubung ke API backend (${api.defaults.baseURL}). Pastikan URL API benar dan backend aktif.`,
          });
        } else {
          form.setError("root", { message: `Error ${error.response.status}: ${error.message}` });
        }
      } else {
        form.setError("root", { message: "Terjadi kesalahan yang tidak terduga" });
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Gunakan akun demo untuk masuk
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {form.formState.errors.root && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {form.formState.errors.root.message}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                autoFocus
                {...form.register("username")}
                aria-invalid={!!form.formState.errors.username}
              />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register("password")}
                aria-invalid={!!form.formState.errors.password}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Sedang login..." : "Masuk"}
            </Button>
            
            <div className="text-sm text-center text-muted-foreground bg-muted p-3 rounded-md w-full">
              <p className="font-semibold text-foreground mb-1">Demo Account:</p>
              <p>Username: <code className="bg-background px-1 py-0.5 rounded">penguji</code></p>
              <p>Password: <code className="bg-background px-1 py-0.5 rounded">password123</code></p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
