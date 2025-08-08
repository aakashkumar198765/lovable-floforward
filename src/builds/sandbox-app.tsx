import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { componentRegistry } from '../libraryTemplate/componentRegistry';

// Define types for the component structure
interface ComponentVariation {
  name: string;
  props: Record<string, any>;
  description?: string;
}

interface ComponentDefinition {
  name: string;
  component: React.ComponentType<any>;
  description: string;
  variations: ComponentVariation[];
}

interface SubcategoryData {
  components: ComponentDefinition[];
}

interface CategoryData {
  [subcategory: string]: SubcategoryData;
}

interface ComponentRegistry {
  [category: string]: CategoryData;
}

const ComponentSandbox = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null);
  const [selectedVariation, setSelectedVariation] = useState(0);

  const typedRegistry = componentRegistry as ComponentRegistry;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Component Sandbox</h2>
          </div>
          
          {Object.entries(typedRegistry).map(([category, categoryData]) => (
            <div key={category} className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 capitalize">{category}</h3>
              {Object.entries(categoryData).map(([subcat, subcatData]) => (
                <div key={subcat} className="ml-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">{subcat}</h4>
                  {subcatData.components.map((comp: ComponentDefinition) => (
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
                  {selectedComponent.variations.map((variation: ComponentVariation, index: number) => (
                    <option key={index} value={index}>{variation.name}</option>
                  ))}
                </select>
              </div>

              {/* Component preview */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                {React.createElement(
                  selectedComponent.component,
                  selectedComponent.variations[selectedVariation].props
                )}
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
root.render(<ComponentSandbox />);