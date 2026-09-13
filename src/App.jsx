import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Workspace from './pages/Workspace';
import Documents from './pages/Documents';
import KnowledgeBase from './pages/KnowledgeBase';
import Models from './pages/Models';
import Tools from './pages/Tools';
import Tasks from './pages/Tasks';
import AuditLogs from './pages/AuditLogs';
import Security from './pages/Security';
import Settings from './pages/Settings';
import Sandbox from './pages/Sandbox';
import Users from './pages/Users';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentManagement from './pages/DepartmentManagement';
import Notices from './pages/Notices';
import SystemHealth from './pages/SystemHealth';
import UserNotices from './pages/UserNotices';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebSocketProvider>
          <WorkspaceProvider>
            <Routes>
              {/* Public Authentication Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Workbench Application Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Workspace />} />
                <Route path="workspace" element={<Workspace />} />
                <Route path="documents" element={<Documents />} />
                <Route path="knowledge-base" element={<KnowledgeBase />} />
                <Route path="models" element={<Models />} />
                <Route path="tools" element={<Tools />} />
                <Route path="sandbox" element={<Sandbox />} />
                <Route path="admin/users" element={<ProtectedRoute requiredRole="admin"><Users /></ProtectedRoute>} />
                <Route path="admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="admin/departments" element={<ProtectedRoute requiredRole="admin"><DepartmentManagement /></ProtectedRoute>} />
                <Route path="admin/notices" element={<ProtectedRoute requiredRole="admin"><Notices /></ProtectedRoute>} />
                <Route path="admin/system-health" element={<ProtectedRoute requiredRole="admin"><SystemHealth /></ProtectedRoute>} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="security" element={<Security />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notices" element={<UserNotices />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </WorkspaceProvider>
        </WebSocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

