import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowRight,
  FolderArchive,
  Terminal,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/navbar";
import { EmptyState } from "@/components/empty-state";
import { HistoryCardSkeleton, StatsCardSkeleton } from "@/components/loading-skeletons";
import { AnalysisWorkspace } from "@/components/analysis-workspace";
import { BrutalistStats } from "@/components/brutalist-stats";
import { HistoryTable } from "@/components/history-table";
import { Footer } from "@/components/footer";
import {
  useComparisons,
  useCreateComparison,
  useUpdateComparison,
  useDeleteComparison,
  useComparisonStats,
  type ComparisonData,
  type ComparisonMode,
} from "@/hooks/use-comparisons";

export default function HomePage() {
  const location = useLocation();
  const [editingData, setEditingData] = useState<ComparisonData | null>(
    (location.state as { editData?: ComparisonData } | null)?.editData || null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Queries & Mutations (Recent 5 is first page)
  const { data: historyData, isLoading: isLoadingHistory } = useComparisons(1);
  const { data: statsData, isLoading: isLoadingStats } = useComparisonStats();
  const queryClient = useQueryClient();
  const createMutation = useCreateComparison();
  const updateMutation = useUpdateComparison();
  const deleteMutation = useDeleteComparison();

  const handleSaveWorkspace = (data: { input1: string; input2: string; mode: ComparisonMode }) => {
    if (editingData) {
      updateMutation.mutate(
        { id: editingData.id, ...data },
        {
          onSuccess: () => {
            setEditingData(null);
            toast.success("Perubahan data berhasil disimpan!");
            queryClient.invalidateQueries({ queryKey: ["comparisons"] });
            queryClient.invalidateQueries({ queryKey: ["comparisons", "stats"] });
          },
          onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Gagal memperbarui data.");
            }
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Analisis baru berhasil disimpan ke riwayat!");
          queryClient.invalidateQueries({ queryKey: ["comparisons"] });
          queryClient.invalidateQueries({ queryKey: ["comparisons", "stats"] });
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Gagal menyimpan analisis.");
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
          toast.success("Riwayat berhasil dihapus!");
          queryClient.invalidateQueries({ queryKey: ["comparisons"] });
          queryClient.invalidateQueries({ queryKey: ["comparisons", "stats"] });
        },
        onError: () => {
          toast.error("Gagal menghapus riwayat.");
        },
      });
    }
  };

  const recentItems = historyData?.data.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Workspace Title section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono uppercase tracking-wider">
            <Terminal className="h-3.5 w-3.5" />
            <span>Workspace / Text Similarity Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Live Match Workspace
          </h1>
          <p className="text-sm text-muted-foreground">
            Kalkulator persentase kemunculan karakter dengan pratinjau instan dan visualisasi breakdown per-karakter.
          </p>
        </div>

        {/* Section 1: Live Analysis Split Workspace */}
        <section className="space-y-3">
          <AnalysisWorkspace
            initialData={editingData}
            onSave={handleSaveWorkspace}
            isSaving={createMutation.isPending || updateMutation.isPending}
            onCancelEdit={() => setEditingData(null)}
          />
        </section>

        {/* Section 2: Metrics Dashboard */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ringkasan Metrik Akun
            </h2>
          </div>
          {isLoadingStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </div>
          ) : statsData ? (
            <BrutalistStats stats={statsData} />
          ) : null}
        </section>

        {/* Section 3: Recent 5 History Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderArchive className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                5 Riwayat Terakhir
              </h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs font-mono gap-1 text-muted-foreground hover:text-foreground">
              <Link to="/history">
                Lihat Semua Riwayat ({historyData?.meta.total || 0}) <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {isLoadingHistory ? (
            <div className="space-y-3">
              <HistoryCardSkeleton />
            </div>
          ) : recentItems.length === 0 ? (
            <EmptyState
              title="Belum ada riwayat tersimpan"
              description="Hasil analisis yang disimpan melalui panel live workspace di atas akan dicatat secara otomatis."
            />
          ) : (
            <div className="space-y-3">
              <HistoryTable
                data={recentItems}
                onEdit={(item) => {
                  setEditingData(item);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  toast.info(`Memuat data #${item.id.slice(0, 8)} ke workspace untuk diedit.`);
                }}
                onDelete={(id) => setDeletingId(id)}
              />
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Konfirmasi Hapus Riwayat</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus catatan riwayat pengecekan ini? Tindakan ini akan menerapkan soft-delete pada database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingId(null)}
              disabled={deleteMutation.isPending}
              className="text-xs font-mono"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="text-xs font-mono"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus Data"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
