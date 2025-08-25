# Backend Plan - Project-Centric Architecture
## Lovable FloForward - FastAPI Backend

### 🎯 **System Overview**
This document outlines the backend plan for the Lovable FloForward AI-powered application builder. The system is **project-centric**, meaning every AI-generated artifact (BRD, schemas, state machines, etc.) is linked to a specific project, creating a cohesive development environment.

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
- **Artifact Service** - Manage all project artifacts
- **Build Service** - Application building and compilation
- **Deploy Service** - Deployment orchestration
- **User Service** - Authentication and user management

### **3. Data Layer**
- **MongoDB** - Primary database for structured data and document storage
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
│   │       ├── artifacts.py      # All project artifacts
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

## 🎯 **Project-Centric Data Model**

### **Core Project Entity**
```python
class Project(Document):
    meta = {'collection': 'projects'}
    
    id = ObjectIdField(primary_key=True)
    name = StringField(required=True, max_length=255)
    description = StringField()
    owner_id = ObjectIdField(required=True)
    status = StringField(choices=['draft', 'active', 'archived'], default='draft')
    visibility = StringField(choices=['private', 'team', 'public'], default='private')
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    # Embedded documents for project artifacts
    brd = EmbeddedDocumentField('BRD')
    project_plan = EmbeddedDocumentField('ProjectPlan')
    schemas = ListField(EmbeddedDocumentField('Schema'))
    state_machines = ListField(EmbeddedDocumentField('StateMachine'))
    master_schemas = ListField(EmbeddedDocumentField('MasterSchema'))
    business_rules = ListField(EmbeddedDocumentField('BusinessRule'))
    synthetic_data = ListField(EmbeddedDocumentField('SyntheticData'))
    applications = ListField(EmbeddedDocumentField('Application'))
    ai_sessions = ListField(EmbeddedDocumentField('AISession'))
    
    # Collaboration relationships
    members = ListField(EmbeddedDocumentField('ProjectMember'))
    invitations = ListField(EmbeddedDocumentField('ProjectInvitation'))
    comments = ListField(EmbeddedDocumentField('ProjectComment'))
    activity_logs = ListField(EmbeddedDocumentField('ProjectActivityLog'))
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
```

### **Project Artifacts (All Linked to Project)**

#### **1. BRD (Business Requirements Document)**
```python
class BRD(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    content = DictField()  # AI-generated BRD content
    version = IntField(default=1)
    created_at = DateTimeField(default=datetime.utcnow)
```

#### **2. Project Plan**
```python
class ProjectPlan(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    plan_data = DictField()  # AI-generated project plan
    status = StringField(choices=['draft', 'reviewed', 'approved'], default='draft')
    created_at = DateTimeField(default=datetime.utcnow)
```

#### **3. Schemas**
```python
class Schema(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    name = StringField(required=True)
    schema_data = DictField()  # AI-generated schema
    type = StringField(choices=['data', 'api', 'database'])
    version = IntField(default=1)
    created_at = DateTimeField(default=datetime.utcnow)
```

#### **4. State Machines**
```python
class StateMachine(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    name = StringField(required=True)
    state_machine_data = DictField()  # AI-generated state machine
    version = IntField(default=1)
    created_at = DateTimeField(default=datetime.utcnow)
```

#### **5. Master Schemas**
```python
class MasterSchema(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    name = StringField(required=True)
    master_schema_data = DictField()  # AI-generated master schema
    version = IntField(default=1)
    created_at = DateTimeField(default=datetime.utcnow)
```

#### **6. Business Rules**
```python
class BusinessRule(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    name = StringField(required=True)
    rule_data = DictField()  # AI-generated business rules
    category = StringField(choices=['validation', 'workflow', 'business_logic'])
    version = IntField(default=1)
    created_at = DateTimeField(default=datetime.utcnow)
```

