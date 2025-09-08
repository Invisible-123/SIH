import React, { createContext, useContext, useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Generate initial mock data
const generateMockData = () => {
  const courseNames = [
    'Advanced Mathematics', 'Physics Fundamentals', 'Chemistry Laboratory',
    'Computer Science Basics', 'Psychology Introduction', 'Economics Theory',
    'Environmental Science', 'Business Analytics', 'Data Structures',
    'Machine Learning', 'Digital Marketing', 'Philosophy Ethics'
  ];
  // Shuffle the array to ensure random assignment, but keep names unique per generation.
  const shuffledCourseNames = faker.helpers.shuffle(courseNames);

  const courses = Array.from({ length: 12 }, (_, i) => ({
    id: `C${String(i + 1).padStart(3, '0')}`,
    name: shuffledCourseNames[i], // This ensures each course has a unique name
    credits: faker.helpers.arrayElement([2, 3, 4]),
    type: faker.helpers.arrayElement(['Core', 'Elective', 'Practical']),
    department: faker.helpers.arrayElement(['Science', 'Arts', 'Commerce', 'Engineering'])
  }));

  const teachers = Array.from({ length: 15 }, (_, i) => ({
    id: `T${String(i + 1).padStart(3, '0')}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    subjects: faker.helpers.arrayElements(courses.map(c => c.name), { min: 1, max: 3 }),
    availability: faker.helpers.arrayElements([
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
    ], { min: 3, max: 5 }),
    department: faker.helpers.arrayElement(['Science', 'Arts', 'Commerce', 'Engineering'])
  }));

  const rooms = Array.from({ length: 20 }, (_, i) => ({
    id: `R${String(i + 1).padStart(3, '0')}`,
    name: `Room ${faker.helpers.arrayElement(['A', 'B', 'C'])}${faker.number.int({ min: 101, max: 405 })}`,
    capacity: faker.helpers.arrayElement([30, 40, 50, 60, 80, 100]),
    type: faker.helpers.arrayElement(['Lecture Hall', 'Laboratory', 'Seminar Room', 'Auditorium']),
    amenities: faker.helpers.arrayElements([
      'Projector', 'Whiteboard', 'Air Conditioning', 'Sound System', 'Internet'
    ], { min: 2, max: 5 })
  }));

  const students = Array.from({ length: 25 }, (_, i) => ({
    id: `S${String(i + 1).padStart(3, '0')}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    rollNumber: `2024${String(i + 1).padStart(3, '0')}`,
    courses: faker.helpers.arrayElements(courses.map(c => c.id), { min: 4, max: 8 }),
    semester: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8]),
    department: faker.helpers.arrayElement(['Science', 'Arts', 'Commerce', 'Engineering'])
  }));

  return { courses, teachers, rooms, students };
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('timetableData');
    let initialData = savedData ? JSON.parse(savedData) : generateMockData();

    // This cleaning step ensures that no matter where the data comes from (stale localStorage or generation),
    // the courses array used by the app has unique names, preventing the key error.
    const uniqueCourses = [];
    const seenCourseNames = new Set();
    if (initialData && initialData.courses) {
      for (const course of initialData.courses) {
        if (!seenCourseNames.has(course.name)) {
          uniqueCourses.push(course);
          seenCourseNames.add(course.name);
        }
      }
      initialData.courses = uniqueCourses;
    }
    
    return initialData;
  });

  const [masterTimetable, setMasterTimetable] = useState(() => {
    const savedTimetable = localStorage.getItem('masterTimetable');
    return savedTimetable ? JSON.parse(savedTimetable) : null;
  });

  const [filters, setFilters] = useState({
    courses: { department: '', type: '' },
    teachers: { department: '', availability: '' },
    rooms: { type: '', capacity: '' },
    students: { department: '', semester: '' }
  });

  useEffect(() => {
    localStorage.setItem('timetableData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (masterTimetable) {
      localStorage.setItem('masterTimetable', JSON.stringify(masterTimetable));
    } else {
      localStorage.removeItem('masterTimetable');
    }
  }, [masterTimetable]);

  const addEntity = (type, entity) => {
    const newId = generateId(type, data[type]);
    const newEntity = { ...entity, id: newId };
    setData(prev => ({
      ...prev,
      [type]: [...prev[type], newEntity]
    }));
    return newEntity;
  };

  const updateEntity = (type, id, updates) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const deleteEntity = (type, id) => {
    setData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const generateId = (type, items) => {
    const prefix = type.charAt(0).toUpperCase();
    const maxId = items.reduce((max, item) => {
      const num = parseInt(item.id.slice(1));
      return num > max ? num : max;
    }, 0);
    return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
  };

  const generateAndSetMasterTimetable = (settings) => {
    const { courses, teachers, rooms } = data;
    const { workingDays, timeSlots } = settings;

    const schedule = {};
    const occupied = {}; // Tracks teacher/room occupation: { 'Monday-9:00-10:00': { teachers: [id], rooms: [id] } }
    let conflicts = 0;
    let placedClasses = 0;

    workingDays.forEach(day => {
      schedule[day] = {};
      timeSlots.forEach(slot => {
        schedule[day][slot] = null;
        occupied[`${day}-${slot}`] = { teachers: [], rooms: [] };
      });
    });

    courses.forEach(course => {
      let placed = false;
      const potentialTeachers = teachers.filter(t => t.subjects.includes(course.name));
      if (potentialTeachers.length === 0) return;

      const shuffledDays = [...workingDays].sort(() => Math.random() - 0.5);
      const shuffledSlots = [...timeSlots].sort(() => Math.random() - 0.5);

      for (const day of shuffledDays) {
        if (placed) break;
        for (const slot of shuffledSlots) {
          if (placed) break;

          const slotKey = `${day}-${slot}`;
          const availableTeachers = potentialTeachers.filter(
            t => !occupied[slotKey].teachers.includes(t.id) && t.availability.includes(day)
          );
          const availableRooms = rooms.filter(r => !occupied[slotKey].rooms.includes(r.id));

          if (availableTeachers.length > 0 && availableRooms.length > 0) {
            const teacher = availableTeachers[0];
            const room = availableRooms[0];

            schedule[day][slot] = { course, teacher, room };
            occupied[slotKey].teachers.push(teacher.id);
            occupied[slotKey].rooms.push(room.id);
            placed = true;
            placedClasses++;
          }
        }
      }

      if (!placed) {
        conflicts++;
      }
    });

    const totalPossibleSlots = workingDays.length * timeSlots.length * rooms.length;
    const metadata = {
      totalSlots: workingDays.length * timeSlots.length,
      placedClasses,
      utilization: totalPossibleSlots > 0 ? ((placedClasses / totalPossibleSlots) * 100).toFixed(1) + '%' : '0%',
      conflicts,
      generatedAt: new Date().toISOString(),
      algorithm: 'Constraint-Based Heuristic'
    };

    setMasterTimetable({ schedule, metadata, settings });
    return { schedule, metadata };
  };

  const getFilteredData = (type) => {
    const typeFilters = filters[type];
    if (!typeFilters) return data[type];

    return data[type].filter(item => {
      return Object.entries(typeFilters).every(([key, value]) => {
        if (!value) return true;
        
        if (key === 'availability' && Array.isArray(item[key])) {
          return item[key].includes(value);
        }
        
        if (key === 'capacity') {
          const capacity = parseInt(value);
          return item[key] >= capacity;
        }
        
        if (key === 'semester') {
          return item[key] === parseInt(value);
        }
        
        return item[key] === value;
      });
    });
  };

  const updateFilter = (type, filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [filterKey]: value
      }
    }));
  };

  const clearFilters = (type) => {
    setFilters(prev => ({
      ...prev,
      [type]: Object.keys(prev[type]).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {})
    }));
  };

  const value = {
    data,
    filters,
    masterTimetable,
    addEntity,
    updateEntity,
    deleteEntity,
    getFilteredData,
    updateFilter,
    clearFilters,
    generateAndSetMasterTimetable,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
