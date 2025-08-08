// Commerce State Types
export type CommerceState = 'initiation' | 'agreement' | 'execution' | 'settlement' | 'completion' | 'none';

// Layout Types
export interface FlexLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  inline?: boolean;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  background?: 'none' | 'white' | 'gray' | 'primary' | 'secondary' | string;
  border?: 'none' | 'default' | 'dashed' | 'dotted' | string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | string;
  children: React.ReactNode;
  childrenHeights?: string[];
}

export interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none' | 'subgrid' | string;
  rows?: 1 | 2 | 3 | 4 | 5 | 6 | 'none' | 'subgrid' | string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  gapX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  gapY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  flow?: 'row' | 'col' | 'row-dense' | 'col-dense';
  autoCols?: 'auto' | 'min' | 'max' | 'fr' | string;
  autoRows?: 'auto' | 'min' | 'max' | 'fr' | string;
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'between' | 'around' | 'evenly';
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'between' | 'around' | 'evenly';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  fullWidth?: boolean;
  fullHeight?: boolean;
  background?: 'none' | 'white' | 'gray' | 'primary' | 'secondary' | string;
  border?: 'none' | 'default' | 'dashed' | 'dotted' | string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | string;
  children: React.ReactNode;
}

// Navbar Types
export interface NavbarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
  submenu?: NavbarItem[];
}

export interface NavbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: NavbarItem[];
  activeItem?: string;
  variant?: 'default' | 'minimal' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  responsive?: boolean;
  showOverflow?: boolean;
  overflowTrigger?: 'hover' | 'click';
  onChange?: (itemId: string) => void;
  onItemClick?: (item: NavbarItem) => void;
}

// Sidebar Types
export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
  submenu?: SidebarItem[];
}

export interface SidebarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onToggle'> {
  items: SidebarItem[];
  activeItem?: string;
  variant?: 'default' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right';
  fixed?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  showTooltips?: boolean;
  onChange?: (itemId: string) => void;
  onItemClick?: (item: SidebarItem) => void;
  onToggle?: (collapsed: boolean) => void;
}

// Separator Key Types
export type SeparatorKey = 'arrow' | 'slash' | 'dot' | 'dash' | 'pipe' | 'chevron';

// User and Role Types
export interface UserRole {
  id?: string;
  name?: string;
  permissions?: string[];
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

// Workflow Context
export interface WorkflowContext {
  workflowId?: string;
  currentStep?: number;
  totalSteps?: number;
  stepName?: string;
  data?: any;
}

// AI Configuration
export interface AIComponentConfig {
  layout?: 'default' | 'compact' | 'expanded' | 'adaptive';
  features?: string[];
  customization?: Record<string, any>;
  hints?: string[];
}

// Dynamic Schema
export interface DynamicSchema {
  fields?: SchemaField[];
  validation?: ValidationRule[];
  metadata?: Record<string, any>;
}

export interface SchemaField {
  name?: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect';
  label?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type?: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message?: string;
}

// Audit Configuration
export interface AuditConfig {
  enabled?: boolean;
  level?: 'basic' | 'detailed' | 'full' | 'comprehensive';
  trackChanges?: boolean;
  logUserActions?: boolean;
}

// Audit Trail
export interface AuditTrail {
  id?: string;
  userId?: string;
  action?: string;
  timestamp?: Date;
  before?: any;
  after?: any;
  metadata?: Record<string, any>;
}

// Encryption Levels
export type EncryptionLevel = 'none' | 'field' | 'record' | 'standard' | 'high';

// Base Enterprise Component Props
export interface EnterpriseComponentProps {
  // Commerce state awareness
  commerceState?: CommerceState;
  workflowContext?: WorkflowContext;
  
  // AI configuration
  aiConfig?: AIComponentConfig;
  schema?: DynamicSchema;
  
  // RBAC
  allowedActions?: string[];
  userRole?: UserRole;
  
  // Data
  data?: any;
  onUpdate?: (data: any) => void;
  
  // Enterprise features
  auditTrail?: AuditConfig;
  encryptionLevel?: EncryptionLevel;
  
  // Standard props
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Clean Input Component Types (Business Logic Removed)
export interface CleanInputProps {
  // Basic HTML input props
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  encryptionLevel?: EncryptionLevel; // Encryption level for sensitive data
  // Styling props
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  status?: 'default' | 'error' | 'warning' | 'success';
  className?: string;
  style?: React.CSSProperties;
  
  // Label and helper text
  label?: string;
  helperText?: string;
  errorMessage?: string;
  
  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Event handlers
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

// Legacy Input Component Types (for backward compatibility)
export interface InputProps extends EnterpriseComponentProps {
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  status?: 'default' | 'error' | 'warning' | 'success';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

// Textarea Component Specific Types
export interface TextareaProps extends EnterpriseComponentProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  status?: 'default' | 'error' | 'warning' | 'success';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

// Select Component Types
export interface SelectOption {
  value?: string;
  label?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface SelectGroup {
  label?: string;
  options?: SelectOption[];
  disabled?: boolean;
}

export interface CascadingSelectData {
  [key: string]: SelectOption[] | SelectGroup[];
}

export type CascadingLevelData = SelectOption[] | SelectGroup[] | CascadingSelectData;

export interface SelectProps extends EnterpriseComponentProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | string[];
  defaultValue?: string | string[];
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  status?: 'default' | 'error' | 'warning' | 'success';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  options?: SelectOption[];
  groups?: SelectGroup[];
  maxSelections?: number;
  badgeColor?: string;
  badgeVariant?: 'default' | 'outlined' | 'filled';
  showBadges?: boolean;
  noOptionsMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
  tabIndex?: number;
  onChange?: (value: string | string[], option?: SelectOption | SelectOption[]) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  onSearch?: (searchTerm: string) => void;
  onClear?: () => void;
}

export interface MultiSelectProps extends Omit<SelectProps, 'value' | 'defaultValue' | 'onChange'> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[], options: SelectOption[]) => void;
  multiple?: boolean;
}

export interface CascadingSelectProps extends EnterpriseComponentProps {
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  status?: 'default' | 'error' | 'warning' | 'success';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  levels?: {
    placeholder?: string;
    label?: string;
    data?: CascadingLevelData;
  }[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[], level: number) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>, level: number) => void;
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>, level: number) => void;
}

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: string;
  color?: string;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  style?: React.CSSProperties;
  size?: string;
}

// Design Token Types
export interface DesignTokens {
  colors?: {
    primary?: Record<string, string>;
    gray?: Record<string, string>;
    success?: Record<string, string>;
    warning?: Record<string, string>;
    error?: Record<string, string>;
  };
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  fontFamily?: Record<string, string[]>;
  fontSize?: Record<string, string>;
  fontWeight?: Record<string, string>;
  boxShadow?: Record<string, string>;
}

// Component State Types
export interface ComponentState {
  loading?: boolean;
  error?: string | null;
  success?: boolean;
  data?: any;
}

// Theme Context
export interface ThemeContext {
  theme?: 'light' | 'dark';
  tokens?: DesignTokens;
  toggleTheme?: () => void;
}

// Form Validation
export interface FormValidation {
  isValid?: boolean;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
}

// Accessibility
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  role?: string;
  tabIndex?: number;
}

// Button Types
export interface ButtonProps extends EnterpriseComponentProps {
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'outline-danger' | 'outline-success' | 'outline-warning' | 'danger' | 'success' | 'warning' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  href?: string;
  id?: string;
  target?: string;
  rel?: string;
  role?: string;
  tabIndex?: number;
  applyDefaultClasses?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

// Clean Checkbox Types
export interface CleanCheckboxProps {
  // Basic HTML checkbox props
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  value?: string;
  name?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  
  // Styling props
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  className?: string;
  style?: React.CSSProperties;
  
