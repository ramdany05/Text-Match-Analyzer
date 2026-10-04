import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Search,
  Download,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Edit2,
  CheckSquare,
  Square,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EmptyState } from "@/components/empty-state";
import { HistoryCardSkeleton } from "@/components/loading-skeletons";
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
  useDeleteComparison,
  type ComparisonMode,
} from "@/hooks/use-comparisons";

export default function HistoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<"ALL" | ComparisonMode>("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const { data: historyData, isLoading, isFetching, refetch } = useComparisons(page);
  const deleteMutation = useDeleteComparison();

  // Client-side filtering across current page records
  const filteredData = useMemo(() => {
    if (!historyData?.data) return [];
    return historyData.data.filter((item) => {
      // Search filter
      const matchSearch =
        !searchQuery ||
        item.input1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.input2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase());

      // Mode filter
      const matchMode = modeFilter === "ALL" || item.mode === modeFilter;

      // Date range filter
      let matchDate = true;
      const itemDate = new Date(item.createdAt);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        matchDate = matchDate && itemDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchDate = matchDate && itemDate <= end;
      }

      return matchSearch && matchMode && matchDate;
    });
  }, [historyData, searchQuery, modeFilter, startDate, endDate]);

  // Bulk selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((d) => d.id)));
    }
  };

  // Export to CSV handler
  const handleExportCSV = () => {
    if (!filteredData.length) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }

    const headers = ["ID", "Input 1", "Input 2", "Mode", "Kecocokan (%)", "Label", "Cocok", "Total", "Tanggal Dibuat"];
    const rows = filteredData.map((row) => [
      `"${row.id}"`,
      `"${row.input1.replace(/"/g, '""')}"`,
      `"${row.input2.replace(/"/g, '""')}"`,
      `"${row.mode}"`,
      row.percentage,
      `"${row.label}"`,
      row.matchedCount,
      row.totalCount,
      `"${new Date(row.createdAt).toISOString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `text-match-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("File CSV riwayat berhasil diunduh.");
  };

  // Single delete
  const confirmSingleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
          toast.success("Catatan riwayat berhasil dihapus.");
          queryClient.invalidateQueries({ queryKey: ["comparisons"] });
        },
      });
    }
  };

  // Bulk delete execution
  const executeBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const idsToDelete = Array.from(selectedIds);
      // Sequentially / concurrently delete
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`/comparisons/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            baseURL: "http://localhost:3000/api",
          })
        )
      );
      toast.success(`${idsToDelete.length} riwayat berhasil dihapus!`);
      setSelectedIds(new Set());
      setIsBulkModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["comparisons"] });
    } catch {
      toast.error("Gagal menghapus beberapa data.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Riwayat Pengecekan
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Kelola, cari, filter, dan ekspor riwayat analisa kemiripan teks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 text-xs font-mono gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredData.length === 0}
              className="h-9 text-xs font-mono gap-1.5 border-border"
            >
              <Download className="h-3.5 w-3.5" /> Ekspor CSV
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border border-border rounded-lg bg-card space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input (5 cols) */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari teks input atau label..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs font-mono border-border bg-muted/20 focus:bg-background"
              />
            </div>

            {/* Mode Filter (3 cols) */}
            <div className="md:col-span-3 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value as "ALL" | ComparisonMode)}
                className="w-full h-9 rounded-md border border-border bg-muted/20 px-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="ALL">Semua Mode</option>
                <option value="SENSITIVE">Case Sensitive</option>
                <option value="INSENSITIVE">Case Insensitive</option>
              </select>
            </div>

            {/* Date Range Filters (4 cols) */}
            <div className="md:col-span-4 grid grid-cols-2 gap-2">
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-xs font-mono border-border bg-muted/20"
                  title="Tanggal Awal"
                />
              </div>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 text-xs font-mono border-border bg-muted/20"
                  title="Tanggal Akhir"
                />
              </div>
            </div>
          </div>

          {/* Active Filter Indicators / Clear */}
          {(searchQuery || modeFilter !== "ALL" || startDate || endDate) && (
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
              <span>
                Menampilkan <strong>{filteredData.length}</strong> dari total{" "}
                <strong>{historyData?.meta.total || 0}</strong> hasil
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setModeFilter("ALL");
                  setStartDate("");
                  setEndDate("");
                }}
                className="h-6 text-xs text-muted-foreground hover:text-foreground font-mono"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>

        {/* Bulk Action Bar (When rows are selected) */}
        {selectedIds.size > 0 && (
          <div className="p-3 border border-border rounded-lg bg-secondary/80 flex items-center justify-between text-xs animate-in fade-in duration-150">
            <span className="font-semibold font-mono">
              {selectedIds.size} baris data terpilih
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
                className="h-7 text-xs font-mono"
              >
                Batal Pilih
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkModalOpen(true)}
                className="h-7 text-xs font-mono gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> Hapus Terpilih
              </Button>
            </div>
          </div>
        )}

        {/* History Table View */}
        {isLoading ? (
          <div className="space-y-3">
            <HistoryCardSkeleton />
            <HistoryCardSkeleton />
            <HistoryCardSkeleton />
          </div>
        ) : filteredData.length === 0 ? (
          <EmptyState
            title="Tidak ada riwayat yang cocok"
            description="Tidak ditemukan catatan riwayat pengecekan berdasarkan filter atau kata kunci yang diterapkan."
            actionLabel="Reset Pencarian"
            onAction={() => {
              setSearchQuery("");
              setModeFilter("ALL");
              setStartDate("");
              setEndDate("");
            }}
          />
        ) : (
          <div className="border border-border rounded-lg overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4 w-[40px]">
                      <button
                        onClick={handleSelectAll}
                        className="text-muted-foreground hover:text-foreground flex items-center"
                      >
                        {selectedIds.size > 0 && selectedIds.size === filteredData.length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4 w-[110px]">Skor (%)</th>
                    <th className="py-3 px-4">Teks Input 1 & 2</th>
                    <th className="py-3 px-4 w-[130px]">Mode</th>
                    <th className="py-3 px-4 w-[150px]">Tanggal</th>
                    <th className="py-3 px-4 w-[90px] text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredData.map((item) => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-muted/30 transition-colors group ${
                          isSelected ? "bg-muted/40" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4 align-top">
                          <button
                            onClick={() => handleToggleSelect(item.id)}
                            className="text-muted-foreground hover:text-foreground mt-0.5"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-foreground" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>

                        {/* Percentage */}
                        <td className="py-3 px-4 align-top">
                          <div className="flex flex-col items-start gap-1">
                            <span className="font-mono font-bold text-base text-foreground">
                              {item.percentage}%
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary font-medium border border-border text-muted-foreground">
                              {item.label}
                            </span>
                          </div>
                        </td>

                        {/* Text Inputs */}
                        <td className="py-3 px-4 align-top space-y-1.5">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-mono uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground shrink-0">
                              In 1
                            </span>
                            <span className="font-mono text-xs text-foreground break-all line-clamp-1">
                              {item.input1}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-[10px] font-mono uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground shrink-0">
                              In 2
                            </span>
                            <span className="font-mono text-xs text-foreground break-all line-clamp-1">
                              {item.input2}
                            </span>
                          </div>
                        </td>

                        {/* Mode */}
                        <td className="py-3 px-4 align-top">
                          <span className="inline-flex items-center text-xs font-mono px-2 py-0.5 rounded border border-border bg-background">
                            {item.mode === "SENSITIVE" ? "Sensitive" : "Insensitive"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 align-top text-xs text-muted-foreground font-mono">
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigate("/", { state: { editData: item } });
                              }}
                              title="Buka di Workspace"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletingId(item.id)}
                              title="Hapus"
                              className="h-7 w-7 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {historyData?.meta && historyData.meta.lastPage > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border text-xs text-muted-foreground font-mono bg-card">
                <span>
                  Halaman {historyData.meta.page} dari {historyData.meta.lastPage} (Total{" "}
                  {historyData.meta.total} item)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8 text-xs font-mono"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(historyData.meta.lastPage, p + 1))}
                    disabled={page === historyData.meta.lastPage}
                    className="h-8 text-xs font-mono"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Single Delete Confirmation Modal */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Hapus Riwayat Pengecekan</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus catatan riwayat pengecekan ini? Data akan dihapus secara soft-delete.
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
              onClick={confirmSingleDelete}
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

      {/* Bulk Delete Confirmation Modal */}
      <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
        <DialogContent className="border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Hapus {selectedIds.size} Riwayat Terpilih</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus seluruh {selectedIds.size} catatan terpilih ini secara sekaligus?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkModalOpen(false)}
              disabled={isBulkDeleting}
              className="text-xs font-mono"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={executeBulkDelete}
              disabled={isBulkDeleting}
              className="text-xs font-mono"
            >
              {isBulkDeleting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Menghapus {selectedIds.size} item...
                </>
              ) : (
                `Hapus ${selectedIds.size} Item`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
