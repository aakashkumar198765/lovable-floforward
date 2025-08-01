import React, { useState } from "react";
import Select from "./Select";
import CascadingSelect from "./CascadingSelect";
import { CommerceState, SelectOption, SelectGroup } from "../../../types";
import MultiSelect from "./MultiSelect";

interface SelectAllTypesProps {
  className?: string;
  style?: React.CSSProperties;
  onStateChange?: (state: CommerceState) => void;
  initialCommerceState?: CommerceState;
}

const SelectAllTypes: React.FC<SelectAllTypesProps> = ({
  className = "",
  style = {},
  onStateChange,
  initialCommerceState = "initiation",
}) => {
  const [commerceState, setCommerceState] =
    useState<CommerceState>(initialCommerceState);
  const [singleValue, setSingleValue] = useState<string>("");
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [cascadingValue, setCascadingValue] = useState<string[]>([]);

  const commerceStates: CommerceState[] = [
    "initiation",
    "agreement",
    "execution",
    "settlement",
    "completion",
  ];

  const handleCommerceStateChange = (newState: CommerceState) => {
    setCommerceState(newState);
    if (onStateChange && typeof onStateChange === "function") {
      onStateChange(newState);
    }
  };

  // Sample data
  const basicOptions: SelectOption[] = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
    { value: "grape", label: "Grape" },
    { value: "kiwi", label: "Kiwi" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "active", label: "Active", icon: "🟢" },
    { value: "inactive", label: "Inactive", icon: "🔴" },
    { value: "pending", label: "Pending", icon: "🟡" },
    { value: "suspended", label: "Suspended", icon: "🟠", disabled: true },
  ];

  const groupedOptions: SelectGroup[] = [
    {
      label: "Fruits",
      options: [
        { value: "apple", label: "Apple", icon: "🍎" },
        { value: "banana", label: "Banana", icon: "🍌" },
        { value: "orange", label: "Orange", icon: "🍊" },
      ],
    },
    {
      label: "Vegetables",
      options: [
        { value: "carrot", label: "Carrot", icon: "🥕" },
        { value: "broccoli", label: "Broccoli", icon: "🥦" },
        { value: "tomato", label: "Tomato", icon: "🍅" },
      ],
    },
    {
      label: "Proteins",
      options: [
        { value: "chicken", label: "Chicken", icon: "🐔" },
        { value: "fish", label: "Fish", icon: "🐟" },
        { value: "beef", label: "Beef", icon: "🥩" },
      ],
    },
  ];

  const teamOptions: SelectOption[] = [
    { value: "john", label: "John Smith", description: "Frontend Developer" },
    { value: "jane", label: "Jane Doe", description: "Backend Developer" },
    { value: "bob", label: "Bob Johnson", description: "UI/UX Designer" },
    { value: "alice", label: "Alice Brown", description: "Product Manager" },
    {
      value: "charlie",
      label: "Charlie Wilson",
      description: "DevOps Engineer",
    },
  ];

  // Cascading select data
  const cascadingLevels = [
    {
      label: "Country",
      placeholder: "Select country",
      data: [
        { value: "usa", label: "United States" },
        { value: "canada", label: "Canada" },
        { value: "uk", label: "United Kingdom" },
      ],
    },
    {
      label: "State/Province",
      placeholder: "Select state/province",
      data: {
        usa: [
          { value: "ca", label: "California" },
          { value: "ny", label: "New York" },
          { value: "tx", label: "Texas" },
          { value: "fl", label: "Florida" },
        ],
        canada: [
          { value: "on", label: "Ontario" },
          { value: "bc", label: "British Columbia" },
          { value: "qc", label: "Quebec" },
        ],
        uk: [
          { value: "england", label: "England" },
          { value: "scotland", label: "Scotland" },
          { value: "wales", label: "Wales" },
        ],
      },
    },
    // {
    //   label: "City",
    //   placeholder: "Select city",
    //   data: {
    //     ca: [
    //       { value: "la", label: "Los Angeles" },
    //       { value: "sf", label: "San Francisco" },
    //       { value: "sd", label: "San Diego" },
    //     ],
    //     ny: [
    //       { value: "nyc", label: "New York City" },
    //       { value: "buffalo", label: "Buffalo" },
    //       { value: "rochester", label: "Rochester" },
    //     ],
    //     tx: [
    //       { value: "houston", label: "Houston" },
    //       { value: "dallas", label: "Dallas" },
    //       { value: "austin", label: "Austin" },
    //     ],
    //     fl: [
    //       { value: "miami", label: "Miami" },
    //       { value: "orlando", label: "Orlando" },
    //       { value: "tampa", label: "Tampa" },
    //     ],
    //     on: [
    //       { value: "toronto", label: "Toronto" },
    //       { value: "ottawa", label: "Ottawa" },
    //       { value: "hamilton", label: "Hamilton" },
    //     ],
    //     bc: [
    //       { value: "vancouver", label: "Vancouver" },
    //       { value: "victoria", label: "Victoria" },
    //       { value: "burnaby", label: "Burnaby" },
    //     ],
    //     qc: [
    //       { value: "montreal", label: "Montreal" },
    //       { value: "quebec-city", label: "Quebec City" },
    //       { value: "laval", label: "Laval" },
    //     ],
    //     england: [
    //       { value: "london", label: "London" },
    //       { value: "manchester", label: "Manchester" },
    //       { value: "birmingham", label: "Birmingham" },
    //     ],
    //     scotland: [
    //       { value: "edinburgh", label: "Edinburgh" },
    //       { value: "glasgow", label: "Glasgow" },
    //       { value: "aberdeen", label: "Aberdeen" },
    //     ],
    //     wales: [
    //       { value: "cardiff", label: "Cardiff" },
    //       { value: "swansea", label: "Swansea" },
    //       { value: "newport", label: "Newport" },
    //     ],
    //   },
    // },
  ];

  return (
    <div className={`space-y-8 ${className}`} style={style}>
      {/* Commerce State Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Commerce State
        </label>
        <select
          value={commerceState}
          onChange={(e) => {
            const newState = e.target.value as CommerceState;
            if (commerceStates.includes(newState)) {
              handleCommerceStateChange(newState);
            }
          }}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {commerceStates.map((state) => (
            <option key={state} value={state}>
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Single Select Examples */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Single Select
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Single Select */}
          <Select
            id="basic-select"
            label="Basic Select"
            placeholder="Choose a fruit"
            options={basicOptions}
            value={singleValue}
            onChange={(value) => setSingleValue(value as string)}
            commerceState={commerceState}
            helperText="Select your favorite fruit"
          />

          {/* Select with Different Statuses */}
          <Select
            id="status-select"
            label="Status Select"
            placeholder="Choose status"
            options={statusOptions}
            commerceState={commerceState}
            status="success"
            helperText="Select account status"
          />

          {/* Select with Groups */}
          <Select
            id="grouped-select"
            label="Grouped Select"
            placeholder="Choose food item"
            groups={groupedOptions}
            commerceState={commerceState}
            helperText="Select from grouped options"
          />

          {/* Clearable Select */}
          <Select
            id="clearable-select"
            label="Clearable Select"
            placeholder="Choose a fruit"
            options={basicOptions}
            clearable
            commerceState={commerceState}
            helperText="This select can be cleared"
          />
        </div>
      </div>

      {/* Multi Select Examples */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Multi Select
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Multi Select */}
          <MultiSelect
            id="basic-multi-select"
            label="Basic Multi Select"
            placeholder="Choose multiple fruits"
            options={basicOptions}
            value={multiValue}
            onChange={(values) => setMultiValue(values)}
            commerceState={commerceState}
            helperText="Select multiple fruits"
            showBadges
            multiple
          />

          {/* Multi Select with Team */}
          <MultiSelect
            id="team-multi-select"
            label="Team Members"
            placeholder="Select team members"
            options={teamOptions}
            commerceState={commerceState}
            helperText="Select team members for the project"
            showBadges
            badgeColor="success"
            maxSelections={3}
            multiple
          />

          {/* Multi Select with Groups */}
          <MultiSelect
            id="grouped-multi-select"
            label="Grouped Multi Select"
            placeholder="Choose food items"
            groups={groupedOptions}
            commerceState={commerceState}
            helperText="Select from grouped options"
            showBadges
            badgeVariant="outlined"
            searchable
            multiple
          />

          {/* Clearable Multi Select */}
          <MultiSelect
            id="clearable-multi-select"
            label="Clearable Multi Select"
            placeholder="Choose multiple fruits"
            options={basicOptions}
            commerceState={commerceState}
            helperText="This multi-select can be cleared"
            showBadges
            clearable
            badgeColor="warning"
            multiple
          />
        </div>
      </div>

      {/* Select Sizes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select Sizes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            id="small-select"
            label="Small Select"
            placeholder="Small select"
            options={basicOptions}
            size="sm"
            commerceState={commerceState}
          />

          <Select
            id="medium-select"
            label="Medium Select"
            placeholder="Medium select"
            options={basicOptions}
            size="md"
            commerceState={commerceState}
          />

          <Select
            id="large-select"
            label="Large Select"
            placeholder="Large select"
            options={basicOptions}
            size="lg"
            commerceState={commerceState}
          />
        </div>
      </div>

      {/* Select Variants */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select Variants
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            id="default-variant default-variant-select"
            label="Default Variant"
            placeholder="Default"
            options={basicOptions}
            variant="default"
            commerceState={commerceState}
          />

          <Select
            id="outlined-variant outlined-variant-select"
            label="Outlined Variant"
            placeholder="Outlined"
            options={basicOptions}
            variant="outlined"
            commerceState={commerceState}
          />

          <Select
            id="filled-variant filled-variant-select"
            label="Filled Variant"
            placeholder="Filled"
            options={basicOptions}
            variant="filled"
            commerceState={commerceState}
          />
        </div>
      </div>

      {/* Select States */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select States
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="error-select"
            label="Error State"
            placeholder="Error select"
            options={basicOptions}
            status="error"
            errorMessage="This field has an error"
            commerceState={commerceState}
          />

          <Select
            id="warning-select"
            label="Warning State"
            placeholder="Warning select"
            options={basicOptions}
            status="warning"
            helperText="This field has a warning"
            commerceState={commerceState}
          />

          <Select
            id="success-select"
            label="Success State"
            placeholder="Success select"
            options={basicOptions}
            status="success"
            helperText="This field is valid"
            commerceState={commerceState}
          />

          <Select
            id="disabled-select"
            label="Disabled State"
            placeholder="Disabled select"
            options={basicOptions}
            disabled
            commerceState={commerceState}
          />
        </div>
      </div>

      {/* Cascading Select */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Cascading Select
        </h3>

        <CascadingSelect
          id="location-cascading"
          label="Location Selection"
          levels={cascadingLevels}
          value={cascadingValue}
          onChange={(values) => setCascadingValue(values)}
          commerceState={commerceState}
          helperText="Select country, then state/province, then city"
        />
      </div>

      {/* Enterprise Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Enterprise Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="audit-select"
            label="Audit Trail Select"
            placeholder="Tracked selections"
            options={basicOptions}
            commerceState={commerceState}
            auditTrail={{
              enabled: true,
              level: "detailed",
              trackChanges: true,
              logUserActions: true,
            }}
            helperText="All changes are logged"
          />

          <MultiSelect
            id="encrypted-multi-select"
            label="Encrypted Multi Select"
            placeholder="Encrypted data"
            options={teamOptions}
            commerceState={commerceState}
            encryptionLevel="field"
            helperText="Field-level encryption enabled"
            showBadges
            badgeColor="error"
            multiple
          />
        </div>
      </div>

      {/* AI Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          AI Configuration
        </h3>

        <Select
          id="ai-select"
          label="AI Configured Select"
          placeholder="AI managed select"
          options={basicOptions}
          commerceState={commerceState}
          aiConfig={{
            layout: "adaptive",
            features: ["smart-suggestions", "auto-complete"],
            customization: { theme: "enterprise" },
            hints: [
              "AI will suggest relevant options",
              "Smart filtering enabled",
            ],
          }}
          helperText="This select has AI configuration (check console in dev mode)"
        />
      </div>

      {/* Commerce State Specific Examples */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Commerce State Behaviors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="initiation-example"
            label="Initiation State"
            placeholder="Full capabilities"
            options={basicOptions}
            commerceState="initiation"
            helperText="All features available"
          />

          <Select
            id="completion-example"
            label="Completion State"
            placeholder="Read-only mode"
            options={basicOptions}
            commerceState="completion"
            value="apple"
            helperText="Read-only in completion state"
          />

          <MultiSelect
            id="settlement-example"
            label="Settlement State"
            placeholder="Restricted editing"
            options={basicOptions}
            commerceState="settlement"
            allowedActions={[]} // No edit permissions
            helperText="Limited editing based on permissions"
            showBadges
            multiple
          />

          <Select
            id="execution-example"
            label="Execution State"
            placeholder="Active processing"
            options={basicOptions}
            commerceState="execution"
            helperText="Active state with full features"
          />
        </div>
      </div>

      {/* Current Values Display */}
      {/* <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-700 mb-2">Current Values</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Commerce State:</strong> {commerceState}
          </p>
          <p>
            <strong>Single Select:</strong> {singleValue || "None"}
          </p>
          <p>
            <strong>Multi Select:</strong>{" "}
            {multiValue.length > 0 ? multiValue.join(", ") : "None"}
          </p>
          <p>
            <strong>Cascading Select:</strong>{" "}
            {cascadingValue.length > 0 ? cascadingValue.join(" → ") : "None"}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default SelectAllTypes;
