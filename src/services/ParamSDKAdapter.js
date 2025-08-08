/**
 * param Exchange SDK - Frontend Version
 * Version 4.0.0
 * 
 * JavaScript SDK for communicating with param 4.0 platform (React/Frontend)
 * 
 * USAGE EXAMPLE:
 * 
 * // Initialize SDK with configuration
 * const sdk = createSDK({
 *   baseUrl: 'https://your-api-url.com',
 *   apiKey: 'your-api-key-here',
 *   paramId: 'your-param-id',
 *   subdomainName: 'your-subdomain',
 *   portalType: 'your-portal-type',
 *   projectId: 'your-project-id'
 * });
 * 
 * // Send OTP (no headers needed - uses config)
 * const otpResult = await sdk.sendOTP({ email: 'user@example.com' });
 * 
 * // Verify OTP (no headers needed - uses config)
 * const verifyResult = await sdk.verifyOTP({ 
 *   email: 'user@example.com', 
 *   otp: '123456' 
 * });
 * 
 * // Get documents (no headers needed - uses config)
 * const documents = await sdk.getDocuments({
 *   projection: ['_id', 'name'],
 *   filters: { status: 'active' }
 * });
 */

class ParamSDKAdapter {
  /**
   * Initialize the SDK with configuration
   * @param {Object} config - SDK configuration
   * @param {string} config.baseUrl - Base URL for the param platform API (default: http://localhost:8004)
   * @param {string} config.apiKey - API key for authentication (required)
   * @param {string} config.paramId - Param ID for authentication
   * @param {string} config.subdomainName - Subdomain name
   * @param {string} config.portalType - Portal type
   * @param {string} config.projectId - Project ID
   */
  constructor(config = {}) {
    if (!config.baseUrl) {
      throw new Error('baseUrl is required for SDK initialization');
    }
    if (!config.apiKey) {
      throw new Error('apiKey is required for SDK initialization');
    }

    this.config = config;
    
    console.log('SDK initialized with baseUrl:', this.config.baseUrl);
  }