  // Label and description props
  children?: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string;
  
  // Event handlers
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Legacy Checkbox Types (for backward compatibility)
export interface CheckboxProps extends EnterpriseComponentProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  value?: string;
  name?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  children?: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string;
  size?: "sm" | "md" | "lg";
  status?: string;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Radio Types
export interface RadioOption {
  value?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface RadioProps extends EnterpriseComponentProps {
  options?: RadioOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  description?: string;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Switch Types
export interface SwitchProps extends EnterpriseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right';
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Label Types
export interface LabelProps extends EnterpriseComponentProps {
  children?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'error' | 'warning' | 'success';
}

// Icon Types
export interface IconProps extends EnterpriseComponentProps {
  name?: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  children?: React.ReactNode;
  title?: string;
  decorative?: boolean;
}

// Avatar Types
export interface AvatarProps extends EnterpriseComponentProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  name?: string;
  initials?: string;
  fallback?: React.ReactNode;
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  border?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

// Image Types
export interface ImageProps extends EnterpriseComponentProps {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  fallback?: React.ReactNode;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

// Link Types
export interface LinkProps extends EnterpriseComponentProps {
  children?: React.ReactNode;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  external?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'danger';
  underline?: 'always' | 'hover' | 'never';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLAnchorElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLAnchorElement>) => void;
}

// Progress Types
export interface ProgressProps extends EnterpriseComponentProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  variant?: 'default' | 'striped' | 'animated';
  showValue?: boolean;
  label?: string;
  formatValue?: (value: number, max: number) => string;
}

// Alert Types
export interface AlertProps extends EnterpriseComponentProps {
  children?: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  title?: string;
  description?: string;
  dismissible?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  banner?: boolean;
  bordered?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onDismiss?: () => void;
}

// Status Types
export interface StatusProps extends EnterpriseComponentProps {
  status?: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning' | 'online' | 'offline' | 'away' | 'busy';
  variant?: 'dot' | 'badge' | 'text' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  showLabel?: boolean;
  animated?: boolean;
  icon?: React.ReactNode;
  color?: string;
  customColor?: string;
}

// Tooltip Types
export interface TooltipProps extends EnterpriseComponentProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end';
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  delay?: number;
  hideDelay?: number;
  disabled?: boolean;
  arrow?: boolean;
  offset?: number;
  maxWidth?: number | string;
}

// DatePicker Types
export interface DatePickerProps extends EnterpriseComponentProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  min?: string;
  max?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  status?: 'default' | 'error' | 'warning' | 'success';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  format?: string;
  showTime?: boolean;
  timeOnly?: boolean;
  timeFormat?: string;
  disabledDates?: string[];
  highlightedDates?: string[];
  firstDayOfWeek?: number;
  showWeekNumbers?: boolean;
  monthsToShow?: number;
  closeOnSelect?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onDateChange?: (date: Date | null, dateString: string) => void;
  onCalendarOpen?: () => void;
  onCalendarClose?: () => void;
}

// FileUpload Types
export interface FileUploadProps extends EnterpriseComponentProps {
  id?: string;
  name?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  allowedTypes?: string[];
  showPreview?: boolean;
  dragAndDrop?: boolean;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  status?: 'default' | 'error' | 'warning' | 'success';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  uploadText?: string;
  uploadingText?: string;
  successText?: string;
  files?: File[];
  onFilesChange?: (files: File[], newFiles: File[]) => void;
  onFileRemove?: (file: File, index: number) => void;
  onUploadStart?: (files: File[]) => void;
  onUploadProgress?: (progress: Record<string, number>) => void;
  onUploadComplete?: (files: File[]) => void;
  onUploadError?: (error: string, file?: File) => void;
  customUpload?: (files: File[]) => Promise<void>;
}

// Toast Types
export interface ToastProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  persistent?: boolean;
  closable?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose?: () => void;
  onOpen?: () => void;
}

// Modal Types
export interface ModalProps extends EnterpriseComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  variant?: 'modal' | 'slider';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  centered?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  loading?: boolean;
  destroyOnClose?: boolean;
  zIndex?: number;
  focusTrap?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  slideDirection?: 'left' | 'right' | 'top' | 'bottom';
  maxWidth?: string | number;
  maxHeight?: string | number;
  onOpen?: () => void;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
}

// Spinner Types
export interface SpinnerProps extends Omit<EnterpriseComponentProps, 'color'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted' | 'white';
  speed?: 'slow' | 'normal' | 'fast';
  thickness?: number;
  label?: string;
  overlay?: boolean;
  centered?: boolean;
}

// LoadingState Types
export interface LoadingStateProps extends EnterpriseComponentProps {
  loading?: boolean;
  children?: React.ReactNode;
  spinner?: React.ReactNode;
  overlay?: boolean;
  text?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  fullScreen?: boolean;
  transparent?: boolean;
  blur?: boolean;
}

// Tab Types
export interface TabItem {
  id?: string;
  label?: string;
  content?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  closable?: boolean;
}

export interface TabProps extends EnterpriseComponentProps {
  items?: TabItem[];
  activeTab?: string;
  defaultActiveTab?: string;
  variant?: 'default' | 'pills' | 'underline' | 'card';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  closable?: boolean;
  addable?: boolean;
  scrollable?: boolean;
  centered?: boolean;
  fullWidth?: boolean;
  onChange?: (activeTab: string) => void;
  onClose?: (tabId: string) => void;
  onAdd?: () => void;
}

// Breadcrumb Types
export interface BreadcrumbItem {
  id?: string;
  label?: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  current?: boolean;
  badge?: string | number;
  isEllipsis?: boolean;
}

export interface BreadcrumbProps extends EnterpriseComponentProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHome?: boolean;
  homeIcon?: React.ReactNode;
  homeHref?: string;
  collapsible?: boolean;
  onClick?: (item: BreadcrumbItem) => void;
}

// Menu Types
export interface MenuItem {
  id?: string;
  label?: string;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  divider?: boolean;
  submenu?: MenuItem[];
  badge?: string | number;
  shortcut?: string;
  description?: string;
}

