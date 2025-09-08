import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, BookOpen, Zap, Download, RefreshCw } from 'lucide-react';

const TimetableGenerator = () => {
  const { data, masterTimetable, generateAndSetMasterTimetable } = useData();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [generationSettings, setGenerationSettings] = useState({
    startTime: '09:00',
    endTime: '17:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });

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

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const timeSlots = generateTimeSlots();
    generateAndSetMasterTimetable({
      ...generationSettings,
      timeSlots
    });
    
    setIsGenerating(false);
  };

  const workingDays = masterTimetable?.settings?.workingDays || generationSettings.workingDays;
  const timeSlots = masterTimetable?.settings?.timeSlots || generateTimeSlots();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable Generator</h1>
          <p className="text-gray-600">AI-powered scheduling with NEP 2020 compliance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {masterTimetable && (
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all">
              <Download size={20} />
              <span>Export Timetable</span>
            </button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
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
                <span>{masterTimetable ? 'Regenerate' : 'Generate'} Timetable</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Courses', value: data.courses.length, icon: BookOpen, color: 'blue' },
          { label: 'Total Teachers', value: data.teachers.length, icon: Users, color: 'green' },
          { label: 'Total Rooms', value: data.rooms.length, icon: MapPin, color: 'purple' },
          { label: 'Total Students', value: data.students.length, icon: Users, color: 'orange' }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
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
              transition={{ duration: 2, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}

      {/* Generated Timetable */}
      {masterTimetable && !isGenerating && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Master Timetable</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Utilization: {masterTimetable.metadata?.utilization}</span>
              <span>Conflicts: {masterTimetable.metadata?.conflicts}</span>
            </div>
          </div>
          
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
                {timeSlots.map(timeSlot => (
                  <tr key={timeSlot}>
                    <td className="border border-gray-300 p-3 font-medium bg-gray-50 align-top">
                      {timeSlot}
                    </td>
                    {workingDays.map(day => {
                      const classData = masterTimetable.schedule[day]?.[timeSlot];
                      return (
                        <td key={`${day}-${timeSlot}`} className="border border-gray-300 p-2 align-top">
                          {classData ? (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-left">
                              <div className="font-semibold text-blue-900 text-sm">
                                {classData.course.name}
                              </div>
                              <div className="text-xs text-blue-700 mt-1 flex items-center space-x-1">
                                <Users size={12}/> 
                                <span>{classData.teacher.name}</span>
                              </div>
                              <div className="text-xs text-blue-600 mt-1 flex items-center space-x-1">
                                <MapPin size={12}/>
                                <span>{classData.room.name}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 h-full flex items-center justify-center">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TimetableGenerator;
