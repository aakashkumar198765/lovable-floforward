import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building,
  Clock,
} from 'lucide-react';

// Import reusable components
import Button from '../components/atoms/form/Button';
import Input from '../components/atoms/form/Input';
import Alert from '../components/atoms/feedback/Alert';
import Spinner from '../components/atoms/feedback/Spinner';

// Import Param SDK service
import paramSDKService from '../services/ParamSDKService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // State management
  const [currentStep, setCurrentStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Timer for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Email submission handler
  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Loading state
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use real Param SDK to send OTP
      console.log('🔄 Sending OTP via Param SDK...');
      const result = await paramSDKService.sendOTP(email);
      
      if ((result as any).success) {
        // Success handling
        setCurrentStep('otp');
        setSuccess((result as any).message || 'Access code sent successfully!');
        setResendTimer(30);
        console.log('✅ OTP sent successfully');
      } else {
        // Handle SDK error
        setError((result as any).error || 'Failed to send access code. Please try again.');
        console.error('❌ Failed to send OTP:', (result as any).error);
      }
      
    } catch (err) {
      console.error('❌ Error in handleEmailSubmit:', err);
      setError('Failed to send access code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // OTP submission handler
  const handleOtpSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!otp || otp.length !== 8) {
      setError('Please enter the 8-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use real Param SDK to verify OTP
      console.log('🔄 Verifying OTP via Param SDK...');
      const result = await paramSDKService.verifyOTP(email, otp);
      
      if ((result as any).success) {
        setSuccess((result as any).message || 'Login successful!');
        console.log('✅ Login successful for:', email);
        console.log('🔑 User data:', (result as any).data);
        
        // Store authentication data and mark user as logged in
        const token = (result as any).data?.token;
        login(token);
        console.log('🔑 User authenticated successfully');
        
        // Navigate to prompt page
        setTimeout(() => {
          navigate('/prompt');
        }, 1000);
      } else {
        // User-friendly error message for verification failures
        setError('Invalid verification code. Please check your email and try again, or request a new code.');
        console.error('❌ OTP verification failed:', (result as any).error);
      }
    } catch (err) {
      console.error('❌ Error in handleOtpSubmit:', err);
      setError('Unable to verify code at the moment. Please try again or request a new code.');
    } finally {
      setIsLoading(false);
    }
  }, [otp, email, navigate]);

  // Resend OTP handler
  const handleResendOtp = useCallback(async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Use real Param SDK to resend OTP
      console.log('🔄 Resending OTP via Param SDK...');
      const result = await paramSDKService.sendOTP(email);
      
      if ((result as any).success) {
        setSuccess((result as any).message || 'Access code resent successfully');
        setResendTimer(30);
        console.log('✅ OTP resent successfully');
      } else {
        setError((result as any).error || 'Failed to resend access code. Please try again.');
        console.error('❌ Failed to resend OTP:', (result as any).error);
      }
    } catch (err) {
      console.error('❌ Error in handleResendOtp:', err);
      setError('Failed to resend access code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resendTimer, email]);

  // Timer component
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

  // Email step rendering
  const renderEmailStep = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
            <Mail className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to ai/studio
        </h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Access your AI-powered workflow builder platform
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-left font-medium text-gray-700 dark:text-gray-300">
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

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={isLoading}
          disabled={!email || isLoading}
          iconRight={<ArrowRight className="h-4 w-4" />}
          onClick={handleEmailSubmit}
        >
                      Get Access Code
        </Button>
      </form>
    </div>
  );

  // OTP step rendering
  const renderOtpStep = () => (
    <div className="space-y-6 mt-4">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
            <Lock className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Access</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Enter the verification code sent to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Input
              type="text"
              maxLength={8}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 8-digit code"
              leftIcon={<Lock className="h-4 w-4" />}
              required
              size="md"
              disabled={isLoading}
            />
          </div>

          <div className="text-center space-y-3">
            {renderTimer()}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Check your email for the 8-digit verification code
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
                  Resend Code
                </button>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={isLoading}
            disabled={!otp || otp.length !== 8 || isLoading}
            iconRight={<CheckCircle className="h-4 w-4" />}
            onClick={handleOtpSubmit}
          >
            Access Platform
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
    </div>
  );

  // Alert rendering
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

  // Loading overlay
  const renderLoadingOverlay = () => (
    isLoading && (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-2xl">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {currentStep === 'email' ? 'Sending access code...' : 'Verifying credentials...'}
          </p>
        </div>
      </div>
    )
  );

  // Main content
  const renderMainContent = () => (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md mx-auto p-8 backdrop-blur-sm">
      {renderAlerts()}
      {currentStep === 'email' ? renderEmailStep() : renderOtpStep()}
      {renderLoadingOverlay()}
    </div>
  );

  // Main layout
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Branding */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center justify-center space-y-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="text-white font-bold text-xl">⦃p⦄</div>
          </div>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">⦃param⦄ ai/studio</span>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
          AI-Powered Low-Code Workflow Builder
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          Transform prompts into production-ready applications with intelligent workflow automation
        </p>
        <div className="w-20 h-px bg-gradient-to-r from-blue-600 to-blue-500 mx-auto"></div>
      </div>

      {renderMainContent()}

      {/* Footer */}
      <div className="text-center mt-12 space-y-3">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <span>AI-Initiated, Human-Perfected</span>
          <span>•</span>
          <span>Enterprise-Grade Security</span>
          <span>•</span>
          <span>Low-Code Platform</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 ⦃param⦄ network. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login; 