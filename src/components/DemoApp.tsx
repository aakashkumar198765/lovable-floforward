import React, { useState } from "react";
import { FlexLayout } from "./atoms/layouts";
import { Button, Input } from "./atoms";

const DemoApp: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Welcome to your deployed app!", completed: false },
    { id: 2, title: "This is a sample task", completed: true },
    { id: 3, title: "Add your own tasks below", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: newTask,
          completed: false,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎉 Your App is Live!
            </h1>
            <p className="text-gray-600">
              This is a preview of your deployed React application
            </p>
          </div>

          {/* Demo Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Task Manager Demo
            </h2>

            {/* Add Task Form */}
            <FlexLayout direction="row" gap="sm" className="mb-6">
              <Input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="flex-1"
              />
              <Button onClick={addTask} variant="primary">
                Add Task
              </Button>
            </FlexLayout>

            {/* Tasks List */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    task.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span
                    className={`flex-1 ${
                      task.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.completed && (
                    <span className="text-green-600 text-sm">✓ Complete</span>
                  )}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Statistics</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {tasks.length}
                  </div>
                  <div className="text-sm text-blue-700">Total Tasks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter((t) => t.completed).length}
                  </div>
                  <div className="text-sm text-green-700">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {tasks.filter((t) => !t.completed).length}
                  </div>
                  <div className="text-sm text-orange-700">Remaining</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>🚀 Powered by Param Network</p>
            <p>Deployed on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoApp;
