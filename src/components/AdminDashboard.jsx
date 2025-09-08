import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Users, 
  BookOpen, 
  MapPin, 
  GraduationCap,
  Calendar,
  Settings,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import EntityManager from './EntityManager';
import TimetableGenerator from './TimetableGenerator';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { 
      path: '/admin',
      label: 'Overview',
      icon: BarChart3,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    { 
      path: '/admin/students', 
      label: 'Students', 
      icon: GraduationCap, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      path: '/admin/teachers', 
      label: 'Teachers', 
      icon: Users, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      path: '/admin/courses', 
      label: 'Courses', 
      icon: BookOpen, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      path: '/admin/rooms', 
      label: 'Rooms', 
      icon: MapPin, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      path: '/admin/timetable', 
      label: 'Generate Timetable', 
      icon: Calendar, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const currentPath = location.pathname;
  const currentItem = menuItems.find(item => item.path === currentPath) || menuItems.find(item => currentPath.startsWith(item.path) && item.path !== '/admin') || menuItems[0];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <motion.div 
      initial={mobile ? { x: -300 } : { x: 0 }}
      animate={mobile ? { x: sidebarOpen ? 0 : -300 } : { x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`${mobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} w-64 bg-white shadow-lg`}
    >
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600">Welcome, {user.name}</p>
        </div>
        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate(item.path);
                if (mobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                isActive 
                  ? `${item.bgColor} ${item.color} shadow-sm font-semibold` 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar mobile />
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentItem?.label || 'Dashboard'}
                </h2>
                <p className="text-gray-600">AI-Based Timetable Generation System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-medium">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/students" element={<EntityManager type="students" />} />
            <Route path="/teachers" element={<EntityManager type="teachers" />} />
            <Route path="/courses" element={<EntityManager type="courses" />} />
            <Route path="/rooms" element={<EntityManager type="rooms" />} />
            <Route path="/timetable" element={<TimetableGenerator />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const { data } = useData();
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Students', value: data.students.length, color: 'blue', icon: GraduationCap, path: '/admin/students' },
    { label: 'Total Teachers', value: data.teachers.length, color: 'green', icon: Users, path: '/admin/teachers' },
    { label: 'Total Courses', value: data.courses.length, color: 'purple', icon: BookOpen, path: '/admin/courses' },
    { label: 'Total Rooms', value: data.rooms.length, color: 'orange', icon: MapPin, path: '/admin/rooms' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
              onClick={() => navigate(stat.path)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 text-${stat.color}-600 rounded-lg flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/admin/timetable')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <div className="font-medium text-gray-900">Generate New Timetable</div>
              <div className="text-sm text-gray-600">Create optimized schedules for all entities</div>
            </button>
            <button 
              onClick={() => navigate('/admin/students')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <div className="font-medium text-gray-900">Manage Students</div>
              <div className="text-sm text-gray-600">Add, edit, or remove student records</div>
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>NEP 2020 Compliant</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>AI-Powered Scheduling</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Conflict Resolution</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Multi-disciplinary Support</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
