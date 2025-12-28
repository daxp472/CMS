# 🚀 NyayaSankalan Frontend - Complete Setup Guide

> **Status**: Foundation Complete - Ready for UI Development  
> **Date**: December 28, 2025  
> **Tech Stack**: React + Vite + TypeScript + Tailwind CSS + React Router + Axios

---

## 📋 Table of Contents

1. [What's Been Built](#whats-been-built)
2. [Project Structure](#project-structure)
3. [Configuration Files](#configuration-files)
4. [TypeScript Types](#typescript-types)
5. [API Services](#api-services)
6. [What's Next](#whats-next)
7. [How to Continue Development](#how-to-continue-development)
8. [Quick Start Commands](#quick-start-commands)

---

## ✅ What's Been Built

### **Phase 1: Foundation (COMPLETE)**

#### 1. **Project Setup** ✅
- Created React + Vite + TypeScript project
- Installed all dependencies:
  - `react-router-dom` - for navigation
  - `axios` - for API calls
  - `react-hot-toast` - for notifications
  - `tailwindcss` - for styling

#### 2. **Complete Folder Structure** ✅
```
client/
├── src/
│   ├── api/                    # ✅ All API service files
│   │   ├── axios.ts           # ✅ HTTP client with JWT
│   │   ├── auth.api.ts        # ✅ Login/logout APIs
│   │   ├── fir.api.ts         # ✅ FIR creation APIs
│   │   ├── case.api.ts        # ✅ Case management APIs
│   │   ├── investigation.api.ts # ✅ Investigation APIs
│   │   ├── document.api.ts    # ✅ Document APIs
│   │   ├── court.api.ts       # ✅ Court submission APIs
│   │   ├── bail.api.ts        # ✅ Bail APIs
│   │   ├── timeline.api.ts    # ✅ Timeline/audit APIs
│   │   └── index.ts           # ✅ Export all APIs
│   │
│   ├── types/                  # ✅ TypeScript definitions
│   │   └── api.types.ts       # ✅ 600+ lines matching backend
│   │
│   ├── components/             # ⏳ Need to create components
│   │   ├── layout/            # Empty - for Navbar, Sidebar
│   │   ├── common/            # Empty - for Loader, Error
│   │   └── ui/                # Empty - for Button, Input
│   │
│   ├── pages/                  # ⏳ Need to create pages
│   │   ├── auth/              # Empty - for Login
│   │   ├── police/            # Empty - for Police dashboards
│   │   ├── sho/               # Empty - for SHO dashboards
│   │   ├── court/             # Empty - for Court dashboards
│   │   └── judge/             # Empty - for Judge dashboards
│   │
│   ├── context/                # ⏳ Need AuthContext
│   ├── routes/                 # ⏳ Need ProtectedRoute
│   └── utils/                  # ⏳ Need helper functions
│
├── .env                        # ✅ Backend API URL configured
├── tailwind.config.js          # ✅ Tailwind with custom colors
├── postcss.config.js           # ✅ PostCSS configured
└── package.json                # ✅ All dependencies installed
```

#### 3. **TypeScript Types** ✅
Created `src/types/api.types.ts` with **100% backend schema match**:
- All 11 Enums (UserRole, CaseState, EvidenceCategory, etc.)
- User & Organization types
- FIR & Case types
- Investigation types (Events, Evidence, Witness, Accused)
- Document types
- Court types
- Bail types
- Audit & Timeline types
- API Request/Response types
- Form Data types for all operations

#### 4. **Complete API Service Layer** ✅
Created 9 API service files - ready to use immediately!

---

## 📁 Project Structure (Detailed)

```
client/
├── 📄 Configuration Files
│   ├── .env                    → Backend URL: http://localhost:5000/api
│   ├── package.json            → Dependencies: router, axios, toast
│   ├── tsconfig.json           → TypeScript config
│   ├── vite.config.ts          → Vite build config
│   ├── tailwind.config.js      → Custom colors for government UI
│   └── postcss.config.js       → CSS processing
│
├── 📂 src/
│   │
│   ├── 📂 api/ (✅ COMPLETE)
│   │   ├── axios.ts            → HTTP client + JWT interceptor
│   │   ├── auth.api.ts         → login(), getCurrentUser()
│   │   ├── fir.api.ts          → createFIR(), getFIRById()
│   │   ├── case.api.ts         → getMyCases(), getAllCases(), etc.
│   │   ├── investigation.api.ts → Evidence, Witness, Accused APIs
│   │   ├── document.api.ts     → Document management APIs
│   │   ├── court.api.ts        → Court submission APIs
│   │   ├── bail.api.ts         → Bail management APIs
│   │   ├── timeline.api.ts     → Timeline & audit APIs
│   │   └── index.ts            → Export all APIs
│   │
│   ├── 📂 types/ (✅ COMPLETE)
│   │   └── api.types.ts        → All TypeScript interfaces
│   │
│   ├── 📂 components/ (⏳ TO DO)
│   │   ├── layout/             → Navbar, Sidebar, Header
│   │   ├── common/             → Loader, Error, EmptyState, FileUpload
│   │   └── ui/                 → Button, Input, Card, Modal, Table
│   │
│   ├── 📂 pages/ (⏳ TO DO)
│   │   ├── auth/               → Login.tsx
│   │   ├── police/             → Police dashboards & workflows
│   │   ├── sho/                → SHO dashboards & workflows
│   │   ├── court/              → Court clerk dashboards
│   │   └── judge/              → Judge dashboards
│   │
│   ├── 📂 context/ (⏳ TO DO)
│   │   └── AuthContext.tsx     → User authentication state
│   │
│   ├── 📂 routes/ (⏳ TO DO)
│   │   └── ProtectedRoute.tsx  → Role-based route guards
│   │
│   ├── 📂 utils/ (⏳ TO DO)
│   │   └── helpers.ts          → Utility functions
│   │
│   ├── App.tsx                 → Main app component
│   ├── main.tsx                → App entry point
│   └── index.css               → ✅ Tailwind styles configured
```

---

## ⚙️ Configuration Files

### **1. .env**
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```
**Purpose**: Points frontend to your backend server

### **2. tailwind.config.js**
```javascript
// Custom government-style color scheme
colors: {
  primary: { ... },      // Blue shades
  government: { ... }    // Gray/neutral tones
}
```
**Purpose**: Professional, government-ready UI colors

### **3. src/index.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom utility classes */
.btn, .btn-primary, .btn-danger
.card, .input, .label, .badge
```
**Purpose**: Tailwind setup + reusable CSS classes

---

## 📝 TypeScript Types

### **File**: `src/types/api.types.ts`

This file contains **ALL** types matching the backend Prisma schema **exactly**.

### **What's Inside:**

#### **1. Enums (11 total)**
```typescript
UserRole         // POLICE, SHO, COURT_CLERK, JUDGE
CaseState        // 16 states from FIR_REGISTERED to ARCHIVED
EvidenceCategory // PHOTO, REPORT, FORENSIC, STATEMENT
DocumentType     // CHARGE_SHEET, EVIDENCE_LIST, etc.
BailStatus       // APPLIED, GRANTED, REJECTED
// ... and 6 more
```

#### **2. Core Entities**
```typescript
User             // User profile
PoliceStation    // Police station details
Court            // Court details
FIR              // First Information Report
Case             // Case details with state
```

#### **3. Investigation**
```typescript
InvestigationEvent  // Investigation activities
Evidence            // Evidence with file URLs
Witness             // Witness statements
Accused             // Accused persons
```

#### **4. Documents & Court**
```typescript
Document           // Legal documents
CourtSubmission    // Submission to court
CourtAction        // Hearings, judgments
BailRecord         // Bail applications
```

#### **5. Form Data Types**
```typescript
CreateFIRFormData      // For FIR creation form
CreateEvidenceFormData // For evidence upload form
// ... all form types
```

**Why This Matters**: Complete type safety - TypeScript will catch any API mismatch!

---

## 🔌 API Services (The Important Part!)

All API services are **ready to use**. Just import and call!

### **File**: `src/api/axios.ts`

**The Foundation** - HTTP client with JWT authentication

```typescript
import apiClient from './api/axios';

// Automatically:
// ✅ Adds JWT token to all requests
// ✅ Handles 401 (logout & redirect)
// ✅ Handles 403 (access denied)
// ✅ Shows error toasts
// ✅ Network error handling
```

### **File**: `src/api/auth.api.ts`

**Authentication APIs**

```typescript
import { authApi } from './api';

// Login
const response = await authApi.login({
  email: 'sho.central@police.gov',
  password: 'password123'
});
// Returns: { token: '...', user: {...} }

// Get current user
const user = await authApi.getCurrentUser();
// Returns: { id, email, name, role, organizationType, ... }

// Logout
authApi.logout(); // Clears token from localStorage
```

### **File**: `src/api/fir.api.ts`

**FIR Management**

```typescript
import { firApi } from './api';

// Create FIR (with optional file upload)
const fir = await firApi.createFIR({
  firNumber: 'FIR/2025/001',
  firDate: '2025-12-28',
  firSource: 'POLICE',
  sectionsApplied: ['302 IPC', '307 IPC'],
  complainantName: 'John Doe',
  complainantContact: '9876543210',
  incidentDate: '2025-12-27',
  incidentLocation: 'Main Street',
  descriptionOfIncident: 'Theft occurred...',
  firDocument: file // Optional PDF/JPG/PNG
});
// Auto-uploads file to Cloudinary via backend
```

### **File**: `src/api/case.api.ts`

**Case Management**

```typescript
import { caseApi } from './api';

// Get my assigned cases (POLICE)
const myCases = await caseApi.getMyCases();

// Get all cases (SHO/COURT)
const allCases = await caseApi.getAllCases();

// Get case details
const caseDetails = await caseApi.getCaseById('case-uuid');

// Assign case to officer (SHO only)
await caseApi.assignCase('case-uuid', {
  officerId: 'officer-uuid'
});

// Archive case (SHO/JUDGE)
await caseApi.archiveCase('case-uuid');
```

### **File**: `src/api/investigation.api.ts`

**Investigation Operations** (Evidence, Witness, Accused)

```typescript
import { investigationApi } from './api';

// Add evidence with file
const evidence = await investigationApi.createEvidence('case-uuid', {
  category: 'PHOTO',
  description: 'Crime scene photo',
  collectedDate: '2025-12-28',
  collectedFrom: 'Crime scene',
  file: photoFile // PDF/JPG/PNG
});

// Add witness with statement file
const witness = await investigationApi.createWitness('case-uuid', {
  name: 'Jane Smith',
  contact: '9876543210',
  address: '123 Street',
  statement: 'I witnessed...',
  statementFile: pdfFile // Optional
});

// Add accused
const accused = await investigationApi.createAccused('case-uuid', {
  name: 'Accused Name',
  fatherName: 'Father Name',
  address: '456 Street',
  status: 'ARRESTED',
  arrestDate: '2025-12-28'
});

// Get all evidence/witnesses/accused
const evidenceList = await investigationApi.getEvidence('case-uuid');
const witnessList = await investigationApi.getWitnesses('case-uuid');
const accusedList = await investigationApi.getAccused('case-uuid');
```

### **File**: `src/api/document.api.ts`

**Document Management**

```typescript
import { documentApi } from './api';

// Create document with file
const doc = await documentApi.createDocument('case-uuid', {
  documentType: 'CHARGE_SHEET',
  contentJson: { /* document data */ },
  file: pdfFile // Optional
});

// Get all documents
const docs = await documentApi.getDocuments('case-uuid');

// Finalize document (mark as FINAL)
await documentApi.finalizeDocument('doc-uuid');
```

### **File**: `src/api/court.api.ts`

**Court Operations**

```typescript
import { courtApi } from './api';

// Get police stations (for dropdowns)
const stations = await courtApi.getPoliceStations();

// Get courts (for dropdowns)
const courts = await courtApi.getCourts();

// Submit case to court (SHO - locks case)
const submission = await courtApi.submitToCourt('case-uuid', {
  courtId: 'court-uuid'
});

// Intake case (COURT_CLERK - accept case)
await courtApi.intakeCase('case-uuid');

// Create court action (JUDGE - hearings, judgments)
const action = await courtApi.createCourtAction('case-uuid', {
  actionType: 'HEARING',
  actionDate: '2025-12-30',
  description: 'First hearing scheduled'
});
```

### **File**: `src/api/bail.api.ts`

**Bail Management**

```typescript
import { bailApi } from './api';

// Create bail record
const bail = await bailApi.createBailRecord('case-uuid', {
  accusedName: 'Accused Name',
  bailType: 'ANTICIPATORY',
  applicationDate: '2025-12-28',
  remarks: 'Medical grounds'
});

// Get all bail records
const bailRecords = await bailApi.getBailRecords('case-uuid');
```

### **File**: `src/api/timeline.api.ts`

**Timeline & Audit**

```typescript
import { timelineApi } from './api';

// Get case timeline
const timeline = await timelineApi.getCaseTimeline('case-uuid');

// Get audit logs
const auditLogs = await timelineApi.getAuditLogs('case-uuid');
```

---

## 🎯 What's Next (Remaining Work)

### **Phase 2: Authentication (HIGH PRIORITY)**

#### **Task 4: Create AuthContext**
**File to create**: `src/context/AuthContext.tsx`

```typescript
// What you need to implement:
- AuthProvider component
- useAuth() hook
- login() function
- logout() function
- checkAuth() to verify token on load
- User state management
- Role detection
```

#### **Task 5: Protected Routing**
**Files to create**: 
- `src/routes/ProtectedRoute.tsx`
- Update `src/App.tsx`

```typescript
// What you need to implement:
- ProtectedRoute component with role checking
- React Router setup with all routes
- Role-based redirects (POLICE → /police, SHO → /sho, etc.)
- Unauthorized access → 403 page
```

#### **Task 8: Login Page**
**File to create**: `src/pages/auth/Login.tsx`

```typescript
// What you need to implement:
1. Email/password form
2. Call authApi.login()
3. Store token in localStorage
4. Call authApi.getCurrentUser()
5. Detect role
6. Redirect:
   - POLICE → /police/dashboard
   - SHO → /sho/dashboard
   - COURT_CLERK → /court/dashboard
   - JUDGE → /judge/dashboard
```

### **Phase 3: UI Components**

#### **Task 6: Common UI Components**
**Files to create** in `src/components/ui/`:
- Button.tsx - Reusable button with variants
- Input.tsx - Text input with validation
- Select.tsx - Dropdown select
- Textarea.tsx - Multi-line text
- Card.tsx - Content container
- Modal.tsx - Popup dialog
- Table.tsx - Data table
- Badge.tsx - Status badges

**Files to create** in `src/components/common/`:
- Loader.tsx - Loading spinner
- ErrorMessage.tsx - Error display
- EmptyState.tsx - Empty list message
- FileUpload.tsx - Drag & drop file upload

#### **Task 7: Layout Components**
**Files to create** in `src/components/layout/`:
- Layout.tsx - Main wrapper
- Navbar.tsx - Top navigation with role-based links
- Sidebar.tsx - Side navigation
- Header.tsx - Page headers

### **Phase 4: Role-Specific Pages**

#### **POLICE Pages** (9 pages)
1. Dashboard.tsx - Overview
2. CreateFIR.tsx - FIR creation form with file upload
3. MyCases.tsx - Assigned cases list
4. CaseDetails.tsx - Full case view
5. Investigation.tsx - Add investigation events
6. AddEvidence.tsx - Evidence upload
7. AddWitness.tsx - Witness management
8. AddAccused.tsx - Accused management
9. Documents.tsx - Document viewer

#### **SHO Pages** (7 pages)
1. Dashboard.tsx
2. AllCases.tsx
3. CaseDetails.tsx
4. AssignCase.tsx
5. ReviewCase.tsx
6. SubmitToCourt.tsx
7. ArchiveCase.tsx

#### **COURT_CLERK Pages** (5 pages)
1. Dashboard.tsx
2. IncomingCases.tsx
3. IntakeCase.tsx
4. CaseDetails.tsx
5. Documents.tsx

#### **JUDGE Pages** (5 pages)
1. Dashboard.tsx
2. CaseViewer.tsx
3. CourtActions.tsx
4. BailReview.tsx
5. Timeline.tsx

---

## 🚀 How to Continue Development

### **Step 1: Start with Authentication**

```bash
# 1. Create AuthContext
# File: src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { User } from '../types/api.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### **Step 2: Create Login Page**

```bash
# File: src/pages/auth/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');

      // Redirect based on role
      if (user?.role === 'POLICE') navigate('/police/dashboard');
      else if (user?.role === 'SHO') navigate('/sho/dashboard');
      else if (user?.role === 'COURT_CLERK') navigate('/court/dashboard');
      else if (user?.role === 'JUDGE') navigate('/judge/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          NyayaSankalan Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
```

### **Step 3: Setup Routing**

```bash
# File: src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/auth/Login';
// Import other pages as you create them

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Add protected routes here */}
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 💻 Quick Start Commands

### **Development**
```bash
# Navigate to client folder
cd "d:\Hack The Winter\client"

# Install dependencies (already done)
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# In another terminal, start backend
cd "../backend"
npm run dev
# Runs at http://localhost:5000
```

### **Build for Production**
```bash
npm run build
# Creates dist/ folder with optimized build
```

---

## 📚 Important Notes

### **1. NO Mock Data**
❌ Don't create fake data  
✅ All data comes from backend APIs  
✅ Use the API services already created

### **2. NO Business Logic in Frontend**
❌ Don't validate permissions in frontend  
❌ Don't enforce case state transitions  
✅ Backend is the source of truth  
✅ Frontend only shows/hides UI based on role

### **3. File Uploads**
✅ Use FormData (already handled in API services)  
✅ Backend handles Cloudinary automatically  
✅ Frontend just sends the file

### **4. Authentication**
✅ JWT stored in localStorage  
✅ Axios automatically adds token to requests  
✅ 401 errors automatically logout user

### **5. Error Handling**
✅ Global Axios interceptor handles most errors  
✅ Toasts show automatically  
✅ Just wrap async calls in try-catch for loading states

---

## 🎯 Development Priority

**Week 1: Core Auth & Layout**
1. AuthContext ✓
2. Login page ✓
3. Protected routing ✓
4. Layout components ✓

**Week 2: Police Workflow**
1. Police dashboard
2. Create FIR with file upload
3. My cases list
4. Case details page
5. Investigation features

**Week 3: SHO & Court**
1. SHO pages
2. Case assignment
3. Submit to court
4. Court clerk pages
5. Intake functionality

**Week 4: Judge & Polish**
1. Judge pages
2. Court actions
3. UI/UX improvements
4. Testing
5. Bug fixes

---

## 🔗 Backend Integration

### **Backend URLs**
- **API Base**: http://localhost:5000/api
- **Backend Docs**: See `backend/BACKEND.md`
- **API List**: See `backend/API_DOCUMENTATION.md`

### **Test Credentials**
From backend seed data:

**Police:**
- Email: `officer1@police.gov`
- Password: `password123`

**SHO:**
- Email: `sho.central@police.gov`
- Password: `password123`

**Court Clerk:**
- Email: `clerk@court.gov`
- Password: `password123`

**Judge:**
- Email: `judge@court.gov`
- Password: `password123`

---

## ✨ Summary

### **What You Have:**
✅ Complete project structure  
✅ All TypeScript types matching backend  
✅ 9 API service files ready to use  
✅ JWT authentication setup  
✅ File upload support  
✅ Error handling  
✅ Tailwind CSS configured  

### **What You Need to Build:**
⏳ AuthContext  
⏳ Login page  
⏳ Protected routing  
⏳ UI components  
⏳ Role-specific pages  
⏳ Forms and workflows  

### **How Long It Will Take:**
- **AuthContext + Login**: 2-3 hours
- **UI Components**: 4-5 hours
- **Police Pages**: 8-10 hours
- **Other Role Pages**: 6-8 hours
- **Polish & Testing**: 4-6 hours

**Total**: ~25-32 hours of focused development

---

## 🎉 You're Ready!

The hardest part (API integration, types, setup) is **DONE**.  
Now it's just building UI components and pages.  

**Start with AuthContext → Login → One dashboard at a time.**

Good luck! 🚀
