import React, { useState } from 'react';
import { 
    Button, 
    Input, 
    Select, 
    Checkbox, 
    Radio, 
    Switch, 
    Textarea,
    DatePicker,
    FileUpload,
    MultiSelect,
    CascadingSelect
} from '../components/atoms';

const AtomsFormPage = () => {
    const [checkboxValue, setCheckboxValue] = useState(false);
    const [radioValue, setRadioValue] = useState('option1');
    const [switchValue, setSwitchValue] = useState(false);
    const [selectValue, setSelectValue] = useState('');
    const [multiSelectValue, setMultiSelectValue] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [textareaValue, setTextareaValue] = useState('');

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Atoms</h1>
                <h2 className="text-xl text-gray-600 mb-4">Form Components</h2>
                <p className="text-gray-600">
                    Interactive form elements with comprehensive validation, styling, and accessibility features.
                </p>
            </div>

            {/* Button Component */}
            <ComponentSection 
                title="Button" 
                description="Interactive buttons and links with multiple variants and states."
            >
                <div className="space-y-6">
                    {/* Variants */}
                    <ExampleGroup title="Variants">
                        <div className="flex flex-wrap gap-3">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="tertiary">Tertiary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="danger">Danger</Button>
                            <Button variant="success">Success</Button>
                            <Button variant="warning">Warning</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                        </div>
                        <CodeBlock>{`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Outline Variants */}
                    <ExampleGroup title="Outline Variants">
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline">Outline Primary</Button>
                            <Button variant="outline-success">Outline Success</Button>
                            <Button variant="outline-danger">Outline Danger</Button>
                            <Button variant="outline-warning">Outline Warning</Button>
                        </div>
                        <CodeBlock>{`<Button variant="outline">Outline Primary</Button>
<Button variant="outline-success">Outline Success</Button>
<Button variant="outline-danger">Outline Danger</Button>
<Button variant="outline-warning">Outline Warning</Button>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Sizes */}
                    <ExampleGroup title="Sizes">
                        <div className="flex items-center space-x-3">
                            <Button size="xs">Extra Small</Button>
                            <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button>
                            <Button size="xl">Extra Large</Button>
                        </div>
                        <CodeBlock>{`<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`}</CodeBlock>
                    </ExampleGroup>

                    {/* States */}
                    <ExampleGroup title="States">
                        <div className="flex space-x-3">
                            <Button>Normal</Button>
                            <Button loading>Loading</Button>
                            <Button disabled>Disabled</Button>
                            <Button fullWidth>Full Width</Button>
                        </div>
                        <CodeBlock>{`<Button>Normal</Button>
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Icons */}
                    <ExampleGroup title="With Icons">
                        <div className="flex space-x-3">
                            <Button iconLeft="plus">Add Item</Button>
                            <Button iconRight="arrow-right">Continue</Button>
                            <Button variant="secondary" iconLeft="download">Download</Button>
                            <Button variant="danger" iconLeft="trash">Delete</Button>
                        </div>
                        <CodeBlock>{`<Button iconLeft="plus">Add Item</Button>
<Button iconRight="arrow-right">Continue</Button>
<Button variant="secondary" iconLeft="download">Download</Button>
<Button variant="danger" iconLeft="trash">Delete</Button>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Input Component */}
            <ComponentSection 
                title="Input" 
                description="Text input fields with comprehensive features and validation states."
            >
                <div className="space-y-6">
                    {/* Basic Inputs */}
                    <ExampleGroup title="Basic Inputs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                                label="Email" 
                                type="email" 
                                placeholder="Enter your email"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Input 
                                label="Password" 
                                type="password" 
                                placeholder="Enter password"
                            />
                            <Input 
                                label="Phone" 
                                type="tel" 
                                placeholder="+1 (555) 123-4567"
                            />
                            <Input 
                                label="Website" 
                                type="url" 
                                placeholder="https://example.com"
                            />
                        </div>
                        <CodeBlock>{`<Input 
  label="Email" 
  type="email" 
  placeholder="Enter your email"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
<Input label="Password" type="password" />
<Input label="Phone" type="tel" />
<Input label="Website" type="url" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Sizes and Variants */}
                    <ExampleGroup title="Sizes and Variants">
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <Input size="sm" placeholder="Small" />
                                <Input size="md" placeholder="Medium" />
                                <Input size="lg" placeholder="Large" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Input variant="default" placeholder="Default" />
                                <Input variant="outlined" placeholder="Outlined" />
                                <Input variant="filled" placeholder="Filled" />
                            </div>
                        </div>
                        <CodeBlock>{`<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />

<Input variant="default" placeholder="Default" />
<Input variant="outlined" placeholder="Outlined" />
<Input variant="filled" placeholder="Filled" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Status States */}
                    <ExampleGroup title="Status States">
                        <div className="space-y-4">
                            <Input 
                                label="Default Input" 
                                placeholder="Normal state"
                                helperText="This is helper text"
                            />
                            <Input 
                                label="Error Input" 
                                status="error"
                                placeholder="Error state"
                                errorMessage="This field is required"
                            />
                            <Input 
                                label="Warning Input" 
                                status="warning"
                                placeholder="Warning state"
                                helperText="Please check this value"
                            />
                            <Input 
                                label="Success Input" 
                                status="success"
                                placeholder="Success state"
                                helperText="Looks good!"
                            />
                        </div>
                        <CodeBlock>{`<Input 
  label="Error Input" 
  status="error"
  errorMessage="This field is required"
/>
<Input 
  label="Warning Input" 
  status="warning"
  helperText="Please check this value"
/>
<Input 
  label="Success Input" 
  status="success"
  helperText="Looks good!"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Icons */}
                    <ExampleGroup title="With Icons">
                        <div className="space-y-4">
                            <Input 
                                label="Search" 
                                leftIcon="search"
                                placeholder="Search items..."
                            />
                            <Input 
                                label="Amount" 
                                leftIcon="dollar"
                                rightIcon="calculator"
                                placeholder="0.00"
                            />
                            <Input 
                                label="Password" 
                                type="password"
                                rightIcon="eye"
                                placeholder="Enter password"
                            />
                        </div>
                        <CodeBlock>{`<Input 
  label="Search" 
  leftIcon="search"
  placeholder="Search items..."
/>
<Input 
  label="Amount" 
  leftIcon="dollar"
  rightIcon="calculator"
  placeholder="0.00"
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Select Component */}
            <ComponentSection 
                title="Select" 
                description="Dropdown selection with options, groups, and search functionality."
            >
                <div className="space-y-6">
                    {/* Basic Select */}
                    <ExampleGroup title="Basic Select">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Country"
                                placeholder="Select a country"
                                options={[
                                    { value: 'us', label: 'United States' },
                                    { value: 'ca', label: 'Canada' },
                                    { value: 'uk', label: 'United Kingdom' },
                                    { value: 'au', label: 'Australia' }
                                ]}
                                value={selectValue}
                                onChange={setSelectValue}
                            />
                            <Select
                                label="Status"
                                placeholder="Select status"
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'disabled', label: 'Disabled', disabled: true }
                                ]}
                            />
                        </div>
                        <CodeBlock>{`<Select
  label="Country"
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
  value={value}
  onChange={setValue}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Multi Select */}
                    <ExampleGroup title="Multi Select">
                        <MultiSelect
                            label="Skills"
                            placeholder="Select your skills"
                            options={[
                                { value: 'js', label: 'JavaScript' },
                                { value: 'react', label: 'React' },
                                { value: 'vue', label: 'Vue.js' },
                                { value: 'angular', label: 'Angular' },
                                { value: 'node', label: 'Node.js' },
                                { value: 'python', label: 'Python' }
                            ]}
                            value={multiSelectValue}
                            onChange={setMultiSelectValue}
                        />
                        <CodeBlock>{`<MultiSelect
  label="Skills"
  placeholder="Select your skills"
  options={[
    { value: 'js', label: 'JavaScript' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' }
  ]}
  value={value}
  onChange={setValue}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Searchable Select */}
                    <ExampleGroup title="Searchable Select">
                        <Select
                            label="City"
                            placeholder="Search for a city"
                            searchable
                            options={[
                                { value: 'nyc', label: 'New York City' },
                                { value: 'la', label: 'Los Angeles' },
                                { value: 'chicago', label: 'Chicago' },
                                { value: 'houston', label: 'Houston' },
                                { value: 'phoenix', label: 'Phoenix' },
                                { value: 'philadelphia', label: 'Philadelphia' }
                            ]}
                        />
                        <CodeBlock>{`<Select
  label="City"
  placeholder="Search for a city"
  searchable
  options={cities}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Checkbox Component */}
            <ComponentSection 
                title="Checkbox" 
                description="Checkbox inputs for multiple selections and boolean values."
            >
                <div className="space-y-6">
                    {/* Basic Checkboxes */}
                    <ExampleGroup title="Basic Checkboxes">
                        <div className="space-y-3">
                            <Checkbox 
                                checked={checkboxValue}
                                onChange={setCheckboxValue}
                            >
                                Accept terms and conditions
                            </Checkbox>
                            <Checkbox defaultChecked>
                                Subscribe to newsletter
                            </Checkbox>
                            <Checkbox disabled>
                                Disabled checkbox
                            </Checkbox>
                            <Checkbox defaultChecked disabled>
                                Disabled checked
                            </Checkbox>
                        </div>
                        <CodeBlock>{`<Checkbox 
  checked={checked}
  onChange={setChecked}
>
  Accept terms and conditions
</Checkbox>
<Checkbox defaultChecked>Subscribe to newsletter</Checkbox>
<Checkbox disabled>Disabled checkbox</Checkbox>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Indeterminate State */}
                    <ExampleGroup title="Indeterminate State">
                        <div className="space-y-3">
                            <Checkbox indeterminate>
                                Select all items
                            </Checkbox>
                            <div className="ml-6 space-y-2">
                                <Checkbox defaultChecked>Item 1</Checkbox>
                                <Checkbox>Item 2</Checkbox>
                                <Checkbox>Item 3</Checkbox>
                            </div>
                        </div>
                        <CodeBlock>{`<Checkbox indeterminate>Select all items</Checkbox>
<div className="ml-6">
  <Checkbox defaultChecked>Item 1</Checkbox>
  <Checkbox>Item 2</Checkbox>
  <Checkbox>Item 3</Checkbox>
</div>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Radio Component */}
            <ComponentSection 
                title="Radio" 
                description="Radio button inputs for single selection from multiple options."
            >
                <div className="space-y-6">
                    <ExampleGroup title="Radio Groups">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Delivery Method</h4>
                                <div className="space-y-2">
                                    <Radio 
                                        name="delivery"
                                        value="standard"
                                        checked={radioValue === 'standard'}
                                        onChange={(e) => setRadioValue(e.target.value)}
                                    >
                                        Standard Delivery (5-7 days)
                                    </Radio>
                                    <Radio 
                                        name="delivery"
                                        value="express"
                                        checked={radioValue === 'express'}
                                        onChange={(e) => setRadioValue(e.target.value)}
                                    >
                                        Express Delivery (2-3 days)
                                    </Radio>
                                    <Radio 
                                        name="delivery"
                                        value="overnight"
                                        checked={radioValue === 'overnight'}
                                        onChange={(e) => setRadioValue(e.target.value)}
                                    >
                                        Overnight Delivery
                                    </Radio>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Method</h4>
                                <div className="space-y-2">
                                    <Radio name="payment" value="card" defaultChecked>
                                        Credit Card
                                    </Radio>
                                    <Radio name="payment" value="paypal">
                                        PayPal
                                    </Radio>
                                    <Radio name="payment" value="bank" disabled>
                                        Bank Transfer (Not Available)
                                    </Radio>
                                </div>
                            </div>
                        </div>
                        <CodeBlock>{`<Radio 
  name="delivery"
  value="standard"
  checked={value === 'standard'}
  onChange={(e) => setValue(e.target.value)}
>
  Standard Delivery (5-7 days)
</Radio>
<Radio name="delivery" value="express">
  Express Delivery (2-3 days)
</Radio>
<Radio name="delivery" value="overnight">
  Overnight Delivery
</Radio>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Switch Component */}
            <ComponentSection 
                title="Switch" 
                description="Toggle switches for boolean settings and preferences."
            >
                <div className="space-y-6">
                    <ExampleGroup title="Basic Switches">
                        <div className="space-y-4">
                            <Switch 
                                checked={switchValue}
                                onChange={setSwitchValue}
                            >
                                Enable notifications
                            </Switch>
                            <Switch defaultChecked>
                                Auto-save enabled
                            </Switch>
                            <Switch disabled>
                                Offline mode (Premium only)
                            </Switch>
                            <Switch defaultChecked disabled>
                                Two-factor authentication
                            </Switch>
                        </div>
                        <CodeBlock>{`<Switch 
  checked={checked}
  onChange={setChecked}
>
  Enable notifications
</Switch>
<Switch defaultChecked>Auto-save enabled</Switch>
<Switch disabled>Offline mode (Premium only)</Switch>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Switch Sizes */}
                    <ExampleGroup title="Sizes">
                        <div className="space-y-4">
                            <Switch size="sm">Small switch</Switch>
                            <Switch size="md">Medium switch</Switch>
                            <Switch size="lg">Large switch</Switch>
                        </div>
                        <CodeBlock>{`<Switch size="sm">Small switch</Switch>
<Switch size="md">Medium switch</Switch>
<Switch size="lg">Large switch</Switch>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Textarea Component */}
            <ComponentSection 
                title="Textarea" 
                description="Multi-line text input with auto-resize and character counting."
            >
                <div className="space-y-6">
                    <ExampleGroup title="Basic Textarea">
                        <div className="space-y-4">
                            <Textarea
                                label="Description"
                                placeholder="Enter your description..."
                                value={textareaValue}
                                onChange={(e) => setTextareaValue(e.target.value)}
                                helperText="Provide a detailed description"
                            />
                            <Textarea
                                label="Comments"
                                placeholder="Add your comments..."
                                rows={4}
                            />
                            <Textarea
                                label="Feedback"
                                placeholder="Share your feedback..."
                                maxLength={500}
                                showCharCount
                            />
                        </div>
                        <CodeBlock>{`<Textarea
  label="Description"
  placeholder="Enter your description..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  helperText="Provide a detailed description"
/>
<Textarea
  label="Feedback"
  maxLength={500}
  showCharCount
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Auto-resize */}
                    <ExampleGroup title="Auto-resize">
                        <Textarea
                            label="Auto-resize Textarea"
                            placeholder="Start typing... This will grow automatically"
                            autoResize
                            minRows={2}
                            maxRows={6}
                        />
                        <CodeBlock>{`<Textarea
  label="Auto-resize Textarea"
  placeholder="Start typing..."
  autoResize
  minRows={2}
  maxRows={6}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>
        </div>
    );
};

// Helper Components
const ComponentSection = ({ title, description, children }) => (
    <div className="mb-12">
        <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {children}
        </div>
    </div>
);

const ExampleGroup = ({ title, children }) => (
    <div className="space-y-3">
        <h4 className="text-lg font-medium text-gray-900">{title}</h4>
        {children}
    </div>
);

const CodeBlock = ({ children }) => (
    <div className="mt-4 bg-gray-100 rounded-md p-4 overflow-x-auto">
        <pre className="text-sm text-gray-800">
            <code>{children}</code>
        </pre>
    </div>
);

export default AtomsFormPage;