export interface MenuProps extends EnterpriseComponentProps {
  items?: MenuItem[];
  variant?: 'default' | 'compact' | 'sidebar';
  trigger?: 'hover' | 'click';
  placement?: 'bottom' | 'top' | 'left' | 'right';
  showIcons?: boolean;
  showShortcuts?: boolean;
  closeOnClick?: boolean;
  maxHeight?: number;
  onSelect?: (item: MenuItem) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

// Pagination Types
export interface PaginationProps extends EnterpriseComponentProps {
  current?: number;
  total?: number;
  pageSize?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  size?: 'sm' | 'md' | 'lg';
  simple?: boolean;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  pageSizeOptions?: number[];
  showPrevNextJumpers?: boolean;
  showFirstLastJumpers?: boolean;
  onChange?: (page: number, pageSize?: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  formatTotal?: (total: number, range: [number, number]) => string;
}

// Navigation Button Types (different from form Button)
export interface NavigationButtonProps extends EnterpriseComponentProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

// ====================================
// MOLECULE COMPONENT TYPES
// ====================================

// Data Molecule Types
export interface SearchBoxProps extends EnterpriseComponentProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  readonly?: boolean;
  searchOnType?: boolean;
  debounceMs?: number;
  showClearButton?: boolean;
  showSearchButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  status?: 'default' | 'error' | 'warning' | 'success';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  searchIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onChange?: (value: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface FilterOption {
  key?: string;
  label?: string;
  type?: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'checkbox';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  defaultValue?: any;
  visible?: boolean;
  disabled?: boolean;
}

export interface FilterValue {
  [key: string]: any;
}

export interface FilterPanelProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  description?: string;
  filters?: FilterOption[];
  values?: FilterValue;
  defaultValues?: FilterValue;
  layout?: 'horizontal' | 'vertical' | 'grid';
  columns?: number;
  collapsible?: boolean;
  collapsed?: boolean;
  showApplyButton?: boolean;
  showClearButton?: boolean;
  showResetButton?: boolean;
  applyButtonText?: string;
  clearButtonText?: string;
  resetButtonText?: string;
  autoApply?: boolean;
  debounceMs?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  onApply?: (filters: FilterValue) => void;
  onClear?: () => void;
  onReset?: () => void;
  onChange?: (filters: FilterValue) => void;
  onFilterChange?: (key: string, value: any) => void;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export interface SortOption {
  key?: string;
  label?: string;
  defaultDirection?: 'asc' | 'desc';
  disabled?: boolean;
}

export interface SortCriteria {
  key?: string;
  direction?: 'asc' | 'desc';
}

export interface SortControlProps extends EnterpriseComponentProps {
  id?: string;
  label?: string;
  options?: SortOption[];
  value?: SortCriteria[];
  defaultValue?: SortCriteria[];
  multiple?: boolean;
  maxSorts?: number;
  showDirection?: boolean;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  showClearButton?: boolean;
  addButtonText?: string;
  clearButtonText?: string;
  noSortText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'compact';
  layout?: 'horizontal' | 'vertical' | 'inline';
  isDisabled?: boolean;
  isReadonly?: boolean;
  onChange?: (sorts: SortCriteria[]) => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  onClear?: () => void;
}

export interface BulkAction {
  key?: string;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning' | 'success';
  confirmRequired?: boolean;
  confirmTitle?: string;
  confirmMessage?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  disabled?: boolean;
  requiresSelection?: boolean;
  minSelection?: number;
  maxSelection?: number;
  permissions?: string[];
}

export interface BulkActionsProps extends EnterpriseComponentProps {
  id?: string;
  actions?: BulkAction[];
  selectedItems?: string[] | number[];
  totalItems?: number;
  showSelectAll?: boolean;
  showSelectionCount?: boolean;
  showItemsSelected?: boolean;
  selectAllText?: string;
  deselectAllText?: string;
  itemsSelectedText?: string;
  noActionsText?: string;
  layout?: 'horizontal' | 'dropdown' | 'toolbar';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'minimal';
  position?: 'top' | 'bottom' | 'sticky';
  isDisabled?: boolean;
  onAction?: (actionKey: string, selectedItems: string[] | number[]) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onSelectionChange?: (selectedItems: string[] | number[]) => void;
}

// Display Molecule Types
export interface StatusAction {
  key?: string;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning' | 'success';
  disabled?: boolean;
  hidden?: boolean;
  permissions?: string[];
  tooltip?: string;
}

export interface StatusCardProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
  status?: string;
  statusVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  description?: string;
  timestamp?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  progress?: number;
  metadata?: { [key: string]: any };
  actions?: StatusAction[];
  showActions?: boolean;
  showTimestamp?: boolean;
  showAssignee?: boolean;
  showPriority?: boolean;
  showProgress?: boolean;
  showCategory?: boolean;
  clickable?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  layout?: 'horizontal' | 'vertical' | 'compact';
  showMetadata?: boolean;
  onClick?: () => void;
  onAction?: (actionKey: string) => void;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export interface MetricData {
  value?: number | string;
  label?: string;
  unit?: string;
  format?: 'number' | 'currency' | 'percentage' | 'decimal' | 'custom';
  precision?: number;
  prefix?: string;
  suffix?: string;
}

export interface TrendData {
  value?: number;
  period?: string;
  direction?: 'up' | 'down' | 'neutral';
  isPositive?: boolean;
}

export interface ComparisonData {
  previous?: number;
  current?: number;
  label?: string;
  format?: 'number' | 'currency' | 'percentage';
}

export interface MetricCardProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
  metric?: MetricData;
  trend?: TrendData;
  comparison?: ComparisonData;
  description?: string;
  target?: number;
  isDisabled?: boolean;
  isReadonly?: boolean;
  threshold?: {
    warning?: number;
    critical?: number;
  };
  status?: 'normal' | 'warning' | 'critical' | 'excellent';
  category?: string;
  lastUpdated?: string;
  actions?: Array<{
    key?: string;
    label?: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary';
    disabled?: boolean;
  }>;
  showTrend?: boolean;
  showComparison?: boolean;
  showTarget?: boolean;
  showActions?: boolean;
  showLastUpdated?: boolean;
  clickable?: boolean;
  refreshable?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'minimal' | 'gradient';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  layout?: 'vertical' | 'horizontal' | 'compact';
  onClick?: () => void;
  onAction?: (actionKey: string) => void;
  onRefresh?: () => void;
}

export interface SummaryItem {
  key?: string;
  label?: string;
  value?: string | number | React.ReactNode;
  format?: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'boolean' | 'custom';
  highlight?: boolean;
  emphasis?: 'normal' | 'strong' | 'muted';
  tooltip?: string;
  copyable?: boolean;
  clickable?: boolean;
  visible?: boolean;
  order?: number;
}

export interface SummarySection {
  key?: string;
  title?: string;
  description?: string;
  items?: SummaryItem[];
  collapsible?: boolean;
  collapsed?: boolean;
  badge?: {
    text?: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  actions?: Array<{
    key?: string;
    label?: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary';
    disabled?: boolean;
  }>;
  visible?: boolean;
  order?: number;
}

export interface SummaryPanelProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
  sections?: SummarySection[];
  defaultCollapsed?: boolean;
  collapsibleSections?: boolean;
  showSectionBadges?: boolean;
  showSectionActions?: boolean;
  layout?: 'vertical' | 'horizontal' | 'grid' | 'compact';
  columns?: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  spacing?: 'tight' | 'normal' | 'relaxed';
  itemLayout?: 'rows' | 'columns' | 'inline';
  showEmptyItems?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  refreshable?: boolean;
  loading?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
  onSectionToggle?: (sectionKey: string, collapsed: boolean) => void;
  onSectionAction?: (sectionKey: string, actionKey: string) => void;
  onItemClick?: (sectionKey: string, itemKey: string) => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

export interface ProgressStep {
  key?: string;
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped' | 'cancelled';
  timestamp?: string;
  assignee?: string;
  duration?: number;
  metadata?: { [key: string]: any };
  icon?: React.ReactNode;
  actions?: Array<{
    key?: string;
    label?: string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    disabled?: boolean;
    icon?: React.ReactNode;
  }>;
  dependencies?: string[];
  optional?: boolean;
  estimate?: number;
  actualDuration?: number;
  notes?: string;
  attachments?: Array<{
    name?: string;
    url?: string;
    type?: string;
  }>;
  visible?: boolean;
  order?: number;
}

export interface ProgressTrackerProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
  steps?: ProgressStep[];
  currentStep?: string;
  overallProgress?: number;
  layout?: 'vertical' | 'horizontal' | 'compact' | 'timeline';
  orientation?: 'left' | 'right' | 'center';
  showProgress?: boolean;
  showTimestamps?: boolean;
  showAssignees?: boolean;
  showDurations?: boolean;
  showActions?: boolean;
  showNotes?: boolean;
  showAttachments?: boolean;
  showMetadata?: boolean;
  allowStepNavigation?: boolean;
  clickableSteps?: boolean;
  collapsibleSteps?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | string;
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  colorScheme?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  animateProgress?: boolean;
  showEstimates?: boolean;
  showOverallStats?: boolean;
  onStepClick?: (stepKey: string) => void;
  onStepAction?: (stepKey: string, actionKey: string) => void;
  onProgressUpdate?: (progress: number) => void;
}

// Form Molecule Types
export interface AddressData {
  type?: 'billing' | 'shipping' | 'mailing' | 'business';
  firstName?: string;
  lastName?: string;
  company?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  isBusinessAddress?: boolean;
}

export interface AddressFormProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  addressType?: 'billing' | 'shipping' | 'mailing' | 'business';
  value?: Partial<AddressData>;
  defaultValue?: Partial<AddressData>;
  required?: boolean;
  showTitle?: boolean;
  showType?: boolean;
  showPersonName?: boolean;
  showCompany?: boolean;
  showDefaultCheckbox?: boolean;
  showBusinessCheckbox?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
  layout?: 'vertical' | 'horizontal' | 'compact';
  columns?: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  countries?: Array<{ value: string; label: string }>;
  states?: Array<{ value: string; label: string }>;
  addressTypes?: Array<{ value: string; label: string }>;
  validation?: {
    required?: string[];
    patterns?: { [key: string]: string };
    customRules?: { [key: string]: (value: string) => string | null };
  };
  onChange?: (data: Partial<AddressData>) => void;
  onValidation?: (isValid: boolean, errors: { [key: string]: string }) => void;
  onSubmit?: (data: AddressData) => void;
}

export interface ContactData {
  type?: 'primary' | 'secondary' | 'emergency' | 'business';
  prefix?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  suffix?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  workPhone?: string;
  fax?: string;
  website?: string;
  linkedIn?: string;
  preferredContact?: 'email' | 'phone' | 'mobile' | 'work';
  timezone?: string;
  notes?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export interface ContactFormProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  contactType?: 'primary' | 'secondary' | 'emergency' | 'business';
  value?: Partial<ContactData>;
  defaultValue?: Partial<ContactData>;
  required?: boolean;
  showTitle?: boolean;
  showType?: boolean;
  showPrefix?: boolean;
  showMiddleName?: boolean;
  showSuffix?: boolean;
  showJobInfo?: boolean;
  showMultiplePhones?: boolean;
  showSocialLinks?: boolean;
  showPreferences?: boolean;
  showNotes?: boolean;
  showStatusFlags?: boolean;
  isDisabled?: boolean;
  isReadonly?: boolean;
  layout?: 'vertical' | 'horizontal' | 'compact';
  columns?: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  prefixes?: Array<{ value: string; label: string }>;
  suffixes?: Array<{ value: string; label: string }>;
  contactTypes?: Array<{ value: string; label: string }>;
  contactMethods?: Array<{ value: string; label: string }>;
  timezones?: Array<{ value: string; label: string }>;
  validation?: {
    required?: string[];
    patterns?: { [key: string]: string };
    customRules?: { [key: string]: (value: string) => string | null };
  };
  onChange?: (data: Partial<ContactData>) => void;
  onValidation?: (isValid: boolean, errors: { [key: string]: string }) => void;
  onSubmit?: (data: ContactData) => void;
}

export interface PaymentData {
  method?: 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal' | 'apple_pay' | 'google_pay' | 'crypto';
  cardNumber?: string;
  cardHolderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  paypalEmail?: string;
  cryptoWallet?: string;
  cryptoType?: 'bitcoin' | 'ethereum' | 'litecoin';
  billingAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  savePaymentMethod?: boolean;
  setAsDefault?: boolean;
  agreeToTerms?: boolean;
}

export interface PaymentFormProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  value?: Partial<PaymentData>;
  defaultValue?: Partial<PaymentData>;
  required?: boolean;
  showTitle?: boolean;
  allowedMethods?: PaymentData['method'][];
  showBillingAddress?: boolean;
  showSaveOptions?: boolean;
  showTermsAgreement?: boolean;
  enableEncryption?: boolean;
  layout?: 'vertical' | 'horizontal' | 'compact';
  columns?: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  paymentMethods?: Array<{ value: PaymentData['method']; label: string; icon?: React.ReactNode }>;
  countries?: Array<{ value: string; label: string }>;
  states?: Array<{ value: string; label: string }>;
  cryptoTypes?: Array<{ value: string; label: string }>;
  validation?: {
    required?: string[];
    patterns?: { [key: string]: string };
    customRules?: { [key: string]: (value: string) => string | null };
  };
  onChange?: (data: Partial<PaymentData>) => void;
  onValidation?: (isValid: boolean, errors: { [key: string]: string }) => void;
  onSubmit?: (data: PaymentData) => void;
}

