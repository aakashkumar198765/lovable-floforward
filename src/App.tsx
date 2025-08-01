import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ToastContainer from './components/atoms/feedback/ToastContainer';
import PurchaseOrderApp from "./pages/PurchaseOrderApp";
import ThemeTestPage from "./pages/ThemeTestPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import LibraryTemplate from "./libraryTemplate";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/theme-test" element={<ThemeTestPage />} />
          <Route path="/purchase-order/*" element={<PurchaseOrderApp />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/*" element={<LibraryTemplate />} />
        </Routes>
        
        {/* Global Toast Container */}
        <ToastContainer position="top-right" />
      </Router>
    </ThemeProvider>
  );
}

export default App;