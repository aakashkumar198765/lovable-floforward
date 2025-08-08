#!/usr/bin/env node

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const { BUILD_TARGETS, generateWebpackConfig } = require('./build-config');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class MultiBuildSystem {
  constructor() {
    this.buildsDir = path.resolve(__dirname, 'src/builds');
    this.distDir = path.resolve(__dirname, 'dist');
  }

  // Ensure builds directory exists
  ensureBuildsDirectory() {
    if (!fs.existsSync(this.buildsDir)) {
      fs.mkdirSync(this.buildsDir, { recursive: true });
      console.log(`${colors.green}✓${colors.reset} Created builds directory: ${this.buildsDir}`);
    }
  }

  // Create entry point files for each build target
  createEntryPoints() {
    this.ensureBuildsDirectory();

    Object.entries(BUILD_TARGETS).forEach(([key, target]) => {
      const entryFile = path.resolve(__dirname, target.entry);
      
      if (!fs.existsSync(entryFile)) {
        console.log(`${colors.yellow}⚡${colors.reset} Creating entry point: ${target.entry}`);
        this.generateEntryPoint(key, target, entryFile);
      }
    });
  }

  // Generate entry point file based on target type
  generateEntryPoint(key, target, filePath) {
    let content = '';

    switch (key) {
      case 'atoms':
        content = this.generateAtomsApp();
        break;
      case 'molecules':
        content = this.generateMoleculesApp();
        break;
      case 'forms':
        content = this.generateFormsApp();
        break;
      case 'templates':
        content = this.generateTemplatesApp();
        break;
      case 'sandbox':
        content = this.generateSandboxApp();
        break;
      case 'docs':
        content = this.generateDocsApp();
        break;
      default:
        content = this.generateDefaultApp(target.name);
    }

    fs.writeFileSync(filePath, content);
    console.log(`${colors.green}✓${colors.reset} Generated: ${filePath}`);
  }

  generateAtomsApp() {
    return `import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import * as Atoms from '../components/atoms';

const AtomsShowcase = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Atomic Components</h1>
          <p className="text-xl text-gray-600">
            Basic building blocks of our design system
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Avatar Examples */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Avatar</h3>
            <div className="space-y-4">
              <Atoms.Avatar name="John Doe" size="sm" />
              <Atoms.Avatar name="Jane Smith" size="md" />
              <Atoms.Avatar name="Bob Johnson" size="lg" />
            </div>
          </div>

          {/* Badge Examples */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Badges</h3>
            <div className="space-y-2">
              <Atoms.Badge variant="primary">Primary</Atoms.Badge>
              <Atoms.Badge variant="success">Success</Atoms.Badge>
              <Atoms.Badge variant="warning">Warning</Atoms.Badge>
              <Atoms.Badge variant="danger">Danger</Atoms.Badge>
            </div>
          </div>

          {/* Button Examples */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Buttons</h3>
            <div className="space-y-2">
              <Atoms.Button variant="primary">Primary</Atoms.Button>
              <Atoms.Button variant="secondary">Secondary</Atoms.Button>
              <Atoms.Button variant="outline">Outline</Atoms.Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<AtomsShowcase />);`;
  }

  generateMoleculesApp() {
    return `import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import * as Molecules from '../components/molecules';

const MoleculesShowcase = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Molecular Components</h1>
          <p className="text-xl text-gray-600">
            Combined atomic components forming functional units
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Box */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Search Box</h3>
            <Molecules.SearchBox placeholder="Search components..." />
          </div>

          {/* Metric Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Metric Card</h3>
            <Molecules.MetricCard 
              title="Total Users"
              value="1,234"
              change="+12%"
              trend="up"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<MoleculesShowcase />);`;
  }

  generateFormsApp() {
    return `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import * as Atoms from '../components/atoms';
import * as Molecules from '../components/molecules';

const FormsShowcase = () => {
  const [formData, setFormData] = useState({});

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Form Components</h1>
          <p className="text-xl text-gray-600">
            Complete collection of form inputs and controls
          </p>
        </header>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Sample Form</h3>
          
          <div className="space-y-6">
            <Atoms.InputAllTypes 
              label="Name"
              placeholder="Enter your name"
              type="text"
            />
            
            <Atoms.InputAllTypes 
              label="Email"
              placeholder="Enter your email"
              type="email"
            />
            
            <Atoms.SelectAllTypes 
              label="Role"
              options={[
                { value: 'admin', label: 'Administrator' },
                { value: 'user', label: 'User' },
                { value: 'guest', label: 'Guest' }
              ]}
            />
            
            <Atoms.TextareaAllTypes 
              label="Message"
              placeholder="Enter your message"
            />
            
            <Atoms.DatePickerAllTypes 
              label="Date"
            />
            
            <Atoms.FileUploadAllTypes 
              label="Upload File"
            />
            
            <div className="flex space-x-4">
              <Atoms.Button variant="primary">Submit</Atoms.Button>
              <Atoms.Button variant="outline">Cancel</Atoms.Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<FormsShowcase />);`;
  }

  generateTemplatesApp() {
    return `import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import * as Templates from '../components/templates';

const TemplatesShowcase = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900">Page Templates</h1>
            <p className="text-gray-600 mt-2">Complete page layouts and templates</p>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Templates.ListingPage />} />
          <Route path="/detail" element={<Templates.DetailPage />} />
          <Route path="/create" element={<Templates.CreatePage />} />
        </Routes>
      </div>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<TemplatesShowcase />);`;
  }

  generateSandboxApp() {
    return `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { componentRegistry } from '../libraryTemplate/componentRegistry';

const ComponentSandbox = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Component Sandbox</h2>
          </div>
          
          {Object.entries(componentRegistry).map(([category, categoryData]) => (
            <div key={category} className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 capitalize">{category}</h3>
              {Object.entries(categoryData).map(([subcat, subcatData]) => (
                <div key={subcat} className="ml-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">{subcat}</h4>
                  {subcatData.components.map((comp) => (
                    <button
                      key={comp.name}
                      onClick={() => {
                        setSelectedComponent(comp);
                        setSelectedVariation(0);
                      }}
                      className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 p-1"
                    >
                      {comp.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {selectedComponent ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">{selectedComponent.name}</h1>
              <p className="text-gray-600 mb-6">{selectedComponent.description}</p>
              
              {/* Variation selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Variations:</label>
                <select 
                  value={selectedVariation}
                  onChange={(e) => setSelectedVariation(Number(e.target.value))}
                  className="border rounded px-3 py-2"
                >
                  {selectedComponent.variations.map((variation, index) => (
                    <option key={index} value={index}>{variation.name}</option>
                  ))}
                </select>
              </div>

              {/* Component preview */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <selectedComponent.component {...selectedComponent.variations[selectedVariation].props} />
              </div>

              {/* Props display */}
              <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Props:</h3>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(selectedComponent.variations[selectedVariation].props, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-16">
              <h2 className="text-xl mb-2">Select a component to preview</h2>
              <p>Choose a component from the sidebar to see its variations and props</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<ComponentSandbox />);`;
  }

  generateDocsApp() {
    return `import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';

const DocsApp = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Component Library Documentation</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/getting-started" className="hover:underline">Getting Started</Link>
              <Link to="/api" className="hover:underline">API Reference</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/api" element={<APIReference />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const HomePage = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">Welcome to Our Component Library</h1>
    <p className="text-lg text-gray-600 mb-8">
      A comprehensive collection of reusable React components built with modern best practices.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-2">🧱 Atomic Design</h3>
        <p className="text-gray-600">Built following atomic design principles for maximum reusability.</p>
      </div>
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-2">🎨 Tailwind CSS</h3>
        <p className="text-gray-600">Styled with Tailwind CSS for rapid customization.</p>
      </div>
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-2">📱 Responsive</h3>
        <p className="text-gray-600">Mobile-first responsive design for all screen sizes.</p>
      </div>
    </div>
  </div>
);

const GettingStarted = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">Getting Started</h1>
    <div className="prose max-w-none">
      <h2>Installation</h2>
      <pre className="bg-gray-100 p-4 rounded">npm install reusable-components</pre>
      
      <h2>Usage</h2>
      <pre className="bg-gray-100 p-4 rounded">
{\`import { Button, Avatar } from 'reusable-components';

function MyApp() {
  return (
    <div>
      <Avatar name="John Doe" />
      <Button variant="primary">Click me</Button>
    </div>
  );
}\`}
      </pre>
    </div>
  </div>
);

const APIReference = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">API Reference</h1>
    <p className="text-gray-600">Detailed API documentation for all components.</p>
  </div>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<DocsApp />);`;
  }

  generateDefaultApp(name) {
    return `import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const ${name.replace(/\s+/g, '')}App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">${name}</h1>
        <p className="text-xl text-gray-600">
          This is a custom build for ${name.toLowerCase()}
        </p>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<${name.replace(/\s+/g, '')}App />);`;
  }

  // Build specific target
  async buildTarget(targetName) {
    const target = BUILD_TARGETS[targetName];
    if (!target) {
      console.error(`${colors.red}✗${colors.reset} Target "${targetName}" not found`);
      return false;
    }

    console.log(`${colors.blue}🔨${colors.reset} Building ${target.name}...`);

    const config = generateWebpackConfig(target);
    
    return new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
          console.error(`${colors.red}✗${colors.reset} Build failed for ${target.name}`);
          if (err) console.error(err);
          if (stats.hasErrors()) {
            stats.compilation.errors.forEach(error => console.error(error));
          }
          reject(false);
        } else {
          console.log(`${colors.green}✓${colors.reset} Successfully built ${target.name} → ${target.outputDir}`);
          resolve(true);
        }
      });
    });
  }

  // Build all targets
  async buildAll() {
    console.log(`${colors.bright}${colors.magenta}🚀 Starting multi-build process...${colors.reset}\n`);
    
    this.createEntryPoints();
    
    const targetNames = Object.keys(BUILD_TARGETS);
    let successCount = 0;

    for (const targetName of targetNames) {
      try {
        const success = await this.buildTarget(targetName);
        if (success) successCount++;
      } catch (error) {
        console.error(`Error building ${targetName}:`, error);
      }
    }

    console.log(`\n${colors.bright}${colors.green}🎉 Build Summary:${colors.reset}`);
    console.log(`${colors.green}✓${colors.reset} Successfully built: ${successCount}/${targetNames.length} targets`);
    
    if (successCount === targetNames.length) {
      console.log(`${colors.cyan}📂${colors.reset} All builds available in: ./dist/`);
      this.listBuilds();
    }
  }

  // List available builds
  listBuilds() {
    console.log(`\n${colors.bright}${colors.cyan}📋 Available Builds:${colors.reset}`);
    Object.entries(BUILD_TARGETS).forEach(([key, target]) => {
      console.log(`  ${colors.yellow}${target.subdomain}${colors.reset} → ${target.outputDir} (${target.description})`);
    });
  }
}

// CLI Interface
const args = process.argv.slice(2);
const command = args[0];
const targetName = args[1];

const buildSystem = new MultiBuildSystem();

switch (command) {
  case 'build':
    if (targetName) {
      buildSystem.buildTarget(targetName);
    } else {
      buildSystem.buildAll();
    }
    break;
  
  case 'list':
    buildSystem.listBuilds();
    break;
    
  case 'create-entries':
    buildSystem.createEntryPoints();
    break;
    
  default:
    console.log(`${colors.bright}Multi-Build System${colors.reset}`);
    console.log('Usage:');
    console.log('  node multi-build.js build [target]  - Build specific target or all');
    console.log('  node multi-build.js list            - List all build targets');
    console.log('  node multi-build.js create-entries  - Create entry point files');
    break;
} 