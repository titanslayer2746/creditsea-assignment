import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import UserDashboard from "./components/UserDashboard";
import VerifierDashboard from "./components/VerifierDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    <div className="h-full w-full bg-slate-200 overflow-y-scroll">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Role-Based Protected Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verifier"
            element={
              <ProtectedRoute allowedRoles={["verifier"]}>
                <VerifierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to SignIn */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
