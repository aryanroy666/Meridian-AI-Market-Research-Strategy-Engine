import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResearchProgress from "./pages/ResearchProgress";
import ReportView from "./pages/ReportView";

import Methodology from "./pages/Methodology";
import AboutProject from "./pages/AboutProject";


import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research/new"
              element={
                <ProtectedRoute>
                  <ResearchProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research/:jobId"
              element={
                <ProtectedRoute>
                  <ReportView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AboutProject />
                </ProtectedRoute>
              }
            />

            <Route
              path="/methodology"
              element={
                <ProtectedRoute>
                  <Methodology />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
