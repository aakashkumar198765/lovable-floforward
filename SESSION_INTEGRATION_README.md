# Session Management Integration for Project Plan Tabs

This document explains the session management functionality integrated into the Project Plan screen for BRD, Plan, and Preview tabs.

## Overview

The Project Plan screen now dynamically loads and displays content from Param AI sessions using mind IDs configured in `config.json`. Each tab (BRD, Plan, Preview, Synthetic Data) can fetch and display different versions/sessions of content with specific payloads for each mind type.

## Features

### 1. Dynamic Version Dropdown
- The version dropdown now shows actual sessions from the Param AI API
- Sessions are sorted by creation date (most recent first)
- Each version shows the format: "Version X - Date Time"

### 2. Automatic Content Loading
- When the component loads, it automatically fetches the most recent session for the active tab
- Content is displayed immediately for the most recent session

### 3. Tab-Specific Session Management
- **BRD Tab**: Loads session content as Markdown (uses original mind ID for backward compatibility)
- **Plan Tab**: Combines sessions from both Schema and StateMachine minds
- **Preview Tab**: Loads session content as Markdown or falls back to WorkflowPreview component
- **Synthetic Data Tab**: Loads session content for synthetic data generation

### 4. Error Handling & Loading States
- Loading indicators while fetching sessions
- Error messages with retry functionality
- Graceful fallback to default content if no sessions are available

### 5. Manual Refresh
- Refresh button to manually reload sessions
- Session ID display in the header for debugging

## Files Modified

### 1. `src/services/sessionService.js` (NEW)
Contains all session management functions:

#### Core Functions:
**BRD Functions:**
- `getBRDSessions()` - Get all BRD sessions
- `getBRDSessionContent(sessionId)` - Get specific BRD session content
- `getRecentBRDSession()` - Get the most recent BRD session
- `executeBRDMind(args)` - Execute BRD mind with custom arguments

**Plan Functions:**
- `getPlanSessions()` - Get combined sessions from Schema and StateMachine
- `getPlanSchemaSessions()` - Get all Plan Schema sessions
- `getPlanSchemaSessionContent(sessionId)` - Get specific Plan Schema session content
- `getPlanStateMachineSessions()` - Get all Plan StateMachine sessions
- `getPlanStateMachineSessionContent(sessionId)` - Get specific Plan StateMachine session content
- `getPlanSessionContent(sessionId)` - Get Plan session content (auto-detects type)
- `getRecentPlanSession()` - Get the most recent Plan session
- `executePlanSchemaMind(args)` - Execute Plan Schema mind
- `executePlanStateMachineMind(args)` - Execute Plan StateMachine mind

**Preview Functions:**
- `getPreviewSessions()` - Get all Preview sessions
- `getPreviewSessionContent(sessionId)` - Get specific Preview session content
- `getRecentPreviewSession()` - Get the most recent Preview session

**Synthetic Data Functions:**
- `getSyntheticDataSessions()` - Get all Synthetic Data sessions
- `getSyntheticDataSessionContent(sessionId)` - Get specific Synthetic Data session content
- `getRecentSyntheticDataSession()` - Get the most recent Synthetic Data session
- `executeSyntheticDataMind(args)` - Execute Synthetic Data mind with custom arguments

#### Utility Functions:
- `getMindIdForTab(tabType)` - Get appropriate mind ID for each tab type
- `createPayload(type, customArgs)` - Create proper payload structure for each mind type
- `formatSessionsForDropdown(sessions)` - Format sessions for dropdown display
- `getTabSessionsAndContent(tabType)` - Generic function to get sessions for any tab
- `getTabSessionContent(tabType, sessionId)` - Generic function to get session content

### 2. `src/pages/ProjectPlanScreen.tsx` (MODIFIED)
Updated with session management integration:

#### New State Variables:
- `versionOptions` - Array of session options for dropdown
- `sessionContent` - Current session content being displayed
- `isLoading` - Loading state indicator
- `error` - Error state management

#### New Functions:
- `loadSessionsForActiveTab()` - Load sessions when tab changes
- `handleVersionChange(sessionId)` - Handle version selection change
- `getDefaultContent(tabType)` - Get fallback content for each tab

## Usage

### How It Works
1. User navigates to Project Plan screen
2. Component automatically loads sessions for the active tab (BRD by default)
3. Most recent session is selected and displayed
4. User can change versions using the dropdown
5. Content updates dynamically based on selection

### API Integration
The integration uses the existing `paramai_browsersdk.js` functions:
- `getAllSessions(mindId, shareKey)` - Get all sessions
- `getSession(mindId, sessionId, shareKey)` - Get specific session content

### Configuration
Mind IDs and share key are now configured in `src/config.json`:
```json
{
  "paramAiStudio": {
    "url": "https://staging.paramwallet.com:8006",
    "mindShareKey": "94a5bcfa7fbcf707f434e63d7ce6c44d1e7b1bc0d45e3923ab8746feef66bcbb",
    "mindIds": {
      "schema": "4846edec-c789-4e2a-a018-0f5e4823921e",
      "statemachine": "0a162d01-e526-41b4-aa50-9fb1bae3bc78",
      "syntheticData": "a3ae4c7d-8ca7-4640-8bba-fbefb9a399ab"
    }
  }
}
```

### Mind Type Payloads
Each mind type uses specific payload structures:

**BRD:** Uses original mind ID for backward compatibility
**Plan Schema:** 
```javascript
args: {
  workflow_tree: "",
  files: []
}
```

**Plan StateMachine:**
```javascript
args: {
  csv_input: "",
  workflow_tree: "",
  files: []
}
```

**Synthetic Data:**
```javascript
args: {
  prompts: "",
  file: "",
  n_instances: []
}
```

## Testing

### Local Testing
1. Start the development server: `npm start`
2. Navigate to `/project-plan`
3. Check browser console for session loading logs
4. Try switching between tabs (BRD, Plan, Preview)
5. Use the version dropdown to switch between sessions
6. Use the refresh button to reload sessions

### Expected Behavior
- Loading indicator appears while fetching sessions
- Version dropdown populates with available sessions
- Content displays for selected session
- Error messages appear if API calls fail
- Fallback content shows if no sessions are available

## Troubleshooting

### Common Issues
1. **No sessions showing**: Check API connectivity and mind ID
2. **Loading forever**: Check network requests in developer tools
3. **Content not updating**: Verify session ID is being passed correctly

### Debug Information
- Check browser console for detailed logging
- Session loading starts with "🔄 Loading sessions for {tab} tab..."
- Session content loading shows "📄 Fetching {tab} session content for session: {sessionId}"
- Errors are logged with "❌" prefix

## Future Enhancements

### Planned Features
1. **Plan Tab Content Integration**: Display session content for Plan tab instead of just ReactFlow
2. **Session Metadata Display**: Show creation date, execution status, etc.
3. **Session Filtering**: Filter sessions by date, status, or other criteria
4. **Session Creation**: Allow creating new sessions from the UI
5. **Real-time Updates**: Auto-refresh when new sessions are created

### Extension Points
- Add session management for Smart AI tab
- Implement session comparison functionality
- Add session export/import features
- Integrate with workflow execution status

## Notes

- The Plan tab currently shows the existing ReactFlow visualization regardless of session content
- Session content is primarily designed for Markdown rendering
- Error handling includes retry functionality for failed API calls
- The integration is backward compatible - fallback content is shown if sessions aren't available 