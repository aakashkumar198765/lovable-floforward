# Backend Architecture Document
## Lovable FloForward - FastAPI Backend

### 🎯 **System Overview**
This document outlines the backend architecture for the Lovable FloForward AI-powered application builder. The backend replaces all frontend minds integrations with REST APIs, providing a centralized service layer for AI operations, project management, and application lifecycle management.

---

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
│                    (Lovable FloForward)                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/WebSocket
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                             │
│                      (Port 8000)                               │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Internal Services
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              External AI Services                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ Param AI    │ │ Param SDK   │ │ Other AI    │              │
│  │ Studio      │ │ Wallet      │ │ Services    │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ **System Architecture**

### **1. API Gateway Layer**
- **FastAPI Application** - Main entry point
- **Middleware Stack** - CORS, authentication, rate limiting
- **Request/Response Validation** - Pydantic schemas
- **API Versioning** - v1, v2 support

### **2. Service Layer**
- **AI Service** - Minds integration and AI operations
- **Project Service** - Project lifecycle management
- **Build Service** - Application building and compilation
- **Deploy Service** - Deployment orchestration
- **User Service** - Authentication and user management

### **3. Data Layer**
- **PostgreSQL** - Primary database for structured data
- **Redis** - Caching and session management
- **MinIO/S3** - File storage for generated applications

---

## 📁 **Project Structure**

```
backend/
├── app/
│   ├── main.py                    # FastAPI application entry
│   ├── core/
│   │   ├── config.py             # Environment configuration
│   │   ├── security.py           # JWT authentication
│   │   ├── database.py           # Database connections
│   │   └── exceptions.py         # Custom exception handlers
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py           # Authentication endpoints
│   │       ├── projects.py       # Project management
│   │       ├── ai_minds.py       # AI minds integration
│   │       ├── builds.py         # Build orchestration
│   │       ├── deployments.py    # Deployment management
│   │       └── workflows.py      # Workflow management
│   ├── models/                   # SQLAlchemy models
│   ├── schemas/                  # Pydantic schemas
│   ├── services/                 # Business logic services
│   └── utils/                    # Utility functions
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

---

## 🔌 **API Endpoints**

### **Authentication**
```
POST   /api/v1/auth/login          # User login
POST   /api/v1/auth/send-otp       # Send OTP
POST   /api/v1/auth/verify-otp     # Verify OTP
POST   /api/v1/auth/refresh        # Refresh token
```

### **AI Minds Integration** (Replacing Frontend Integration)
```
POST   /api/v1/ai/minds/execute    # Execute any mind
POST   /api/v1/ai/minds/sessions   # Create new session
GET    /api/v1/ai/minds/sessions   # Get session data
POST   /api/v1/ai/generate-app     # Generate application
POST   /api/v1/ai/generate-brd     # Generate BRD
POST   /api/v1/ai/generate-schema  # Generate schema
```

### **Project Management**
```
GET    /api/v1/projects            # List projects
POST   /api/v1/projects            # Create project
GET    /api/v1/projects/{id}       # Get project
PUT    /api/v1/projects/{id}       # Update project
DELETE /api/v1/projects/{id}       # Delete project
```

### **Build & Deploy**
```
POST   /api/v1/projects/{id}/build     # Start build
GET    /api/v1/builds/{id}/status      # Build status
POST   /api/v1/projects/{id}/deploy    # Deploy application
GET    /api/v1/deployments/{id}        # Deployment status
```

---

## 🧠 **AI Minds Integration Architecture**

### **Current Frontend Integration (To Be Replaced)**
```javascript
// OLD: Frontend directly calling Param AI
const mindResult = await executeMind(
    mindName, 
    args, 
    responseStructure, 
    config.paramAiSdk.appBuilderMindId
);
```

### **New Backend Integration**
```python
# NEW: Backend REST API
@router.post("/api/v1/ai/minds/execute")
async def execute_mind(
    request: MindExecutionRequest,
    current_user: User = Depends(get_current_user)
):
    mind_service = MindService()
    return await mind_service.execute_mind(
        mind_id=request.mind_id,
        mind_name=request.mind_name,
        args=request.args,
        response_structure=request.response_structure
    )
```

### **Mind Types Supported**
1. **User Story Mind** - `033e0168-bc64-4833-bc22-bd3e3992501a`
2. **BRD Mind** - `98b50fe2-54df-47f0-acee-b33f8dbeb78e`
3. **Schema Mind** - `4846edec-c789-4e2a-a018-0f5e4823921a`
4. **State Machine Mind** - `0a162d01-e526-41b4-aa50-9fb1bae3bc78`
5. **Synthetic Data Mind** - `a3ae4c7d-8ca7-4640-8bba-fbefb9a399ab`
6. **App Builder Mind** - `0f95b2f7-008e-4310-84c4-a8823765d3e3`

---

## 🔄 **Data Flow Architecture**

### **1. AI Mind Execution Flow**
```
Frontend → Backend API → Mind Service → Param AI Studio → Response → Frontend
```

### **2. Application Generation Flow**
```
Project Plan → AI Service → Mind Execution → Code Generation → Build Service → Deploy Service
```

### **3. Session Management Flow**
```
Frontend → Backend → Mind Service → Param AI → Session Storage → Response
```

---

## 🗄️ **Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Projects Table**
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id),
    project_plan JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **AI Sessions Table**
```sql
CREATE TABLE ai_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    mind_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255),
    session_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Builds Table**
