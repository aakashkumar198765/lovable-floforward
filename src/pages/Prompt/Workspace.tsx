import React, { useState, useMemo, useEffect } from "react";
import {
  Input,
  Select,
  Icon,
  Avatar,
  Badge,
  Button,
} from "../../components/atoms";
import { getSession } from "../../services/paramai_browsersdk";
import { useNavigate } from "react-router-dom";

// User Story Mind ID (from the Prompt component)
const USER_STORY_MIND_ID = "033e0168-bc64-4833-bc22-bd3e3992501a";

const dummyProjects = [
  {
    id: 1,
    title: "pulse-robot-template",
    category: "Website",
    remixes: 23675,
    imageUrl: "https://i.imgur.com/mJ8Z3d1.png",
    avatarUrl: "https://i.imgur.com/9lJdCqI.png",
    creator: "John",
  },
  {
    id: 2,
    title: "cryptocurrency-trading-dashboard-with-advanced-features",
    category: "Website",
    remixes: 14360,
    imageUrl: "https://i.imgur.com/s21a9aE.png",
    avatarUrl: "https://i.imgur.com/9lJdCqI.png",
    creator: "John Doe",
  },
  {
    id: 3,
    title: "wrlds-ai-integration",
    category: "Website",
    remixes: 8828,
    imageUrl: "https://i.imgur.com/aJk3pA4.png",
    avatarUrl: "https://i.imgur.com/9lJdCqI.png",
    creator: "Jane Smith",
  },
  {
    id: 4,
    title: "crypto-trade-template",
    category: "Website",
    remixes: 7913,
    imageUrl: "https://i.imgur.com/aJk3pA4.png",
    avatarUrl: "https://i.imgur.com/aJk3pA4.png",
    creator: "John",
  },
];

// Generate simple fallback for project images
const ProjectImageFallback = ({
  projectName,
  index,
}: {
  projectName: string;
  index: number;
}) => {
  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center relative overflow-hidden"></div>
  );
};