export interface ApprovalData {
  id?: string;
  requestTitle?: string;
  requestType?: 'purchase' | 'expense' | 'budget' | 'contract' | 'hiring' | 'custom';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  amount?: number;
  currency?: string;
  description?: string;
  justification?: string;
  requestedBy?: string;
  requestedDate?: string;
  requiredBy?: string;
  department?: string;
  approvers?: string[];
  currentApprover?: string;
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvalLevel?: number;
  maxApprovalLevel?: number;
  comments?: string;
  attachments?: File[];
  requiresSignature?: boolean;
  signatureRequired?: boolean;
  urgentApproval?: boolean;
  skipLevels?: boolean;
  notifyOnDecision?: boolean;
}

export interface ApprovalFormProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  mode?: 'create' | 'review' | 'view';
  value?: Partial<ApprovalData>;
  defaultValue?: Partial<ApprovalData>;
  currentUser?: string;
  currentUserRole?: string;
  showTitle?: boolean;
  showAmount?: boolean;
  showAttachments?: boolean;
  showApprovalFlow?: boolean;
  showSignatureOption?: boolean;
  showUrgentOption?: boolean;
  enableComments?: boolean;
  layout?: 'vertical' | 'horizontal' | 'compact';
  columns?: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  requestTypes?: Array<{ value: string; label: string }>;
  priorities?: Array<{ value: string; label: string }>;
  departments?: Array<{ value: string; label: string }>;
  approvers?: Array<{ value: string; label: string; level?: number }>;
  currencies?: Array<{ value: string; label: string }>;
  approvalLevels?: Array<{ level?: number; name?: string; approvers?: string[], required?: boolean }>;
  validation?: {
    required?: string[];
    patterns?: { [key: string]: string };
    customRules?: { [key: string]: (value: string) => string | null };
  };
  onChange?: (data: Partial<ApprovalData>) => void;
  onValidation?: (isValid: boolean, errors: { [key: string]: string }) => void;
  onSubmit?: (data: ApprovalData) => void;
  onApprove?: (data: ApprovalData, comments: string) => void;
  onReject?: (data: ApprovalData, comments: string) => void;
  onDelegate?: (data: ApprovalData, newApprover: string) => void;
  onWithdraw?: (data: ApprovalData) => void;
}

// ====================================
// ORGANISM COMPONENT TYPES (TIER 3)
// ====================================

// Data Grid Types
export interface DataGridColumn {
  key?: string;
  title?: string;
  dataIndex?: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  validator?: (value: any) => string | null;
  editor?: 'input' | 'select' | 'datepicker' | 'checkbox' | React.ComponentType;
  editorProps?: any;
}

export interface DataGridData {
  [key: string]: any;
  id?: string | number;
}

