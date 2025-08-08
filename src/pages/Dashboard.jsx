import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your application dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AI Configuration Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900">AI Configuration</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Configure AI features for your application including conversational assistant, anomaly detection, and predictive insights.
            </p>
            <Link to="/ai-configuration">
              <Button variant="primary" size="sm" className="w-full">
                Configure AI Features
              </Button>
            </Link>
          </div>

          {/* Other Dashboard Cards */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">📊</div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              View detailed analytics and insights about your application performance.
            </p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">⚙️</div>
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Manage your application settings and configurations.
            </p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}