import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  BookOpen, 
  Users, 
  MapPin, 
  GraduationCap,
  Search,
  Calendar,
  User,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { data } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Find student data if logged in with a student ID
  const studentData = data.students.find(s => s.id === user.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: GraduationCap },
    { id: 'timetable', label: 'My Timetable', icon: Calendar },
    { id: 'courses', label: 'All Courses', icon: BookOpen },
    { id: 'teachers', label: 'All Teachers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-medium">
                <User size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {activeTab === 'overview' && <OverviewTab studentData={studentData} data={data} />}
        {activeTab === 'courses' && <CoursesTab data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        {activeTab === 'teachers' && <TeachersTab data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        {activeTab === 'timetable' && <TimetableTab studentData={studentData} />}
      </div>
    </div>
  );
};

const OverviewTab = ({ studentData, data }) => {
  if (!studentData) {
    return <div className="text-center p-8 bg-white rounded-lg">Loading student data...</div>;
  }

  const stats = [
    { label: 'Enrolled Courses', value: studentData.courses?.length || 0, color: 'blue' },
    { label: 'Current Semester', value: studentData.semester || 'N/A', color: 'green' },
    { label: 'Department', value: studentData.department || 'N/A', color: 'purple' },
    { label: 'Total Credits', value: studentData.courses?.reduce((acc, courseId) => {
      const course = data.courses.find(c => c.id === courseId);
      return acc + (course?.credits || 0);
    }, 0) || 0, color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 text-${stat.color}-600 rounded-lg flex items-center justify-center`}>
                <GraduationCap size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Student Profile */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <p className="text-gray-900">{studentData.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Roll Number</label>
            <p className="text-gray-900">{studentData.rollNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{studentData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone</label>
            <p className="text-gray-900">{studentData.phone}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CoursesTab = ({ data, searchTerm, setSearchTerm }) => {
  const filteredCourses = data.courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                <p className="text-sm text-gray-600">{course.id}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                course.type === 'Core' ? 'bg-blue-100 text-blue-800' :
                course.type === 'Elective' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {course.type}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Credits:</span>
                <span className="text-gray-900 font-medium">{course.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Department:</span>
                <span className="text-gray-900 font-medium">{course.department}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TeachersTab = ({ data, searchTerm, setSearchTerm }) => {
  const filteredTeachers = data.teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teachers..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher, index) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                <p className="text-sm text-gray-600">{teacher.id}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900 font-medium">{teacher.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Department:</span>
                <span className="text-gray-900 font-medium">{teacher.department}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Subjects:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {teacher.subjects.slice(0, 3).map(subject => (
                    <span key={subject} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TimetableTab = ({ studentData }) => {
  const { masterTimetable } = useData();

  const studentSchedule = useMemo(() => {
    if (!masterTimetable || !studentData || !studentData.courses) {
      return null;
    }

    const schedule = {};
    const studentCourseIds = new Set(studentData.courses);
    const { workingDays, timeSlots } = masterTimetable.settings;

    workingDays.forEach(day => {
      schedule[day] = {};
      timeSlots.forEach(slot => {
        const classInfo = masterTimetable.schedule[day]?.[slot];
        if (classInfo && studentCourseIds.has(classInfo.course.id)) {
          schedule[day][slot] = classInfo;
        } else {
          schedule[day][slot] = null;
        }
      });
    });

    return schedule;
  }, [studentData, masterTimetable]);

  if (!studentData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Student Data</h3>
        <p className="text-gray-600">Please wait while we fetch your information.</p>
      </div>
    );
  }
  
  if (!masterTimetable) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Timetable Not Yet Available</h3>
        <p className="text-yellow-700">The master timetable has not been generated by the administrator. Please check back later.</p>
      </div>
    );
  }
  
  if (!studentSchedule || studentData.courses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
        <p className="text-gray-600">You are not enrolled in any courses, so no timetable can be displayed.</p>
      </div>
    );
  }

  const { workingDays, timeSlots } = masterTimetable.settings;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Timetable for {studentData.name}</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 bg-gray-50 text-left min-w-[120px]">Time</th>
                {workingDays.map(day => (
                  <th key={day} className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[200px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <td className="border border-gray-300 p-3 font-medium bg-gray-50 align-top">{time}</td>
                  {workingDays.map(day => {
                    const classInfo = studentSchedule[day]?.[time];
                    return (
                      <td key={`${day}-${time}`} className="border border-gray-300 p-2 text-center align-top">
                        {classInfo ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-blue-50 border border-blue-200 rounded p-3 text-left h-full"
                          >
                            <div className="font-semibold text-blue-900 text-sm">{classInfo.course.name}</div>
                            <div className="text-xs text-blue-700 mt-1 flex items-center space-x-1">
                              <User size={12}/> 
                              <span>{classInfo.teacher.name}</span>
                            </div>
                            <div className="text-xs text-blue-600 mt-1 flex items-center space-x-1">
                              <MapPin size={12}/>
                              <span>{classInfo.room.name}</span>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-gray-400 h-full flex items-center justify-center">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
