import React from "react";
import PromptContent from "./content";

const MOCK_RECENTS = [
  { id: "1", name: "Meridian EXIM" },
  { id: "2", name: "Sales Insights" },
  { id: "3", name: "Ops Monitor" },
  { id: "4", name: "Support Hub" },
  { id: "5", name: "Docs Portal" },
  { id: "6", name: "Data Sync" },
];

const Prompt: React.FC = () => {
  const [prompt, setPrompt] = React.useState("");
  const [building, setBuilding] = React.useState(false);
  const [buildingAppName, setBuildingAppName] = React.useState<
    string | undefined
  >(undefined);
  const [logs, setLogs] = React.useState<{ id: string; text: string }[]>([]);

  const handleSubmit = React.useCallback(() => {
    if (!prompt.trim()) return;
    const name = prompt.trim();
    setBuilding(true);
    setBuildingAppName(name);
    setLogs([]);

    const steps = [
      `Initializing workspace for ${name}...`,
      "Analyzing prompt and requirements...",
      "Scaffolding project structure...",
      "Generating components...",
      "Wiring state and routes...",
      "Finalizing setup...",
      "Done! Project ready to open.",
    ];

    let idx = 0;
    const interval = setInterval(() => {
      setLogs((prev) => [
        ...prev,
        { id: `${Date.now()}-${idx}`, text: steps[idx] },
      ]);
      idx += 1;
      if (idx >= steps.length) {
        clearInterval(interval);
        setBuilding(false);
      }
    }, 800);
  }, [prompt]);

  const handleSelectRecent = React.useCallback(
    (app: { id: string; name: string }) => {
      setPrompt(app.name);
    },
    []
  );

  return (
    <PromptContent
      prompt={prompt}
      onPromptChange={setPrompt}
      onSubmit={handleSubmit}
      building={building}
      buildingAppName={buildingAppName}
      recentApps={MOCK_RECENTS}
      onSelectRecent={handleSelectRecent}
      logs={logs}
    />
  );
};

export default Prompt;
