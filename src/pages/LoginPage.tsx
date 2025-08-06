import React, { useState, useCallback, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Shield,
  CheckCircle,
  AlertCircle,
  User,
  Key,
  Building,
  Globe,
  Smartphone,
  Clock,
  CheckCircle2
} from 'lucide-react';

// Using reusable components as demonstrated in the template
import Button from '../components/atoms/form/Button';
import Input from '../components/atoms/form/Input';
import Alert from '../components/atoms/feedback/Alert';
import Spinner from '../components/atoms/feedback/Spinner';

const LoginPage: React.FC = () => {
  // Following LoginPageTemplate patterns exactly
  const [currentStep, setCurrentStep] = useState<'email' | 'otp'>('otp');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState(0);

  // Following template timer pattern for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Following template email submission pattern
  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Following template validation pattern
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Following template loading state pattern
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Following template API call pattern
      // In real implementation, this would call your authentication service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Following template success handling pattern
      setCurrentStep('otp');
      setSuccess('OTP sent successfully!');
      setResendTimer(30);
      console.log('Email submitted, moving to OTP step');
      
    } catch (err) {
      // Following template error handling pattern
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Following template OTP submission pattern
  const handleOtpSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Following template validation pattern
    if (!otp || otp.length !== 8) {
      setError('Please enter the 8-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Following template API call pattern
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Following template success/failure pattern
      const success = otp === '12345678'; // Demo: 12345678 is valid
      if (success) {
        setSuccess('Login successful! Redirecting to dashboard...');
        console.log('Login successful for:', email);
        // Redirect or handle successful login
        setTimeout(() => {
          window.location.href = '/dashboard'; // or use router
        }, 2000);
      } else {
        setError('Invalid OTP. Please try again.');
        console.log('Invalid OTP entered:', otp);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [otp, email]);

  // Following template resend pattern
  const handleResendOtp = useCallback(async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('OTP resent successfully');
      setResendTimer(30);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resendTimer]);

  // Enhanced timer component
  const renderTimer = () => {
    if (currentStep !== 'otp' || resendTimer === 0) return null;
    
    return (
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Clock className="h-4 w-4" />
        <span>Resend available in</span>
        <span className="font-mono font-medium text-primary-600">{resendTimer}s</span>
      </div>
    );
  };

  // Following template email step rendering pattern
  const renderEmailStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
            <Mail className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Enter your email to receive a one-time password
        </p>
      </div>

      {/* Following template form pattern */}
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
            required
            size="md"
            disabled={isLoading}
          />
        </div>

        {/* Following template submit button pattern */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={isLoading}
          disabled={!email || isLoading}
          iconRight={<ArrowRight className="h-4 w-4" />}
          onClick={(e) => handleEmailSubmit(e)}
        >
          Request OTP
        </Button>
      </form>
    </div>
  );

  // Following template OTP step rendering pattern
  const renderOtpStep = () => (
    <div className="space-y-6 mt-4">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
            <Lock className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enter OTP</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          We've sent a code to <strong>{email}</strong>
        </p>
      </div>

      {/* Following template OTP form pattern */}
      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Following template OTP input pattern */}
          <div className="flex justify-center">
            <Input
              type="text"
              maxLength={8}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 8-digit OTP"
              leftIcon={<Lock className="h-4 w-4" />}
              required
              size="md"
              disabled={isLoading}
            />
          </div>

          {/* Enhanced timer and resend pattern */}
          <div className="text-center space-y-3">
            {renderTimer()}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Demo: Use OTP <strong>12345678</strong> for successful login
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?{' '}
              {resendTimer > 0 ? (
                <span className="text-gray-500">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Following template action buttons pattern */}
        <div className="space-y-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={isLoading}
            disabled={!otp || otp.length !== 8 || isLoading}
            iconRight={<CheckCircle className="h-4 w-4" />}
            onClick={(e) => handleOtpSubmit(e)}
          >
            Verify OTP
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            fullWidth
            onClick={() => setCurrentStep('email')}
            disabled={isLoading}
            iconLeft={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Email
          </Button>
        </div>
      </form>

      {/* Following template security notice pattern */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="h-4 w-4" />
          <span>Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  );

  // Following template alert rendering pattern
  const renderAlerts = () => (
    <div className="space-y-3">
      {error && (
        <Alert
          variant="error"
          title="Error"
          description={error}
          dismissible
          onDismiss={() => setError('')}
        />
      )}
      {success && (
        <Alert
          variant="success"
          title="Success"
          description={success}
          dismissible={false}
        />
      )}
    </div>
  );

  // Following template loading overlay pattern
  const renderLoadingOverlay = () => (
    isLoading && (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-2xl">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {currentStep === 'email' ? 'Sending OTP...' : 'Verifying OTP...'}
          </p>
        </div>
      </div>
    )
  );

  // Following template main content pattern
  const renderMainContent = () => (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto p-8 backdrop-blur-sm">
      {renderAlerts()}
      {currentStep === 'email' ? renderEmailStep() : renderOtpStep()}
      {renderLoadingOverlay()}
    </div>
  );

  // Following template layout pattern - actual login page
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Following template branding pattern - Vertical layout */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center justify-center space-y-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-sm">
            <Building className="h-6 w-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">Param Network</span>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
          Order Management & Visibility
        </p>
        <div className="w-20 h-px bg-gradient-to-r from-primary-600 to-primary-500 mx-auto"></div>
      </div>

      {renderMainContent()}

      {/* Following template footer pattern */}
      <div className="text-center mt-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 Param Network. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 