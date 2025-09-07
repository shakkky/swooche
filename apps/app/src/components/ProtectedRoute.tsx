import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spinner, Center } from "@chakra-ui/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Debug logging
  console.log("🔒 ProtectedRoute - loading:", loading, "user:", user?.id);

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user) {
    console.log("🚫 No user found, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  console.log("✅ User authenticated, rendering protected content");
  return <>{children}</>;
}