#### **7. Synthetic Data**
```python
class SyntheticData(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    name = StringField(required=True)
    data_schema = DictField()  # Schema for synthetic data
    sample_data = DictField()  # Generated sample data
    generation_config = DictField()  # AI configuration used
    created_at = DateTimeField(default=datetime.utcnow)
```

#### **8. Applications**
```python
class Application(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    name = StringField(required=True)
    app_code = StringField()  # Generated application code
    build_status = StringField(choices=['pending', 'building', 'built', 'failed'], default='pending')
    deploy_status = StringField(choices=['pending', 'deploying', 'deployed', 'failed'], default='pending')
    version = IntField(default=1)
    created_at = DateTimeField(default=datetime.utcnow)
```

### **Collaboration Models**

#### **9. Project Members**
```python
class ProjectMember(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    user_id = ObjectIdField(required=True)
    role = StringField(choices=['owner', 'admin', 'developer', 'investor', 'viewer'], required=True)
    permissions = DictField()  # Granular permissions
    joined_at = DateTimeField(default=datetime.utcnow)
```

#### **10. Project Invitations**
```python
class ProjectInvitation(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    email = StringField(required=True)
    role = StringField(choices=['admin', 'developer', 'investor', 'viewer'], required=True)
    invited_by = ObjectIdField()
    status = StringField(choices=['pending', 'accepted', 'declined', 'expired'], default='pending')
    expires_at = DateTimeField()
    created_at = DateTimeField(default=datetime.utcnow)
```

#### **11. Project Comments**
```python
class ProjectComment(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    user_id = ObjectIdField(required=True)
    content = StringField(required=True)
    parent_comment_id = ObjectIdField()  # For replies
    created_at = DateTimeField(default=datetime.utcnow)
```

#### **12. Project Activity Logs**
```python
class ProjectActivityLog(EmbeddedDocument):
    id = ObjectIdField(primary_key=True, default=ObjectId)
    user_id = ObjectIdField(required=True)
    action = StringField(required=True)  # "created", "updated", "deleted", etc.
    resource_type = StringField()  # "brd", "schema", "application", etc.
    resource_id = ObjectIdField()
    details = DictField()
    created_at = DateTimeField(default=datetime.utcnow)
```

### **Configuration Models**

#### **13. Global Configuration**
```python
class GlobalConfiguration(Document):
    meta = {'collection': 'global_configurations'}
    
    id = ObjectIdField(primary_key=True, default=ObjectId)
    key = StringField(required=True, unique=True)
    value = DictField(required=True)
    description = StringField()
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
```

#### **14. Mind Configuration**
```python
class MindConfiguration(Document):
    meta = {'collection': 'mind_configurations'}
    
    id = ObjectIdField(primary_key=True, default=ObjectId)
    mind_id = StringField(required=True)  # Param AI mind ID
    name = StringField(required=True)
    description = StringField()
    default_config = DictField()  # Default configuration
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
```

#### **15. Project Mind Configuration**
```python
class ProjectMindConfiguration(Document):
    meta = {'collection': 'project_mind_configurations'}
    
    id = ObjectIdField(primary_key=True, default=ObjectId)
    project_id = ObjectIdField(required=True)
    mind_id = StringField(required=True)  # Param AI mind ID
    custom_config = DictField()  # Project-specific overrides
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
```

---

## 🔄 **Project-Centric API Flow**

### **1. Create Project**
```python
@router.post("/projects")
async def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user)
):
    # Create new project
    # Initialize empty artifact containers
    # Return project with ID
```

### **2. Generate BRD for Project**
```python
@router.post("/projects/{project_id}/brd")
async def generate_brd(
    project_id: UUID,
    requirements: BRDRequirements,
    current_user: User = Depends(get_current_user)
):
    # Use BRD Mind to generate business requirements
    # Store in project's BRD table
    # Link to project
```

### **3. Generate Project Plan**
```python
@router.post("/projects/{project_id}/plan")
async def generate_project_plan(
    project_id: UUID,
    brd_id: UUID,
    current_user: User = Depends(get_current_user)
):
    # Use Project Plan Mind to generate plan
    # Store in project's plan table
    # Link to project and BRD
```

