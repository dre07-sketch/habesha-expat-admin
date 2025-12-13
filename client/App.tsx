import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Forgot from './pages/auth/Forgot';
import Dashboard from './pages/lists/Dashboard';
import B2B from './pages/lists/B2B';
import Podcasts from './pages/lists/Podcasts';
import Videos from './pages/lists/Videos';
import Users from './pages/lists/Users';
import Articles from './pages/lists/Articles';
import Subscribers from './pages/lists/Subscribers';
import Events from './pages/lists/Events';
import Ads from './pages/lists/Ads';
import Categories from './pages/lists/Categories';
import Settings from './pages/lists/Settings';
import AdminPanelShutdown from './pages/shutdown/AdminPanelShutdown';
import Jobs from './pages/lists/Jobs';
import Travel from './pages/lists/TravelPage';

const App: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<'activated' | 'deactivated' | 'loading'>('loading');
  const [maintenanceMessage, setMaintenanceMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await fetch('/api/system/system-status/admin-panel/check');
        const data = await response.json();

        if (data.success) {
          setSystemStatus(data.status);
          setMaintenanceMessage(data.maintenance_message || '');
        } else {
          setError(data.message || 'Failed to fetch admin panel status');
          setSystemStatus('activated'); // Fallback to activated
        }
      } catch (err) {
        console.error('Error fetching admin panel status:', err);
        setError('Network error while checking admin panel status');
        setSystemStatus('activated'); // Fallback to activated
      }
    };

    fetchSystemStatus();
  }, []);

  if (systemStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-lg font-mono">CHECKING ADMIN PANEL STATUS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        <div className="text-center p-6 border border-red-800 rounded max-w-md">
          <h2 className="text-2xl font-bold mb-4">SYSTEM ERROR</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-900 hover:bg-red-800 rounded"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {systemStatus === 'deactivated' ? (
          // If system is deactivated, show shutdown page for all routes
          <Route path="*" element={<AdminPanelShutdown maintenanceMessage={maintenanceMessage} />} />
        ) : (
          // Normal routes when system is activated
          <>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/login" element={<Login />} />
            {/* Protected Admin Routes */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/b2b" element={<Layout><B2B /></Layout>} />
            <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
            <Route path="/podcasts" element={<Layout><Podcasts /></Layout>} />
            <Route path="/videos" element={<Layout><Videos /></Layout>} />
            <Route path="/users" element={<Layout><Users /></Layout>} />
            <Route path="/articles" element={<Layout><Articles /></Layout>} />
            <Route path="/subscribers" element={<Layout><Subscribers /></Layout>} />
            <Route path="/events" element={<Layout><Events /></Layout>} />
            <Route path="/ads" element={<Layout><Ads /></Layout>} />
            <Route path="/categories" element={<Layout><Categories /></Layout>} />
            <Route path="/travel" element={<Layout><Travel /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="/admin-panel-shutdown" element={<Layout><AdminPanelShutdown /></Layout>} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;