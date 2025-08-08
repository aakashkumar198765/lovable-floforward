import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ToastContainer from './components/atoms/feedback/ToastContainer';
import { ThemeProvider } from "./contexts/ThemeContext";
import LibraryTemplate from "./libraryTemplate";
import ProjectPlanScreen from "./pages/ProjectPlanScreen";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<LibraryTemplate />} />
          <Route path="/project-plan" element={<ProjectPlanScreen />} />
        </Routes>
        
        {/* Global Toast Container */}
        <ToastContainer position="top-right" />
      </Router>
    </ThemeProvider>
  );
}

export default App;