### **4. Generate Schemas**
```python
@router.post("/projects/{project_id}/schemas")
async def generate_schemas(
    project_id: UUID,
    plan_id: UUID,
    current_user: User = Depends(get_current_user)
):
    # Use Schema Mind to generate data schemas
    # Store in project's schemas table
    # Link to project and plan
```

### **5. Generate State Machines**
```python
@router.post("/projects/{project_id}/state-machines")
async def generate_state_machines(
    project_id: UUID,
    plan_id: UUID,
    current_user: User = Depends(get_current_user)
):
    # Use State Machine Mind to generate workflows
    # Store in project's state_machines table
    # Link to project and plan
```

### **6. Generate Master Schemas**
```python
@router.post("/projects/{project_id}/master-schemas")
async def generate_master_schemas(
    project_id: UUID,
    schema_ids: List[UUID],
    current_user: User = Depends(get_current_user)
):
    # Use Master Schema Mind to consolidate schemas
    # Store in project's master_schemas table
    # Link to project and individual schemas
```

### **7. Generate Business Rules**
```python
@router.post("/projects/{project_id}/business-rules")
async def generate_business_rules(
    project_id: UUID,
    plan_id: UUID,
    current_user: User = Depends(get_current_user)
):
    # Use Business Rules Mind to generate rules
    # Store in project's business_rules table
    # Link to project and plan
```

### **8. Generate Synthetic Data**
```python
@router.post("/projects/{project_id}/synthetic-data")
async def generate_synthetic_data(
    project_id: UUID,
    schema_ids: List[UUID],
    current_user: User = Depends(get_current_user)
):
    # Use Synthetic Data Mind to generate test data
    # Store in project's synthetic_data table
    # Link to project and schemas
```

### **9. Create Application**
```python
@router.post("/projects/{project_id}/applications")
async def create_application(
    project_id: UUID,
    app_config: ApplicationConfig,
    current_user: User = Depends(get_current_user)
):
    # Use App Builder Mind to generate application
    # Store in project's applications table
    # Link to project and all generated artifacts
```

---

## 🎯 **Project Dashboard API**

### **Get Complete Project View**
```python
@router.get("/projects/{project_id}/dashboard")
async def get_project_dashboard(
    project_id: UUID,
    current_user: User = Depends(get_current_user)
):
    # Return project with all artifacts:
    # - BRD
    # - Project Plan
    # - Schemas
    # - State Machines
    # - Master Schemas
    # - Business Rules
    # - Synthetic Data
    # - Applications
    # - Build/Deploy status
```

---

## 🔗 **Artifact Dependencies**

```
Project
├── BRD (Business Requirements)
├── Project Plan (depends on BRD)
├── Schemas (depends on Plan)
├── State Machines (depends on Plan)
├── Master Schemas (depends on Schemas)
├── Business Rules (depends on Plan)
├── Synthetic Data (depends on Schemas)
└── Applications (depends on all above)
```

---

## 🧠 **AI Minds Integration**

### **Mind Types Supported**
1. **User Story Mind** - `033e0168-bc64-4833-bc22-bd3e3992501a`
2. **BRD Mind** - `98b50fe2-54df-47f0-acee-b33f8dbeb78e`
3. **Schema Mind** - `4846edec-c789-4e2a-a018-0f5e4823921a`
4. **State Machine Mind** - `0a162d01-e526-41b4-aa50-9fb1bae3bc78`
5. **Synthetic Data Mind** - `a3ae4c7d-8ca7-4640-8bba-fbefb9a399ab`
6. **App Builder Mind** - `0f95b2f7-008e-4310-84c4-a8823765d3e3`

### **Mind Service Implementation**
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
        response_structure: dict,
        project_id: UUID
    ) -> dict:
        # Execute mind via Param AI Studio
        # Store result in project's artifact table
        # Return structured response
        
    async def get_session(self, mind_id: str, session_id: str, project_id: UUID) -> dict:
        # Retrieve session data from Param AI
        # Cache in local database
        # Link to project
