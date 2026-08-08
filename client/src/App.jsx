import React from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DevbotPage from './pages/DevbotPage';
import ChatPage from './pages/ChatPage';
import ProjectPage from './pages/ProjectPage';
import ProfilePage from './pages/ProfilePage';
import { useAppContext } from './context/AppContext';

// Private routes that require authentication
const PRIVATE_ROUTES = ['/devbot', '/chat', '/dashboard', '/profile', '/project'];

function App() {
  const { currentPath, setCurrentPath } = useAppContext();

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const cleanPath = currentPath.split('?')[0];
  const token = localStorage.getItem('token');

  // Handle GitHub OAuth callback
  if (cleanPath === '/auth/callback') {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const username = params.get('username');
    const email = params.get('email');
    const avatar = params.get('avatar');

    if (tokenParam) {
      localStorage.setItem('token', tokenParam);
      localStorage.setItem(
        'user',
        JSON.stringify({
          username,
          email: decodeURIComponent(email),
          avatar: decodeURIComponent(avatar)
        })
      );
      window.history.pushState({}, '', '/dashboard');
      setCurrentPath('/dashboard');
    } else {
      navigateTo('/login');
    }

    return null;
  }

  // Route protection for private routes
  const isPrivateRoute = PRIVATE_ROUTES.some(route => cleanPath.startsWith(route));
  if (isPrivateRoute && !token) {
    window.history.pushState({}, '', '/login');
    setCurrentPath('/login');
    return null;
  }

  // Public routes
  if (cleanPath === '/') {
    return <LandingPage navigateTo={navigateTo} />;
  }

  if (cleanPath === '/login' || cleanPath === '/register') {
    return <LoginPage navigateTo={navigateTo} />;
  }

  if (cleanPath === '/devbot') {
    return <DevbotPage navigateTo={navigateTo} />;
  }

  if (cleanPath === '/chat') {
    return <ChatPage navigateTo={navigateTo} />;
  }

  if (cleanPath === '/dashboard') {
    return <Dashboard navigateTo={navigateTo} />;
  }

  if (cleanPath === '/project') {
    return <ProjectPage navigateTo={navigateTo} />;
  }

  if (cleanPath === '/profile') {
    return <ProfilePage navigateTo={navigateTo} />;
  }

  // Fallback: render landing page for any unmatched route
  return <LandingPage navigateTo={navigateTo} />;
}

export default App;