export interface EditableDataGridProps extends EnterpriseComponentProps {
  id?: string;
  columns?: DataGridColumn[];
  data?: DataGridData[];
  loading?: boolean;
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    onChange?: (page: number, pageSize?: number) => void;
    onShowSizeChange?: (page: number, pageSize: number) => void;
  };
  infiniteScroll?: {
    enabled?: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    threshold?: number;
    showLoader?: boolean;
    onLoadMore?: (cursor?: string | number) => Promise<{
      data: DataGridData[];
      nextCursor?: string | number;
      hasNextPage: boolean;
    }>;
    onStateChange?: (state: {
      hasNextPage: boolean;
      isLoading: boolean;
      cursor?: string | number;
    }) => void;
  };
  selection?: {
    type?: 'checkbox' | 'radio';
    selectedRowKeys?: string[];
    onSelectionChange?: (selectedRowKeys: string[], selectedRows: DataGridData[]) => void;
  };
  editable?: boolean;
  expandable?: {
    expandedRowRender?: (record: DataGridData, index: number) => React.ReactNode;
    expandedRowKeys?: string[];
    onExpandedRowsChange?: (expandedRowKeys: string[]) => void;
  };
  virtualization?: {
    enabled?: boolean;
    itemHeight?: number;
    overscan?: number;
    containerHeight?: number;
    scrollToIndex?: number;
    onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void;
  };
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  striped?: boolean;
  sticky?: boolean;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  onRowClick?: (record: DataGridData, index: number) => void;
  onRowDoubleClick?: (record: DataGridData, index: number) => void;
  onCellEdit?: (value: any, record: DataGridData, column: DataGridColumn) => void;
  onRowAdd?: () => void;
  onRowDelete?: (record: DataGridData) => void;
  onExport?: (format: string) => void;
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
}

export interface ComparisonTableProps extends EnterpriseComponentProps {
  id?: string;
  items?: Array<{
    id?: string;
    name?: string;
    data?: Record<string, any>;
    metadata?: Record<string, any>;
  }>;
  criteria?: Array<{
    key?: string;
    label?: string;
    weight?: number;
    type?: 'numeric' | 'text' | 'boolean' | 'rating';
    formatter?: (value: any) => string;
    comparator?: (a: any, b: any) => number;
  }>;
  scoring?: {
    enabled?: boolean;
    method?: 'weighted' | 'simple' | 'custom';
    customScorer?: (item: any, criteria: any[]) => number;
  };
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showScores?: boolean;
  showRanking?: boolean;
  highlightBest?: boolean;
  exportable?: boolean;
  onItemSelect?: (item: any) => void;
  onCompare?: (items: any[]) => void;
  onExport?: (format: string) => void;
}

export interface PivotTableProps extends EnterpriseComponentProps {
  id?: string;
  data?: Array<Record<string, any>>;
  rows?: string[];
  columns?: string[];
  values?: Array<{
    field?: string;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
    formatter?: (value: any) => string;
  }>;
  filters?: Record<string, any>;
  sorting?: {
    field?: string;
    direction?: 'asc' | 'desc';
  };
  expandable?: boolean;
  exportable?: boolean;
  configurable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTotals?: boolean;
  showSubtotals?: boolean;
  onCellClick?: (value: any, rowData: any, colData: any) => void;
  onDrillDown?: (field: string, value: any) => void;
  onExport?: (format: string) => void;
}

// Workflow Types
export interface WorkflowStep {
  id?: string;
  name?: string;
  description?: string;
  type?: 'approval' | 'task' | 'decision' | 'notification';
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  assignees?: string[];
  dueDate?: string;
  completedBy?: string;
  completedAt?: string;
  duration?: number;
  dependencies?: string[];
  conditions?: Record<string, any>;
  actions?: Array<{
    id?: string;
    label?: string;
    type?: 'approve' | 'reject' | 'delegate' | 'skip' | 'custom';
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  }>;
  metadata?: Record<string, any>;
  optional?: boolean | string;
}

export interface ApprovalWorkflowProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  steps?: WorkflowStep[];
  currentStep?: string;
  requestData?: Record<string, any>;
  approvers?: Array<{
    id?: string;
    name?: string;
    role?: string;
    level?: number;
  }>;
  parallel?: boolean;
  autoAdvance?: boolean;
  layout?: 'vertical' | 'horizontal' | 'timeline';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  showHistory?: boolean;
  showComments?: boolean;
  allowDelegate?: boolean;
  allowSkip?: boolean;
  exportable?: boolean;
  importable?: boolean;
  onStepAction?: (stepId: string, action: string, data?: any) => void;
  onWorkflowComplete?: (result: 'approved' | 'rejected' | 'cancelled') => void;
  onDelegate?: (stepId: string, newAssignee: string) => void;
}

export interface StateTransitionProps extends EnterpriseComponentProps {
  id?: string;
  currentState?: string;
  availableStates?: Array<{
    key?: string;
    label?: string;
    description?: string;
    color?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    requiredPermissions?: string[];
  }>;
  transitions?: Array<{
    from?: string;
    to?: string;
    label?: string;
    conditions?: Array<{
      field?: string;
      operator?: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'notin';
      value?: any;
    }>;
    actions?: string[];
  }>;
  layout?: 'buttons' | 'dropdown' | 'timeline' | 'diagram';
  size?: 'sm' | 'md' | 'lg';
  showHistory?: boolean;
  showValidation?: boolean;
  confirmTransitions?: boolean;
  exportable?: boolean;
  importable?: boolean;
  onStateChange?: (fromState: string, toState: string) => void;
  onValidate?: (toState: string) => Promise<boolean>;
}

export interface WorkflowTrackerProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  workflows?: Array<{
    id?: string;
    name?: string;
    status?: any;
    currentStep?: string;
    totalSteps?: number;
    completedSteps?: number;
    assignee?: any;
    priority?: any;
    dueDate?: string;
    startDate?: string;
    completedDate?: string;
    metadata?: Record<string, any>;
  }>;
  groupBy?: string;
  filters?: {
    status?: string[];
    assignee?: string[];
    priority?: string[];
    dateRange?: { start: string; end: string };
  };
  layout?: string;
  size?: 'sm' | 'md' | 'lg';
  showMetrics?: boolean;
  showFilters?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onWorkflowClick?: (workflow: any) => void;
  onWorkflowAction?: (workflowId: string, action: string) => void;
  onFilterChange?: (filters: any) => void;
}

// Management Types
export interface SettingCategory {
  id?: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  settings?: Setting[];
  collapsed?: boolean;
  permissions?: string[];
}

export interface Setting {
  id?: string;
  name?: string;
  description?: string;
  type?: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'json' | 'file';
  value?: any;
  defaultValue?: any;
  options?: Array<{ value: any; label: string }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
  sensitive?: boolean;
  readonly?: boolean;
  hidden?: boolean;
}

export interface SettingsManagerProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  categories?: SettingCategory[];
  layout?: 'tabs' | 'accordion' | 'sidebar';
  searchable?: boolean;
  exportable?: boolean;
  importable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showResetButton?: boolean;
  showSaveButton?: boolean;
  autoSave?: boolean;
  validation?: boolean;
  onSettingChange?: (settingId: string, value: any, categoryId: string) => void;
  onSave?: (settings: Record<string, any>) => Promise<void>;
  onReset?: (categoryId?: string) => void;
  onImport?: (settings: Record<string, any>) => void;
  onExport?: () => Record<string, any>;
}

