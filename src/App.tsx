import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ToastContainer from "./components/atoms/feedback/ToastContainer";
import { ThemeProvider } from "./contexts/ThemeContext";
import LibraryTemplate from "./libraryTemplate";
import ProjectPlanScreen from "./pages/ProjectPlanScreen";
import WorkflowPreview from "./pages/WorkflowPreview";
import Dashboard from "./pages/Dashboard";
import paramSDKService from "./services/ParamSDKService";

import Prompt from "./pages/Prompt";
import Login from "./pages/Login";
import AIConfiguration from "./pages/AIConfiguration";

function App() {
  useEffect(() => {
    // Initialize Param SDK when app loads
    const initializeSDK = async () => {
      try {
        console.log('🚀 Initializing Param SDK on app startup...');
        await paramSDKService.initialize();
        console.log('✅ Param SDK initialization complete');
      } catch (error) {
        console.error('❌ Failed to initialize Param SDK on startup:', error);
        // Don't block the app if SDK fails to initialize
      }
    };

    initializeSDK();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/project-plan" element={<ProjectPlanScreen />} />
          <Route path="/workflow-preview" element={<WorkflowPreview />} />
          <Route path="/library-template" element={<LibraryTemplate />} />
          <Route path="/prompt" element={<Prompt />} />
          <Route path="/ai-configuration" element={<AIConfiguration />} />
        </Routes>

        {/* Global Toast Container */}
        <ToastContainer position="top-right" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
