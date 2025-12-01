

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<Forgot />} />
        
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
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/admin-panel-shutdown" element={<Layout><AdminPanelShutdown /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;