export interface UserManagerProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  users?: Array<{
    id?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    status?: 'active' | 'inactive' | 'suspended' | 'pending';
    roles?: string[];
    permissions?: string[];
    lastLogin?: string;
    createdAt?: string;
    metadata?: Record<string, any>;
  }>;
  roles?: Array<{
    id?: string;
    name?: string;
    description?: string;
    permissions?: string[];
  }>;
  permissions?: Array<{
    id?: string;
    name?: string;
    description?: string;
    category?: string;
  }>;
  layout?: 'table' | 'cards' | 'list';
  searchable?: boolean;
  filterable?: boolean;
  bulkActions?: boolean;
  inviteUsers?: boolean;
  exportable?: boolean;
  importable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onUserCreate?: (userData: any) => void;
  onUserUpdate?: (userId: string, userData: any) => void;
  onUserDelete?: (userId: string) => void;
  onUserInvite?: (inviteData: any) => void;
  onRoleAssign?: (userId: string, roleIds: string[]) => void;
  onPermissionGrant?: (userId: string, permissionIds: string[]) => void;
  onStatusChange?: (userId: string, status: string) => void;
}

export interface RoleManagerProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  roles?: Array<{
    id?: string;
    name?: string;
    description?: string;
    type?: 'system' | 'custom';
    permissions?: string[];
    userCount?: number;
    createdAt?: string;
    updatedAt?: string;
    metadata?: Record<string, any>;
  }>;
  permissions?: Array<{
    id?: string;
    name?: string;
    description?: string;
    category?: string;
    type?: 'read' | 'write' | 'delete' | 'admin';
  }>;
  layout?: 'table' | 'cards' | 'tree';
  hierarchical?: boolean;
  searchable?: boolean;
  cloneable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showPermissionMatrix?: boolean;
  exportable?: boolean;
  importable?: boolean;
  onRoleCreate?: (roleData: any) => void;
  onRoleUpdate?: (roleId: string, roleData: any) => void;
  onRoleDelete?: (roleId: string) => void;
  onRoleClone?: (roleId: string, newName: string) => void;
  onPermissionChange?: (roleId: string, permissionIds: string[]) => void;
}

// Integration Types
export interface ImportStep {
  id?: string;
  name?: string;
  description?: string;
  type?: 'upload' | 'mapping' | 'validation' | 'preview' | 'import';
  status?: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  optional?: boolean;
  data?: any;
}

export interface ImportWizardProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  steps?: ImportStep[];
  supportedFormats?: string[];
  maxFileSize?: number;
  templateDownload?: boolean;
  batchProcessing?: boolean;
  validationRules?: Array<{
    field?: string;
    type?: 'required' | 'type' | 'format' | 'range' | 'custom';
    params?: any;
    message?: string;
  }>;
  fieldMapping?: Array<{
    source?: string;
    target?: string;
    required?: boolean;
    transformer?: (value: any) => any;
  }>;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  allowSkipSteps?: boolean;
  exportable?: boolean;
  importable?: boolean;
  onFileUpload?: (file: File) => void;
  onFieldMapping?: (mapping: any[]) => void;
  onValidation?: (data: any[]) => Promise<any[]>;
  onImport?: (data: any[], options: any) => Promise<any>;
  onComplete?: (result: any) => void;
  onCancel?: () => void;
}

export interface ExportManagerProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  data?: any[] | (() => Promise<any[]>);
  formats?: Array<{
    key?: string;
    label?: string;
    extension?: string;
    mimeType?: string;
    description?: string;
    icon?: React.ReactNode;
  }>;
  templates?: Array<{
    id?: string;
    name?: string;
    description?: string;
    format?: string;
    fields?: string[];
    filters?: any;
  }>;
  fields?: Array<{
    key?: string;
    label?: string;
    type?: string;
    required?: boolean;
    formatter?: (value: any) => string;
  }>;
  filters?: Record<string, any>;
  scheduling?: {
    enabled?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'custom';
    time?: string;
    recipients?: string[];
  };
  size?: 'sm' | 'md' | 'lg';
  showPreview?: boolean;
  showProgress?: boolean;
  batchSize?: number;
  exportable?: boolean;
  importable?: boolean;
  onExport?: (format: string, options: any) => Promise<void>;
  onSchedule?: (schedule: any) => void;
  onTemplateCreate?: (template: any) => void;
  onTemplateUpdate?: (templateId: string, template: any) => void;
}

export interface APIConnectorProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  endpoints?: Array<{
    id?: string;
    name?: string;
    description?: string;
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    authentication?: {
      type?: 'none' | 'basic' | 'bearer' | 'api_key' | 'oauth2';
      credentials?: Record<string, any>;
    };
    parameters?: Array<{
      name?: string;
      type?: 'query' | 'path' | 'header' | 'body';
      required?: boolean;
      description?: string;
      defaultValue?: any;
    }>;
    responseMapping?: Record<string, string>;
    status?: 'connected' | 'disconnected' | 'error' | 'testing';
    lastTested?: string;
  }>;
  integrations?: Array<{
    id?: string;
    name?: string;
    type?: 'webhook' | 'polling' | 'realtime';
    source?: string;
    target?: string;
    transformations?: any[];
    schedule?: string;
    status?: 'active' | 'paused' | 'error';
    lastRun?: string;
    nextRun?: string;
  }>;
  exportable?: boolean;
  importable?: boolean;
  layout?: 'tabs' | 'accordion' | 'split';
  testable?: boolean;
  monitorable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLogs?: boolean;
  showMetrics?: boolean;
  onEndpointTest?: (endpointId: string) => Promise<any>;
  onEndpointSave?: (endpointData: any) => void;
  onIntegrationToggle?: (integrationId: string, active: boolean) => void;
  onIntegrationRun?: (integrationId: string) => void;
  onIntegrationCreate?: (integrationData: any) => void;
}

// ====================================
// TEMPLATE COMPONENT TYPES (TIER 4)
// ====================================

// Layout Template Types
export interface DashboardLayoutProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  headerContent?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  sidebarWidth?: string;
  sidebarCollapsible?: boolean;
  headerHeight?: string;
  footerHeight?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
  }>;
  metrics?: Array<{
    label: string;
    value: string | number;
    change?: string;
    icon?: string;
  }>;
  quickActions?: Array<{
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
  }>;
  notifications?: Array<{
    id?: string;
    title: string;
    message: string;
    timestamp?: string;
    read?: boolean;
  }>;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'auto';
  responsive?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
  onNotificationClick?: (notification: any) => void;
  onQuickAction?: (action: any) => void;
  onMetricClick?: (metric: any) => void;
}

export interface FormLayoutProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  description?: string;
  steps?: Array<{
    title: string;
    content?: React.ReactNode;
  }>;
  currentStep?: number;
  showProgress?: boolean;
  showStepNavigation?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  confirmBeforeLeave?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'single-column' | 'two-column' | 'three-column';
  formActions?: Array<{
    id: string;
    label: string;
    variant: string;
    action: () => void;
    disabled?: boolean;
    icon?: any;
  }>;
  headerActions?: React.ReactNode;
  showRequiredIndicator?: boolean;
  onStepChange?: (stepIndex: number, step: any) => void;
  onFormSubmit?: (data: any) => void;
  onFormCancel?: () => void;
  onFormSave?: (data: any) => void;
  onFieldChange?: (fieldName: string, value: any) => void;
  onValidation?: (fieldName: string, error?: string) => void;
}

export interface ListDetailLayoutProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  listTitle?: string;
  detailTitle?: string;
  items?: any[];
  selectedItem?: any;
  listWidth?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  showBulkActions?: boolean;
  showItemActions?: boolean;
  virtualizedList?: boolean;
  resizable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{
      value: string;
      label: string;
    }>;
  }>;
  bulkActions?: Array<{
    id: string;
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  itemActions?: Array<{
    id: string;
    label: string;
    icon?: string;
  }>;
  searchPlaceholder?: string;
  emptyStateMessage?: string;
  loadingState?: boolean;
  onItemSelect?: (item: any) => void;
  onItemAction?: (item: any, action: string) => void;
  onBulkAction?: (selectedItems: string[], action: string) => void;
  onSearch?: (term: string) => void;
  onFilter?: (filters: any) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  listContent?: React.ReactNode;
  detailContent?: React.ReactNode;
}

