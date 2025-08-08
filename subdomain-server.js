#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');
const { BUILD_TARGETS } = require('./build-config');

class SubdomainServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.basePort = 3000;
    this.servers = new Map();
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Enable trust proxy for subdomain detection
    this.app.set('trust proxy', true);
    
    // Static file serving
    this.app.use(express.static('public'));
    
    // CORS for cross-origin requests
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  setupRoutes() {
    // Subdomain routing middleware
    this.app.use((req, res, next) => {
      const host = req.get('host');
      const subdomain = this.extractSubdomain(host);
      
      console.log(`📡 Request: ${host} → subdomain: ${subdomain || 'none'}`);
      
      if (subdomain && BUILD_TARGETS[subdomain]) {
        this.serveSubdomain(req, res, subdomain);
      } else {
        next();
      }
    });

    // Main landing page with build selector
    this.app.get('/', (req, res) => {
      res.send(this.generateLandingPage());
    });

    // API endpoint to list builds
    this.app.get('/api/builds', (req, res) => {
      const builds = Object.entries(BUILD_TARGETS).map(([key, target]) => ({
        key,
        name: target.name,
        subdomain: target.subdomain,
        description: target.description,
        url: `http://${target.subdomain}.localhost:${this.port}`,
        available: fs.existsSync(path.resolve(__dirname, target.outputDir))
      }));
      res.json(builds);
    });

    // Build trigger endpoint
    this.app.post('/api/build/:target', async (req, res) => {
      const targetName = req.params.target;
      if (!BUILD_TARGETS[targetName]) {
        return res.status(404).json({ error: 'Target not found' });
      }

      try {
        // Trigger build (you'd implement this)
        res.json({ success: true, message: `Building ${targetName}...` });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Fallback for undefined routes
    this.app.use((req, res) => {
      res.status(404).send(this.generate404Page());
    });
  }

  extractSubdomain(host) {
    if (!host) return null;
    
    // Remove port if present
    const hostname = host.split(':')[0];
    
    // Extract subdomain (assuming format: subdomain.domain.tld)
    const parts = hostname.split('.');
    
    if (parts.length > 2) {
      return parts[0];
    }
    
    // For localhost development (subdomain.localhost)
    if (parts.length === 2 && parts[1] === 'localhost') {
      return parts[0];
    }
    
    return null;
  }

  serveSubdomain(req, res, subdomain) {
    const target = BUILD_TARGETS[subdomain];
    const buildPath = path.resolve(__dirname, target.outputDir);
    
    // Check if build exists
    if (!fs.existsSync(buildPath)) {
      return res.status(404).send(this.generateBuildNotFoundPage(target));
    }

    // Serve the specific build
    const filePath = path.join(buildPath, req.path === '/' ? 'index.html' : req.path);
    
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        return res.sendFile(filePath);
      }
    }
    
    // Fallback to index.html for SPA routing
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    
    res.status(404).send('Build file not found');
  }

  generateLandingPage() {
    const builds = Object.entries(BUILD_TARGETS);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi-Build Component Library</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen py-12">
        <div class="max-w-6xl mx-auto px-4">
            <header class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                    🏗️ Multi-Build Component Library
                </h1>
                <p class="text-xl text-gray-600">
                    Access different builds of your component library via subdomains
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                ${builds.map(([key, target]) => `
                    <div class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        <div class="p-6">
                            <h3 class="text-xl font-semibold text-gray-900 mb-2">
                                ${target.name}
                            </h3>
                            <p class="text-gray-600 mb-4">
                                ${target.description}
                            </p>
                            <div class="space-y-2">
                                <a href="http://${target.subdomain}.localhost:${this.port}" 
                                   class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                   target="_blank">
                                    🌐 Open Build
                                </a>
                                <div class="text-sm text-gray-500">
                                    ${target.subdomain}.localhost:${this.port}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="bg-white rounded-lg shadow-sm border p-6">
                <h2 class="text-2xl font-semibold mb-4">🚀 Quick Setup</h2>
                <div class="space-y-4">
                    <div>
                        <h3 class="font-medium mb-2">1. Build all targets:</h3>
                        <code class="bg-gray-100 px-3 py-1 rounded">node multi-build.js build</code>
                    </div>
                    <div>
                        <h3 class="font-medium mb-2">2. Add to your hosts file (optional):</h3>
                        <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
${builds.map(([key, target]) => `127.0.0.1    ${target.subdomain}.localhost`).join('\n')}
                        </pre>
                    </div>
                    <div>
                        <h3 class="font-medium mb-2">3. Access via subdomains:</h3>
                        <ul class="space-y-1">
                            ${builds.map(([key, target]) => `
                                <li class="text-sm">
                                    <code class="bg-blue-100 px-2 py-1 rounded">
                                        http://${target.subdomain}.localhost:${this.port}
                                    </code>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  generateBuildNotFoundPage(target) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Build Not Found - ${target.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">🔧 Build Not Found</h1>
            <p class="text-xl text-gray-600 mb-6">
                The build for <strong>${target.name}</strong> hasn't been created yet.
            </p>
            <div class="bg-white p-6 rounded-lg shadow-sm border max-w-md mx-auto">
                <h3 class="font-semibold mb-3">To create this build:</h3>
                <code class="bg-gray-100 px-3 py-2 rounded block">
                    node multi-build.js build ${target.subdomain}
                </code>
            </div>
            <a href="http://localhost:${this.port}" 
               class="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
                ← Back to Main Page
            </a>
        </div>
    </div>
</body>
</html>`;
  }

  generate404Page() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
            <p class="text-xl text-gray-600 mb-6">
                The requested page could not be found.
            </p>
            <a href="http://localhost:${this.port}" 
               class="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
                ← Back to Main Page
            </a>
        </div>
    </div>
</body>
</html>`;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Multi-Build Server running on http://localhost:${this.port}`);
      console.log(`📋 Available subdomains:`);
      Object.entries(BUILD_TARGETS).forEach(([key, target]) => {
        console.log(`   ${target.subdomain}.localhost:${this.port} → ${target.name}`);
      });
    });
  }
}

// Start server if run directly
if (require.main === module) {
  const server = new SubdomainServer();
  server.start();
}

module.exports = SubdomainServer; 