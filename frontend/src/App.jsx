import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import RoleSwitcher from './components/RoleSwitcher';
import CitizenView from './pages/CitizenView';
import OfficialView from './pages/OfficialView';
import AdminDashboard from './pages/AdminDashboard';
import LoginView from './pages/LoginView';
import RegistrationView from './pages/RegistrationView';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col font-sans bg-gray-50 relative overflow-hidden">
        
        <RoleSwitcher />
        <main id="main-content" className="flex-grow z-10 w-full focus:outline-none" tabIndex="-1">
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/signup" element={<RegistrationView />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <CitizenView />
                </ProtectedRoute>
            } />
            <Route path="/official/police" element={<OfficialView roleName="Traffic Police" />} />
            <Route path="/official/bank" element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer className="z-10 bg-[#003893] text-white py-8 mt-12 border-t-4 border-[#DC143C]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-lg font-bold mb-4">E-Kar Nepal</h4>
                        <p className="text-sm text-blue-200">
                            Government of Nepal<br />
                            Ministry of Finance<br />
                            Singha Durbar, Kathmandu
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="text-sm text-blue-200 space-y-2">
                            <li><a href="#" className="hover:text-white hover:underline">Terms of Use</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Tax Calculation Rules</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Contact Support</h4>
                        <p className="text-sm text-blue-200">
                            Toll Free: 1111<br />
                            Email: info@mof.gov.np<br />
                            Designed by: <a href="https://gyanubaniya.com.np" target="_blank" rel="noreferrer" className="text-white font-bold hover:underline">Gyanu Baniya</a>
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-blue-800 text-center text-xs text-blue-300">
                    © {new Date().getFullYear()} Government of Nepal. All rights reserved.
                </div>
            </div>
        </footer>
      </div>
    </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