// Page Template Types
export interface SettingsPageProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  description?: string;
  sections?: Array<{
    id: string;
    title: string;
    description?: string;
    icon?: string;
    badge?: string | number;
    settings?: Array<{
      key: string;
      label: string;
      description?: string;
      type: 'text' | 'email' | 'url' | 'textarea' | 'number' | 'select' | 'boolean' | 'radio' | 'file';
      defaultValue?: any;
      placeholder?: string;
      required?: boolean;
      disabled?: boolean;
      options?: Array<{
        value: string;
        label: string;
      }>;
      checkboxLabel?: string;
      rows?: number;
      min?: number;
      max?: number;
      step?: number;
      accept?: string;
      help?: string;
    }>;
  }>;
  activeSection?: number;
  showNavigation?: boolean;
  showSearch?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  confirmChanges?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'sidebar' | 'tabs';
  onSectionChange?: (sectionIndex: number, section: any) => void;
  onSettingChange?: (settingKey: string, value: any) => void;
  onSave?: (data: any) => void;
  onReset?: () => void;
  onExport?: (data: any) => void;
  onImport?: (data: any) => void;
}

export interface ReportsPageProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  description?: string;
  reports?: Array<{
    id: string;
    title: string;
    description?: string;
    status?: 'ready' | 'generating' | 'failed';
    lastGenerated?: string;
    filters?: any;
  }>;
  charts?: Array<{
    id: string;
    title: string;
    description?: string;
    type?: 'line' | 'bar' | 'pie';
    content?: React.ReactNode;
  }>;
  metrics?: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeLabel?: string;
    icon?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendPercentage?: number;
  }>;
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{
      value: string;
      label: string;
    }>;
  }>;
  dateRanges?: Array<{
    label: string;
    value: string;
  }>;
  selectedDateRange?: string;
  showFilters?: boolean;
  showExport?: boolean;
  showSchedule?: boolean;
  refreshInterval?: number;
  autoRefresh?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'grid' | 'list' | 'masonry';
  onFilterChange?: (filters: any) => void;
  onDateRangeChange?: (range: string, customRange?: { start: string; end: string }) => void;
  onReportGenerate?: (reportId: string, config?: any) => void;
  onExport?: (format: string, reportIds?: string[]) => void;
  onSchedule?: (reportId: string, schedule: any) => void;
  onRefresh?: () => void;
  onChartInteraction?: (chartId: string, interaction: any) => void;
}

export interface WorkflowPageProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  description?: string;
  workflows?: Array<{
    id: string;
    name: string;
    description?: string;
    status: 'draft' | 'running' | 'paused' | 'completed' | 'failed';
    category?: string;
    steps?: Array<any>;
    lastRun?: string;
  }>;
  templates?: Array<{
    id: string;
    name: string;
    description?: string;
    category?: string;
    usageCount?: number;
  }>;
  currentWorkflow?: any;
  showDesigner?: boolean;
  showTemplates?: boolean;
  showMetrics?: boolean;
  showHistory?: boolean;
  designerMode?: 'visual' | 'code';
  viewMode?: 'list' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  setViewMode?: (mode: 'list' | 'grid') => void;
  setDesignerMode?: (mode: 'visual' | 'code') => void;
  onWorkflowSelect?: (workflow: any) => void;
  onWorkflowCreate?: (data: any) => void;
  onWorkflowUpdate?: (workflowId: string, data: any) => void;
  onWorkflowDelete?: (workflowId: string) => void;
  onWorkflowExecute?: (workflowId: string) => void;
  onWorkflowPause?: (workflowId: string) => void;
  onWorkflowResume?: (workflowId: string) => void;
  onWorkflowCancel?: (workflowId: string) => void;
  onTemplateSelect?: (template: any) => void;
  onStepEdit?: (stepId: string, data: any) => void;
  onConnectionEdit?: (connectionId: string, data: any) => void;
}

export interface LoginPageProps extends EnterpriseComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
  logo?: string;
  logoAlt?: string;
  backgroundImage?: string;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showSignUp?: boolean;
  showSocialLogin?: boolean;
  socialProviders?: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  otpLength?: number;
  otpResendTime?: number;
  showOtpResend?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'centered' | 'split' | 'minimal';
  theme?: 'light' | 'dark' | 'auto';
  onEmailSubmit?: (email: string) => Promise<boolean>;
  onOtpSubmit?: (otp: string) => Promise<boolean>;
  onSocialLogin?: (provider: string) => Promise<boolean>;
  onForgotPassword?: (email: string) => Promise<boolean>;
  onSignUp?: () => void;
  onLoginSuccess?: (user: any) => void;
  onLoginError?: (error: string) => void;
}

// =============================================================================
// TAILWIND CLASS MAP TYPES
// =============================================================================

// Size Types
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpacingSize = 'sm' | 'md' | 'lg';

// Variant Types
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'outline' 
  | 'outline-danger' 
  | 'outline-success' 
  | 'outline-warning' 
  | 'danger' 
  | 'success' 
  | 'warning' 
  | 'ghost' 
  | 'link';

export type InputVariant = 'default' | 'outlined' | 'filled';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

// Status Types
export type InputStatus = 'default' | 'error' | 'warning' | 'success';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';
export type IndicatorStatus = 'active' | 'inactive' | 'pending' | 'error' | 'warning';

// Shape Types
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type AvatarShape = 'circle' | 'square' | 'rounded';

// Position Types
export type StatusPosition = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
export type ModalPosition = 'center' | 'top' | 'bottom';
export type ToastPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'top-center' 
  | 'bottom-center';

// Layout Types
export type ContainerType = 'default' | 'fluid' | 'narrow';
export type GridCols = 'cols1' | 'cols2' | 'cols3' | 'cols4';
export type FlexLayout = 'center' | 'between' | 'start' | 'end' | 'col' | 'colCenter';

// Animation Types
export type TransitionSpeed = 'default' | 'fast' | 'slow' | 'colors' | 'opacity';
export type LoadingAnimation = 'pulse' | 'spin' | 'bounce';
export type HoverEffect = 'scale' | 'opacity' | 'shadow';

// Focus Types
export type FocusRing = 'default' | 'primary' | 'error' | 'success' | 'warning';

// Shadow Types
export type ShadowElevation = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// Border Types
export type BorderWidth = 'none' | 'thin' | 'thick';
export type BorderColor = 'default' | 'primary' | 'error' | 'success' | 'warning';

// Class Map Interface Types
export interface SizeClassMap {
  text: Record<TextSize, string>;
  button: Record<ComponentSize, string>;
  input: Record<ComponentSize, string>;
  avatar: Record<AvatarSize, string>;
  icon: Record<IconSize, string>;
  badge: Record<BadgeSize, string>;
  spacing: Record<SpacingSize, string>;
}

export interface VariantClassMap {
  button: Record<ButtonVariant, string>;
  input: Record<InputVariant, string>;
  badge: Record<BadgeVariant, string>;
  alert: Record<AlertVariant, string>;
}

export interface StatusClassMap {
  input: Record<InputStatus, string>;
  avatar: Record<AvatarStatus, string>;
  indicator: Record<IndicatorStatus, string>;
}

