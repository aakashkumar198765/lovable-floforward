import React from "react";

type LogEntry = {
  message: string;
  status: string;
  format: string;
};

type LogsProps = {
  logs: LogEntry[];
};

const Logs: React.FC<LogsProps> = ({ logs }) => {
  const formatMessage = (message: string) => {
    // Simple markdown-like formatting
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>') // Inline code
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-2 rounded text-sm overflow-x-auto"><code>$1</code></pre>'
      ) // Code blocks
      .replace(
        /#{1,6}\s+(.*)/g,
        '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
      ) // Headers
      .replace(/- (.*)/g, '<li class="ml-4">$1</li>') // List items
      .replace(/\n/g, "<br />"); // Line breaks
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "started":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      case "completed":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "started":
        return "▶️";
      case "pending":
        return "⏳";
      case "completed":
        return "✅";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Building Progress
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      <div className="h-96 overflow-y-auto bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            Initializing build process...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border-l-4 ${
                log.status === "completed"
                  ? "border-l-green-500 bg-green-50"
                  : log.status === "error"
                  ? "border-l-red-500 bg-red-50"
                  : log.status === "started"
                  ? "border-l-blue-500 bg-blue-50"
                  : "border-l-yellow-500 bg-yellow-50"
              }`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-sm mt-0.5">
                  {getStatusIcon(log.status)}
                </span>
                <div className="flex-1">
                  <div
                    className={`text-sm ${getStatusColor(
                      log.status
                    )} font-medium mb-1`}
                  >
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </div>
                  <div
                    className="text-sm text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(log.message),
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logs;
