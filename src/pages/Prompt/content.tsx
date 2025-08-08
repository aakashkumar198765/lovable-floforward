import React, { useState, useEffect } from "react";
import { Textarea, Button, Badge } from "../../components/atoms";
import Logs from "./Logs";

type RecentApp = { id: string; name: string; description?: string };

type LogEntry = {
  message: string;
  status: string;
  format: string;
};

type PromptContentProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  building: boolean;
  buildingAppName?: string;
  recentApps: RecentApp[];
  onSelectRecent: (app: RecentApp) => void;
  logs: LogEntry[];
};

const PromptContent: React.FC<PromptContentProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  building,
  buildingAppName,
  recentApps,
  onSelectRecent,
  logs,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsDrawerOpen(false);
    }
  };

  const handleBackToPrompt = () => {
    setShowLogs(false);
    setIsCompleted(false); // Reset isCompleted when returning to prompt
  };

  const handleViewOutput = () => {
    console.log("View output clicked");
    alert("View Output functionality will be implemented here");
  };

  // Show logs if building or if logs exist and we're in logs view
  // const shouldShowLogs = building || (logs.length > 0 && showLogs);

  // Update showLogs when building starts and check for completed logs
  useEffect(() => {
    if (building) {
      setShowLogs(true);
    }
    // Check if any log has status "completed"
    if (logs.some((log) => log.status.toLowerCase() === "completed")) {
      setIsCompleted(true);
    }
  }, [building, logs]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Main Content: Prompt or Logs */}
      <div className="w-full max-w-2xl">
        {!showLogs ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Build App With Natural Language
            </h3>
            <Textarea
              id="prompt"
              placeholder="Describe the app you want to build..."
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              rows={6}
              className="w-full text-center"
            />
            <div className="flex justify-center mt-4">
              <Button onClick={onSubmit} variant="primary">
                Build
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Logs logs={logs} />
            {logs.length > 0 && (
              <div className="mt-6 flex justify-center space-x-4">
                <Button
                  onClick={handleBackToPrompt}
                  variant="secondary"
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  ← Back to Prompt
                </Button>
                <Button
                  onClick={handleViewOutput}
                  variant="primary"
                  className={`px-6 py-2 rounded-lg transition-colors duration-200`}
                >
                  View Output →
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recent Apps Drawer Trigger: Hidden During Logs */}
      {!showLogs && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center">
          <button
            onClick={toggleDrawer}
            className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 transition"
          >
            <span className="text-sm font-medium text-gray-900 mr-2">
              Recent Apps
            </span>
            <svg
              className={`w-4 h-4 transform ${
                isDrawerOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Recent Apps Drawer with Backdrop: Shown When Triggered */}
      {isDrawerOpen && !showLogs && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-end"
          onClick={handleBackdropClick}
        >
          <div className="w-full max-w-7xl bg-white border-t border-gray-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-gray-900">
                Recent Apps
              </h4>
              <Badge variant="secondary">{recentApps.length}</Badge>
            </div>
            {recentApps.length === 0 ? (
              <div className="text-center text-gray-600">No recent apps</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {recentApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onSelectRecent(app);
                      setIsDrawerOpen(false);
                    }}
                    className="group h-28 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition bg-white flex items-center justify-center text-center p-2"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                        {app.name}
                      </div>
                      {app.description && (
                        <div className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {app.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptContent;