export interface ShapeClassMap {
  rounded: Record<BorderRadius, string>;
  avatar: Record<AvatarShape, string>;
}

export interface PositionClassMap {
  status: Record<StatusPosition, string>;
  modal: Record<ModalPosition, string>;
  toast: Record<ToastPosition, string>;
}

export interface LayoutClassMap {
  container: Record<ContainerType, string>;
  grid: Record<GridCols, string>;
  flex: Record<FlexLayout, string>;
  size: Record<ComponentSize, string>;
  variant: Record<LayoutVariant, string>;
}

export interface AnimationClassMap {
  transition: Record<TransitionSpeed, string>;
  loading: Record<LoadingAnimation, string>;
  hover: Record<HoverEffect, string>;
}

export interface FocusClassMap {
  ring: Record<FocusRing, string>;
}

export interface StateClassMap {
  disabled: {
    button: string;
    input: string;
    general: string;
  };
  loading: {
    button: string;
    overlay: string;
  };
  interactive: {
    clickable: string;
    hoverable: string;
    selectable: string;
  };
}

export interface ShadowClassMap {
  elevation: Record<ShadowElevation, string>;
}

export interface BorderClassMap {
  width: Record<BorderWidth, string>;
  color: Record<BorderColor, string>;
}

// Navigation-specific Types
export type TabVariant = 'default' | 'pills' | 'underline' | 'card';
export type MenuVariant = 'default' | 'compact' | 'sidebar';
export type MenuTrigger = 'hover' | 'click';
export type MenuPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface NavigationClassMap {
  tab: Record<TabVariant, {
    container: string;
    tab: string;
    active: string;
    inactive: string;
    content: string;
  }>;
  menu: Record<MenuVariant, string>;
  menuItem: {
    default: string;
    disabled: string;
    submenu: string;
    divider: string;
  };
  breadcrumb: {
    container: string;
    item: string;
    current: string;
    separator: string;
    link: string;
  };
  pagination: {
    container: string;
    list: string;
    item: string;
    active: string;
    disabled: string;
    ellipsis: string;
  };
}

// Form-specific Types
export type FieldContainer = 'container' | 'wrapper';
export type LabelVariant = 'default' | 'required' | 'optional' | 'disabled';
export type HelperTextVariant = 'default' | 'error' | 'warning' | 'success';

export interface FormClassMap {
  field: {
    container: string;
    wrapper: string;
    icon: string;
    iconLeft: string;
    iconRight: string;
    iconFocused: string;
  };
  label: Record<LabelVariant, string>;
  helperText: Record<HelperTextVariant, string>;
  choice: {
    container: string;
    input: string;
    label: string;
    description: string;
  };
  switch: {
    container: string;
    track: {
      off: string;
      on: string;
    };
    thumb: string;
    thumbPosition: {
      off: string;
      on: string;
    };
  };
  fileUpload: {
    dropzone: string;
    dropzoneActive: string;
    content: string;
    icon: string;
    text: string;
    subtext: string;
  };
}

// Display-specific Types
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface DisplayClassMap {
  card: Record<CardVariant, string>;
  avatarGroup: {
    container: string;
    avatar: string;
    more: string;
  };
  badgePosition: Record<BadgePosition, string>;
  metric: {
    container: string;
    value: string;
    label: string;
    change: string;
    changePositive: string;
    changeNegative: string;
    changeNeutral: string;
  };
}

// Feedback-specific Types
export type ToastContainer = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface FeedbackClassMap {
  toastContainer: Record<ToastContainer, string>;
  toast: {
    base: string;
    info: string;
    success: string;
    warning: string;
    error: string;
  };
  toastIcon: Record<ToastVariant, string>;
  modal: {
    backdrop: string;
    container: string;
    wrapper: string;
    panel: string;
    header: string;
    title: string;
    content: string;
    actions: string;
  };
  progress: {
    track: string;
    bar: string;
    label: string;
    percentage: string;
  };
  loading: {
    spinner: string;
    overlay: string;
    skeleton: string;
  };
}

// Additional Class Map Types for component-specific classes
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted' | 'white';
export type LoadingStateSize = 'sm' | 'md' | 'lg';
export type FormInputSize = 'sm' | 'md' | 'lg';
export type FormInputVariant = 'default' | 'outlined' | 'filled';
export type FormInputStatus = 'default' | 'error' | 'warning' | 'success';
export type LayoutVariant = 'vertical' | 'horizontal' | 'compact';
export type GridLayoutType = 'single-column' | 'two-column' | 'three-column';

export interface SpinnerClassMap {
  size: Record<SpinnerSize, string>;
  color: Record<SpinnerColor, string>;
}

export interface LoadingStateClassMap {
  size: Record<LoadingStateSize, {
    text: string;
    description: string;
    spacing: string;
  }>;
}
export interface FormInputClassMap {
  size: Record<FormInputSize, string>;
  variant: Record<FormInputVariant, string>;
  status: Record<FormInputStatus, string>;
}

export interface ToastContainerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  children?: React.ReactNode;
  className?: string;
}


export interface FlexLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex direction */
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  /** Flex wrap */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Justify content (main axis alignment) */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  /** Align items (cross axis alignment) */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /** Align content (multi-line alignment) */
  alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch';
  /** Gap between items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  /** Inline flex instead of block flex */
  inline?: boolean;
  /** Custom padding */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  /** Custom margin */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  /** Full width */
  fullWidth?: boolean;
  /** Full height */
  fullHeight?: boolean;
  /** Background color variant */
  background?: 'none' | 'white' | 'gray' | 'primary' | 'secondary' | string;
  /** Border variant */
  border?: 'none' | 'default' | 'dashed' | 'dotted' | string;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
  /** Shadow variant */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | string;
  /** Children components */
  children: React.ReactNode;
  /** Width percentages for each child component */
  childrenWidths?: string[];
}
export interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none' | 'subgrid' | string;
  /** Number of rows */
  rows?: 1 | 2 | 3 | 4 | 5 | 6 | 'none' | 'subgrid' | string;
  /** Gap between grid items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  /** Gap between columns */
  gapX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  /** Gap between rows */
  gapY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  /** Grid flow direction */
  flow?: 'row' | 'col' | 'row-dense' | 'col-dense';
  /** Auto columns sizing */
  autoCols?: 'auto' | 'min' | 'max' | 'fr' | string;
  /** Auto rows sizing */
  autoRows?: 'auto' | 'min' | 'max' | 'fr' | string;
  /** Justify items (horizontal alignment within grid cells) */
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  /** Align items (vertical alignment within grid cells) */
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  /** Justify content (horizontal alignment of grid within container) */
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'between' | 'around' | 'evenly';
  /** Align content (vertical alignment of grid within container) */
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'between' | 'around' | 'evenly';
  /** Custom padding */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  /** Custom margin */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;
  /** Full width */
  fullWidth?: boolean;
  /** Full height */
  fullHeight?: boolean;
  /** Background color variant */
  background?: 'none' | 'white' | 'gray' | 'primary' | 'secondary' | string;
  /** Border variant */
  border?: 'none' | 'default' | 'dashed' | 'dotted' | string;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
  /** Shadow variant */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | string;
  /** Children components */
  children: React.ReactNode;
}


export interface NavbarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
  submenu?: NavbarItem[];
}

export interface NavbarProps {
  items: NavbarItem[];
  activeItem?: string;
  variant?: 'default' | 'minimal' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  responsive?: boolean;
  showOverflow?: boolean;
  overflowTrigger?: 'hover' | 'click';
  className?: string;
  style?: React.CSSProperties;
  onChange?: (itemId: string) => void;
  onItemClick?: (item: NavbarItem) => void;
}