
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/authContext';
import ProtectedRoute from './utils/protectedRoute';

import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/signup';
import Home from './pages/home/home';
import Settings from './pages/settings/settings';
import TaskManagementPage from './pages/task-management/task-management-page';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* Private section */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/task-management" element={<TaskManagementPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
