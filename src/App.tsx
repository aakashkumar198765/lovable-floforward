import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import ToastContainer from "./components/atoms/feedback/ToastContainer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { store } from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import LibraryTemplate from "./libraryTemplate";
import ProjectPlanScreen from "./pages/ProjectPlanScreen";
import WorkflowPreview from "./pages/WorkflowPreview";
import Dashboard from "./pages/Dashboard";
import paramSDKService from "./services/ParamSDKService";
import Prompt from "./pages/Prompt";
import Login from "./pages/Login";
import AIConfiguration from "./pages/AIConfiguration";
import CreateDeployScreen from "./pages/CreateDeployScreen/CreateDeployScreen";

function App() {
  useEffect(() => {
    // Initialize Param SDK when app loads
    const initializeSDK = async () => {
      try {
        console.log("🚀 Initializing Param SDK on app startup...");
        await paramSDKService.initialize();
        console.log("✅ Param SDK initialization complete");
      } catch (error) {
        console.error("❌ Failed to initialize Param SDK on startup:", error);
        // Don't block the app if SDK fails to initialize
      }
    };

    initializeSDK();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>

              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Prompt />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prompt"
                element={
                  <ProtectedRoute>
                    <Prompt />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-plan/:projectId/:projectName"
                element={
                  <ProtectedRoute>
                    <ProjectPlanScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-configuration"
                element={
                  <ProtectedRoute>
                    <AIConfiguration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workflow-preview"
                element={
                  <ProtectedRoute>
                    <WorkflowPreview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-deploy/:projectId/:projectName"
                element={
                  <ProtectedRoute>
                    <CreateDeployScreen />
                  </ProtectedRoute>
                }
              />
            </Routes>

            {/* Global Toast Container */}
            <ToastContainer position="top-right" />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
