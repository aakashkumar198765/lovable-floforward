import React from "react";
import ReactMarkdown from "react-markdown";

type LogEntry = {
  message: string;
  status: string;
  format: string;
};

type LogsProps = {
  logs: LogEntry[];
};

// Mark the file as a module to satisfy --isolatedModules
export {};

const Logs: React.FC<LogsProps> = ({ logs }) => {
  // Map log status to Tailwind CSS classes for color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "started":
        return "text-blue-600 bg-blue-100 border-blue-300";
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "completed":
        return "text-green-600 bg-green-100 border-green-300";
      default:
        return "text-gray-800 bg-gray-50 border-gray-200";
    }
  };

  // Custom markdown components for colorful rendering
  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      return inline ? (
        <code className="bg-gray-200 text-red-600 px-1 rounded" {...props}>
          {children}
        </code>
      ) : (
        <pre
          className="bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto"
          {...props}
        >
          <code>{children}</code>
        </pre>
      );
    },
    strong({ node, ...props }: any) {
      return <strong className="text-purple-700 font-semibold" {...props} />;
    },
    h1({ node, ...props }: any) {
      return (
        <h1
          className="text-2xl font-bold text-indigo-700 mt-4 mb-2"
          {...props}
        />
      );
    },
    h2({ node, ...props }: any) {
      return (
        <h2
          className="text-xl font-bold text-indigo-600 mt-3 mb-2"
          {...props}
        />
      );
    },
    h3({ node, ...props }: any) {
      return (
        <h3
          className="text-lg font-semibold text-indigo-500 mt-2 mb-1"
          {...props}
        />
      );
    },
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Building App
      </h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        This is a simulated build log for demonstration purposes.
      </p>
      <div className="h-80 overflow-y-auto border border-gray-200 rounded-md p-4 space-y-4">
        {logs.length === 0 ? (
          <div className="text-sm text-gray-500 text-center">No logs yet</div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`text-sm rounded-md p-3 ${getStatusColor(
                log.status
              )} text-center`}
            >
              {log.format === "markdown" ? (
                <ReactMarkdown components={markdownComponents}>
                  {log.message}
                </ReactMarkdown>
              ) : (
                <p>{log.message}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logs;
