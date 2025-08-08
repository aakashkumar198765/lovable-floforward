import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ToastContainer from './components/atoms/feedback/ToastContainer';
import { ThemeProvider } from "./contexts/ThemeContext";
import LibraryTemplate from "./libraryTemplate";
import ProjectPlanScreen from "./pages/ProjectPlanScreen";
import WorkflowPreview from "./pages/WorkflowPreview";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/project-plan" element={<ProjectPlanScreen />} />
          <Route path="/workflow-preview" element={<WorkflowPreview />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/*" element={<WorkflowPreview />} />
        </Routes>

        {/* Global Toast Container */}
        <ToastContainer position="top-right" />
      </Router>
    </ThemeProvider>
  );
}

export default App;