import { createSDK } from './ParamSDKAdapter.js';
import config from '../config.json';

class ParamSDKService {
  constructor() {
    this.sdk = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the SDK with configuration from config.json
   * @returns {Promise<Object>} SDK instance
   */
  async initialize() {
    try {
      if (this.isInitialized && this.sdk) {
        console.log('✅ SDK already initialized');
        return this.sdk;
      }

      console.log('🔧 Initializing Param SDK...');
      console.log('🔧 Config:', {
        baseUrl: config.paramSdk.url,
        apiKey: config.paramSdk.apiKey ? '***' + config.paramSdk.apiKey.slice(-4) : 'Not provided'
      });

      // Initialize SDK with config
      this.sdk = createSDK({
        baseUrl: config.paramSdk.url,
        apiKey: config.paramSdk.apiKey,
        // Add other config parameters as needed
        paramId: config.paramSdk.paramId || '',
        subdomainName: config.paramSdk.subdomainName || 'default',
        portalType: config.paramSdk.portalType || 'web',
        projectId: config.paramSdk.projectId || ''
      });

      this.isInitialized = true;
      console.log('✅ Param SDK initialized successfully');
      
      return this.sdk;
    } catch (error) {
      console.error('❌ Failed to initialize Param SDK:', error);
      throw new Error(`SDK initialization failed: ${error.message}`);
    }
  }

  /**
   * Get the SDK instance (initialize if not already done)
   * @returns {Promise<Object>} SDK instance
   */
  async getSDK() {
    if (!this.isInitialized || !this.sdk) {
      await this.initialize();
    }
    return this.sdk;
  }

  /**
   * Send OTP to user's email using real Param SDK
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Result of OTP send operation
   */
  async sendOTP(email) {
    try {
      const sdk = await this.getSDK();
      console.log('📧 Sending OTP via Param SDK to:', email);
      
      const result = await sdk.sendOTP({ email });
      
      if (result.success) {
        console.log('✅ OTP sent successfully via Param SDK');
        return {
          success: true,
          message: result.message || 'Verification code sent successfully',
          data: result.data
        };
      } else {
        console.log('❌ Failed to send OTP via Param SDK:', result.error);
        return {
          success: false,
          error: result.error || 'Failed to send verification code',
          data: result.data
        };
      }
    } catch (error) {
      console.error('❌ Error in sendOTP service:', error);
      return {
        success: false,
        error: error.message || 'Failed to send verification code',
        data: null
      };
    }
  }

  /**
   * Verify OTP using real Param SDK
   * @param {string} email - User's email address
   * @param {string} otp - OTP entered by user
   * @returns {Promise<Object>} Result of OTP verification
   */
  async verifyOTP(email, otp) {
    try {
      const sdk = await this.getSDK();
      console.log('🔐 Verifying OTP via Param SDK for:', email);
      
      const result = await sdk.verifyOTP({ email, otp });
      
      if (result.success) {
        console.log('✅ OTP verified successfully via Param SDK');
        
        // Generate token using SDK
        let token = null;
        try {
          token = sdk.generateToken(email, otp);
          console.log('🔑 Token generated successfully');
        } catch (tokenError) {
          console.warn('⚠️ Token generation failed:', tokenError);
        }
        
        return {
          success: true,
          message: result.message || 'Verification successful',
          data: {
            ...result.data,
            token,
            user: {
              email,
              verified: true,
              loginTime: new Date().toISOString()
            }
          }
        };
      } else {
        console.log('❌ OTP verification failed via Param SDK:', result.error);
        return {
          success: false,
          error: result.error || 'Invalid verification code',
          data: result.data
        };
      }
    } catch (error) {
      console.error('❌ Error in verifyOTP service:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify code',
        data: null
      };
    }
  }

  /**
   * Check if SDK is initialized
   * @returns {boolean} Initialization status
   */
  isSDKInitialized() {
    return this.isInitialized && this.sdk !== null;
  }

  /**
   * Get SDK configuration (without sensitive data)
   * @returns {Object} SDK configuration
   */
  getSDKConfig() {
    if (!this.sdk) {
      return null;
    }
    return this.sdk.getConfig();
  }
}

// Create and export singleton instance
const paramSDKService = new ParamSDKService();

export default paramSDKService; 