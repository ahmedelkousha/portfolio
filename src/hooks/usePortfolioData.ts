import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioService } from "@/services/portfolioService";
import { toast } from "sonner";

export const usePortfolioData = (collectionName: string) => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: [collectionName],
    queryFn: () => portfolioService.getAll(collectionName),
  });

  return { data, loading: isLoading, error };
};

export const usePersonalInfo = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["personalInfo"],
    queryFn: () => portfolioService.getPersonalInfo(),
  });

  return { data, loading: isLoading, error };
};

export const usePortfolioDoc = (collectionName: string, docId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [collectionName, docId],
    queryFn: () => portfolioService.getDocData(collectionName, docId),
  });

  return { data, loading: isLoading, error };
};

// Generic Mutation Hook
export const usePortfolioMutation = (collectionName: string) => {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      portfolioService.save(collectionName, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      // If it's a special doc, invalidate specifically
      if (collectionName === "metadata") {
        queryClient.invalidateQueries({ queryKey: ["personalInfo"] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => portfolioService.delete(collectionName, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
    },
  });

  return {
    save: saveMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
