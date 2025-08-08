import React from "react";
import ChatPage from "./Chatpage";
import { FlexLayout } from "../components/atoms/layouts";

const ProjectPlanScreen: React.FC = () => {
  return (
    <div className="flex w-full">
      <FlexLayout
        direction="row"
        gap="md"
        background="gray"
        padding="none"
        rounded="lg"
        border="default"
        className="w-full h-screen"
        childrenWidths={['30%', '70%']}
      >
        <ChatPage />
        <div>
          {/* <h1>Project Plan</h1>
          <p>Welcome to the Project Plan screen.</p> */}
        </div>
      </FlexLayout>
    </div>
  );
};

export default ProjectPlanScreen;
