import React from 'react';
import FlexLayout from './FlexLayout';

/**
 * FlexLayout Examples Component
 * Demonstrates various use cases and configurations of the FlexLayout component
 */
const FlexLayoutExamples = () => {
  // Sample content for demonstrations
  const SampleBox = ({ children, color = 'bg-blue-100' }: { children: React.ReactNode; color?: string }) => (
    <div className={`${color} border border-blue-300 p-4 rounded-md text-center font-medium`}>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">FlexLayout Examples</h1>

      {/* Basic Row Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Basic Row Layout</h2>
        <FlexLayout 
          direction="row" 
          gap="md" 
          background="gray" 
          padding="lg" 
          rounded="lg"
          border="default"
        >
          <SampleBox>Item 1</SampleBox>
          <SampleBox>Item 2</SampleBox>
          <SampleBox>Item 3</SampleBox>
        </FlexLayout>
      </section>

      {/* Column Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Column Layout</h2>
        <FlexLayout 
          direction="col" 
          gap="sm" 
          background="white" 
          padding="lg" 
          rounded="lg"
          border="default"
          shadow="md"
        >
          <SampleBox color="bg-green-100">Item A</SampleBox>
          <SampleBox color="bg-green-100">Item B</SampleBox>
          <SampleBox color="bg-green-100">Item C</SampleBox>
        </FlexLayout>
      </section>

      {/* Center Alignment */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Center Alignment</h2>
        <FlexLayout 
          direction="row" 
          justify="center" 
          align="center"
          gap="lg"
          background="primary" 
          padding="xl" 
          rounded="xl"
          fullHeight={false}
          style={{ minHeight: '200px' }}
        >
          <SampleBox color="bg-white">Centered Item 1</SampleBox>
          <SampleBox color="bg-white">Centered Item 2</SampleBox>
        </FlexLayout>
      </section>

      {/* Space Between */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Space Between</h2>
        <FlexLayout 
          direction="row" 
          justify="between" 
          align="center"
          background="secondary" 
          padding="lg" 
          rounded="lg"
          border="dashed"
        >
          <SampleBox color="bg-yellow-100">Left</SampleBox>
          <SampleBox color="bg-yellow-100">Center</SampleBox>
          <SampleBox color="bg-yellow-100">Right</SampleBox>
        </FlexLayout>
      </section>

      {/* Wrap Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Wrap Layout</h2>
        <FlexLayout 
          direction="row" 
          wrap="wrap"
          justify="start" 
          gap="md"
          background="gray" 
          padding="lg" 
          rounded="lg"
        >
          <SampleBox color="bg-purple-100">Item 1</SampleBox>
          <SampleBox color="bg-purple-100">Item 2</SampleBox>
          <SampleBox color="bg-purple-100">Item 3</SampleBox>
          <SampleBox color="bg-purple-100">Item 4</SampleBox>
          <SampleBox color="bg-purple-100">Item 5</SampleBox>
          <SampleBox color="bg-purple-100">Item 6</SampleBox>
        </FlexLayout>
      </section>

      {/* Inline Flex */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Inline Flex</h2>
        <div className="space-x-4">
          <FlexLayout 
            inline
            direction="row" 
            gap="sm"
            background="white" 
            padding="md" 
            rounded="md"
            border="default"
          >
            <SampleBox color="bg-pink-100">Inline 1</SampleBox>
            <SampleBox color="bg-pink-100">Inline 2</SampleBox>
          </FlexLayout>
          <FlexLayout 
            inline
            direction="row" 
            gap="sm"
            background="white" 
            padding="md" 
            rounded="md"
            border="default"
          >
            <SampleBox color="bg-indigo-100">Inline 3</SampleBox>
            <SampleBox color="bg-indigo-100">Inline 4</SampleBox>
          </FlexLayout>
        </div>
      </section>

      {/* Different Gaps */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Different Gap Sizes</h2>
        <div className="space-y-4">
          <FlexLayout direction="row" gap="xs" background="gray" padding="md" rounded="md">
            <SampleBox color="bg-red-100">XS Gap</SampleBox>
            <SampleBox color="bg-red-100">XS Gap</SampleBox>
            <SampleBox color="bg-red-100">XS Gap</SampleBox>
          </FlexLayout>
          <FlexLayout direction="row" gap="lg" background="gray" padding="md" rounded="md">
            <SampleBox color="bg-orange-100">LG Gap</SampleBox>
            <SampleBox color="bg-orange-100">LG Gap</SampleBox>
            <SampleBox color="bg-orange-100">LG Gap</SampleBox>
          </FlexLayout>
          <FlexLayout direction="row" gap="2xl" background="gray" padding="md" rounded="md">
            <SampleBox color="bg-teal-100">2XL Gap</SampleBox>
            <SampleBox color="bg-teal-100">2XL Gap</SampleBox>
            <SampleBox color="bg-teal-100">2XL Gap</SampleBox>
          </FlexLayout>
        </div>
      </section>

      {/* Responsive Card Layout */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Card Layout Example</h2>
        <FlexLayout 
          direction="row" 
          wrap="wrap"
          gap="lg"
          justify="center"
          background="white" 
          padding="xl" 
          rounded="xl"
          shadow="lg"
          border="default"
        >
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 min-w-[250px] flex-1 max-w-[300px]">
              <h3 className="text-lg font-semibold mb-2">Card {item}</h3>
              <p className="text-gray-600 mb-4">This is a sample card content that demonstrates how FlexLayout can be used to create responsive card layouts.</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Action
              </button>
            </div>
          ))}
        </FlexLayout>
      </section>
    </div>
  );
};

export default FlexLayoutExamples;