```sql
CREATE TABLE builds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    status VARCHAR(50) DEFAULT 'pending',
    build_logs TEXT[],
    artifacts_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 **Service Implementation**

### **Mind Service**
```python
class MindService:
    def __init__(self):
        self.param_ai_client = ParamAIClient()
        self.param_sdk_client = ParamSDKClient()
    
    async def execute_mind(
        self, 
        mind_id: str, 
        mind_name: str, 
        args: dict, 
        response_structure: dict
    ) -> dict:
        # Execute mind via Param AI Studio
        # Handle session management
        # Return structured response
        
    async def get_session(self, mind_id: str, session_id: str) -> dict:
        # Retrieve session data from Param AI
        # Cache in local database
        
    async def create_session(self, mind_id: str, project_id: str) -> dict:
        # Create new AI session
        # Initialize with project context
```

### **AI Service**
```python
class AIService:
    def __init__(self, mind_service: MindService):
        self.mind_service = mind_service
    
    async def generate_application(self, project_plan: dict) -> dict:
        # Use App Builder Mind to generate application
        # Coordinate with other minds as needed
        
    async def generate_brd(self, requirements: dict) -> dict:
        # Use BRD Mind to generate business requirements
        
    async def generate_schema(self, data_structure: dict) -> dict:
        # Use Schema Mind to generate data schemas
```

---

## 🔒 **Security Architecture**

### **Authentication**
- JWT-based token authentication
- OTP verification for sensitive operations
- Token refresh mechanism
- Session management with Redis

### **Authorization**
- Role-based access control (RBAC)
- Project-level permissions
- API rate limiting
- Input validation and sanitization

### **Data Protection**
- HTTPS/TLS encryption
- Database connection encryption
- Sensitive data hashing
- Audit logging

---

## 🚀 **Deployment Architecture**

### **Containerization**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Infrastructure**
- **Application Server**: FastAPI with Uvicorn
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **File Storage**: MinIO/S3
- **Load Balancer**: Nginx (optional)
- **Monitoring**: Prometheus + Grafana (optional)

---

## 📊 **Performance & Scalability**

### **Caching Strategy**
- Redis caching for AI responses
- Database query result caching
- Session data caching
- Static asset caching

### **Async Processing**
- FastAPI async endpoints
- Background task processing
- Queue-based job processing
- WebSocket for real-time updates

### **Horizontal Scaling**
- Stateless API design
- Database connection pooling
- Load balancer support
- Microservice architecture ready

---

## 🔍 **Monitoring & Observability**

### **Health Checks**
- Database connectivity
- External service availability
- Memory and CPU usage
- Response time metrics

### **Logging**
- Structured JSON logging
- Request/response logging
- Error tracking and alerting
- Performance metrics collection

### **Metrics**
- API response times
- Error rates
- Throughput metrics
- Resource utilization

---

## 🔄 **Migration Strategy**

### **Phase 1: Backend Development**
- Implement FastAPI backend
- Create AI minds integration services
- Set up database and authentication

### **Phase 2: Frontend Integration**
- Update frontend to use backend APIs
- Remove direct Param AI calls
- Implement new authentication flow

### **Phase 3: Testing & Deployment**
- End-to-end testing
- Performance optimization
- Production deployment
- Monitoring setup

---

## 📋 **API Specifications**

### **Mind Execution Request**
```json
{
  "mind_id": "0f95b2f7-008e-4310-84c4-a8823765d3e3",
  "mind_name": "app_builder",
  "args": {
    "project_plan": "...",
    "requirements": "..."
  },
  "response_structure": {
    "format": "json",
    "schema": "..."
  }
}
```

### **Mind Execution Response**
```json
{
  "success": true,
  "data": {
    "session_id": "abc123",
    "result": "...",
    "status": "completed"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🎯 **Benefits of New Architecture**

### **Centralized Control**
- Single point of AI service management
- Consistent error handling
- Unified logging and monitoring

### **Security Improvements**
- Backend API key management
- User authentication and authorization
- Rate limiting and abuse prevention

### **Scalability**
- Horizontal scaling capability
- Load balancing support
- Microservice architecture ready

### **Maintainability**
- Clear separation of concerns
- Standardized API patterns
- Easy testing and debugging

---

## 🚧 **Implementation Timeline**

- **Week 1-2**: Backend foundation and database setup
- **Week 3-4**: AI minds integration services
- **Week 5-6**: Authentication and project management
- **Week 7-8**: Build and deploy services
- **Week 9-10**: Frontend integration and testing
- **Week 11-12**: Deployment and monitoring setup

---

This architecture provides a robust, scalable foundation for your AI-powered application builder while centralizing all minds integration through a clean REST API interface. 