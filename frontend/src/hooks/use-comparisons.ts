import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export type ComparisonMode = "SENSITIVE" | "INSENSITIVE";

export interface ComparisonData {
  id: string;
  input1: string;
  input2: string;
  mode: ComparisonMode;
  percentage: number;
  matchedCount: number;
  totalCount: number;
  matchedChars: string[];
  label: string;
  createdAt: string;
}

export interface PaginatedComparisons {
  data: ComparisonData[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface ComparisonStats {
  avgPercentage: number;
  maxPercentage: number;
  sensitiveCount: number;
  insensitiveCount: number;
}

export function useComparisonStats() {
  return useQuery({
    queryKey: ["comparisons", "stats"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ComparisonStats }>("/comparisons/stats");
      return res.data.data;
    },
  });
}

// Custom Hooks for Comparisons

export function useComparisons(page: number = 1) {
  return useQuery({
    queryKey: ["comparisons", page],
    queryFn: async () => {
      const res = await api.get<{ success: boolean } & PaginatedComparisons>(
        `/comparisons?page=${page}`
      );
      return res.data;
    },
  });
}

export function useComparison(id: string) {
  return useQuery({
    queryKey: ["comparisons", id],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: ComparisonData }>(
        `/comparisons/${id}`
      );
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateComparison() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { input1: string; input2: string; mode: ComparisonMode }) => {
      const res = await api.post<{ success: boolean; data: ComparisonData }>(
        "/comparisons",
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comparisons"] });
    },
  });
}

export function useUpdateComparison() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      input1: string;
      input2: string;
      mode: ComparisonMode;
    }) => {
      const res = await api.put<{ success: boolean; data: ComparisonData }>(
        `/comparisons/${id}`,
        data
      );
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comparisons"] });
      queryClient.invalidateQueries({ queryKey: ["comparisons", variables.id] });
    },
  });
}

export function useDeleteComparison() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/comparisons/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comparisons"] });
    },
  });
}
