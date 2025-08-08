// api.js
import { fetch as undiciFetch } from 'undici';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { Readable } from 'stream';

/**
 * Stream SSE from a URL in Node.js using undici + readline
 * @param {string} url 
 * @param {object} opts 
 * @param {string[]} opts.eventTypes - which event types to listen for
 * @param {function} opts.onEvent - callback with (data)
 * @param {function} opts.onError - callback on error
 */
async function streamSSE(
  url,
  {
    eventTypes = ['message'],
    onEvent,
    onError,
    maxRetries = 5,
    retryDelay = 5000
  }
) {
  let attempts = 0;

  const connect = async () => {
    try {
      const res = await undiciFetch(url);
      if (!res.ok || !res.body) throw new Error(`SSE failed: ${res.status}`);

      const readableBody = Readable.from(res.body);

      const rl = readline.createInterface({
        input: readableBody,
        crlfDelay: Infinity,
      });

      let eventType = 'message';

      for await (const line of rl) {
        if (line.startsWith('event:')) {
          eventType = line.replace(/^event: */, '').trim();
          if (eventType === 'end') {
            rl.close();
            readableBody.destroy();
            return;
          }
          continue;
        }

        if (line.startsWith('data:')) {
          if (eventTypes.includes(eventType)) {
            const raw = line.replace(/^data: */, '');
            try {
              const json = JSON.parse(raw);
              await onEvent(json);
            } catch (err) {
              await onEvent(raw);
            }
          }
        }
        
        if (line === '') {
          eventType = 'message';
        }
      }
    } catch (err) {
      await onError(err);
      if (attempts < maxRetries) {
        attempts++;
        await new Promise(res => setTimeout(res, retryDelay));
        return connect();
      }
    }
  };

  return connect();
}

async function getConfig() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const configRaw = await fs.readFile(path.resolve(__dirname, 'config.json'), 'utf8');
  return JSON.parse(configRaw);
}

async function executeMind(mindName, isDefaultUiDisabled, args, responseStructure) {
  const config = await getConfig();
  const { mind_id, 'share-key': shareKey } = config;

  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const body = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="mind_name"`,
    '',
    mindName,
    `--${boundary}`,
    `Content-Disposition: form-data; name="is_default_ui_disabled"`,
    '',
    String(isDefaultUiDisabled),
    `--${boundary}`,
    `Content-Disposition: form-data; name="args"`,
    '',
    JSON.stringify(args),
    `--${boundary}`,
    `Content-Disposition: form-data; name="mind_id"`,
    '',
    mind_id,
    `--${boundary}`,
    `Content-Disposition: form-data; name="response_structure"`,
    '',
    JSON.stringify(responseStructure),
    `--${boundary}--`,
    '',
  ].join('\r\n');

  const res = await undiciFetch('https://api.paramai.studio/mindflow/execute_mind', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Share-Key': shareKey,
      'Origin': 'https://lab.paramai.studio',
      'Referer': 'https://lab.paramai.studio/',
      'X-Mind-Id': mind_id,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body: body,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`executeMind failed: ${res.status} - ${errorText}`);
  }
  return res.json();
}

async function getSession(mindId, sessionId) {
  const config = await getConfig();
  const { 'share-key': shareKey } = config;

  const res = await undiciFetch(`https://api.paramai.studio/mindflow/${mindId}/${sessionId}/get_session`, {
    headers: {
      Accept: 'application/json',
      'share-key': shareKey,
      Origin: 'https://lab.paramai.studio',
      Referer: 'https://lab.paramai.studio/',
      'X-Mind-Id': mindId,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`getSession failed: ${res.status} - ${errorText}`);
  }
  return res.json();
}

/**
 * Executes a mindflow and streams logs via SSE
 * @returns resolved session data
 */
async function executeMindAndGetResults(mindName, isDefaultUiDisabled, args, responseStructure) {
  const { job_id, session_id } = await executeMind(mindName, isDefaultUiDisabled, args, responseStructure);
  const config = await getConfig();

  console.log(`Mind execution started. Job ID: ${job_id}, Session ID: ${session_id}`);
  console.log('Streaming logs...');

  await streamSSE(`https://lab.paramai.studio/sse/events/${job_id}?check=1`, {
    eventTypes: ['message'], // Only listen to 'message' events for logging
    onEvent: data => {
      // The server seems to send JSON with a 'message' property, or just raw strings.
      if (typeof data === 'object' && data !== null && data.message) {
        console.log(data.message);
      } else if (typeof data === 'string') {
        // It might send strings which are JSON, so we try to parse them.
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.message) {
            console.log(parsed.message);
          } else {
            console.log(data);
          }
        } catch(e) {
          console.log(data); // Not JSON, just log raw
        }
      } else {
        // For other data types, just log them.
        console.log(data);
      }
    },
    onError: err => console.error('SSE error:', err.message),
  });

  console.log('Log streaming finished.');
  console.log('Fetching final session data...');
  return getSession(config.mind_id, session_id);
}

export {
  executeMind,
  getSession,
  streamSSE,
  executeMindAndGetResults,
};
