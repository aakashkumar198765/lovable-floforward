import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Textarea, Button, Badge, Icon, Avatar } from "../../components/atoms";
import { useAuth } from "../../contexts/AuthContext";
import { RootState } from "../../store";
import Logs from "./Logs";
import Workspace from "./Workspace";

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
  setBuilding?: (value: boolean) => void;
  logs: LogEntry[];
  streamCompleted?: boolean;
};

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
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  // Get user data from Redux store for detailed user information
  const user = useSelector((state: RootState) => state.auth?.user);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Fallback user info when Redux user is not available
  const getUserDisplayInfo = () => {
    if (user) {
      return {
        name: user.name,
        email: user.email,
        role: user.role,
        initials: user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || user.email?.[0]?.toUpperCase()
      };
    }
    
    // Fallback: try to get info from localStorage if authenticated
    if (isAuthenticated) {
      const userEmail = localStorage.getItem('userEmail');
      const authToken = localStorage.getItem('authToken');
      
      if (userEmail) {
        const name = userEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return {
          name,
          email: userEmail,
          role: null,
          initials: name.split(' ').map(n => n[0]).join('').toUpperCase()
        };
      } else if (authToken) {
        return {
          name: 'User',
          email: 'user@example.com',
          role: null,
          initials: 'U'
        };
      }
    }
    
    return null;
  };

  const userInfo = getUserDisplayInfo();

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
    setIsCompleted(false);
    setBuilding(false);
  };

  const handleViewOutput = () => {
    console.log("View output clicked - navigating to project plan");
    // Generate project ID in format P_DDMMYYYY_HHMM
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const projectId = `P_${day}${month}${year}_${hours}${minutes}`;
    
    const projectNameForUrl = buildingAppName ? encodeURIComponent(buildingAppName.replace(/\s+/g, '-')) : 'default-project';
    navigate(`/project-plan/${projectId}/${projectNameForUrl}`);
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
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
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
    if (logs.some((log) => log.status.toLowerCase() === "completed")) {
      setIsCompleted(true);
    }
  }, [building, logs]);

  return (
    <div className="h-full relative overflow-y-auto overflow-x-hidden">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Header */}
      <header
        className={`sticky top-0 z-20 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-md"
            : "bg-white/0 backdrop-blur-none shadow-none"
        } border-b border-gray-200 backdrop-blur-[2px]`}
      >
        <div className="bg-white/70 mx-auto px-6 py-4">
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
              <h1 className="text-2xl font-bold text-gray-800">
                Lovable FloForward
              </h1>
            </div>

            {/* Login/User Section */}
            {!isAuthenticated ? (
              <Button
                variant="secondary"
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-all duration-300 hover:scale-105 shadow-sm"
                onClick={() => navigate("/login")}
                iconLeft={<Icon name="user" size="sm" />}
              >
                Login
              </Button>
            ) : (
              <div className="relative user-menu-container">
                <Button
                  variant="secondary"
                  className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-all duration-300 hover:scale-105 shadow-sm flex items-center space-x-2"
                  onClick={toggleUserMenu}
                >
                  <Avatar 
                    name={userInfo?.name || userInfo?.email || 'User'} 
                    size="sm" 
                    className="w-6 h-6"
                  />
                  <span className="hidden sm:inline text-sm font-medium">
                    {userInfo?.name || userInfo?.email || 'User'}
                  </span>
                  <Icon name="chevron-down" size="sm" className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </Button>
                
                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          name={userInfo?.name || userInfo?.email || 'User'} 
                          size="sm"
                          className="w-10 h-10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userInfo?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userInfo?.email || 'No email'}
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
              <div className="w-full flex justify-center">
                <div className="max-w-4xl bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl p-4 sm:p-8 shadow-lg mt-8">
                  {/* Hero Section */}
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                      Build Apps With Natural Language
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                      Transform your ideas into fully functional applications
                      using the power of AI. Simply describe what you want to
                      build, and watch it come to life.
                    </p>
                  </div>

                  {/* Prompt Input */}
                  <div className="space-y-6">
                    <div className="relative">
                      <Textarea
                        id="prompt"
                        placeholder="Describe the app you want to build... (e.g., 'A task management app with drag-and-drop functionality and team collaboration features')"
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        rows={6}
                        className="w-full bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg p-4 shadow-inner"
                      />
                      <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
                        {prompt.length}/1000
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={onSubmit}
                        variant="primary"
                        className="bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!prompt.trim() || building}
                        loading={building}
                        iconLeft={
                          !building ? <Icon name="arrow-right" /> : undefined
                        }
                      >
                        {building ? "Building..." : "Build BRD"}
                      </Button>
                    </div>
                    <div className="text-center mb-4">
                      <button
                        onClick={() => {
                          // Generate project ID in format P_DDMMYYYY_HHMM
                          const now = new Date();
                          const day = String(now.getDate()).padStart(2, '0');
                          const month = String(now.getMonth() + 1).padStart(2, '0');
                          const year = now.getFullYear();
                          const hours = String(now.getHours()).padStart(2, '0');
                          const minutes = String(now.getMinutes()).padStart(2, '0');
                          const projectId = `P_${day}${month}${year}_${hours}${minutes}`;
                          
                          const projectNameForUrl = buildingAppName ? encodeURIComponent(buildingAppName.replace(/\s+/g, '-')) : 'default-project';
                          navigate(`/project-plan/${projectId}/${projectNameForUrl}`);
                        }}
                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                      >
                        → Go to Project Plan
                      </button>
                    </div>
                  </div>
                </div>
                {/* Features Grid */}
                {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">...</div> */}
              </div>
              <Workspace />
            </div>
          ) : (
            <Logs
              logs={logs}
              onBackToPrompt={handleBackToPrompt}
              onViewOutput={handleViewOutput}
              streamCompleted={streamCompleted}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default PromptContent;