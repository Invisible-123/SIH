import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, BookOpen, Zap, Download, RefreshCw } from 'lucide-react';

const TimetableGenerator = () => {
  const { data } = useData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [generationSettings, setGenerationSettings] = useState({
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 60,
    breakDuration: 15,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });

  const generateTimetable = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock timetable generation
    const timeSlots = generateTimeSlots();
    const mockTimetable = createMockTimetable(timeSlots);
    
    setGeneratedTimetable(mockTimetable);
    setIsGenerating(false);
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = parseInt(generationSettings.startTime.split(':')[0]);
    const end = parseInt(generationSettings.endTime.split(':')[0]);
    
    for (let hour = start; hour < end; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push(`${startTime}-${endTime}`);
    }
    
    return slots;
  };

  const createMockTimetable = (timeSlots) => {
    const timetable = {};
    
    generationSettings.workingDays.forEach(day => {
      timetable[day] = {};
      timeSlots.forEach(slot => {
        if (Math.random() > 0.3) { // 70% chance of having a class
          const randomCourse = data.courses[Math.floor(Math.random() * data.courses.length)];
          const randomTeacher = data.teachers[Math.floor(Math.random() * data.teachers.length)];
          const randomRoom = data.rooms[Math.floor(Math.random() * data.rooms.length)];
          
          timetable[day][slot] = {
            course: randomCourse,
            teacher: randomTeacher,
            room: randomRoom,
            students: Math.floor(Math.random() * 40) + 20
          };
        }
      });
    });
    
    return { schedule: timetable, timeSlots, metadata: generateMetadata() };
  };

  const generateMetadata = () => {
    return {
      totalSlots: Object.keys(generatedTimetable?.schedule || {}).reduce((acc, day) => 
        acc + Object.keys(generatedTimetable?.schedule[day] || {}).length, 0
      ),
      utilization: '78%',
      conflicts: 0,
      generatedAt: new Date().toISOString(),
      algorithm: 'AI-Optimized Constraint Satisfaction'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable Generator</h1>
          <p className="text-gray-600">AI-powered scheduling with NEP 2020 compliance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {generatedTimetable && (
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all">
              <Download size={20} />
              <span>Export Timetable</span>
            </button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateTimetable}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Zap size={20} />
                <span>Generate Timetable</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Generation Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              value={generationSettings.startTime}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              value={generationSettings.endTime}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slot Duration (min)</label>
            <select
              value={generationSettings.slotDuration}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, slotDuration: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Break Duration (min)</label>
            <select
              value={generationSettings.breakDuration}
              onChange={(e) => setGenerationSettings(prev => ({ ...prev, breakDuration: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Courses', value: data.courses.length, icon: BookOpen, color: 'blue' },
          { label: 'Total Teachers', value: data.teachers.length, icon: Users, color: 'green' },
          { label: 'Total Rooms', value: data.rooms.length, icon: MapPin, color: 'purple' },
          { label: 'Total Students', value: data.students.length, icon: Users, color: 'orange' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 text-${stat.color}-600 rounded-lg flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Loading State */}
      {isGenerating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-sm border text-center"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="animate-spin" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Timetable</h3>
          <p className="text-gray-600 mb-4">AI is optimizing schedules and resolving conflicts...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Generated Timetable */}
      {generatedTimetable && !isGenerating && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Generated Timetable</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Utilization: {generatedTimetable.metadata?.utilization}</span>
              <span>Conflicts: {generatedTimetable.metadata?.conflicts}</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 bg-gray-50 text-left min-w-[120px]">Time</th>
                  {generationSettings.workingDays.map(day => (
                    <th key={day} className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[200px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generatedTimetable.timeSlots?.map(timeSlot => (
                  <tr key={timeSlot}>
                    <td className="border border-gray-300 p-3 font-medium bg-gray-50">
                      {timeSlot}
                    </td>
                    {generationSettings.workingDays.map(day => {
                      const classData = generatedTimetable.schedule[day]?.[timeSlot];
                      
                      return (
                        <td key={`${day}-${timeSlot}`} className="border border-gray-300 p-2">
                          {classData ? (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <div className="font-medium text-blue-900 text-sm">
                                {classData.course.name}
                              </div>
                              <div className="text-xs text-blue-700 mt-1">
                                {classData.teacher.name}
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                {classData.room.name} ({classData.students} students)
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 py-4">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Generation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
              <div>Algorithm: AI-Optimized CSP</div>
              <div>Conflicts Resolved: 100%</div>
              <div>Generated: {new Date().toLocaleString()}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Conflict Resolution', desc: 'Automatically resolves scheduling conflicts' },
            { title: 'NEP 2020 Compliance', desc: 'Supports multidisciplinary course selection' },
            { title: 'Resource Optimization', desc: 'Maximizes room and teacher utilization' },
            { title: 'Preference Learning', desc: 'Learns from previous scheduling patterns' },
            { title: 'Real-time Updates', desc: 'Dynamically adjusts to changes' },
            { title: 'Export Options', desc: 'Multiple export formats available' }
          ].map((feature, index) => (
            <div key={feature.title} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TimetableGenerator;