```

---

## 🔧 **Service Implementation**

### **Project Service**
```python
class ProjectService:
    async def create_project(self, project_data: dict, owner_id: UUID) -> Project:
        # Create new project
        # Initialize empty artifact containers
        
    async def get_project_dashboard(self, project_id: UUID) -> dict:
        # Return project with all artifacts
        # Include status and relationships
        
    async def update_project(self, project_id: UUID, updates: dict) -> Project:
        # Update project details
```

### **Collaboration Service**
```python
class CollaborationService:
    async def add_project_member(
        self, 
        project_id: UUID, 
        user_id: UUID, 
        role: str, 
        permissions: dict
    ) -> ProjectMember:
        # Add member to project
        # Set role and permissions
        # Log activity
        
    async def invite_to_project(
        self, 
        project_id: UUID, 
        email: str, 
        role: str, 
        invited_by: UUID
    ) -> ProjectInvitation:
        # Send invitation email
        # Create invitation record
        # Set expiration
        
    async def update_member_role(
        self, 
        project_id: UUID, 
        member_id: UUID, 
        new_role: str, 
        new_permissions: dict
    ) -> ProjectMember:
        # Update member role and permissions
        # Log activity
        # Notify member
        
    async def add_project_comment(
        self, 
        project_id: UUID, 
        user_id: UUID, 
        content: str, 
        parent_comment_id: UUID = None
    ) -> ProjectComment:
        # Add comment to project
        # Handle replies
        # Log activity
```

### **Configuration Service**
```python
class ConfigurationService:
    async def get_mind_configuration(
        self, 
        mind_id: str, 
        project_id: UUID = None
    ) -> dict:
        # Get mind configuration with priority:
        # 1. Project-specific override
        # 2. Mind default configuration
        # 3. Global configuration
        
    async def update_project_mind_config(
        self, 
        project_id: UUID, 
        mind_id: str, 
        custom_config: dict
    ) -> ProjectMindConfiguration:
        # Update project-specific mind configuration
        # Validate configuration
        # Log changes
        
    async def get_global_configuration(self, key: str) -> dict:
        # Get global configuration value
        # Apply caching if enabled
        
    async def update_global_configuration(
        self, 
        key: str, 
        value: dict, 
        description: str = None
    ) -> GlobalConfiguration:
        # Update global configuration (admin only)
        # Validate changes
        # Notify relevant services
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

### **Project Management**
```
GET    /api/v1/projects            # List projects
POST   /api/v1/projects            # Create project
GET    /api/v1/projects/{id}       # Get project
PUT    /api/v1/projects/{id}       # Update project
DELETE /api/v1/projects/{id}       # Delete project
GET    /api/v1/projects/{id}/dashboard  # Project dashboard
```

### **AI Artifacts Generation**
```
POST   /api/v1/projects/{id}/brd              # Generate BRD
POST   /api/v1/projects/{id}/plan             # Generate project plan
POST   /api/v1/projects/{id}/schemas          # Generate schemas
POST   /api/v1/projects/{id}/state-machines   # Generate state machines
POST   /api/v1/projects/{id}/master-schemas   # Generate master schemas
POST   /api/v1/projects/{id}/business-rules   # Generate business rules
POST   /api/v1/projects/{id}/synthetic-data   # Generate synthetic data
POST   /api/v1/projects/{id}/applications     # Create application
```

### **Build & Deploy**
```
POST   /api/v1/projects/{id}/build     # Start build
GET    /api/v1/builds/{id}/status      # Build status
POST   /api/v1/projects/{id}/deploy    # Deploy application
GET    /api/v1/deployments/{id}        # Deployment status
```

---

## 👥 **Collaboration API Endpoints**

### **Project Members Management**
```
GET    /api/v1/projects/{id}/members           # Get project members
POST   /api/v1/projects/{id}/members           # Add project member
PUT    /api/v1/projects/{id}/members/{member_id}  # Update member role
DELETE /api/v1/projects/{id}/members/{member_id}  # Remove member
```

### **Project Invitations**
```
POST   /api/v1/projects/{id}/invitations       # Send invitation
GET    /api/v1/projects/{id}/invitations       # Get invitations
PUT    /api/v1/invitations/{id}/respond       # Accept/decline invitation
```

### **Project Collaboration**
```
POST   /api/v1/projects/{id}/comments          # Add comment
GET    /api/v1/projects/{id}/comments          # Get comments
GET    /api/v1/projects/{id}/activity          # Get activity log
```

---

## ⚙️ **Configuration Management API**

### **Global Configuration**
```
GET    /api/v1/config/global                   # Get global configs
POST   /api/v1/config/global                   # Create global config (admin)
PUT    /api/v1/config/global/{id}              # Update global config (admin)
```

### **Mind Configuration**
```
GET    /api/v1/config/minds                    # Get mind configs
GET    /api/v1/config/minds/{mind_id}          # Get specific mind config
POST   /api/v1/config/minds                    # Create mind config (admin)
PUT    /api/v1/config/minds/{mind_id}          # Update mind config (admin)
```

### **Project-Specific Mind Configuration**
```
GET    /api/v1/projects/{id}/config/minds      # Get project mind configs
POST   /api/v1/projects/{id}/config/minds      # Create project mind config
PUT    /api/v1/projects/{id}/config/minds/{mind_id}  # Update project mind config
```

---

## 🗄️ **Database Schema**

### **Users Collection**
```python
class User(Document):
    meta = {'collection': 'users'}
    
    id = ObjectIdField(primary_key=True, default=ObjectId)
    email = StringField(required=True, unique=True, max_length=255)
    hashed_password = StringField(required=True)
    full_name = StringField(max_length=255)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
```

### **Projects Collection**
```python
class Project(Document):
    meta = {'collection': 'projects'}
    
    id = ObjectIdField(primary_key=True, default=ObjectId)
    name = StringField(required=True, max_length=255)
    description = StringField()
    owner_id = ObjectIdField(required=True)
    status = StringField(choices=['draft', 'active', 'archived'], default='draft')
    visibility = StringField(choices=['private', 'team', 'public'], default='private')
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
```

### **AI Sessions Collection**
```python
class AISession(Document):
    meta = {'collection': 'ai_sessions'}
    
    id = ObjectIdField(primary_key=True, default=ObjectId)
    project_id = ObjectIdField(required=True)
    mind_id = StringField(required=True)
    session_id = StringField()
    session_data = DictField()
    created_at = DateTimeField(default=datetime.utcnow)
```

---

## 🔧 **Service Implementation**

### **Project Service**
```python
class ProjectService:
    async def create_project(self, project_data: dict, owner_id: UUID) -> Project:
        # Create new project
        # Initialize empty artifact containers
        
    async def get_project_dashboard(self, project_id: UUID) -> dict:
        # Return project with all artifacts
        # Include status and relationships
        
    async def update_project(self, project_id: UUID, updates: dict) -> Project:
        # Update project details
```

### **Artifact Service**
```python
class ArtifactService:
    async def generate_artifact(
        self, 
        project_id: UUID, 
        artifact_type: str, 
        mind_id: str, 
        args: dict
    ) -> dict:
        # Generate artifact using AI mind
        # Store in appropriate project table
        # Return generated artifact
```

---

## 🔒 **Security Features**

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

### **Role-Based Access Control (RBAC)**

#### **User Roles**
```python
class UserRole(Enum):
    OWNER = "owner"           # Project creator, full access
    ADMIN = "admin"           # Can manage project and members
    DEVELOPER = "developer"   # Can create/edit artifacts
    INVESTOR = "investor"     # Can view and comment
    VIEWER = "viewer"         # Read-only access
```

