import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { TRPCProvider } from "./components/TRPCProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { SignIn } from "./pages/SignIn";
import { AppHome } from "./pages/AppHome";
import { Clients } from "./pages/Clients";
import { Tasks } from "./pages/Tasks";
import { CreateBoard } from "./pages/CreateBoard";
import { system } from "./components/theme";

const App = () => {
  return (
    <ChakraProvider value={system}>
      <TRPCProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/signin" element={<SignIn />} />

              {/* Protected app routes with sidebar layout */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AppHome />} />
                <Route path="clients" element={<Clients />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="create-board" element={<CreateBoard />} />
              </Route>

              {/* Redirect root to app - with auth check */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/app" replace />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </TRPCProvider>
    </ChakraProvider>
  );
};

export default App;
