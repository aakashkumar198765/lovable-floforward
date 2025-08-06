import React, { useState } from 'react';
import ApprovalWorkflow from '../../src/components/organisms/workflow/ApprovalWorkflow';

// Sample dummy data showcasing all workflow states and functionalities
const sampleApprovers = [
  { id: 'john.smith', name: 'John Smith', role: 'Manager', email: 'john.smith@company.com' },
  { id: 'jane.doe', name: 'Jane Doe', role: 'Director', email: 'jane.doe@company.com' },
  { id: 'bob.johnson', name: 'Bob Johnson', role: 'VP Finance', email: 'bob.johnson@company.com' },
  { id: 'alice.wilson', name: 'Alice Wilson', role: 'CEO', email: 'alice.wilson@company.com' },
  { id: 'mike.davis', name: 'Mike Davis', role: 'Finance Manager', email: 'mike.davis@company.com' },
  { id: 'sarah.brown', name: 'Sarah Brown', role: 'Legal Counsel', email: 'sarah.brown@company.com' },
];

// Sample workflow steps demonstrating different states
const sampleStepsInProgress = [
  {
    id: 'step-1',
    name: 'Initial Review',
    description: 'Review request for completeness and basic validation',
    type: 'review',
    status: 'completed',
    assignees: ['john.smith'],
    completedAt: '2024-01-15T10:30:00Z',
    completedBy: 'john.smith',
    duration: 1800, // 30 minutes
    dueDate: '2024-01-15T12:00:00Z',
    actions: [
      { id: 'approve', label: 'Approve', type: 'approve', variant: 'primary' },
      { id: 'reject', label: 'Reject', type: 'reject', variant: 'danger' },
    ]
  },
  {
    id: 'step-2',
    name: 'Budget Validation',
    description: 'Validate budget availability and financial impact',
    type: 'financial',
    status: 'in_progress',
    assignees: ['mike.davis'],
    dueDate: '2024-01-16T15:00:00Z',
    actions: [
      { id: 'approve', label: 'Approve', type: 'approve', variant: 'primary' },
      { id: 'reject', label: 'Reject', type: 'reject', variant: 'danger' },
      { id: 'request_info', label: 'Request More Info', type: 'request_info', variant: 'secondary' },
    ]
  },
  {
    id: 'step-3',
    name: 'Legal Compliance',
    description: 'Ensure compliance with legal and regulatory requirements',
    type: 'legal',
    status: 'pending',
    assignees: ['sarah.brown'],
    dueDate: '2024-01-17T12:00:00Z',
    optional: false,
  },
  {
    id: 'step-4',
    name: 'Executive Approval',
    description: 'Final executive sign-off for high-value requests',
    type: 'executive',
    status: 'pending',
    assignees: ['alice.wilson'],
    dueDate: '2024-01-18T17:00:00Z',
    optional: false,
  }
];

const sampleStepsCompleted = [
  {
    id: 'step-1',
    name: 'Manager Review',
    description: 'Initial manager approval for budget request',
    type: 'review',
    status: 'completed',
    assignees: ['john.smith'],
    completedAt: '2024-01-10T14:30:00Z',
    completedBy: 'john.smith',
    duration: 2400, // 40 minutes
    dueDate: '2024-01-10T16:00:00Z',
  },
  {
    id: 'step-2',
    name: 'Finance Review',
    description: 'Financial validation and budget impact analysis',
    type: 'financial',
    status: 'completed',
    assignees: ['mike.davis'],
    completedAt: '2024-01-11T11:15:00Z',
    completedBy: 'mike.davis',
    duration: 3600, // 1 hour
    dueDate: '2024-01-11T15:00:00Z',
  },
  {
    id: 'step-3',
    name: 'Director Approval',
    description: 'Director level approval for departmental spend',
    type: 'approval',
    status: 'completed',
    assignees: ['jane.doe'],
    completedAt: '2024-01-12T09:45:00Z',
    completedBy: 'jane.doe',
    duration: 900, // 15 minutes
    dueDate: '2024-01-12T12:00:00Z',
  }
];

const sampleStepsWithRejection = [
  {
    id: 'step-1',
    name: 'Initial Review',
    description: 'Review request for completeness and basic validation',
    type: 'review',
    status: 'completed',
    assignees: ['john.smith'],
    completedAt: '2024-01-08T10:30:00Z',
    completedBy: 'john.smith',
    duration: 1200, // 20 minutes
  },
  {
    id: 'step-2',
    name: 'Budget Validation',
    description: 'Validate budget availability and financial constraints',
    type: 'financial',
    status: 'failed',
    assignees: ['mike.davis'],
    completedAt: '2024-01-09T14:20:00Z',
    completedBy: 'mike.davis',
    duration: 1800, // 30 minutes
    rejectionReason: 'Insufficient budget allocation for Q1',
  }
];