  /**
   * Get base headers for all requests
   * @returns {Object} Base headers
   */
  getBaseHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.config.apiKey,
      'Connection': 'keep-alive'
    };
  }

  /**
   * Get authenticated headers with param credentials
   * @param {Object} customHeaders - Additional custom headers
   * @returns {Object} Complete headers with authentication
   */
  getAuthHeaders(customHeaders = {}) {
    const baseHeaders = this.getBaseHeaders();
    
    // Add param authentication headers if available in config
    const authHeaders = {};
    if (this.config.paramId) authHeaders.paramid = this.config.paramId;
    if (this.config.subdomainName) authHeaders.subdomain_name = this.config.subdomainName;
    if (this.config.portalType) authHeaders.portal_type = this.config.portalType;
    if (this.config.projectId) authHeaders.project_id = this.config.projectId;

    return {
      ...baseHeaders,
      ...authHeaders,
      ...customHeaders
    };
  }

  /**
   * Get headers for specific request with optional overrides
   * @param {Object} headers - Override headers
   * @returns {Object} Complete headers
   */
  getHeaders(headers = {}) {
    return this.getAuthHeaders(headers);
  }

  /**
   * Update API key dynamically
   * @param {string} apiKey - New API key
   */
  updateApiKey(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    this.config.apiKey = apiKey;
    console.log('API key updated successfully');
  }

  /**
   * Update configuration dynamically
   * @param {Object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    if (newConfig.apiKey) {
      this.config.apiKey = newConfig.apiKey;
    }
    if (newConfig.paramId) {
      this.config.paramId = newConfig.paramId;
    }
    if (newConfig.subdomainName) {
      this.config.subdomainName = newConfig.subdomainName;
    }
    if (newConfig.portalType) {
      this.config.portalType = newConfig.portalType;
    }
    if (newConfig.projectId) {
      this.config.projectId = newConfig.projectId;
    }
    console.log('Configuration updated successfully');
  }

  /**
   * Get current configuration (without sensitive data)
   * @returns {Object} Current configuration
   */
  getConfig() {
    return {
      baseUrl: this.config.baseUrl,
      paramId: this.config.paramId,
      subdomainName: this.config.subdomainName,
      portalType: this.config.portalType,
      projectId: this.config.projectId,
      apiKey: this.config.apiKey ? '***' + this.config.apiKey.slice(-4) : undefined
    };
  }

  /**
   * Make HTTP request with retry logic
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @param {number} retries - Number of retries (default: 3)
   * @returns {Promise<Object>} - Response data
   */
  async makeRequest(url, options = {}, retries = 3) {
    const config = {
      method: 'GET',
      headers: this.getHeaders(options.headers),
      ...options
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          // Only retry on 5xx errors or network issues
          if (response.status >= 500 || response.status === 408) {
            if (attempt < retries) {
              const delayMs = Math.min(1000 * Math.pow(2, attempt), 10000);
              await new Promise(resolve => setTimeout(resolve, delayMs));
              continue;
            }
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (attempt === retries) {
          console.error('Request failed after retries:', error);
          throw error;
        }
        
        // Exponential back-off for retries
        const delayMs = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  /**
   * Define a state machine using the define_sm API endpoint
   * @param {Object} smPayload - State machine payload containing all SM configuration
   * @returns {Promise<Object>} - API response
   */
  async defineStateMachine(smPayload) {
    const body = {
      operation_name: "stateTxnV1",
      payload: smPayload,
      stateMachine: [Utils.getStateMachine(smPayload)],
      stateTo: smPayload.StartAt || "",
      props: {},
      roles: {}
    };

    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/api/v1/define_sm`, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      return response;
    } catch (error) {
      console.error('Error calling define_sm API:', error);
      throw error;
    }
  }

  /**
   * Define a schema using the extend_schema API endpoint
   * @param {Object} schemaPayload - Schema payload containing schema definition
   * @param {string} schemaRef - Schema reference
   * @returns {Promise<Object>} - API response
   */
  async defineSchema(schemaPayload, schemaRef) {
    const body = {
      operation_name: "stateTxnV1",
      payload: schemaPayload,
      stateMachine: schemaRef,
      stateTo: schemaPayload.stateTo || "",
      props: {},
      roles: {}
    };

    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/api/v1/extend_schema`, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      return response;
    } catch (error) {
      console.error('Error calling extend_schema API:', error);
      throw error;
    }
  }

  /**
   * Create a state in the state machine
   * @param {Object} payload - Document payload containing all details
   * @param {Object} props - Properties for the state creation (optional, falls back to config)
   * @param {Object} roles - Role mappings (optional, falls back to config)
   * @param {string} stateTo - Target state to transition to
   * @returns {Promise<Object>} - API response
   */
  async createState(payload, props = {}, roles = {}, stateTo, smType = "Commerce") {

    const body = {
      operation_name: "stateTxnV1",
      param_id: payload?.SystemProperties?.P_DocOwner,
      docID : payload?._id,
      props: {
        portal: this.config.portalType,
        workspaceName: this.config.subdomainName,
        ...props
      },
      stateMachine: [
        Utils.getStateMachine({
          AppType: smType,
          smID: payload.SystemProperties?.P_SmID
        })
      ],
      stateTo: stateTo || payload.SystemProperties?.P_StateTo || "",
      payload: payload,
      roles: roles
    };

    console.log("SM Create State Body", body);

    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/api/v1/sm_createState`, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      return response;
    } catch (error) {
      console.error('Error calling sm_createState API:', error);
      throw error;
    }
  }

  /**
   * Transition to next state in the state machine
   * @param {Object} payload - Document payload containing all details
   * @param {Object} props - Properties for state transition (optional, falls back to config)
   * @param {Object} roles - Role mappings (optional, falls back to config)
   * @param {string} stateTo - Target state to transition to
   * @param {string} stateMachineRef - Full state machine reference (optional, will be constructed from payload if not provided)
   * @returns {Promise<Object>} - API response
   */
  async nextState(payload, props = {}, roles = {}, stateTo) {

    const body = {
      operation_name: "stateTxnV1",
      docID : payload?._id,
      param_id: payload?.SystemProperties?.P_DocOwner,
      props: {
        portal: this.config.portalType,
        workspaceName: this.config.subdomainName,
        ...props
      },
      stateMachine: [
        Utils.getStateMachineRef({
          AppType: "statetxnpool",
          parentTxnID: payload?.LocalProperties?.TxnID
        })
      ],
      stateTo: stateTo || payload.SystemProperties?.P_StateTo || "",
      payload: payload,
      roles: {
        ...roles,
      }
    };

    console.log("SM Next State Body", body);

    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/api/v1/sm_nextState`, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      return response;
    } catch (error) {
      console.error('Error calling sm_nextState API:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {string} email - User's email address
   * @param {string} subdomainName - Subdomain name for the organization
   * @returns {Promise<Object>} - Registration response
   */
  async getParamId(email, subdomainName) {
    if (!email) {
      throw new Error('Email is required for getparamid');
    }
    if (!subdomainName) {
      throw new Error('Subdomain name is required for getparamid');
    }

    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ email: email }),
        headers: this.getHeaders({
          'subdomain_name': subdomainName
        })
      });
      return {
        success : true,
        data: response,
      };
    } catch (error) {
      console.error('Error during getparamid:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {string} email - User's email address
   * @param {string} subdomainName - Subdomain name for the organization
   * @param {Object} metaInfo - Additional metadata for registration
   * @returns {Promise<Object>} - Registration response
   */
  async register(email, subdomainName, metaInfo) {
    console.log('register', email, subdomainName);
    if (!email) {
      throw new Error('Email is required for registration');
    }
    if (!subdomainName) {
      throw new Error('Subdomain name is required for registration');
    }

    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ email: email, metaInfo: metaInfo }),
        headers: this.getHeaders({
          'subdomain_name': subdomainName
        })
      });
      return response;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  /**
   * Send OTP to user's email
   * @param {Object} payload - Request payload
   * @param {string} payload.email - User's email address
   * @returns {Promise<Object>} OTP send result
   */
  async sendOTP(payload) {
    const {email} = payload;
    if (!email) throw new Error('Email is required');
    
    try {
      console.log('📧 Sending OTP to:', email);

      // Prepare request payload according to API specification
      const requestData = {
        email: email,
        loginType: "",
        admin: ""
      };

      console.log('📧 Send OTP request payload:', JSON.stringify(requestData, null, 2));

      const result = await this.makeRequest(`${this.config.baseUrl}/auth/login/send-otp`, {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      
      if (result?.status) {
        console.log('✅ OTP sent successfully');
        return {
          success: true,
          message: result?.message || 'OTP sent successfully',
          data: result?.data || {}
        };
      } else {
        console.error('❌ Failed to send OTP:', result?.message || 'Unknown error');
        return {
          success: false,
          error: result?.message || 'Failed to send OTP',
          data: result?.data || {}
        };
      }
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP',
        data: null
      };
    }
  }

  /**
   * Verify OTP entered by user
   * @param {Object} payload - Request payload
   * @param {string} payload.email - User's email address
   * @param {string} payload.otp - OTP entered by user
   * @returns {Promise<Object>} OTP verification result
   */
  async verifyOTP(payload) {
    const {email, otp} = payload;
    if (!email) throw new Error('Email is required');
    if (!otp) throw new Error('OTP is required');
    
    try {
      console.log('🔐 Verifying OTP for:', email);
      // Prepare request payload according to API specification
      const requestData = {
        email: email,
        otp: otp,
        isTermsAndConditionVerified: true
      };

      console.log('🔐 Verify OTP request payload:', JSON.stringify(requestData, null, 2));

      const result = await this.makeRequest(`${this.config.baseUrl}/auth/login/verify-otp`, {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      
      if (result?.status) {
        console.log('✅ OTP verified successfully');
        return {
          success: true,
          message: result?.message || 'OTP verified successfully',
          data: result?.data || {},
        };
      } else {
        console.error('❌ OTP verification failed:', result?.message || 'Unknown error');
        return {
          success: false,
          error: result?.message || 'Invalid OTP',
          data: result?.data || {}
        };
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify OTP',
        data: null
      };
    }
  }

  /**
   * Generate JWT token for authenticated user
   * @param {string} email - User's email address
   * @param {string} otp - Verified OTP
   * @returns {string} JWT token
   */
  generateToken(email, otp) {
    try {
      // Simple development token generation using only email and OTP
      const payload = {
        email: email,
        otp: otp,
        exp: Math.floor(Date.now() / 1000) + (3 * 3600), // 3 hours expiry
        iat: Math.floor(Date.now() / 1000)
      };
      
      // Simple base64 encoding for development token
      return btoa(JSON.stringify(payload));
    } catch (error) {
      console.error('❌ Failed to generate token:', error);
      throw error;
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} Decoded token payload or null if invalid
   */
  verifyToken(token) {
    try {
      // Simple development token verification
      const decoded = JSON.parse(atob(token));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decoded.exp && decoded.exp > currentTime) {
        return decoded;
      }
      return null;

    } catch (error) {
      console.error('❌ Failed to verify token:', error);
      return null;
    }
  }

  /**
   * Get state documents with filtering and pagination
   * @param {Object} payload - Request payload
   * @param {string[]} payload.projection - Fields to retrieve
   * @param {Object} payload.filters - Filter configuration
   * @param {Array} payload.filters.match - Array of match conditions
   * @param {string} payload.sm - State machine ID
   * @param {string} payload.stateTo - Target state
   * @param {string} payload.subState - Sub state
   * @param {Object} payload.pagination - Pagination options
   * @param {boolean} payload.pagination.pagination - Whether pagination is enabled
   * @param {string|null} payload.pagination.nextPageToken - Token for next page
   * @param {number} payload.pagination.currentPage - Current page number
   * @param {number} payload.pagination.pageSize - Number of items per page
   * @returns {Promise<Object>} - Document retrieval response
   */
  async getDocuments(payload) {
    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/api/v1/sm_getStateDocs`, {
        method: 'POST',
        body: JSON.stringify({
          projection: payload.projection || [],
          filters: payload.filters || {},
          sm: payload.sm || "",
          stateTo: payload.stateTo || "",
          subState: payload.subState || "",
          pagination: payload.pagination || {
            pagination: false,
            nextPageToken: null,
            currentPage: 1,
            pageSize: 50
          }
        })
      });
      return response;
    } catch (error) {
      console.error('Error retrieving documents:', error);
      throw error;
    }
  }

  /**
   * Get document details for a specific document
   * @param {Object} payload - Request payload
   * @param {string[]} payload.projection - Fields to retrieve
   * @param {Object} payload.filters - Filter configuration
   * @param {Array} payload.filters.match - Array of match conditions
   * @param {string} payload.docID - Document ID
   * @param {string} payload.sm - State machine ID
   * @param {string} payload.stateTo - Target state
   * @param {string} payload.subState - Sub state
   * @param {Object} payload.pagination - Pagination options
   * @param {boolean} payload.pagination.pagination - Whether pagination is enabled
   * @param {string|null} payload.pagination.nextPageToken - Token for next page
   * @param {number} payload.pagination.currentPage - Current page number
   * @param {number} payload.pagination.pageSize - Number of items per page
   * @returns {Promise<Object>} - Document details response
   */
  async getDocDetails(payload) {
    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/api/v1/sm_getDocDetails`, {
        method: 'POST',
        body: JSON.stringify({
          projection: payload.projection || [],
          filters: payload.filters || {},
          docID: payload.docID || "",
          sm: payload.sm || "",
          stateTo: payload.stateTo || "",
          subState: payload.subState || "",
          pagination: payload.pagination || {
            pagination: false,
            nextPageToken: null,
            currentPage: 1,
            pageSize: 50
          }
        })
      });

      return response.data || response;
    } catch (error) {
      console.error('Error retrieving document details:', error);
      throw error;
    }
  }

  /**
   * Create a document in a collection
   * @param {string} collection - Collection name
   * @param {Object} customdata - Document data
   * @param {string} db_type - Database type (default: "exchange")
   * @returns {Promise<Object>} Response from the server
   */
  async custom_api(collection, db_type = "exchange", customdata) {
    try {
      let url = `${this.config.baseUrl}/custom/${collection}`;
      console.log('custom_api endpoint', url);
      
      let body = {
        "db": db_type,
        "data": customdata
      };
      
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      
      console.log('--------------------------------');
      console.log('custom_api response', JSON.stringify(response, null, 2));
      console.log('--------------------------------');
      return response;
    } catch (error) {
      console.error(`Error in custom_api create:`, error);
      throw error;
    }
  }

  /**
   * Get a document from a collection
   * @param {string} collection - Collection name
   * @param {string} document_id - Document ID
   * @param {string} db_type - Database type (default: "exchange")
   * @returns {Promise<Object>} Response from the server
   */
  async custom_api_get(collection, document_id, db_type = "exchange") {
    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/custom/${collection}/${document_id}?db=${db_type}`, {
        method: 'GET'
      });
      
      console.log('--------------------------------');
      console.log('custom_api_get response', JSON.stringify(response, null, 2));
      console.log('--------------------------------');
      return response;
    } catch (error) {
      console.error(`Error in custom_api_get:`, error);
      throw error;
    }
  }

  /**
   * Update a document in a collection
   * @param {string} collection - Collection name
   * @param {string} document_id - Document ID
   * @param {Object} customdata - Update data
   * @param {string} db_type - Database type (default: "exchange")
   * @returns {Promise<Object>} Response from the server
   */
  async custom_api_update(collection, document_id, customdata, db_type = "exchange") {
    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/custom/${collection}/${document_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          db: db_type,
          data: customdata
        })
      });
      return response;
    } catch (error) {
      console.error(`Error in custom_api_update:`, error);
      throw error;
    }
  }

  /**
   * Delete a document from a collection
   * @param {string} collection - Collection name
   * @param {string} document_id - Document ID
   * @param {Object} options - Delete options
   * @param {string} options.db_type - Database type (default: "exchange")
   * @param {boolean} options.hard_delete - Whether to perform hard delete (default: false)
   * @returns {Promise<Object>} Response from the server
   */
  async custom_api_delete(collection, document_id, options = {}) {
    try {
      const { db_type = "exchange", hard_delete = false } = options;
      const response = await this.makeRequest(`${this.config.baseUrl}/custom/${collection}/${document_id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          db: db_type,
          hard_delete
        })
      });
      return response;
    } catch (error) {
      console.error(`Error in custom_api_delete:`, error);
      throw error;
    }
  }

  /**
   * List documents from a collection with optional filters
   * @param {string} collection - Collection name
   * @param {Object} options - Query options
   * @param {string} options.db_type - Database type (default: "exchange")
   * @param {Object} options.filters - Optional query filters
   * @returns {Promise<Object>} Response from the server
   */
  async custom_api_list(collection, options = {}) {
    try {
      const { 
        db_type = "exchange", 
        filters = {}
      } = options;

      const endpoint = `${this.config.baseUrl}/custom/${collection}/list`;
      const body = {
        db: db_type,
        filters
      }

      console.log('--------------------------------');
      console.log('custom_api_list payload', JSON.stringify(body, null, 2));
      console.log('--------------------------------');

      let response = await this.makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      
      return response;
    } catch (error) {
      console.error(`Error in custom_api_list:`, error);
      throw error;
    }
  }

  /**
   * Save a plant
   * @param {Object} plant - Plant data to save
   * @returns {Promise<Object>} Response from the server
   */
  async savePlant(plant) {
    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/v1/plants/add`, {
        method: 'POST',
        body: JSON.stringify(plant)
      });
      return response;
    } catch (error) {
      console.error(`Error in savePlant:`, error);
      throw error;
    }
  }

  /**
   * List plants with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<Object>} Response from the server
   */
  async getPlants(filters) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await this.makeRequest(`${this.config.baseUrl}/v1/plants/list?${queryParams}`, {
        method: 'GET'
      });
      return {
        success: true,
        data: response?.plants || [],
        message: "Plants fetched successfully"
      };
    } catch (error) {
      console.error(`Error in getPlants:`, error);
      throw error;
    }
  }

  /**
   * Save a user
   * @param {Object} user - User data to save
   * @returns {Promise<Object>} Response from the server
   */
  async saveUser(user) {
    try {
      const response = await this.makeRequest(`${this.config.baseUrl}/v1/users/add`, {
        method: 'POST',
        body: JSON.stringify(user)
      });
      return response;
    } catch (error) {
      console.error(`Error in saveUser:`, error);
      throw error;
    }
  }

  /**
   * List users with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<Object>} Response from the server
   */
  async getUsers(filters) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await this.makeRequest(`${this.config.baseUrl}/v1/users/list?${queryParams}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error(`Error in getUsers:`, error);
      throw error;
    }
  }
}

class Utils {
  static getStateMachine(smPayload) {
    const namespace = "statemachine";
    const appType = smPayload.AppType || "";
    const smID = smPayload.smID || "";
    return `@${namespace}/${appType}:${smID}`;
  }

  static getStateMachineRef(smPayload) {
    const namespace = "statemachine";
    const appType = smPayload.AppType || "";
    const parentTxnID = smPayload.parentTxnID || "";

    // Construct the key
    return `@${namespace}/${appType}:${parentTxnID}`;
  }
}

// Create and export a singleton instance
let sdkInstance = null;

const createSDK = (config) => {
  if (!sdkInstance) {
    console.log('Creating new SDK instance with config:', config);
    sdkInstance = new ParamSDKAdapter(config);
  }
  return sdkInstance;
};

// Export both the class and the singleton instance creator
export {
  ParamSDKAdapter,
  Utils,
  createSDK
}; 