import { ChakraProvider } from "@chakra-ui/react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { system } from "./components/theme";
import { TRPCProvider } from "./components/TRPCProvider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { AppHome } from "./pages/AppHome";
import { BoardDetail } from "./pages/BoardDetail";
import { Clients } from "./pages/Clients";
import { Connect } from "./pages/Connect";
import { CreateBoard } from "./pages/CreateBoard";
import { EditBoard } from "./pages/EditBoard";
// import { MyConnections } from "./pages/MyConnections";
import { SignIn } from "./pages/SignIn";
import { Tasks } from "./pages/Tasks";

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
                {/* <Route path="connections" element={<MyConnections />} /> */}
                <Route path="create-board" element={<CreateBoard />} />
                <Route path="boards/:boardId" element={<BoardDetail />} />
                <Route path="boards/:boardId/edit" element={<EditBoard />} />
                <Route path="connect" element={<Connect />} />
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
      <Toaster />
    </ChakraProvider>
  );
};

export default App;
