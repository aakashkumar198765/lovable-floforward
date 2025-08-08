/**
 * Browser-compatible Param AI SDK
 * Provides mind execution functions for React environment
 */


const mindId = "98b50fe2-54df-47f0-acee-b33f8dbeb78e";
const shareKey = "94a5bcfa7fbcf707f434e63d7ce6c44d1e7b1bc0d45e3923ab8746feef66bcbb"; 

/**
 * Execute mind using browser fetch API
 */
async function executeMind(mindName, isDefaultUiDisabled, args, responseStructure) {
  // Create FormData for multipart request
  const formData = new FormData();
  formData.append('mind_name', mindName);
  formData.append('is_default_ui_disabled', false);
  formData.append('args', JSON.stringify(args));
  formData.append('mind_id', mindId);
  formData.append('response_structure', JSON.stringify(responseStructure));

  const response = await fetch('https://dev.paramai.studio:5012/mindflow/execute_mind', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Share-Key': shareKey,
      'Origin': 'https://lab.paramai.studio',
      'Referer': 'https://lab.paramai.studio/',
      'X-Mind-Id': mindId,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`executeMind failed: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

/**
 * Get session(s) for a mind
 * If sessionId is provided, gets one session; otherwise, gets all sessions
 */
async function fetchSessions(mindId, shareKey, sessionId = null) {
  const url = sessionId ? `https://dev.paramai.studio:5012/mindflow/${mindId}/${sessionId}/get_session` : `https://dev.paramai.studio:5012/mindflow/${mindId}/get_session`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'share-key': shareKey,
      'Origin': 'https://lab.paramai.studio',
      'Referer': 'https://lab.paramai.studio/',
      'X-Mind-Id': mindId,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`fetchSessions failed: ${response.status} - ${errorText}`);
  }
  return response.json();
}

/**
 * Get all sessions for a mind
 */
async function getAllSessions(mindId, shareKey) {
  return fetchSessions(mindId, shareKey);
}

/**
 * Get session data using browser fetch API
 */
async function getSession(mindId, sessionId, shareKey) {
  return fetchSessions(mindId, shareKey, sessionId);
}

/**
 * Browser-compatible SSE streaming using EventSource
 * Note: This is a simplified version since full SSE implementation requires more complex setup
 */
async function streamSSE(url, options = {}) {
  const { onEvent, onError, maxRetries = 5, retryDelay = 5000 } = options;
  let attempts = 0;

  const connect = () => {
    return new Promise((resolve, reject) => {
      try {
        // Note: EventSource has CORS limitations, so this might not work for all URLs
        // For production, you might need a proxy or server-side implementation
        const eventSource = new EventSource(url);
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onEvent && onEvent(data);
          } catch (err) {
            onEvent && onEvent(event.data);
          }
        };

        eventSource.onerror = (error) => {
          eventSource.close();
          if (attempts < maxRetries) {
            attempts++;
            setTimeout(() => {
              connect().then(resolve).catch(reject);
            }, retryDelay);
          } else {
            onError && onError(error);
            reject(error);
          }
        };

        eventSource.addEventListener('end', () => {
          eventSource.close();
          resolve();
        });

      } catch (error) {
        onError && onError(error);
        reject(error);
      }
    });
  };

  return connect();
}

/**
 * Execute mind and get results with simplified streaming
 * Since browser SSE has limitations, we'll use polling as fallback
 */
async function executeMindAndGetResults(mindName, isDefaultUiDisabled, args, responseStructure, mindId, shareKey) {
  console.log('🧠 Executing mind:', mindName);
  
  // Execute the mind first
  const { job_id, session_id } = await executeMind(mindName, isDefaultUiDisabled, args, responseStructure, mindId, shareKey);
  
  console.log(`Mind execution started. Job ID: ${job_id}, Session ID: ${session_id}`);
  
  // Try SSE streaming first, but fall back to polling if it fails
  try {
    console.log('Attempting SSE streaming...');
    await streamSSE(`https://lab.paramai.studio/sse/events/${job_id}?check=1`, {
      onEvent: (data) => {
        if (typeof data === 'object' && data !== null && data.message) {
          console.log('📡 SSE:', data.message);
        } else if (typeof data === 'string') {
          try {
            const parsed = JSON.parse(data);
            if (parsed && parsed.message) {
              console.log('📡 SSE:', parsed.message);
            } else {
              console.log('📡 SSE:', data);
            }
          } catch(e) {
            console.log('📡 SSE:', data);
          }
        } else {
          console.log('📡 SSE:', data);
        }
      },
      onError: (err) => console.warn('SSE error (will fall back to polling):', err.message),
      maxRetries: 2,
      retryDelay: 3000
    });
  } catch (sseError) {
    console.warn('SSE streaming failed, using polling fallback:', sseError.message);
    
    // Polling fallback - check session status periodically
    const maxPolls = 20; // Maximum 2 minutes of polling (6s * 20)
    const pollInterval = 6000; // 6 seconds
    
    for (let i = 0; i < maxPolls; i++) {
      console.log(`📊 Polling attempt ${i + 1}/${maxPolls}...`);
      
      try {
        const sessionData = await getSession(mindId, session_id, shareKey);
        
        // Check if execution is complete
        if (sessionData && sessionData.response && sessionData.execution_status === 'completed') {
          console.log('✅ Mind execution completed via polling');
          return sessionData;
        }
        
        // Wait before next poll
        if (i < maxPolls - 1) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
      } catch (pollError) {
        console.warn(`Polling attempt ${i + 1} failed:`, pollError.message);
      }
    }
    
    console.log('⏰ Polling timeout reached, fetching final session data...');
  }
  
  // Fetch final session data
  console.log('Fetching final session data...');
  return getSession(mindId, session_id, shareKey);
}

export {
  executeMind,
  getAllSessions,
  getSession,
  streamSSE,
  executeMindAndGetResults,
};