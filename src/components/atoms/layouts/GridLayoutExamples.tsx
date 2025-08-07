import React from 'react';
import GridLayout from './GridLayout';

/**
 * GridLayout Examples Component
 * Demonstrates various use cases and configurations of the GridLayout component
 */
const GridLayoutExamples = () => {
  // Sample content for demonstrations
  const SampleBox = ({ children, color = 'bg-blue-100', className = '' }: { children: React.ReactNode; color?: string; className?: string }) => (
    <div className={`${color} border border-blue-300 p-4 rounded-md text-center font-medium ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">GridLayout Examples</h1>

      {/* Basic 3-Column Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Basic 3-Column Grid</h2>
        <GridLayout 
          cols={3} 
          gap="md" 
          background="gray" 
          padding="lg" 
          rounded="lg"
          border="default"
        >
          <SampleBox>Item 1</SampleBox>
          <SampleBox>Item 2</SampleBox>
          <SampleBox>Item 3</SampleBox>
          <SampleBox>Item 4</SampleBox>
          <SampleBox>Item 5</SampleBox>
          <SampleBox>Item 6</SampleBox>
        </GridLayout>
      </section>

      {/* 2x3 Grid with Specific Rows */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">2x3 Grid Layout</h2>
        <GridLayout 
          cols={3} 
          rows={2}
          gap="lg" 
          background="white" 
          padding="lg" 
          rounded="lg"
          border="default"
          shadow="md"
        >
          <SampleBox color="bg-green-100">Row 1, Col 1</SampleBox>
          <SampleBox color="bg-green-100">Row 1, Col 2</SampleBox>
          <SampleBox color="bg-green-100">Row 1, Col 3</SampleBox>
          <SampleBox color="bg-blue-100">Row 2, Col 1</SampleBox>
          <SampleBox color="bg-blue-100">Row 2, Col 2</SampleBox>
          <SampleBox color="bg-blue-100">Row 2, Col 3</SampleBox>
        </GridLayout>
      </section>

      {/* Responsive Grid (12-column system) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">12-Column Responsive Grid</h2>
        <GridLayout 
          cols={12} 
          gap="sm" 
          background="primary" 
          padding="lg" 
          rounded="lg"
        >
          <SampleBox color="bg-white" className="col-span-12">Full Width Header</SampleBox>
          <SampleBox color="bg-white" className="col-span-8">Main Content (8/12)</SampleBox>
          <SampleBox color="bg-white" className="col-span-4">Sidebar (4/12)</SampleBox>
          <SampleBox color="bg-white" className="col-span-6">Half Width 1</SampleBox>
          <SampleBox color="bg-white" className="col-span-6">Half Width 2</SampleBox>
          <SampleBox color="bg-white" className="col-span-12">Full Width Footer</SampleBox>
        </GridLayout>
      </section>

      {/* Auto-fit Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Auto-fit Grid</h2>
        <GridLayout 
          cols="repeat(auto-fit, minmax(200px, 1fr))"
          gap="md"
          background="secondary" 
          padding="lg" 
          rounded="lg"
          border="dashed"
        >
          <SampleBox color="bg-yellow-100">Auto Item 1</SampleBox>
          <SampleBox color="bg-yellow-100">Auto Item 2</SampleBox>
          <SampleBox color="bg-yellow-100">Auto Item 3</SampleBox>
          <SampleBox color="bg-yellow-100">Auto Item 4</SampleBox>
        </GridLayout>
      </section>

      {/* Different Gap Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Different Gap Sizes</h2>
        <div className="space-y-4">
          <GridLayout cols={4} gap="xs" background="gray" padding="md" rounded="md">
            <SampleBox color="bg-red-100">XS Gap</SampleBox>
            <SampleBox color="bg-red-100">XS Gap</SampleBox>
            <SampleBox color="bg-red-100">XS Gap</SampleBox>
            <SampleBox color="bg-red-100">XS Gap</SampleBox>
          </GridLayout>
          <GridLayout cols={4} gapX="lg" gapY="sm" background="gray" padding="md" rounded="md">
            <SampleBox color="bg-orange-100">Custom X/Y Gap</SampleBox>
            <SampleBox color="bg-orange-100">Custom X/Y Gap</SampleBox>
            <SampleBox color="bg-orange-100">Custom X/Y Gap</SampleBox>
            <SampleBox color="bg-orange-100">Custom X/Y Gap</SampleBox>
          </GridLayout>
        </div>
      </section>

      {/* Grid Flow */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Grid Flow Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Row Flow (Default)</h3>
            <GridLayout 
              cols={3} 
              rows={2}
              flow="row"
              gap="md" 
              background="white" 
              padding="md" 
              rounded="md"
              border="default"
            >
              <SampleBox color="bg-purple-100">1</SampleBox>
              <SampleBox color="bg-purple-100">2</SampleBox>
              <SampleBox color="bg-purple-100">3</SampleBox>
              <SampleBox color="bg-purple-100">4</SampleBox>
              <SampleBox color="bg-purple-100">5</SampleBox>
            </GridLayout>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Column Flow</h3>
            <GridLayout 
              cols={3} 
              rows={2}
              flow="col"
              gap="md" 
              background="white" 
              padding="md" 
              rounded="md"
              border="default"
            >
              <SampleBox color="bg-indigo-100">1</SampleBox>
              <SampleBox color="bg-indigo-100">2</SampleBox>
              <SampleBox color="bg-indigo-100">3</SampleBox>
              <SampleBox color="bg-indigo-100">4</SampleBox>
              <SampleBox color="bg-indigo-100">5</SampleBox>
            </GridLayout>
          </div>
        </div>
      </section>

      {/* Alignment Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Grid Alignment</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Center Alignment</h3>
            <GridLayout 
              cols={3} 
              gap="md"
              justifyItems="center"
              alignItems="center"
              background="gray" 
              padding="lg" 
              rounded="lg"
              style={{ minHeight: '200px' }}
            >
              <SampleBox color="bg-pink-100">Center 1</SampleBox>
              <SampleBox color="bg-pink-100">Center 2</SampleBox>
              <SampleBox color="bg-pink-100">Center 3</SampleBox>
            </GridLayout>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Stretch Alignment</h3>
            <GridLayout 
              cols={2} 
              gap="md"
              justifyItems="stretch"
              alignItems="stretch"
              background="white" 
              padding="lg" 
              rounded="lg"
              border="default"
              style={{ minHeight: '150px' }}
            >
              <SampleBox color="bg-teal-100">Stretch 1</SampleBox>
              <SampleBox color="bg-teal-100">Stretch 2</SampleBox>
            </GridLayout>
          </div>
        </div>
      </section>

      {/* Card Grid Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Card Grid Example</h2>
        <GridLayout 
          cols="repeat(auto-fit, minmax(280px, 1fr))"
          gap="xl"
          background="white" 
          padding="xl" 
          rounded="xl"
          shadow="lg"
          border="default"
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl">
                {item}
              </div>
              <h3 className="text-lg font-semibold mb-2">Feature {item}</h3>
              <p className="text-gray-600 mb-4">This is a sample feature card that demonstrates how GridLayout can create beautiful, responsive layouts.</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full">
                Learn More
              </button>
            </div>
          ))}
        </GridLayout>
      </section>

      {/* Dashboard Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard Layout Example</h2>
        <GridLayout 
          cols={12}
          rows={4} 
          gap="lg"
          background="gray" 
          padding="lg" 
          rounded="lg"
        >
          <div className="col-span-12 bg-white rounded-lg shadow p-6 border">
            <h3 className="text-xl font-semibold">Dashboard Header</h3>
            <p className="text-gray-600">Welcome back! Here's what's happening.</p>
          </div>
          
          <div className="col-span-3 bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-900">Total Users</h4>
            <p className="text-2xl font-bold text-blue-600">12,489</p>
          </div>
          
          <div className="col-span-3 bg-green-50 rounded-lg shadow p-6 border border-green-200">
            <h4 className="font-semibold text-green-900">Revenue</h4>
            <p className="text-2xl font-bold text-green-600">$45,210</p>
          </div>
          
          <div className="col-span-3 bg-purple-50 rounded-lg shadow p-6 border border-purple-200">
            <h4 className="font-semibold text-purple-900">Orders</h4>
            <p className="text-2xl font-bold text-purple-600">1,247</p>
          </div>
          
          <div className="col-span-3 bg-orange-50 rounded-lg shadow p-6 border border-orange-200">
            <h4 className="font-semibold text-orange-900">Growth</h4>
            <p className="text-2xl font-bold text-orange-600">+23%</p>
          </div>
          
          <div className="col-span-8 bg-white rounded-lg shadow p-6 border">
            <h4 className="font-semibold mb-4">Analytics Chart</h4>
            <div className="bg-gray-100 rounded h-48 flex items-center justify-center text-gray-500">
              Chart Placeholder
            </div>
          </div>
          
          <div className="col-span-4 bg-white rounded-lg shadow p-6 border">
            <h4 className="font-semibold mb-4">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">User registered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Payment received</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Order completed</span>
              </div>
            </div>
          </div>
        </GridLayout>
      </section>
    </div>
  );
};

export default GridLayoutExamples;