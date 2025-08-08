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
  const [logs, setLogs] = React.useState<
    { message: string; status: string; format: string }[]
  >([]);

  const handleSubmit = React.useCallback(() => {
    if (!prompt.trim()) return;
    const name = prompt.trim();
    setBuilding(true);
    setBuildingAppName(name);
    setLogs([]);

    const steps = [
      {
        message: `\`[INFO]\` **Initializing workspace for ${name}...**  
- Setting up project environment  
- Loading configuration files`,
        status: "started",
        format: "markdown",
      },
      {
        message: `\`[INFO]\` **Analyzing prompt requirements...**  
- Detected app type: *${name}*  
- Generating schema for components`,
        status: "pending",
        format: "markdown",
      },
      {
        message: `\`[SEQUENCE]\` **Scaffolding project structure...**  
\`\`\`  
├── src  
│   ├── components  
│   ├── pages  
│   └── styles  
└── public  
\`\`\``,
        status: "pending",
        format: "markdown",
      },
      {
        message: `\`[START]\` **Generating UI components...**  
- **Header**: Responsive navigation  
- **Main**: Dynamic content area  
- **Footer**: Static branding`,
        status: "pending",
        format: "markdown",
      },
      {
        message: `\`[COMPLETE]\` **Building ${name} core logic...**  
## Generated Features  
- **State Management**: Redux integration  
- **Routing**: React Router setup  
- **API Layer**: Mock endpoints ready  
\`\`\`javascript  
const app = initializeApp({ name: "${name}" });  
app.start();  
\`\`\``,
        status: "completed",
        format: "markdown",
      },
      {
        message: `\`[INFO]\` **Running final validations...**  
- Linting: ✅ Passed  
- Tests: ✅ 100% coverage`,
        status: "pending",
        format: "markdown",
      },
      {
        message: `\`[DONE]\` **${name} is ready!**  
# Next Steps  
1. Open project in editor  
2. Run \`npm start\`  
3. Deploy to production`,
        status: "completed",
        format: "markdown",
      },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, steps[idx]]);
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
