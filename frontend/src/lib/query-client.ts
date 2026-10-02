import { QueryClient } from "@tanstack/react-query";

/**
 * Konfigurasi TanStack React Query client.
 *
 * - staleTime: 30 detik — data dianggap stale setelah 30s.
 * - retry: 1x — retry sekali jika request gagal.
 * - refetchOnWindowFocus: false — tidak refetch otomatis saat tab aktif kembali.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
