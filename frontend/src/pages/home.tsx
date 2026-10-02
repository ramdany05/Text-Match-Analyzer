import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import axios from "axios";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  input1: z.string().min(1, "Input 1 tidak boleh kosong"),
  input2: z.string().min(1, "Input 2 tidak boleh kosong"),
  mode: z.enum(["SENSITIVE", "INSENSITIVE"]),
});

type FormValues = z.infer<typeof formSchema>;

type CalculateResponse = {
  success: boolean;
  data: {
    percentage: number;
    matchedCount: number;
    totalCount: number;
    matchedChars: string[];
    label: string;
    hint?: string;
  };
};

export default function HomePage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<CalculateResponse["data"] | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input1: "",
      input2: "",
      mode: "SENSITIVE",
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await api.post<CalculateResponse>("/comparisons/calculate", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        form.setError("root", { message: error.response.data.message });
      } else {
        form.setError("root", { message: "Gagal menghitung kecocokan" });
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    calculateMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-start justify-center p-4 py-12 bg-muted/20">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Text Match Analyzer</h1>
            <p className="text-muted-foreground">Hitung persentase kecocokan dua teks.</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pengecekan Teks</CardTitle>
            <CardDescription>
              Masukkan teks untuk Input 1 dan Input 2, lalu pilih mode pencocokan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {form.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="input1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input 1 (Karakter yang akan dicari)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ketikkan teks pertama di sini..."
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="input2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input 2 (Teks sumber/target)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ketikkan teks kedua di sini..."
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Mode Pencocokan</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="SENSITIVE" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Case Sensitive (A ≠ a)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="INSENSITIVE" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Case Insensitive (A = a)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={calculateMutation.isPending} className="w-full">
                  {calculateMutation.isPending ? "Menghitung..." : "Hitung Kecocokan"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Hasil Pengecekan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-3">
                <span className="text-5xl font-extrabold text-primary">
                  {result.percentage}%
                </span>
                <span className="text-lg font-semibold text-muted-foreground pb-1">
                  ({result.label})
                </span>
              </div>
              
              <p className="text-foreground">
                <span className="font-semibold">{result.matchedCount}</span> dari{" "}
                <span className="font-semibold">{result.totalCount}</span> karakter unik di Input 1 ditemukan pada Input 2.
              </p>

              {result.matchedChars.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Karakter yang cocok:</p>
                  <div className="flex flex-wrap gap-1">
                    {result.matchedChars.map((char, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-background border rounded text-xs font-mono"
                      >
                        {char === " " ? "[spasi]" : char}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.hint && (
                <Alert className="mt-4 bg-background">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Hint</AlertTitle>
                  <AlertDescription>{result.hint}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
