import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type TutorialInput } from "@shared/routes";

// GET /api/tutorials
export function useTutorials(filters?: { search?: string; style?: string; difficulty?: string }) {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.style) queryParams.append("style", filters.style);
  if (filters?.difficulty) queryParams.append("difficulty", filters.difficulty);

  const path = `${api.tutorials.list.path}?${queryParams.toString()}`;

  return useQuery({
    queryKey: [api.tutorials.list.path, filters],
    queryFn: async () => {
      const res = await fetch(path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tutorials");
      return api.tutorials.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/tutorials/:id
export function useTutorial(id: number) {
  return useQuery({
    queryKey: [api.tutorials.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.tutorials.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch tutorial");
      return api.tutorials.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

// POST /api/tutorials
export function useCreateTutorial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TutorialInput) => {
      // Validate with schema before sending
      const validated = api.tutorials.create.input.parse(data);
      
      const res = await fetch(api.tutorials.create.path, {
        method: api.tutorials.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.tutorials.create.responses[400].parse(await res.json());
          throw new Error(error.message || "Validation failed");
        }
        if (res.status === 401) {
          throw new Error("Unauthorized - Please log in");
        }
        throw new Error("Failed to create tutorial");
      }
      return api.tutorials.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tutorials.list.path] });
    },
  });
}
