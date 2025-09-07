import { useAuth } from "../contexts/AuthContext";

/**
 * Custom hook specifically for tRPC queries that require authentication
 * Usage: const { data, isLoading } = useAuthenticatedTrpcQuery(trpc.getBoards.useQuery, undefined);
 */
export function useAuthenticatedTrpcQuery<TData = unknown, TError = unknown>(
  queryHook: (input: any, options?: any) => any,
  input?: any,
  options?: any
) {
  const { user, loading: authLoading } = useAuth();

  // Only enable the query when user is authenticated and not loading
  const isEnabled = !!user && !authLoading && options?.enabled !== false;

  return queryHook(input, {
    ...options,
    enabled: isEnabled,
  });
}
