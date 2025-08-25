# Minds Integration Migration Plan
## Moving from Frontend to Backend

### 🎯 **Current State (Frontend)**
```javascript
// Frontend directly calls Param AI
const mindResult = await executeMind(
    mindName, 
    args, 
    responseStructure, 
    config.paramAiSdk.appBuilderMindId
);
```

### 🚀 **Target State (Backend)**
```javascript
// Frontend calls backend API
const mindResult = await fetch('/api/v1/ai/minds/execute', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
        mind_id: config.paramAiSdk.appBuilderMindId,
        mind_name: mindName,
        args: args,
        response_structure: responseStructure
    })
});
```

---

## 📋 **Migration Steps**

### **Step 1: Create Backend Mind Service**
```python
# app/services/mind_service.py
class MindService:
    async def execute_mind(self, mind_id: str, mind_name: str, args: dict, response_structure: dict):
        # Call Param AI Studio
        # Handle session management
        # Return response to frontend
```

### **Step 2: Create Backend API Endpoint**
```python
# app/api/v1/ai_minds.py
@router.post("/minds/execute")
async def execute_mind(request: MindExecutionRequest):
    mind_service = MindService()
    return await mind_service.execute_mind(
        mind_id=request.mind_id,
        mind_name=request.mind_name,
        args=request.args,
        response_structure=request.response_structure
    )
```

### **Step 3: Update Frontend Calls**
```javascript
// Replace all executeMind calls with fetch to backend
// Update all getSession calls to use backend
// Update all mind-related API calls
```

---

## 🔄 **API Mapping**

| **Frontend Function** | **Backend Endpoint** | **Method** |
|----------------------|---------------------|------------|
| `executeMind()` | `/api/v1/ai/minds/execute` | POST |
| `getSession()` | `/api/v1/ai/minds/sessions/{session_id}` | GET |
| `fetchSessions()` | `/api/v1/ai/minds/sessions` | GET |
| `getAllSessions()` | `/api/v1/ai/minds/sessions` | GET |

---

## 🎯 **Benefits**

✅ **Centralized Control** - All AI operations in one place  
✅ **Better Security** - API keys managed on backend  
✅ **Easier Monitoring** - Track all AI usage  
✅ **Scalability** - Can add caching, rate limiting  
✅ **Maintenance** - Update AI logic without frontend changes  

---

## 🚧 **Implementation Order**

1. **Backend Mind Service** - Handle all Param AI calls
2. **API Endpoints** - Create REST endpoints for minds
3. **Frontend Updates** - Replace direct calls with API calls
4. **Testing** - Verify all functionality works
5. **Deployment** - Deploy backend and update frontend 