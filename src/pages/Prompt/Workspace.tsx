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
    avatarUrl: "https://i.imgur.com/9lJdCqI.png",
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const Projects = await getSession();
        setProjects(Projects?.response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectClick = (project: any) => {
    navigate(`/project-plan/${project?.name}/${project?.name}`);
  };

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(
      (project) =>
        project?.name?.startsWith("P_") &&
        project?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
  }, [searchTerm, creator, projects, date]);

  return (
    <div className="text-gray-800 py-8 px-[4rem] w-full">
      <div className="mx-auto shadow-lg rounded-lg p-8 border border-gray-200 w-full">
        <h1 className="text-3xl font-bold mb-6">Projects</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search projects..."
              className="bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <Icon name="search" className="w-5 h-5 text-gray-400" />
              }
            />
            <Select
              className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={date}
              onChange={(value) => setDate(value as string)}
              options={[
                { value: "newest-first", label: "Newest first" },
                { value: "oldest-first", label: "Oldest first" },
              ]}
            />
            <Select
              className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={creator}
              onChange={(value) => setCreator(value as string)}
              options={[
                { value: "all-creators", label: "All creators" },
                { value: "self", label: "Self" },
              ]}
            />
          </div>
          {/* <a href="#" className="text-gray-600 hover:text-gray-900">
            View All
          </a> */}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 border-t border-gray-200">
            <div className="flex flex-col items-center">
              <Icon name="package" size="lg" className="text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800">
                No Projects Found
              </h3>
              <p className="text-gray-500 mt-2 max-w-md">
                It seems there are no projects matching your search criteria.
                Try adjusting your filters or create a new project.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project._id}
                className="bg-white rounded-lg overflow-hidden group border border-gray-200 hover:shadow-md transition-shadow duration-300"
                onClick={() => handleProjectClick(project)}
              >
                <div className="relative h-48 overflow-hidden">
                  <ProjectImageFallback
                    projectName={project?.name || "Project"}
                    index={index}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon name="package" className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 w-0">
                      <h3 className="text-base font-semibold truncate text-gray-900">
                        {project?.name}
                      </h3>
                      {/* <p className="text-gray-600 text-sm">{project.remixes.toLocaleString()} Remixes</p> */}
                    </div>
                    <Badge
                      color="primary"
                      variant="subtle"
                      className="ml-auto flex-shrink-0"
                    >
                      {"website"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