const sampleRequestData = {
  requestTitle: 'New Marketing Campaign Budget Request',
  description: 'Budget approval for Q1 2024 digital marketing campaign targeting new customer segments',
  amount: 75000,
  currency: 'USD',
  department: 'Marketing',
  priority: 'high',
  requestedBy: 'marketing.team@company.com',
  requestedDate: '2024-01-15',
  category: 'Marketing Spend',
};

const ApprovalWorkflowExample: React.FC = () => {
  const [currentWorkflow, setCurrentWorkflow] = useState<'in-progress' | 'completed' | 'rejected'>('in-progress');
  const [currentStep, setCurrentStep] = useState('step-2');
  const [layout, setLayout] = useState<'vertical' | 'horizontal' | 'timeline'>('vertical');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');

  const getWorkflowData = () => {
    switch (currentWorkflow) {
      case 'completed':
        return {
          steps: sampleStepsCompleted,
          currentStep: 'step-3',
        };
      case 'rejected':
        return {
          steps: sampleStepsWithRejection,
          currentStep: 'step-2',
        };
      default:
        return {
          steps: sampleStepsInProgress,
          currentStep: currentStep,
        };
    }
  };

  const handleStepAction = async (stepId: string, action: string, data: any) => {
    console.log(`Step ${stepId} action: ${action}`, data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (action === 'approve' && currentWorkflow === 'in-progress') {
      // Move to next step
      const currentIndex = sampleStepsInProgress.findIndex(s => s.id === stepId);
      if (currentIndex < sampleStepsInProgress.length - 1) {
        setCurrentStep(sampleStepsInProgress[currentIndex + 1].id);
      }
    }
  };

  const handleWorkflowComplete = (status: string) => {
    console.log(`Workflow completed with status: ${status}`);
  };

  const handleDelegate = async (stepId: string, newAssignee: string) => {
    console.log(`Step ${stepId} delegated to: ${newAssignee}`);
    // Simulate delegation
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const workflowData = getWorkflowData();

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Approval Workflow Component Demo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Workflow State */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Workflow State
              </label>
              <select
                value={currentWorkflow}
                onChange={(e) => setCurrentWorkflow(e.target.value as any)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Layout */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Layout
              </label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value as any)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Workflow Component */}
        <ApprovalWorkflow
          title="Budget Approval Workflow"
          // steps={workflowData.steps}
          currentStep={workflowData.currentStep}
          requestData={sampleRequestData}
          approvers={sampleApprovers}
          layout={layout}
          size={size}
          showProgress={true}
          showHistory={true}
          showComments={true}
          allowDelegate={true}
          allowSkip={true}
          autoAdvance={true}
          parallel={false}
          commerceState="execution"
          allowedActions={['approve', 'reject', 'delegate', 'skip']}
          userRole={{
            id: 'current.user',
            name: 'Current User',
            permissions: ['approve_steps']
          }}
          onStepAction={handleStepAction}
          onWorkflowComplete={handleWorkflowComplete}
          onDelegate={handleDelegate}
          onUpdate={(data) => console.log('Workflow updated:', data)}
          className="shadow-lg"
        />

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Enhanced UI Design
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Modern card-based layout with shadows</li>
              <li>• Gradient backgrounds and status indicators</li>
              <li>• Improved typography and spacing</li>
              <li>• Dark theme support</li>
              <li>• Responsive design</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Visual Status Indicators
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Color-coded step status backgrounds</li>
              <li>• Animated progress bars</li>
              <li>• Icon-based status indicators</li>
              <li>• Enhanced badge styling</li>
              <li>• Clear visual hierarchy</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Better Information Layout
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Improved assignee display with avatars</li>
              <li>• Better timestamp formatting</li>
              <li>• Enhanced metadata presentation</li>
              <li>• Organized workflow history</li>
              <li>• Clean action button layout</li>
            </ul>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Usage Examples
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Budget Approvals</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Multi-step approval process for budget requests with financial validation
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 text-xs font-mono">
                Manager Review → Finance Check → Director Approval → Executive Sign-off
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Purchase Orders</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Procurement workflow with vendor validation and legal compliance
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 text-xs font-mono">
                Request Review → Vendor Check → Legal Review → Final Approval
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">HR Requests</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Employee requests like leave approvals and policy exceptions
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 text-xs font-mono">
                Manager Approval → HR Review → Department Head → Final Decision
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contract Reviews</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Legal and business review process for contracts and agreements
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 text-xs font-mono">
                Business Review → Legal Review → Risk Assessment → Executive Approval
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflowExample;