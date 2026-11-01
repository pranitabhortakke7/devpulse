# DevPulse - Comprehensive Project Structure & Interview Guide

## 1. PROJECT OVERVIEW & TECH STACK

### Project Name
**DevPulse** - An AI-powered developer productivity platform that integrates with GitHub repositories to provide intelligent code analysis, documentation generation, and repository management capabilities.

### High-Level Goal
DevPulse serves as an "AI OS Cockpit" for developers, enabling them to:
- Connect and manage GitHub repositories
- Use AI-powered chat (DevBot) for code explanations and queries
- Automatically generate changelogs and README files
- Analyze code and request refactoring suggestions
- View repository analytics and commit history

### Technology Stack

#### Frontend
- **Language/Framework**: React 19.2.6 with Vite 8.0.12
- **Build Tool**: Vite (dev: `npm run dev`, build: `npm run build`)
- **CSS/Animations**: Framer Motion 12.40.0, Lucide React icons 1.17.0
- **HTTP Client**: Axios 1.17.0 (configured with interceptors for JWT)
- **Markdown Rendering**: React Markdown 10.1.0
- **Deployment**: Vercel (vercel.app domain)
- **Environment**: VITE_API_URL for backend configuration

#### Backend
- **Runtime/Framework**: Node.js + Express 5.2.1
- **Database**: MongoDB with Mongoose 9.6.3 ODM
- **Authentication**: 
  - JWT (jsonwebtoken 9.0.3) with 7-day expiration
  - Password hashing with bcryptjs 3.0.3 (salt rounds: 10)
- **CORS**: CORS 2.8.6 enabled for localhost:5173 and Vercel frontend
- **API Client**: Axios 1.18.1
- **External Services**:
  - **Groq SDK 1.2.1** - AI backend (LLaMA 3.3 70B model)
  - **GitHub OAuth** - User authentication + repository access
  - **GitHub API** - Repository data, commits, file content
- **Environment**: dotenv 17.4.2
- **Dev Tools**: Nodemon 3.1.14

#### Database
- **Type**: MongoDB (NoSQL, document-based)
- **Connection**: Via environment variable `MONGO_URI`
- **ODM**: Mongoose 9.6.3

---

## 2. CORE SYSTEM ARCHITECTURE & WORKFLOW

### User Roles/Personas

#### Primary User Role: Developer
- Can register with email/password OR authenticate via GitHub OAuth
- Has access to connected GitHub repositories
- Can interact with DevBot AI for code analysis
- Can generate documentation and perform repository operations

#### Secondary Capabilities:
- GitHub-Connected Developer: User with GitHub OAuth linking (enhanced permissions)
- Unauthenticated Visitor: Access to landing page only

### End-to-End User Workflows

#### **Workflow 1: Authentication & Onboarding**
```
1. User arrives at Landing Page (/)
   ↓
2. Choose Registration or Login Path
   ├─ Option A: Email/Password Registration
   │  ├─ Submit: POST /api/auth/register { username, email, password }
   │  ├─ Server: Hash password (bcryptjs), create User document
   │  ├─ Response: JWT token + user object
   │  └─ Client: Store token & user in localStorage
   │
   └─ Option B: GitHub OAuth
      ├─ Redirect to GitHub OAuth authorize endpoint
      ├─ User grants permissions (repo, read:user, user:email)
      ├─ GitHub callback: GET /api/auth/github/callback?code=...
      ├─ Server: Exchange code for access token → fetch GitHub user data
      ├─ Server Logic:
      │  ├─ Check if user exists by githubId (existing connection)
      │  ├─ If not, check by email (account linking)
      │  ├─ If not, create new User with generated password
      │  └─ Update the server-stored OAuth credential, avatar, and GitHub ID
      ├─ Generate JWT and redirect: /auth/callback?token=...&username=...&email=...&avatar=...
      └─ Client: Extract params, store token, navigate to /dashboard

3. Navigation by Authentication Status:
   ├─ If token exists → Private routes (/devbot, /dashboard, /chat, /project, /profile)
   └─ If no token → Redirect to /login or /register
```

#### **Workflow 2: Repository Integration & Exploration**
```
1. Authenticated user navigates to Dashboard (/dashboard)
   ↓
2. System fetches user's GitHub repositories
   ├─ Endpoint: GET /api/github/repos
   ├─ Auth: Bearer JWT token
   ├─ Uses: User's server-stored OAuth credential from OAuth
   └─ Returns: Array of repos (name, language, stars, forks, updated_at, etc.)
   ↓
3. User selects an active repository
   ├─ Repo context stored in AppContext state: activeRepo
   ├─ Triggers automatic data fetching:
   │  ├─ Fetch commits: GET /api/github/repos/{repoName}/commits
   │  ├─ Fetch file content: GET /api/github/repos/{repoName}/file
   │  └─ Fetch file tree: GitHub tree API
   └─ Updates component state: commits, codeContent, activeFile
   ↓
4. User interacts with repository
   ├─ View repository statistics: follower count, public repos count
   ├─ Browse commits with author, message, date
   └─ View source code files in Code Studio tab
```

#### **Workflow 3: AI-Powered Code Analysis (DevBot)**
```
1. User accesses DevBot Page (/devbot)
   ↓
2. DevBot Chat Interaction
   ├─ User types message in chat input
   ├─ Endpoint: POST /api/ai/chat
   ├─ Request body: { message, repoContext }
   ├─ Server:
   │  ├─ Initialize Groq client with GROQ_API_KEY
   │  ├─ System prompt: "You are DevBot, an intelligent AI assistant..."
   │  ├─ Call: groq.chat.completions.create()
   │  ├─ Model: llama-3.3-70b-versatile
   │  ├─ Max tokens: 1024
   │  ├─ Temperature: 0.7
   │  └─ Return: AI-generated response
   └─ Client: Display response in chat window (ReactMarkdown for formatting)
   ↓
3. Additional AI-Powered Features in DevBot:
   ├─ Code Refactoring
   │  ├─ Endpoint: POST /api/ai/refactor
   │  ├─ Params: { code, filename }
   │  ├─ Temperature: 0.3 (more deterministic)
   │  └─ Returns: Refactored code with comments
   │
   ├─ Changelog Generation
   │  ├─ Endpoint: POST /api/ai/changelog
   │  ├─ Params: { commits, repoName }
   │  ├─ Sections: ## Added, ## Fixed, ## Changed
   │  └─ Temperature: 0.5 (balanced)
   │
   └─ README Generation
      ├─ Endpoint: POST /api/ai/readme
      ├─ Params: { repoName, description, language }
      ├─ Includes: Title, Badges, Features, Tech Stack, Installation
      └─ Temperature: 0.5
```

#### **Workflow 4: Chat & Code Analysis (ChatPage)**
```
1. User navigates to /chat
   ↓
2. Select file context for chat
   ├─ Default file: src/App.jsx
   ├─ Can switch to different files for context
   └─ File content sent with API request
   ↓
3. Submit query to AI
   ├─ Endpoint: POST /api/ai/chat
   ├─ Message processed with file context
   ├─ Response displayed with React Markdown
   └─ Supports "Explanation Mode" toggle
   ↓
4. Generate Documentation
   ├─ Generate Changelog: Maps commits to sections
   ├─ Generate README: Creates comprehensive documentation
   └─ Results displayed with animated logging interface
```

### Key APIs & Routes

#### Authentication Routes (`/api/auth`)
```
POST   /api/auth/register
   Request:  { username, email, password }
   Response: { token, user: { id, username, email } }
   Status:   201 (Created) or 400 (User exists)

POST   /api/auth/login
   Request:  { email, password }
   Response: { token, user: { id, username, email } }
   Status:   200 or 400 (Invalid credentials)

GET    /api/auth/github
   Redirects to: GitHub OAuth authorize URL
   Scope:       repo, read:user, user:email

GET    /api/auth/github/callback?code=...
   Processes:   OAuth callback from GitHub
   Returns:     Redirect to /auth/callback?token=...&username=...&email=...&avatar=...

GET    /api/auth/me
   Auth:        Required (Bearer token)
   Response:    { User document without password }
   Status:      200 or 401 (No token)
```

#### GitHub Integration Routes (`/api/github`)
```
GET    /api/github/repos
   Auth:      Required
   Response:  Array of repositories with metadata
   Status:    200 or 401 (GitHub not connected)

GET    /api/github/repos/:repoName/commits
   Auth:      Required
   Response:  Array of commits { sha, message, date, author, url }
   Status:    200 or 500

GET    /api/github/repos/:repoName/file?path=...
   Auth:      Required
   Fetches:   File content from GitHub (base64 decoded)
   Response:  { content, path }

GET    /api/github/stats
   Auth:      Required
   Response:  { username, avatar, name, bio, public_repos, followers, following }
   Fetches:   GitHub profile stats for authenticated user
```

#### AI Routes (`/api/ai`)
```
POST   /api/ai/chat
   Auth:      Required
   Request:   { message, repoContext }
   AI Model:  llama-3.3-70b-versatile
   Response:  { reply: "AI response" }

POST   /api/ai/changelog
   Auth:      Required
   Request:   { commits: [], repoName }
   Response:  { changelog: "formatted markdown" }

POST   /api/ai/readme
   Auth:      Required
   Request:   { repoName, description, language }
   Response:  { readme: "formatted markdown" }

POST   /api/ai/refactor
   Auth:      Required
   Request:   { code, filename }
   Response:  { refactoredCode: "improved code" }
```

### Communication Mechanisms
- **REST API**: All primary communication (HTTP/HTTPS)
- **No WebSockets**: Polling-based UI updates
- **No Background Jobs**: Real-time AI request processing
- **Client-Side Caching**: localStorage for tokens and user data
- **Server-Side Caching**: None implemented

---

## 3. DATABASE & DATA MODELS

### Database: MongoDB (Atlas)

#### Connection
- Connection string: `MONGO_URI` environment variable
- ODM: Mongoose 9.6.3
- Connection handling: `.connect()` → `.then()/.catch()`

### Collections & Schema

#### **Users Collection**
```javascript
UserSchema = {
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
    // Hashed with bcryptjs before storage
  },
  githubId: {
    type: String,
    default: null
    // GitHub user ID when OAuth connected
  },
  // Private GitHub OAuth credential, used only by server-side API calls
  avatar: {
    type: String,
    default: ''
    // GitHub avatar URL or empty string
  },
  timestamps: true
  // createdAt, updatedAt automatically added
}
```

### Data Relationships

#### User Entity Relationships
```
User (1) ──────── (M) GitHub Repositories
   │
   ├─ Has: username, email, password
   ├─ Has Optional: githubId, private GitHub OAuth credential, avatar
   └─ Connected to: GitHub user account (external API)

User (1) ──────── (M) API Tokens
   ├─ Stores: JWT token in localStorage (client-side)
   ├─ Expiry: 7 days
   └─ Updated on: Login or Registration

User (1) ──────── (M) Repository Data (cached/external)
   ├─ Fetched from: GitHub API
   ├─ Cached in: AppContext state (client-side)
   └─ Accessed via: /api/github/repos endpoint
```

### Primary & Foreign Keys

#### User Collection
```
_id (MongoDB ObjectId)    → Primary Key
username (unique index)   → Natural key for lookups
email (unique index)      → Natural key for lookups
githubId (indexed)        → Foreign key to GitHub platform
```

#### GitHub Integration (External Reference)
```
githubId: references GitHub user account ID (external system)
Private GitHub OAuth credential: used only for server-side GitHub API access
```

---

## 4. AUTHENTICATION & AUTHORIZATION

### Authentication Implementation

#### Method: JWT (JSON Web Tokens) + Password Hashing

#### Registration Flow
```
1. User submits: { username, email, password }
2. Validation:
   ├─ Check if user already exists: User.findOne({ email })
   ├─ Return 400 if exists: "User already exists"
   └─ Proceed if new email

3. Password Processing:
   ├─ Generate salt: bcryptjs.genSalt(10)
   ├─ Hash password: bcryptjs.hash(password, salt)
   └─ Salt rounds: 10 (high security, ~100ms processing)

4. Create User:
   ├─ new User({ username, email, password: hashedPassword })
   ├─ user.save() → MongoDB
   └─ Returns: User document with _id

5. Generate Token:
   ├─ jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })
   ├─ Payload: User ID only (minimal payload)
   └─ Returns: Signed token string

6. Response:
   └─ { token, user: { id, username, email } }
```

#### Login Flow
```
1. User submits: { email, password }
2. Find user: User.findOne({ email })
   ├─ Return 400 if not found: "Invalid credentials"
   └─ Proceed if user exists

3. Verify password:
   ├─ bcryptjs.compare(password, user.password)
   ├─ Compare plaintext with stored hash
   └─ Return 400 if mismatch: "Invalid credentials"

4. Generate Token:
   ├─ Same JWT generation as registration
   └─ 7-day expiration

5. Response:
   └─ { token, user: { id, username, email } }
```

#### GitHub OAuth Flow
```
1. User clicks "Connect GitHub"
   ├─ Redirect to: https://github.com/login/oauth/authorize
   ├─ Parameters:
   │  ├─ client_id: GITHUB_CLIENT_ID
   │  ├─ scope: repo,read:user,user:email
   │  └─ redirect_uri: /api/auth/github/callback

2. GitHub OAuth Callback:
   ├─ Receive: code (one-time authorization code)
   ├─ Exchange for access_token:
   │  ├─ POST https://github.com/login/oauth/access_token
   │  ├─ Body: { client_id, client_secret, code }
   │  └─ Response: { access_token, token_type: 'bearer' }

3. Fetch GitHub User Data:
   ├─ GET https://api.github.com/user
   ├─ Headers: Authorization: token {accessToken}
   └─ Response: { id, login, email, avatar_url, ... }

4. User Lookup/Creation Logic:
   ├─ Check: User.findOne({ githubId: String(githubUser.id) })
   ├─ If found:
   │  └─ Update the server-stored OAuth credential, avatar, save()
   │
   ├─ Else, Check: User.findOne({ email: githubUser.email })
   ├─ If found:
   │  ├─ Link GitHub account to existing user
   │  └─ Update githubId, the server-stored OAuth credential, avatar, save()
   │
   └─ Else, Create new User:
      ├─ username: githubUser.login
      ├─ email: githubUser.email || `${githubUser.login}@github.com`
      ├─ password: bcryptjs.hash(Math.random().toString(36), 10)
      ├─ githubId, private OAuth credential, avatar
      └─ user.save()

5. Generate JWT:
   ├─ jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })

6. Redirect to Frontend:
   ├─ Redirect: {FRONTEND_URL}/auth/callback
   ├─ Parameters:
   │  ├─ token={jwtToken}
   │  ├─ username={user.username}
   │  ├─ email={user.email}
   │  └─ avatar={user.avatar}
   └─ Frontend extracts params → localStorage → navigate to /dashboard
```

### Session/Token Management

#### Client-Side Token Storage
```javascript
// Storage mechanism: localStorage (browser local storage)

// On login/register/OAuth:
localStorage.setItem('token', jwtToken)
localStorage.setItem('user', JSON.stringify({ id, username, email, avatar }))

// On logout:
localStorage.removeItem('token')
localStorage.removeItem('user')

// On app load:
const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user'))
// If both exist → set authenticated state
// If missing → redirect to /login
```

#### Server-Side Token Validation
```javascript
// Middleware: /server/middleware/auth.js

module.exports = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' })
  }

  try {
    // Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded  // Attach user to request
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
```

#### Axios Request Interceptor (Client)
```javascript
// /client/src/api/axios.js

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

// Every API call automatically includes: Authorization: Bearer {token}
```

### Route Protection

#### Public Routes (No Auth Required)
```
GET    /               → LandingPage
GET    /login          → LoginPage
GET    /register       → LoginPage (same component)
GET    /auth/callback  → GitHub OAuth callback handler
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/github
GET    /api/auth/github/callback
```

#### Protected Routes (Auth Required)
```
// Server-side:
router.get('/route', authMiddleware, (req, res) => { ... })

// Client-side:
PRIVATE_ROUTES = ['/devbot', '/chat', '/dashboard', '/profile', '/project']

// On navigation to private route:
if (PRIVATE_ROUTES.includes(cleanPath) && !token) {
  redirect to /login
}
```

### Validation Logic

#### Client-Side Validation
```javascript
// Login form validation:
if (!loginEmail.trim() || !loginPassword.trim()) return

// Register form validation:
if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) return

// Email format: Not explicitly validated (relying on server)
// Password strength: No client-side enforcement
```

#### Server-Side Validation
```javascript
// Email uniqueness: Checked in database
const existingUser = await User.findOne({ email })
if (existingUser) return 400

// Password requirements: None enforced
// Username uniqueness: Schema constraint (unique: true)

// OAuth email handling:
// If GitHub user has no email → Generate fallback: `${login}@github.com`
```

---

## 5. SECURITY, SAFEGUARDS & PERFORMANCE FEATURES

### Data Protection Mechanisms

#### Password Security
```
Hashing Algorithm:  bcryptjs v3.0.3
Salt Rounds:        10 (adaptive cost, ~100ms per hash)
Storage:            Hashed password only (plaintext never stored)
Comparison:         bcryptjs.compare() for secure verification
```

#### JWT Token Security
```
Algorithm:          HMAC SHA256 (via jsonwebtoken library)
Secret:             JWT_SECRET environment variable
Expiration:         7 days (hardcoded)
Payload:            { id: user._id } (minimal data)
Storage:            localStorage (vulnerable to XSS, but standard SPA pattern)
Transmission:       Authorization: Bearer {token} header
```

#### Network Security
```
CORS Configuration:
  ├─ Allowed Origins: 
  │  ├─ http://localhost:5173 (development)
  │  └─ https://devpulse-five-lovat.vercel.app (production)
  ├─ Credentials: true (allow cookies/auth headers)
  └─ Allowed Headers: Content-Type, Authorization

HTTPS:
  ├─ Production: Vercel enforces HTTPS
  ├─ Development: HTTP (localhost only)
  └─ No SSL pinning implemented
```

#### Data Protection Best Practices
```
✓ Password Hashing:        bcryptjs with high cost factor
✓ Prepared Statements:     Mongoose (ODM) prevents injection
✓ Token Validation:        Server-side JWT verification
✓ Sensitive Data:          Password excluded from API responses (.select('-password'))
✓ No Hardcoded Secrets:    Environment variables (.env)

✗ CSRF Tokens:             Not implemented (REST API, no form-based attacks)
✗ Content Sanitization:    Not explicitly implemented (XSS risk)
✗ Input Validation:        Minimal (relies on schema and error handling)
✗ Rate Limiting:           Not implemented
✗ Audit Logging:           Not implemented
```

### Access Control

#### GitHub Token Access Control
```javascript
// User's GitHub access token stored in database
// Private GitHub OAuth credential stored server-side only; never returned to the client

// Token used for:
├─ Fetching user's own repositories
├─ Accessing commit history
├─ Reading file contents
└─ Fetching user profile stats

// Token security:
├─ Stored securely in MongoDB
├─ Only used in server → GitHub API calls
├─ Never exposed to client
└─ Never logged or printed
```

#### API Endpoint Access
```javascript
// All sensitive endpoints protected by authMiddleware:
POST   /api/ai/chat              → Requires valid JWT
POST   /api/ai/changelog         → Requires valid JWT
POST   /api/ai/readme            → Requires valid JWT
POST   /api/ai/refactor          → Requires valid JWT
GET    /api/github/repos         → Requires valid JWT
GET    /api/github/stats         → Requires valid JWT
GET    /api/auth/me              → Requires valid JWT
```

### Performance Features

#### Client-Side Optimizations
```
Lazy Loading:
  ├─ React Router lazy components (not implemented, but single-page)
  └─ Vite code splitting enabled

Caching:
  ├─ localStorage for tokens and user data (persistent)
  ├─ AppContext state for repositories (cached until refresh)
  ├─ No HTTP cache headers configured

Animation Optimization:
  ├─ Framer Motion for GPU-accelerated animations
  ├─ Canvas rendering for neural network background
  └─ requestAnimationFrame for smooth 60fps

Bundle Size:
  ├─ React 19.2.6 (latest, optimized)
  ├─ Vite build optimization enabled
  └─ Tree-shaking for unused code
```

#### Server-Side Optimizations
```
✓ Async/Await:           All database and API calls are non-blocking
✓ Mongoose Indexing:     Unique indexes on username, email, githubId
✓ No Database Queries:   Minimal (only for auth flows)

✗ Connection Pooling:    Default Mongoose pool (5 connections)
✗ Caching Layer:         No Redis or memcached
✗ Rate Limiting:         Not implemented
✗ Compression:           Not configured (gzip)
✗ Pagination:            GitHub repos fetch only 20 most recent
```

#### GitHub API Optimization
```
Batch Requests:
  ├─ /api/github/repos: Returns 20 most recent repositories (per_page=20)
  └─ /api/github/repos/{name}/commits: Returns 10 most recent commits (per_page=10)

Selective Data Fetching:
  ├─ Commits endpoint returns only essential fields (sha, message, date, author, url)
  ├─ Repos endpoint excludes unnecessary metadata
  └─ File fetching uses base64 decoding (efficient transfer)
```

### Notable Security Observations

#### Strengths
```
1. Password hashing with bcryptjs (industry standard)
2. JWT token-based auth (stateless, scalable)
3. Server-side token validation for all protected routes
4. GitHub OAuth integration (no password storage for OAuth users)
5. Environment variables for secrets (not hardcoded)
6. MongoDB unique indexes prevent duplicate accounts
```

#### Weaknesses / Areas for Improvement
```
1. No rate limiting (vulnerable to brute-force login attempts)
2. localStorage token storage (vulnerable to XSS)
   → Consider: httpOnly cookies instead
3. No input sanitization (XSS risk in chat/markdown rendering)
4. No audit logging (cannot track user actions)
5. No CSRF protection (not critical for REST API)
6. GitHub access token exposed in database (consider encryption at rest)
7. No error message anonymization (reveals user existence)
8. No account lockout after failed login attempts
```

---

## 6. EDGE CASES & NOTABLE ENGINEERING CHOICES

### Authentication Edge Cases

#### 1. GitHub OAuth Account Linking
```
Scenario: User registers with email, then connects GitHub with same email

Implementation:
├─ Step 1: Check if githubId exists in database
│  └─ If yes → Update token, avatar, and return user
│
├─ Step 2: If githubId not found, check by email
│  ├─ If found → LINK accounts (githubId + token to existing user)
│  └─ This allows existing email users to connect GitHub
│
└─ Step 3: If email not found → Create new user with generated password

Implication:
  → Account unification (one user, multiple auth methods)
  → Users can log in via email/password OR GitHub OAuth
  → Seamless account discovery by email
```

#### 2. GitHub Users with No Email
```
Scenario: GitHub user's email is private/not configured

Solution:
  └─ Fallback: email = `${githubUser.login}@github.com`

Implication:
  → Ensures all users have valid email field
  → Generated emails are unique and linked to GitHub username
```

#### 3. GitHub OAuth Token Refresh
```
Current Implementation:
  ├─ Token stored directly in database
  ├─ No refresh token mechanism
  └─ Token expiration: GitHub's default (no expiration for classic tokens)

Risk:
  → If GitHub token revoked or rotated → API calls fail silently
  → No automatic refresh or renewal

Workaround:
  → User must re-connect GitHub to update token
  → Error handling returns: { notConnected: true } to prompt reconnection
```

#### 4. 7-Day Token Expiration
```
Implementation:
  └─ { expiresIn: '7d' } hardcoded in jwt.sign()

Edge Case:
  ├─ User opens app after 7 days → Token expired
  ├─ Private routes check localStorage.getItem('token')
  └─ Redirect to /login if no token or invalid JWT

Improvement Opportunity:
  → Implement token refresh flow with separate refresh tokens
  → Allow extending session without re-logging in
```

### Data & State Edge Cases

#### 1. Empty Repository State
```
Scenario: User connected to GitHub but has no repositories

Handling:
  ├─ /api/github/repos returns: []
  ├─ setActiveRepo() in AppContext → No repo selected
  ├─ Subsequent file/commit fetches return 500 error
  └─ UI shows "No repositories" message

Improvement:
  → Add explicit null checks before repo-dependent operations
  → Show user-friendly error: "No repositories found. Create one on GitHub."
```

#### 2. File Not Found in Repository
```
Scenario: Repo tree exists, but no .js/.jsx files found

Implementation:
  └─ GET /api/github/repos/{name}/file returns: { content: '// No files found', path: '' }

Fallback Strategy:
  ├─ Find first .js or .jsx file in tree
  ├─ If none found → Return stub content
  └─ Client displays placeholder message

Edge Case:
  → Repo with only non-code files (markdown, JSON)
  → API call succeeds but no code to display
```

#### 3. Concurrent AI Requests
```
Scenario: User submits chat message while changelog is generating

Implementation:
  ├─ Separate state variables for each operation
  ├─ Different endpoints: /api/ai/chat vs /api/ai/changelog
  └─ No request queuing or deduplication

Potential Issues:
  ├─ Multiple concurrent Groq API calls
  ├─ Rate limiting by Groq could block requests
  └─ No user feedback on remaining quota

Improvement:
  → Implement request queue on client
  → Show "Please wait..." during processing
  → Add quota tracking from Groq API
```

### Notable Engineering Choices

#### 1. **Single User Model (No Admin/Role System)**
```
Choice:
  └─ All users have identical permissions

Rationale:
  ├─ Early-stage product
  ├─ Focus on single-user experience
  └─ Simplified auth logic

Implication:
  ├─ Cannot assign admin roles
  ├─ All users access GitHub through their own token
  └─ No super-user or support tools
```

#### 2. **Client-Side Context API for State Management (No Redux/Zustand)**
```
Implementation:
  └─ React Context + useState hooks in AppContext.jsx

Pros:
  ├─ Built-in to React (no external dependency)
  ├─ Suitable for medium-sized app
  └─ Simpler than Redux middleware

Cons:
  ├─ No devtools for debugging
  ├─ Potential re-render performance issues at scale
  ├─ Props drilling in deeply nested components
  └─ Difficult to implement time-travel debugging

When this becomes a problem:
  → Add Zustand or Redux for state management
```

#### 3. **Direct localStorage Usage (No Secure Session Manager)**
```
Implementation:
  └─ localStorage.getItem/setItem for token persistence

Pros:
  ├─ Simple, no server-side session store needed
  ├─ Works across browser tabs
  └─ Survives page refresh

Cons:
  ├─ Vulnerable to XSS attacks
  ├─ Cannot revoke tokens from server side
  ├─ Token visible in DevTools Application tab
  └─ No automatic cleanup on logout

Production Alternatives:
  → Use httpOnly secure cookies instead
  → Add Content-Security-Policy (CSP) headers
  → Implement token revocation blacklist on server
```

#### 4. **Groq AI with Fixed Temperature Values**
```
Implementation:
  ├─ /api/ai/chat:       temperature: 0.7 (creative)
  ├─ /api/ai/changelog:  temperature: 0.5 (balanced)
  ├─ /api/ai/readme:     temperature: 0.5 (balanced)
  └─ /api/ai/refactor:   temperature: 0.3 (deterministic)

Rationale:
  ├─ Lower temp for code = consistent, predictable output
  ├─ Higher temp for chat = varied, natural conversations
  └─ Hardcoded to ensure consistency

Limitation:
  → Users cannot adjust creativity of AI responses
  → May produce repetitive changelogs across different repos
```

#### 5. **GitHub Access Through User's Token (No OAuth App Token)**
```
Implementation:
  └─ Each API call uses the user's server-stored OAuth credential

Design Choice:
  ├─ User-centric permissions
  ├─ Follows principle of least privilege
  └─ User can revoke access by disconnecting GitHub

Implication:
  ├─ Cannot access repos user doesn't own
  ├─ Cannot perform admin actions on repos
  ├─ Scope limited to: repo,read:user,user:email

Alternative (Not Used):
  └─ Server has its own OAuth token → Can access any public repo
```

#### 6. **No Database Migrations or Versioning**
```
Current State:
  ├─ Mongoose schema directly in code
  ├─ No migration framework (Sequelize, Prisma)
  └─ No version tracking of schema changes

Risk:
  ├─ Adding new fields requires manual data updates
  ├─ Downtime during schema changes
  ├─ No rollback mechanism

When to address:
  → Use tools like: migrate-mongo, Prisma migrations, or custom scripts
```

#### 7. **No Environment-Specific Configurations**
```
Current:
  ├─ Same JWT_SECRET across dev and production
  ├─ Same MongoDB connection string via .env
  ├─ Same Groq API key shared

Improvement:
  → Separate .env.development, .env.production
  → Use different Groq API keys for testing
  → Rotate secrets in production automatically
```

#### 8. **Inline Error Handling with Generic Messages**
```
Implementation:
  ├─ res.status(500).json({ message: 'Server error', error: err.message })
  └─ Error details exposed in API response

Security Issue:
  → Stack traces reveal internal structure
  → Helpful for debugging but risky in production

Fix:
  → Log errors server-side
  → Return generic "Something went wrong" to client
  → Expose error IDs for support queries
```

### Complex Logic Highlights

#### 1. **GitHub OAuth Callback State Machine**
```
State Flow:
  GitHub Auth URL
    ↓
  User Grants Permissions
    ↓
  GitHub Redirects with Code
    ↓
  Exchange Code for Access Token
    ↓
  Fetch GitHub User Data
    ↓
  Database Lookup/Update/Create
    ↓
  Generate JWT
    ↓
  Redirect to Frontend with Token
    ↓
  Frontend Extracts Token → Navigate to Dashboard
```

#### 2. **Repository Context Cascade (AppContext useEffects)**
```
User selects repo
  ↓
  Trigger useEffect for active repository
  ├─ Fetch commits: GET /api/github/repos/{name}/commits
  ├─ Fetch file content: GET /api/github/repos/{name}/file
  ├─ Update: commits, codeContent, activeFile state
  └─ All three operations run in parallel (Promise.all not used → race condition risk)
```

#### 3. **AI Response Streaming (Future Opportunity)**
```
Current:
  └─ API returns complete response after processing

Future:
  └─ Use streaming endpoints for real-time token generation
  └─ Update UI incrementally as response arrives

Current Limitation:
  → User sees "typing" indicator until full response ready
  → No progressive disclosure of AI thinking
```

---

## SUMMARY

DevPulse is a **full-stack React + Node.js + MongoDB** application with a focus on **AI-powered developer productivity**. The architecture is relatively straightforward:

- **Frontend**: Vite + React with Context API for state management
- **Backend**: Express with MongoDB + Groq AI integration
- **Auth**: JWT + GitHub OAuth with bcrypt password hashing
- **Security**: CORS, environment variables, unique indexes
- **Performance**: Optimized React animations, GitHub API pagination

### Key Strengths:
- Simple, understandable architecture
- Strong authentication with multiple methods (email + GitHub OAuth)
- Smooth integration with GitHub API
- AI-powered features with Groq LLaMA model

### Key Weaknesses:
- No rate limiting (DoS risk)
- No audit logging (compliance risk)
- localStorage token storage (XSS risk)
- Minimal input validation
- No database migration strategy

### Interview Talking Points:
1. How would you add role-based access control (RBAC)?
2. Suggest improvements for security (rate limiting, audit logs)
3. How would you scale this to millions of users?
4. Why use Context API instead of Redux?
5. How does GitHub OAuth account linking work?
6. What are the risks of storing GitHub tokens in the database?
7. How would you implement token refresh flows?
8. Why is the 7-day JWT expiration hardcoded?
