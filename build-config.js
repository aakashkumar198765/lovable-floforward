// Multi-Build Configuration for Dynamic Component Serving
const path = require('path');

// Define your build targets - each will get its own subdomain
const BUILD_TARGETS = {
  // Main component library showcase
  showcase: {
    name: 'Component Showcase',
    entry: './src/index.tsx',
    subdomain: 'showcase',
    port: 3000,
    description: 'Full component library showcase',
    outputDir: 'dist/showcase'
  },
  
  // Individual component categories
  atoms: {
    name: 'Atomic Components',
    entry: './src/builds/atoms-app.tsx', // We'll create this
    subdomain: 'atoms',
    port: 3001,
    description: 'Atomic design components only',
    outputDir: 'dist/atoms'
  },
  
  molecules: {
    name: 'Molecular Components',
    entry: './src/builds/molecules-app.tsx',
    subdomain: 'molecules', 
    port: 3002,
    description: 'Molecular design components',
    outputDir: 'dist/molecules'
  },
  
  forms: {
    name: 'Form Components',
    entry: './src/builds/forms-app.tsx',
    subdomain: 'forms',
    port: 3003,
    description: 'All form-related components',
    outputDir: 'dist/forms'
  },
  
  templates: {
    name: 'Page Templates',
    entry: './src/builds/templates-app.tsx',
    subdomain: 'templates',
    port: 3004,
    description: 'Complete page templates',
    outputDir: 'dist/templates'
  },
  
  // Sandbox for testing individual components
  sandbox: {
    name: 'Component Sandbox',
    entry: './src/builds/sandbox-app.tsx',
    subdomain: 'sandbox',
    port: 3005,
    description: 'Interactive component testing environment',
    outputDir: 'dist/sandbox'
  },
  
  // Documentation
  docs: {
    name: 'Documentation',
    entry: './src/builds/docs-app.tsx',
    subdomain: 'docs',
    port: 3006,
    description: 'Component documentation and guides',
    outputDir: 'dist/docs'
  }
};

// Generate webpack configs for each build target
function generateWebpackConfig(target) {
  return {
    entry: target.entry,
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, target.outputDir),
      publicPath: './',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new (require('clean-webpack-plugin')).CleanWebpackPlugin(),
      new (require('html-webpack-plugin'))({
        template: './public/index.html',
        filename: 'index.html',
        title: target.name
      })
    ],
    mode: 'production'
  };
}

module.exports = {
  BUILD_TARGETS,
  generateWebpackConfig,
  
  // Helper functions
  getAllTargets: () => Object.keys(BUILD_TARGETS),
  getTargetBySubdomain: (subdomain) => BUILD_TARGETS[subdomain],
  getTargetConfig: (targetName) => BUILD_TARGETS[targetName]
}; 