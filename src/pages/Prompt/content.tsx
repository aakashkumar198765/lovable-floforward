import React, { useState } from "react";
import { Textarea, Button, Badge } from "../../components/atoms";

type RecentApp = { id: string; name: string; description?: string };

type LogEntry = { id: string; text: string; timestamp?: string };

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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close drawer only if the click is on the backdrop (not on the drawer content)
    if (e.target === e.currentTarget) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Main Content: Prompt or Logs */}
      <div className="w-full max-w-2xl">
        {!building ? (
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
              className="w-full"
            />
            <div className="flex justify-center mt-4">
              <Button onClick={onSubmit} variant="primary" disabled={building}>
                Build
              </Button>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Building {buildingAppName || "App"}
            </h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              This is a simulated build log for demonstration purposes.
            </p>
            <div className="h-80 overflow-y-auto bg-gray-50 border border-gray-200 rounded-md p-4 space-y-2">
              {logs.length === 0 ? (
                <div className="text-sm text-gray-500 text-center">
                  No logs yet
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="text-sm text-gray-800 text-center"
                  >
                    {log.text}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Apps Drawer Trigger: Hidden During Building */}
      {!building && (
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
      {isDrawerOpen && !building && (
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
