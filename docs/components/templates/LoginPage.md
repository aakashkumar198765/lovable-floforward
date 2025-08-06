# LoginPage Template

A comprehensive, enterprise-grade login page template that demonstrates how to build a login page with email and OTP-based authentication. This template serves as a reference for AI to understand the structure and patterns for creating similar login pages.

## Features

- **Two-Step Authentication**: Email + OTP verification process
- **Multiple Layouts**: Centered, split, and minimal layouts
- **Social Login**: Support for multiple social providers
- **Enterprise Features**: RBAC, audit trails, encryption levels
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliant
- **Customizable**: Extensive theming and configuration options

## Template Purpose

This template demonstrates the structure and patterns for building a login page with email + OTP authentication. AI can use this as a reference to understand:

- State management patterns
- Form validation and error handling
- Loading states and user feedback
- Two-step authentication flow
- Responsive design considerations
- Enterprise features integration

## Template Structure

```tsx
// Template demonstrates these key patterns:
const LoginPageTemplate: React.FC = () => {
  // 1. State Management Pattern
  const [currentStep, setCurrentStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Form Validation Pattern
  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    // API call pattern...
  }, [email]);

  // 3. Loading State Pattern
  setIsLoading(true);
  try {
    // API call
  } catch (err) {
    // Error handling
  } finally {
    setIsLoading(false);
  }

  // 4. Component Rendering Pattern
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {currentStep === 'email' ? renderEmailStep() : renderOtpStep()}
      </div>
    </div>
  );
};
```

## Props

### Basic Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique identifier |
| `title` | `string` | `'Welcome Back'` | Page title |
| `subtitle` | `string` | `'Sign in to your account to continue'` | Page subtitle |
| `logo` | `string` | - | Logo image URL |
| `logoAlt` | `string` | `'Company Logo'` | Logo alt text |
| `backgroundImage` | `string` | - | Background image URL (for split layout) |

### Layout & Styling

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `layout` | `'centered' \| 'split' \| 'minimal'` | `'centered'` | Layout variant |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Theme mode |
| `className` | `string` | - | Additional CSS classes |
| `style` | `React.CSSProperties` | - | Inline styles |

### Features Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showRememberMe` | `boolean` | `true` | Show remember me checkbox |
| `showForgotPassword` | `boolean` | `true` | Show forgot password link |
| `showSignUp` | `boolean` | `true` | Show sign up link |
| `showSocialLogin` | `boolean` | `false` | Show social login options |
| `showOtpResend` | `boolean` | `true` | Show OTP resend functionality |

### OTP Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `otpLength` | `number` | `6` | Number of OTP digits |
| `otpResendTime` | `number` | `30` | Resend timer in seconds |

### Social Login

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `socialProviders` | `Array<SocialProvider>` | `[]` | Social login providers |

```tsx
interface SocialProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
}
```

### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onEmailSubmit` | `(email: string) => Promise<boolean>` | Called when email is submitted |
| `onOtpSubmit` | `(otp: string) => Promise<boolean>` | Called when OTP is submitted |
| `onSocialLogin` | `(provider: string) => Promise<boolean>` | Called for social login |
| `onForgotPassword` | `(email: string) => Promise<boolean>` | Called for password reset |
| `onSignUp` | `() => void` | Called when sign up is clicked |
| `onLoginSuccess` | `(user: any) => void` | Called on successful login |
| `onLoginError` | `(error: string) => void` | Called on login error |

## Layouts

### Centered Layout
Default layout with centered content on a clean background.

```tsx
<LoginPage layout="centered" />
```

### Split Layout
Two-column layout with background image and login form.

```tsx
<LoginPage 
  layout="split"
  backgroundImage="/path/to/image.jpg"
/>
```

### Minimal Layout
Compact layout for quick access scenarios.

```tsx
<LoginPage layout="minimal" />
```

## Examples

### Basic Login
```tsx
<LoginPage
  title="Welcome Back"
  onEmailSubmit={handleEmailSubmit}
  onOtpSubmit={handleOtpSubmit}
/>
```

### Enterprise Login with Social
```tsx
<LoginPage
  title="Enterprise Login"
  subtitle="Secure access to your business platform"
  logo="/logo.png"
  backgroundImage="/background.jpg"
  layout="split"
  showSocialLogin={true}
  socialProviders={[
    { id: 'google', name: 'Google', icon: '🔍', color: '#4285F4' },
    { id: 'microsoft', name: 'Microsoft', icon: '🪟', color: '#00A4EF' }
  ]}
  onEmailSubmit={handleEmailSubmit}
  onOtpSubmit={handleOtpSubmit}
  onSocialLogin={handleSocialLogin}
/>
```

### Minimal Quick Access
```tsx
<LoginPage
  title="Quick Access"
  layout="minimal"
  size="sm"
  showRememberMe={false}
  showForgotPassword={false}
  otpLength={4}
  otpResendTime={15}
  onEmailSubmit={handleEmailSubmit}
  onOtpSubmit={handleOtpSubmit}
/>
```

## Enterprise Features

### RBAC Support
The component supports role-based access control through the `allowedActions` prop.

### Audit Trail
Login attempts are tracked for audit purposes when `auditTrail` is configured.

### Encryption Levels
Data encryption can be configured using the `encryptionLevel` prop:
- `'none'`: No encryption
- `'field'`: Field-level encryption (default)
- `'record'`: Record-level encryption
- `'standard'`: Standard encryption
- `'high'`: High-level encryption

### Workflow Integration
The component integrates with enterprise workflow systems through the `workflowContext` prop.

## Accessibility

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- WCAG 2.1 AA compliance

## Security Features

- Input validation and sanitization
- Rate limiting support
- Secure OTP generation
- Encrypted data transmission
- Audit trail logging

## Styling

The component uses Tailwind CSS classes and supports:
- Dark mode
- Custom color schemes
- Responsive design
- Custom animations
- Brand-specific theming

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading of components
- Optimized re-renders
- Minimal bundle size
- Efficient state management 