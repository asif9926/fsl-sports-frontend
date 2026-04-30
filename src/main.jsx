import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/* ✅ .env থেকে Google Client ID নেওয়া হচ্ছে */}
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </GoogleOAuthProvider>
    </StrictMode>
);

import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })