import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { SignIn } from "./pages/SignIn";
import { AppHome } from "./pages/AppHome";
import { Clients } from "./pages/Clients";
import { Tasks } from "./pages/Tasks";
import { system } from "./components/theme";

const App = () => {
  return (
    <ChakraProvider value={system}>
      <AuthProvider>
        <Router>
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
            </Route>

            {/* Redirect root to app */}
            <Route path="/" element={<Navigate to="/app" replace />} />

            {/* Redirect to app if accessing unknown routes */}
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
