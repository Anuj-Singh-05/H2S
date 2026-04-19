import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { StoreProvider } from './store/StoreContext';
import Dashboard from './pages/Dashboard';
import VolunteerRegistry from './pages/VolunteerRegistry';
import { Heart, Home, Users } from 'lucide-react';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
      <Icon size={20} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
      {children}
    </Link>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-600/20">
                  <Heart size={24} />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  VolunteerMatch AI
                </span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-2 sm:items-center">
                <NavLink to="/" icon={Home}>Dashboard</NavLink>
                <NavLink to="/volunteers" icon={Users}>Registry</NavLink>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  OP
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">NGO Admin</div>
                  <div className="text-xs text-gray-500">Operation Heart</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/volunteers" element={<VolunteerRegistry />} />
          </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
}

export default App;