#### **Permission Matrix**
```python
PERMISSIONS = {
    "owner": {
        "project": ["read", "write", "delete", "manage"],
        "members": ["read", "write", "delete", "manage"],
        "artifacts": ["read", "write", "delete", "manage"],
        "configuration": ["read", "write", "delete", "manage"]
    },
    "admin": {
        "project": ["read", "write"],
        "members": ["read", "write", "delete"],
        "artifacts": ["read", "write", "delete"],
        "configuration": ["read", "write"]
    },
    "developer": {
        "project": ["read"],
        "members": ["read"],
        "artifacts": ["read", "write"],
        "configuration": ["read"]
    },
    "investor": {
        "project": ["read"],
        "members": ["read"],
        "artifacts": ["read"],
        "configuration": ["read"]
    },
    "viewer": {
        "project": ["read"],
        "members": ["read"],
        "artifacts": ["read"],
        "configuration": ["read"]
    }
}
```

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
- **Database**: MongoDB 7.0+
- **Cache**: Redis 7
- **File Storage**: MinIO/S3
- **Load Balancer**: Nginx (optional)
- **Monitoring**: Prometheus + Grafana (optional)

---

## 🎯 **Benefits of Project-Centric Approach**

✅ **Single Source of Truth** - All artifacts linked to one project  
✅ **Version Control** - Track changes across all artifacts  
✅ **Dependency Management** - Clear relationships between artifacts  
✅ **Collaboration** - Team works on same project context  
✅ **Audit Trail** - Complete history of project evolution  
✅ **Easy Export** - Export entire project with all artifacts  
✅ **Centralized AI Operations** - All minds integration in backend  
✅ **Better Security** - API keys managed server-side  
✅ **Scalability** - Easy to add caching, rate limiting, monitoring

---

## ⚙️ **Configuration Management Examples**

### **Global Configuration Examples**
```json
{
  "ai_service": {
    "default_timeout": 300,
    "max_retries": 3,
    "cache_duration": 3600
  },
  "security": {
    "session_timeout": 86400,
    "max_login_attempts": 5,
    "password_min_length": 8
  },
  "notifications": {
    "email_enabled": true,
    "slack_enabled": false,
    "webhook_url": null
  }
}
```

### **Mind Configuration Examples**
```json
{
  "app_builder_mind": {
    "default_config": {
      "framework": "react",
      "styling": "tailwind",
      "state_management": "redux",
      "testing": "jest"
    },
    "options": {
      "frameworks": ["react", "vue", "angular"],
      "styling": ["tailwind", "bootstrap", "material-ui"],
      "state_management": ["redux", "context", "zustand"]
    }
  },
  "schema_mind": {
    "default_config": {
      "output_format": "json_schema",
      "validation_level": "strict",
      "include_examples": true
    }
  }
}
```

### **Project-Specific Override Example**
```json
{
  "project_id": "123e4567-e89b-12d3-a456-426614174000",
  "mind_id": "0f95b2f7-008e-4310-84c4-a8823765d3e3",
  "custom_config": {
    "framework": "vue",  // Override default React
    "styling": "bootstrap",  // Override default Tailwind
    "state_management": "pinia",  // Override default Redux
    "custom_components": ["data-table", "chart-widget"]
  }
}
```

---

## 🔐 **Collaboration Security Features**

### **Invitation System**
- **Email-based invitations** with secure tokens
- **Role-based access** control for different user types
- **Expiration dates** for invitations (default: 7 days)
- **Audit logging** of all invitation activities

### **Real-time Collaboration**
- **WebSocket support** for live updates
- **Comment threading** with reply support
- **Activity feeds** showing project changes
- **Notification system** for important events

### **Data Privacy**
- **Project visibility** controls (private/team/public)
- **Granular permissions** per artifact type
- **Audit trails** for compliance requirements
- **Data export** controls based on user role  

---

This project-centric architecture ensures that every AI-generated artifact is properly linked to a project, creating a cohesive development environment where users can see the complete picture of their application from requirements to deployment. 