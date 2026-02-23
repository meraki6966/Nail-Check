import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// User type matching WordPress response
interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  isPaidMember: boolean;
  membershipPlan: string | null;
  membershipStatus: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: User;
}

async function fetchUser(): Promise<User | null> {
  const response = await fetch("/api/user", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.success ? data.user : null;
}

async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}

async function registerUser(
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
): Promise<AuthResponse> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, firstName, lastName }),
  });

  return response.json();
}

async function logoutUser(): Promise<void> {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });
}

async function refreshMembership(): Promise<User | null> {
  const response = await fetch("/api/refresh-membership", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.success ? data.user : null;
}

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      loginUser(email, password),
    onSuccess: (data) => {
      if (data.success && data.user) {
        queryClient.setQueryData(["/api/user"], data.user);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, firstName, lastName }: { 
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string;
    }) => registerUser(email, password, firstName, lastName),
    onSuccess: (data) => {
      if (data.success && data.user) {
        queryClient.setQueryData(["/api/user"], data.user);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const refreshMembershipMutation = useMutation({
    mutationFn: refreshMembership,
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["/api/user"], data);
      }
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isPaidMember: user?.isPaidMember || false,
    
    // Login
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    // Register
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    
    // Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    
    // Refresh membership
    refreshMembership: refreshMembershipMutation.mutate,
    isRefreshingMembership: refreshMembershipMutation.isPending,
  };
}