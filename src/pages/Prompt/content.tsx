import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Textarea,
  Button,
  Badge,
  Icon,
  Avatar,
  Modal,
} from "../../components/atoms";
import { useAuth } from "../../contexts/AuthContext";
import { RootState } from "../../store";
import Logs from "./Logs";
import Workspace from "./Workspace";
import { PromptContentProps } from "../../types";
import MarkdownRenderer from "../../utils/MarkdownRenderer";

const PromptContent: React.FC<PromptContentProps> = ({
  prompt = "",
  onPromptChange = () => {},
  onSubmit = () => {},
  building = false,
  setBuilding = () => {},
  buildingAppName = "",
  recentApps = [],
  onSelectRecent = () => {},
  streamCompleted = false,
  logs = [],
  setStreamingCompleted = () => {},
  ProjectId,
  // New user story props
  userStory = "",
  showUserStory = false,
  userStoryLoading = false,
  onUserStoryEdit = () => {},
  onProceedToBRD = () => {},
  onGenerateStory = () => {},
  // New regeneration props
  showRegenerationOptions = false,
  regenerationType = null,
  editPrompt = "",
  onRegenerationOption = () => {},
  onEditPromptSubmit = () => {},
  onCancelEdit = () => {},
  onEditPromptChange = () => {},
  onCloseRegenerationOptions = () => {},
}) => {
  // Ref for the prompt input section
  const promptInputRef = useRef<HTMLDivElement>(null);

  // Function to scroll to prompt input
  const scrollToPromptInput = () => {
    if (promptInputRef.current) {
      promptInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Expose scroll function to parent component
  React.useEffect(() => {
    if (regenerationType === "edit") {
      // Small delay to ensure state updates are processed
      setTimeout(() => {
        scrollToPromptInput();
      }, 150);
    }
  }, [regenerationType]);

  // Debug: Log the userStory prop value
  React.useEffect(() => {
    console.log("🔍 PromptContent received userStory:", userStory);
    console.log("🔍 PromptContent userStory type:", typeof userStory);
    console.log("🔍 PromptContent userStory length:", userStory?.length);
  }, [userStory]);

  // Debug: Log when userStory changes for rendering
  React.useEffect(() => {
    if (userStory) {
      console.log("🔍 PromptContent rendering user story:", userStory);
      console.log("🔍 User story length in render:", userStory.length);
    }
  }, [userStory]);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  // Get user data from Redux store for detailed user information
  const user = useSelector((state: RootState) => state.auth?.user);
  const [showLogs, setShowLogs] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleBuildBRDClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      // If we're in user story mode, this button regenerates the user story
      // If we're not in user story mode, this button starts the BRD building process
      if (showUserStory) {
        // This will trigger user story regeneration
        onSubmit();
      } else {
        // This will start the BRD building process
        onSubmit();
      }
    }
  };

  // Fallback user info when Redux user is not available
  const getUserDisplayInfo = () => {
    if (user) {
      return {
        name: user.name,
        email: user.email,
        role: user.role,
        initials:
          user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || user.email?.[0]?.toUpperCase(),
      };
    }

    // Fallback: try to get info from localStorage if authenticated
    if (isAuthenticated) {
      const userEmail = localStorage.getItem("userEmail");
      const authToken = localStorage.getItem("authToken");

      if (userEmail) {
        const name = userEmail
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return {
          name,
          email: userEmail,
          role: null,
          initials: name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
        };
      } else if (authToken) {
        return {
          name: "User",
          email: "user@example.com",
          role: null,
          initials: "U",
        };
      }
    }

    return null;
  };

  const userInfo = getUserDisplayInfo();

  const handleBackToPrompt = () => {
    setShowLogs(false);
    setBuilding(false);
  };

  const handleViewOutput = () => {
    const projectNameForUrl = buildingAppName
      ? encodeURIComponent(buildingAppName.replace(/\s+/g, "-"))
      : "default-project";
    navigate(`/project-plan/${ProjectId}/${projectNameForUrl}`);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/login");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    if (building) {
      setShowLogs(true);
    }
  }, [building, logs]);

  const handleCancelEdit = () => {
    onCancelEdit();
  };

  const handleCloseRegenerationOptions = () => {
    // This will be handled by the parent component
    // For now, we'll use a callback if needed
  };

  return (
    <div className="h-full relative overflow-y-auto overflow-x-hidden">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Header */}
      <header
        className={`sticky top-0 z-20 transition-all duration-300 ${
          scrolled ? "bg-white shadow-sm" : "bg-white"
        } border-b border-gray-200`}
      >
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lovable FloForward
              </h1>
            </div>

            {/* Login/User Section */}
            {!isAuthenticated ? (
              <Button
                variant="secondary"
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
                onClick={() => navigate("/login")}
                iconLeft={<Icon name="user" size="sm" />}
              >
                Login
              </Button>
            ) : (
              <div className="relative user-menu-container">
                <Button
                  variant="secondary"
                  className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-2"
                  onClick={toggleUserMenu}
                >
                  <Avatar
                    name={userInfo?.name || userInfo?.email || "User"}
                    size="sm"
                    className="w-6 h-6"
                  />
                  <span className="hidden sm:inline text-sm font-medium">
                    {userInfo?.name || userInfo?.email || "User"}
                  </span>
                  <Icon
                    name="chevron-down"
                    size="sm"
                    className={`transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          name={userInfo?.name || userInfo?.email || "User"}
                          size="sm"
                          className="w-10 h-10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userInfo?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userInfo?.email || "No email"}
                          </p>
                          {userInfo?.role && (
                            <Badge
                              variant="secondary"
                              size="sm"
                              className="mt-1 text-xs"
                            >
                              {userInfo.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Icon name="logout" size="sm" className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="flex flex-col items-center justify-center p-6">
          {!showLogs ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="w-full px-[4rem]">
                <div className="w-full border border-gray-200 rounded-lg p-4 sm:p-8 mt-8 shadow-lg">
                  {/* Hero Section */}
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Build Apps With Natural Language
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                      Transform your ideas into fully functional applications
                      using the power of AI. Simply describe what you want to
                      build, and watch it come to life.
                    </p>
                  </div>

                  {/* Prompt Input */}
                  <div className="space-y-6" ref={promptInputRef}>
                    {/* Edit Mode Indicator */}
                    {regenerationType === "edit" && !userStoryLoading && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Icon name="edit" size="sm" className="text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">
                            Edit Mode: Modify your prompt below to regenerate the user story
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="relative">
                      <Textarea
                        id="prompt"
                        placeholder={
                          regenerationType === "edit" && !userStoryLoading
                            ? "Describe what you want to change in your user story..."
                            : "Describe the app you want to build... (e.g., 'A task management app with drag-and-drop functionality and team collaboration features')"
                        }
                        value={regenerationType === "edit" && !userStoryLoading ? editPrompt : prompt}
                        onChange={(e) => 
                          regenerationType === "edit" && !userStoryLoading
                            ? onEditPromptChange(e.target.value)
                            : onPromptChange(e.target.value)
                        }
                        rows={6}
                        disabled={userStoryLoading}
                        className={`w-full bg-white border rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:border-transparent resize-none text-lg p-4 ${
                          regenerationType === "edit" && !userStoryLoading
                            ? "border-yellow-300 focus:ring-yellow-500" 
                            : "border-gray-300 focus:ring-gray-500"
                        } ${userStoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
                        {(regenerationType === "edit" && !userStoryLoading ? editPrompt : prompt).length}/1000
                      </div>
                    </div>

                    {/* Edit Mode Submit Button */}
                    {regenerationType === "edit" && !userStoryLoading && (
                      <div className="flex justify-center space-x-4">
                        <Button
                          onClick={onEditPromptSubmit}
                          variant="primary"
                          className="px-8 py-3 rounded-lg font-semibold text-base"
                          disabled={!editPrompt.trim()}
                          iconLeft={<Icon name="refresh" />}
                        >
                          Regenerate with New Prompt
                        </Button>
                        <Button
                          onClick={onCancelEdit}
                          variant="secondary"
                          className="px-6 py-3 rounded-lg font-semibold text-base"
                        >
                          Cancel Edit
                        </Button>
                      </div>
                    )}

                    {/* User Story Section */}
                    {showUserStory && (
                      <div className="border-t border-gray-200 pt-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Generated User Story
                          </h3>
                          {userStoryLoading ? (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                <span className="text-gray-600">
                                  Generating user story...
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="mb-4">
                                {userStory ? (
                                  <div>
                                    <MarkdownRenderer
                                      content={userStory}
                                      className="text-gray-700"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-gray-500">
                                    No user story generated yet.
                                  </span>
                                )}
                              </div>

                              {/* Edit User Story Section */}
                              <div className="space-y-3">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                                    Current Prompt
                                  </h4>
                                  <p className="text-sm text-blue-700 mb-3">
                                    {prompt}
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    Want to modify the user story? Click "Regenerate User Story" to choose how to proceed, or edit the prompt above directly.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4">
                          {userStory && !userStoryLoading && (
                            <Button
                              onClick={onProceedToBRD}
                              variant="primary"
                              className="px-8 py-3 rounded-lg font-semibold text-base"
                              iconLeft={<Icon name="arrow-right" />}
                            >
                              Generate BRD
                            </Button>
                          )}
                          {!regenerationType && (
                            <Button
                              onClick={
                                userStory ? onUserStoryEdit : onGenerateStory
                              }
                              variant="secondary"
                              className="px-8 py-3 rounded-lg font-semibold text-base"
                              disabled={!prompt.trim() || userStoryLoading}
                              loading={userStoryLoading}
                              iconLeft={
                                !userStoryLoading ? (
                                  <Icon
                                    name={userStory ? "refresh" : "arrow-right"}
                                  />
                                ) : undefined
                              }
                            >
                              {userStoryLoading
                                ? "Generating..."
                                : userStory
                                ? "Regenerate User Story"
                                : "Generate User Story"}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Original Button (only show when no user story) */}
                    {!showUserStory && (
                      <div className="flex justify-center">
                        <Button
                          onClick={onGenerateStory}
                          variant="primary"
                          className="px-12 py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!prompt.trim() || userStoryLoading}
                          loading={userStoryLoading}
                          iconLeft={
                            !userStoryLoading ? (
                              <Icon name="arrow-right" />
                            ) : undefined
                          }
                        >
                          {userStoryLoading
                            ? "Generating..."
                            : "Generate User Story"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Workspace />
            </div>
          ) : (
            <Logs
              logs={logs}
              onBackToPrompt={handleBackToPrompt}
              onViewOutput={handleViewOutput}
              streamCompleted={streamCompleted}
              setStreamingCompleted={setStreamingCompleted}
            />
          )}
        </div>
      </main>
      {/* Login Required Modal */}
      {showLoginModal && (
        <Modal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          title="Login Required"
          size="lg"
        >
          <div className="text-center p-4">
            <Icon
              name="lock"
              size="lg"
              className="mx-auto mb-4 text-blue-500"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Unlock Full Features
            </h3>
            <p className="text-gray-600 mb-6">
              To access the "Build BRD" functionality and save your projects,
              please log in.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => setShowLoginModal(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowLoginModal(false);
                  navigate("/login");
                }}
                className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-semibold"
              >
                Login Now
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Regeneration Options Modal */}
      {showRegenerationOptions && (
        <Modal
          isOpen={showRegenerationOptions}
          onClose={onCloseRegenerationOptions}
          title="Regenerate User Story"
          size="lg"
        >
          <div className="text-center p-4">
            <Icon
              name="refresh"
              size="lg"
              className="mx-auto mb-4 text-blue-500"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              How would you like to regenerate?
            </h3>
            <p className="text-gray-600 mb-6">
              Choose whether to regenerate with the same prompt or edit your requirements in the prompt input above.
            </p>
            <div className="flex flex-col space-y-3">
              <Button
                variant="primary"
                onClick={() => onRegenerationOption("same")}
                className="px-8 py-3 rounded-lg font-semibold text-base"
                iconLeft={<Icon name="refresh" />}
              >
                Regenerate with Same Prompt
              </Button>
              <Button
                variant="secondary"
                onClick={() => onRegenerationOption("edit")}
                className="px-8 py-3 rounded-lg font-semibold text-base"
                iconLeft={<Icon name="edit" />}
              >
                Edit in Prompt Input
              </Button>
              <Button
                variant="outline"
                onClick={onCloseRegenerationOptions}
                className="px-8 py-3 rounded-lg font-semibold text-base"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PromptContent;
