import React, { useState, useMemo } from 'react';
import { Input, Select, Icon, Avatar, Badge, Button } from '../../components/atoms';

const dummyProjects = [
  {
    id: 1,
    title: 'pulse-robot-template',
    category: 'Website',
    remixes: 23675,
    imageUrl: 'https://i.imgur.com/mJ8Z3d1.png',
    avatarUrl: 'https://i.imgur.com/9lJdCqI.png',
    creator: 'John'
  },
  {
    id: 2,
    title: 'cryptocurrency-trading-dashboard-with-advanced-features',
    category: 'Website',
    remixes: 14360,
    imageUrl: 'https://i.imgur.com/s21a9aE.png',
    avatarUrl: 'https://i.imgur.com/9lJdCqI.png',
    creator: 'John Doe'
  },
  {
    id: 3,
    title: 'wrlds-ai-integration',
    category: 'Website',
    remixes: 8828,
    imageUrl: 'https://i.imgur.com/aJk3pA4.png',
    avatarUrl: 'https://i.imgur.com/9lJdCqI.png',
    creator: 'Jane Smith'
  },
  {
    id: 4,
    title: 'crypto-trade-template',
    category: 'Website',
    remixes: 7913,
    imageUrl: 'https://i.imgur.com/aJk3pA4.png',
    avatarUrl: 'https://i.imgur.com/9lJdCqI.png',
    creator: 'John'
  },
];

const Workspace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('last-edited');
  const [date, setDate] = useState('newest-first');
  const [creator, setCreator] = useState('all-creators');

  const filteredProjects = useMemo(() => {
    return dummyProjects.filter(project => {
      const searchTermMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
      const creatorMatch = creator === 'all-creators' || project.creator === creator;
      return searchTermMatch && creatorMatch;
    });
  }, [searchTerm, creator]);

  return (
    <div className="text-gray-800 py-8 px-[4rem] w-full">
      <div className="mx-auto bg-white/30 backdrop-blur-lg rounded-2xl p-8 border border-white/50 shadow-lg w-full">
        <h1 className="text-3xl font-bold mb-6">Projects</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search projects..."
              className="bg-white/70 backdrop-blur-sm border-white/50 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Icon name="search" className="w-5 h-5 text-gray-400" />}
            />
            <Select 
              className="bg-white/70 backdrop-blur-sm border-white/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(value) => setSortBy(value as string)}
              options={[
                { value: 'last-edited', label: 'Last edited' },
                { value: 'created-date', label: 'Created date' },
              ]}
            />
            <Select 
              className="bg-white/70 backdrop-blur-sm border-white/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={date}
              onChange={(value) => setDate(value as string)}
              options={[
                { value: 'newest-first', label: 'Newest first' },
                { value: 'oldest-first', label: 'Oldest first' },
              ]}
            />
            <Select 
              className="bg-white/70 backdrop-blur-sm border-white/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={creator}
              onChange={(value) => setCreator(value as string)}
              options={[
                { value: 'all-creators', label: 'All creators' },
                { value: 'John', label: 'John' },
                { value: 'John Doe', label: 'John Doe' },
                { value: 'Jane Smith', label: 'Jane Smith' },
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
              <h3 className="text-lg font-medium text-gray-800">No Projects Found</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                It seems there are no projects matching your search criteria. Try adjusting your filters or create a new project.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white/50 backdrop-blur-md rounded-lg overflow-hidden group border border-white/50 shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center">
                    <Avatar
                      src={project.avatarUrl}
                      alt="avatar"
                      size="sm"
                      className="mr-3 flex-shrink-0"
                    />
                    <div className="flex-1 w-0">
                      <h3 className="text-base font-semibold truncate text-gray-900">{project.title}</h3>
                      <p className="text-gray-600 text-sm">{project.remixes.toLocaleString()} Remixes</p>
                    </div>
                    <Badge color="primary" variant="subtle" className="ml-auto flex-shrink-0">{project.category}</Badge>
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
