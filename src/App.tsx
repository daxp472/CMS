import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/Layout/AppLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FIRIntake from './pages/FIRIntake';
import Cases from './pages/Cases';
import Documents from './pages/Documents';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import AuditTrail from './pages/AuditTrail';
import CaseDetail from './pages/CaseDetail';
import FIRDetail from './pages/FIRDetail';
import DocumentDetail from './pages/DocumentDetail';
import EvidenceList from './pages/EvidenceList';
import ChargeSheet from './pages/ChargeSheet';
import RemandApplication from './pages/RemandApplication';
import EvidenceListTemplate from './pages/EvidenceListTemplate';
import WitnessList from './pages/WitnessList';
import AssignCase from './pages/AssignCase';
import GenericPage from './pages/GenericPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#F9FAFB',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#F9FAFB',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#F9FAFB',
                },
              },
            }}
          />
          
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="fir-intake" element={<FIRIntake />} />
              <Route path="cases" element={<Cases />} />
              <Route path="cases/:caseId" element={<CaseDetail />} />
              <Route path="fir/:firId" element={<FIRDetail />} />
              <Route path="documents" element={<Documents />} />
              <Route path="documents/:docId" element={<DocumentDetail />} />
              <Route path="evidence/:caseId" element={<EvidenceList />} />
              <Route path="charge-sheet/:caseId" element={<ChargeSheet />} />
              <Route path="remand/:caseId" element={<RemandApplication />} />
              <Route path="evidence-list/:caseId" element={<EvidenceListTemplate />} />
              <Route path="witness-list/:caseId" element={<WitnessList />} />
              <Route path="evidence" element={<GenericPage title="Evidence Management" description="Manage evidence for your cases" />} />
              <Route path="submit" element={<GenericPage title="Submit to SHO" description="Submit cases to Senior Officer for approval" />} />
              <Route path="approve" element={<GenericPage title="Approvals" description="Review and approve cases" />} />
              <Route path="assign/:caseId?" element={<AssignCase />} />
              <Route path="intake" element={<GenericPage title="Case Intake" description="Intake new cases" />} />
              <Route path="receipts" element={<GenericPage title="Receipts" description="Manage case receipts" />} />
              <Route path="generate" element={<GenericPage title="Generate Receipt" description="Generate acknowledgment receipts for cases" />} />
              <Route path="timeline" element={<GenericPage title="Case Timeline" description="View case timelines" />} />
              <Route path="search" element={<GenericPage title="Search" description="Search across all records" />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="audit" element={<AuditTrail />} />
              <Route path="judgments" element={<GenericPage title="Judgments" description="View case judgments" />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;