const Workspace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState("newest-first");
  const [creator, setCreator] = useState("all-creators");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [userStories, setUserStories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"projects" | "userStories">("userStories");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch BRD projects (from default mind)
        const brdSessions = await getSession();
        setProjects(brdSessions?.response || []);

        // Fetch User Stories (from user story mind)
        const userStorySessions = await getSession(USER_STORY_MIND_ID);
        setUserStories(userStorySessions?.response || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProjectClick = (project: any) => {
    navigate(`/project-plan/${project?.name}/${project?.name}`);
  };

  const handleUserStoryClick = (userStory: any) => {
    // Navigate to prompt with session ID and mind name for loading existing user story
    const sessionId = userStory?.session_id || userStory?._id;
    const mindName = userStory?.name || "";
    
    if (sessionId) {
      navigate(`/prompt?story=${sessionId}&mind=${encodeURIComponent(mindName)}`);
    } else {
      console.error("No session ID found for user story:", userStory);
    }
  };

  const getFilteredData = useMemo(() => {
    const data = activeTab === "projects" ? projects : userStories;
    
    let filtered = data.filter((item) => {
      const name = item?.name || "";
      const searchMatch = name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === "projects") {
        // Filter BRD projects by "P_" prefix
        return name.startsWith("P_") && searchMatch;
      } else {
        // Filter User Stories - show ONLY stories starting with "US_"
        return name.startsWith("US_") && searchMatch;
      }
    });

    // Sort by created_at date (newest first by default)
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      if (date === "oldest-first") {
        return dateA - dateB; // oldest first
      } else {
        return dateB - dateA; // newest first (default)
      }
    });

    return filtered;
  }, [activeTab, searchTerm, creator, projects, userStories, date]);

  return (
    <div className="text-gray-800 py-8 px-[4rem] w-full">
      <div className="mx-auto shadow-lg rounded-lg p-6 border border-gray-200 w-full">
        <h1 className="text-2xl font-bold mb-4">Workspace</h1>

        {/* Modern Pill Tab System */}
        <div className="mb-4">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab("userStories")}
                className={`relative px-6 py-3 font-medium text-sm transition-all duration-300 ease-in-out ${
                  activeTab === "userStories"
                    ? "text-purple-700 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeTab === "userStories" 
                      ? "bg-purple-100 text-purple-600" 
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  }`}>
                    <Icon name="file" size="sm" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">User Stories</span>
                    <span className="text-xs text-gray-500 font-normal">
                      Requirements & Features
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === "userStories"
                      ? "bg-purple-200 text-purple-700"
                      : "bg-gray-200 text-purple-600"
                  }`}>
                    {userStories.filter((us: any) => us?.name?.startsWith("US_")).length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("projects")}
                className={`relative px-6 py-3 font-medium text-sm transition-all duration-300 ease-in-out ${
                  activeTab === "projects"
                    ? "text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeTab === "projects" 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  }`}>
                    <Icon name="package" size="sm" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">BRD Projects</span>
                    <span className="text-xs text-gray-500 font-normal">
                      Business Requirements
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === "projects"
                      ? "bg-blue-200 text-blue-700"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {projects.filter(p => p?.name?.startsWith("P_")).length}
                  </span>
                </div>
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>User Stories</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>BRD Projects</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Search and Filter Controls */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">Search & Filters</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {getFilteredData.length} of {
                  activeTab === "projects" 
                    ? projects.filter((p: any) => p?.name?.startsWith("P_")).length
                    : userStories.filter((us: any) => us?.name?.startsWith("US_")).length
                } items
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="search" className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder={
                      activeTab === "projects" 
                        ? "Search BRD projects..." 
                        : "Search user stories..."
                    }
                    className="pl-9 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Sort:</label>
                  <Select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={date}
                    onChange={(value) => setDate(value as string)}
                    options={[
                      { value: "newest-first", label: "Newest first" },
                      { value: "oldest-first", label: "Oldest first" },
                    ]}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Creator:</label>
                  <Select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={creator}
                    onChange={(value) => setCreator(value as string)}
                    options={[
                      { value: "all-creators", label: "All creators" },
                      { value: "self", label: "Self" },
                    ]}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                onClick={() => {
                  setLoading(true);
                  // Refetch data
                  const fetchData = async () => {
                    try {
                      const brdSessions = await getSession();
                      setProjects(brdSessions?.response || []);
                      const userStorySessions = await getSession(USER_STORY_MIND_ID);
                      setUserStories(userStorySessions?.response || []);
                    } catch (error) {
                      console.error("Error refreshing data:", error);
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchData();
                }}
                variant="secondary"
                className="px-3 py-2 text-sm font-medium border border-gray-300 hover:border-gray-400 transition-all duration-200"
                disabled={loading}
                iconLeft={<Icon name="refresh" size="sm" />}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              {
                searchTerm && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setDate("newest-first");
                    setCreator("all-creators");
                  }}
                  variant="outline"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-200"
                  iconLeft={<Icon name="x" size="sm" />}
                >
                  Clear
                </Button>   
                )
              }
            </div>
          </div>
        </div>

        {getFilteredData.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                activeTab === "projects" ? "bg-blue-100" : "bg-purple-100"
              }`}>
                <Icon 
                  name={activeTab === "projects" ? "package" : "file"} 
                  size="lg" 
                  className={activeTab === "projects" ? "text-blue-600" : "text-purple-600"} 
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === "projects" ? "No BRD Projects Found" : "No User Stories Found"}
              </h3>
              <p className="text-gray-600 mb-4 max-w-md text-sm">
                {activeTab === "projects" 
                  ? "It seems there are no BRD projects matching your search criteria. Try adjusting your filters or create a new project."
                  : "It seems there are no user stories matching your search criteria. Try adjusting your filters or generate a new user story."
                }
              </p>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setDate("newest-first");
                    setCreator("all-creators");
                  }}
                  variant="secondary"
                  className="px-3 py-2 text-sm"
                  iconLeft={<Icon name="refresh" size="sm" />}
                >
                  Clear Filters
                </Button>
                <Button
                  onClick={() => navigate("/prompt")}
                  variant="primary"
                  className="px-3 py-2 text-sm"
                  iconLeft={<Icon name="plus" size="sm" />}
                >
                  {activeTab === "projects" ? "Create New Project" : "Generate New Story"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Compact Loading State */}
            {loading && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center mb-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-10 h-10 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <div className="mt-3 text-gray-600">
                    <div className="text-base font-medium">
                      Loading {activeTab === "projects" ? "BRD projects" : "user stories"}...
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Please wait while we fetch the latest data
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Compact Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getFilteredData.map((item, index) => (
                <div
                  key={item._id}
                  className="relative group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => {
                    if (activeTab === "projects") {
                      handleProjectClick(item);
                    } else {
                      handleUserStoryClick(item);
                    }
                  }}
                >
                  {/* Compact Card Header with Icon */}
                  <div className="p-3 pb-2 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeTab === "projects" 
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-purple-100 text-purple-600"
                      }`}>
                        <Icon 
                          name={activeTab === "projects" ? "package" : "file"} 
                          size="sm" 
                        />
                      </div>
                      <Badge
                        color={activeTab === "projects" ? "primary" : "secondary"}
                        variant="subtle"
                        className="text-xs font-medium"
                      >
                        {activeTab === "projects" ? "BRD" : "User Story"}
                      </Badge>
                    </div>
                  </div>

                  {/* Compact Card Content */}
                  <div className="p-3">
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate group-hover:text-blue-600 transition-colors duration-200">
                        {item?.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item?.created_at ? new Date(item.created_at).toLocaleDateString() : 'No date'}
                      </p>
                    </div>

                    {/* Compact Card Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icon name="user" size="xs" className="text-gray-500" />
                        </div>
                        <span className="text-xs text-gray-600">
                          {item?.creator || 'Unknown'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Icon name="clock" size="xs" />
                        <span>
                          {item?.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Workspace;
