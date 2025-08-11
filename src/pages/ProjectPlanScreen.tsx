import React, { useState } from "react";
import ChatPage from "./Chatpage";
import { FlexLayout } from "../components/atoms/layouts";
import { Tab } from "../components/atoms/navigation";
import { Button } from "../components/atoms/form";
import { Select } from "../components/atoms/form";
import MarkdownRenderer from "../utils/MarkdownRenderer";
import { testMarkdown } from "./sample_data/brd";
import AIConfiguration from "./AIConfiguration";
import WorkflowPreview from "./WorkflowPreview";
import Plan from "./Plan";

const ProjectPlanScreen: React.FC = () => {
  const [activeProjectTab, setActiveProjectTab] = useState("brd");
  const [selectedVersion, setSelectedVersion] = useState("1.0");

  const projectTabItems = [
    {
      id: "brd",
      label: "BRD",
    },
    {
      id: "plan",
      label: "Plan",
    },
    {
      id: "smart-ai",
      label: "Smart AI",
    },
    {
      id: "preview",
      label: "Preview",
    },
  ];

  const renderContent = () => {
    switch (activeProjectTab) {
      case "brd":
        return <MarkdownRenderer content={testMarkdown} className="w-full p-4" />;
      case "plan":
        return (
          <Plan />
        );
      case "smart-ai":
        return <AIConfiguration />;
      case "preview":
        return <WorkflowPreview />;
      default:
        return <MarkdownRenderer content={testMarkdown} className="w-full" />;
    }
  };

  return (
    <div className="flex w-full">
      <FlexLayout
        direction="row"
        gap="none"
        background="gray"
        padding="none"
        rounded="lg"
        border="default"
        className="w-full h-screen p-0"
        childrenWidths={["20%", "80%"]}
      >
        <ChatPage />

        {/* Project plan content */}
        <FlexLayout
          direction="col"
          className="h-full p-0 rounded-none bg-white w-full border-l border-gray-300 gap-0"
        >
          {/* Navbar */}
          <FlexLayout
            direction="row"
            justify="between"
            align="center"
            padding="sm"
            className="border-b bg-white w-full rounded-none"
          >
            {/* Left side - Version dropdown */}
            <FlexLayout direction="row" align="center" gap="sm">
              <Select
                value={selectedVersion}
                onChange={(value) => setSelectedVersion(value as string)}
                options={[
                  { value: "1.0", label: "Version 1.0" },
                  { value: "2.0", label: "Version 2.0" },
                ]}
                size="sm"
                variant="default"
                className="text-sm font-medium border-none"
              />
            </FlexLayout>

            {/* Center - Tabs */}
            <Tab
              items={projectTabItems}
              activeTab={activeProjectTab}
              onChange={setActiveProjectTab}
              variant="bordered"
              size="sm"
              className="w-fit"
            />

            {/* Right side - Updated text and Deploy button */}
            <FlexLayout direction="row" align="center" gap="md">
              <span className="text-sm text-gray-500">Updated 3min ago</span>
              <Button
                variant="primary"
                size="sm"
                className="bg-gray-800 hover:bg-gray-900"
              >
                Deploy
              </Button>
            </FlexLayout>
          </FlexLayout>

          {/* Rendering the tab content */}
          <div className="w-full overflow-auto h-full">{renderContent()}</div>
        </FlexLayout>
      </FlexLayout>
    </div>
  );
};

export default ProjectPlanScreen;
