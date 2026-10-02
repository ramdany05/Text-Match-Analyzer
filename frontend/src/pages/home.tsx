import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import axios from "axios";
import { AlertCircle, CheckCircle2, Info, Plus, History, Trash2, Edit2, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useComparisons,
  useCreateComparison,
  useUpdateComparison,
  useDeleteComparison,
  type ComparisonData,
} from "@/hooks/use-comparisons";

const formSchema = z.object({
  input1: z.string().min(1, "Input 1 tidak boleh kosong"),
  input2: z.string().min(1, "Input 2 tidak boleh kosong"),
  mode: z.enum(["SENSITIVE", "INSENSITIVE"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function HomePage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<ComparisonData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: historyData, isLoading: isLoadingHistory } = useComparisons(page);
  const createMutation = useCreateComparison();
  const updateMutation = useUpdateComparison();
  const deleteMutation = useDeleteComparison();

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input1: "",
      input2: "",
      mode: "SENSITIVE",
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleOpenCreate = () => {
    setEditingData(null);
    form.reset({ input1: "", input2: "", mode: "SENSITIVE" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: ComparisonData) => {
    setEditingData(data);
    form.reset({
      input1: data.input1,
      input2: data.input2,
      mode: data.mode,
    });
    setIsFormOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    if (editingData) {
      updateMutation.mutate(
        { id: editingData.id, ...data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingData(null);
          },
          onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
              form.setError("root", { message: error.response.data.message });
            }
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsFormOpen(false);
          setPage(1); // Balik ke halaman pertama
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            form.setError("root", { message: error.response.data.message });
          }
        },
      });
    }
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center p-4 py-8 bg-muted/20">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Text Match Analyzer</h1>
            <p className="text-muted-foreground">Kelola riwayat analisis teks Anda.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleOpenCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Cek Baru
            </Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Riwayat Pengecekan
            </CardTitle>
            <CardDescription>
              Daftar pengecekan yang pernah Anda simpan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="py-8 text-center text-muted-foreground">Memuat data...</div>
            ) : historyData?.data.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
                Belum ada riwayat pengecekan.<br />
                Klik tombol "Cek Baru" untuk mulai.
              </div>
            ) : (
              <div className="space-y-4">
                {historyData?.data.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Nilai / Score */}
                      <div className="flex-none p-6 bg-primary/5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border min-w-[150px]">
                        <span className="text-4xl font-extrabold text-primary">
                          {item.percentage}%
                        </span>
                        <span className="text-sm font-medium text-muted-foreground mt-1">
                          {item.label}
                        </span>
                        <span className="text-xs bg-background border px-2 py-1 rounded-full mt-2 font-mono text-muted-foreground">
                          {item.mode}
                        </span>
                      </div>
                      
                      {/* Detail Teks */}
                      <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Input 1</p>
                            <p className="text-sm line-clamp-2">{item.input1}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Input 2</p>
                            <p className="text-sm line-clamp-2">{item.input2}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeletingId(item.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          
          {/* Pagination */}
          {historyData?.meta && historyData.meta.lastPage > 1 && (
            <CardFooter className="flex items-center justify-between border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Halaman {historyData.meta.page} dari {historyData.meta.lastPage}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(p => Math.min(historyData.meta.lastPage, p + 1))}
                  disabled={page === historyData.meta.lastPage}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Dialog Form (Create/Edit) */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingData ? "Edit Pengecekan" : "Pengecekan Baru"}</DialogTitle>
              <DialogDescription>
                Masukkan teks dan pilih mode. {editingData && "Hasil akan dihitung ulang secara otomatis saat disimpan."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
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

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan Pengecekan"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Dialog Delete Confirm */}
        <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Riwayat</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus riwayat pengecekan ini? Data yang dihapus tidak dapat dikembalikan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setDeletingId(null)} disabled={deleteMutation.isPending}>
                Batal
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
