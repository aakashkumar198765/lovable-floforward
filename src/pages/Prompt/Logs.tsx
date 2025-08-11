import React, { useEffect, useRef, useState } from "react";
import { Button, Icon } from "../../components/atoms";

type LogEntry = {
  message: string;
  status: string;
  format: string;
};

type LogsProps = {
  logs: LogEntry[];
  onBackToPrompt: () => void;
  onViewOutput: () => void;
  streamCompleted?: boolean;
};

const Logs: React.FC<LogsProps> = ({ logs, onBackToPrompt, onViewOutput, streamCompleted }) => {
  const logsEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [logs]); // Scroll to bottom when logs array updates

  const formatMessage = (message: string) => {
    // Simple markdown-like formatting
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 rounded">$1</code>') // Inline code
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-2 rounded text-sm overflow-x-auto"><code>$1</code></pre>'
      )
      .replace(
        /#{1,6}\s+(.*)/g,
        '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
      )
      .replace(/- (.*)/g, '<li class="ml-4">$1</li>')
      .replace(/\n/g, "<br />"); // Line breaks
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "started":
        return "text-blue-600";
      case "pending":
        return "text-yellow-700";
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
    <div className="top-0 left-0 h-[calc(100vh-8rem)] rounded-[6px] w-3/4 bg-transparent backdrop-blur-lg text-gray-800 p-8 flex flex-col z-30 shadow-2xl">
      <div className="flex-shrink-0 mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Building - setting up the process
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-4">
        {logs.map((log, index) => {
          return (
            <div
              key={index}
              className="bg-[rgba(255,255,255,0.8)] p-4 rounded-lg shadow-md mb-4 flex items-start space-x-3"
            >
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
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(log.message),
                  }}
                />
              </div>
            </div>
          );
        })}
        <div ref={logsEndRef} />
      </div>

      {logs.length > 0 && (
        <div className="flex-shrink-0 pt-6 border-t border-gray-200">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={onBackToPrompt}
              variant="secondary"
              className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm"
              iconLeft={<Icon name="arrow-left" size="sm" />}
            >
              Back to Prompt
            </Button>
            <Button
              onClick={onViewOutput}
              disabled={!streamCompleted}
              variant="primary"
              className="px-8 py-3 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              iconRight={<Icon name="arrow-right" size="sm" />}
            >
              View Output
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
