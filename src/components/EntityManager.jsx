import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download,
  X,
  Save,
  Eye,
  FileText
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import ExportToPDF from './ExportToPDF';

const EntityManager = ({ type }) => {
  const { data, addEntity, updateEntity, deleteEntity, getFilteredData, updateFilter, clearFilters, filters } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const entities = getFilteredData(type);
  const filteredEntities = entities.filter(entity => 
    Object.values(entity).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const entityConfig = {
    students: {
      title: 'Students',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', required: true },
        { name: 'rollNumber', label: 'Roll Number', type: 'text', required: true },
        { name: 'semester', label: 'Semester', type: 'select', options: [1,2,3,4,5,6,7,8], required: true },
        { name: 'department', label: 'Department', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Engineering'], required: true },
        { name: 'courses', label: 'Courses', type: 'multiselect', options: data.courses.map(c => ({value: c.id, label: c.name})) }
      ],
      displayFields: ['name', 'rollNumber', 'email', 'semester', 'department']
    },
    teachers: {
      title: 'Teachers',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', required: true },
        { name: 'department', label: 'Department', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Engineering'], required: true },
        { name: 'subjects', label: 'Subjects', type: 'multiselect', options: data.courses.map(c => ({value: c.name, label: c.name})) },
        { name: 'availability', label: 'Availability', type: 'multiselect', options: [
          {value: 'Monday', label: 'Monday'},
          {value: 'Tuesday', label: 'Tuesday'},
          {value: 'Wednesday', label: 'Wednesday'},
          {value: 'Thursday', label: 'Thursday'},
          {value: 'Friday', label: 'Friday'}
        ]}
      ],
      displayFields: ['name', 'email', 'department', 'subjects', 'availability']
    },
    courses: {
      title: 'Courses',
      fields: [
        { name: 'name', label: 'Course Name', type: 'text', required: true },
        { name: 'credits', label: 'Credits', type: 'select', options: [1,2,3,4,5], required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['Core', 'Elective', 'Practical'], required: true },
        { name: 'department', label: 'Department', type: 'select', options: ['Science', 'Arts', 'Commerce', 'Engineering'], required: true }
      ],
      displayFields: ['name', 'credits', 'type', 'department']
    },
    rooms: {
      title: 'Rooms',
      fields: [
        { name: 'name', label: 'Room Name', type: 'text', required: true },
        { name: 'capacity', label: 'Capacity', type: 'number', required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['Lecture Hall', 'Laboratory', 'Seminar Room', 'Auditorium'], required: true },
        { name: 'amenities', label: 'Amenities', type: 'multiselect', options: [
          {value: 'Projector', label: 'Projector'},
          {value: 'Whiteboard', label: 'Whiteboard'},
          {value: 'Air Conditioning', label: 'Air Conditioning'},
          {value: 'Sound System', label: 'Sound System'},
          {value: 'Internet', label: 'Internet'}
        ]}
      ],
      displayFields: ['name', 'capacity', 'type', 'amenities']
    }
  };

  const config = entityConfig[type];

  const handleAdd = (formData) => {
    addEntity(type, formData);
    setIsAddModalOpen(false);
  };

  const handleEdit = (formData) => {
    updateEntity(type, selectedEntity.id, formData);
    setIsEditModalOpen(false);
    setSelectedEntity(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteEntity(type, id);
    }
  };

  const handleView = (entity) => {
    setSelectedEntity(entity);
    setIsViewModalOpen(true);
  };

  const renderFilterField = (field) => {
    const filterValue = filters[type][field.name] || '';

    if (field.type === 'select') {
      return (
        <select
          value={filterValue}
          onChange={(e) => updateFilter(type, field.name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All {field.label}</option>
          {field.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'multiselect' && field.name === 'availability') {
      return (
        <select
          value={filterValue}
          onChange={(e) => updateFilter(type, field.name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Days</option>
          {field.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'number' && field.name === 'capacity') {
      return (
        <select
          value={filterValue}
          onChange={(e) => updateFilter(type, field.name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Capacities</option>
          <option value="30">30+ seats</option>
          <option value="50">50+ seats</option>
          <option value="80">80+ seats</option>
          <option value="100">100+ seats</option>
        </select>
      );
    }

    return (
      <input
        type="text"
        value={filterValue}
        onChange={(e) => updateFilter(type, field.name, e.target.value)}
        placeholder={`Filter by ${field.label}`}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
          <p className="text-gray-600">Manage {config.title.toLowerCase()} in the system</p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportToPDF data={filteredEntities} type={type} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            <span>Add {config.title.slice(0, -1)}</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${config.title.toLowerCase()}...`}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.fields
                  .filter(field => ['select', 'multiselect', 'number'].includes(field.type))
                  .slice(0, 4)
                  .map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {renderFilterField(field)}
                    </div>
                  ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => clearFilters(type)}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Entity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEntities.map((entity, index) => (
          <motion.div
            key={entity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{entity.name}</h3>
                <p className="text-sm text-gray-600">{entity.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleView(entity)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => {
                    setSelectedEntity(entity);
                    setIsEditModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(entity.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {config.displayFields.slice(1, 4).map(field => (
                <div key={field} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{field}:</span>
                  <span className="text-gray-900 font-medium">
                    {Array.isArray(entity[field]) 
                      ? entity[field].slice(0, 2).join(', ') + (entity[field].length > 2 ? '...' : '')
                      : entity[field]
                    }
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEntities.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {config.title} Found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.values(filters[type]).some(f => f) 
              ? 'No results match your search criteria.' 
              : `Start by adding your first ${config.title.slice(0, -1).toLowerCase()}.`
            }
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Add {config.title.slice(0, -1)}
          </button>
        </div>
      )}

      {/* Modals */}
      <EntityForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
        title={`Add ${config.title.slice(0, -1)}`}
        fields={config.fields}
      />

      <EntityForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEntity(null);
        }}
        onSubmit={handleEdit}
        title={`Edit ${config.title.slice(0, -1)}`}
        fields={config.fields}
        defaultValues={selectedEntity}
      />

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEntity(null);
        }}
        entity={selectedEntity}
        fields={config.fields}
        title={config.title.slice(0, -1)}
      />
    </div>
  );
};

// Entity Form Component
const EntityForm = ({ isOpen, onClose, onSubmit, title, fields, defaultValues }) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: defaultValues || {}
  });

  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmitForm = (data) => {
    onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-4">
          {fields.map(field => (
            <FormField
              key={field.name}
              field={field}
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          ))}

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Form Field Component
const FormField = ({ field, register, errors, watch, setValue }) => {
  const watchedValue = watch(field.name);

  if (field.type === 'multiselect') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
        </label>
        <div className="space-y-2">
          {field.options.map(option => {
            const value = typeof option === 'object' ? option.value : option;
            const label = typeof option === 'object' ? option.label : option;
            const isChecked = Array.isArray(watchedValue) && watchedValue.includes(value);

            return (
              <label key={value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    const currentValues = Array.isArray(watchedValue) ? watchedValue : [];
                    if (e.target.checked) {
                      setValue(field.name, [...currentValues, value]);
                    } else {
                      setValue(field.name, currentValues.filter(v => v !== value));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
        </label>
        <select
          {...register(field.name, { required: field.required })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select {field.label}</option>
          {field.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors[field.name] && (
          <p className="text-red-600 text-sm mt-1">This field is required</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
      </label>
      <input
        type={field.type}
        {...register(field.name, { required: field.required })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={`Enter ${field.label.toLowerCase()}`}
      />
      {errors[field.name] && (
        <p className="text-red-600 text-sm mt-1">This field is required</p>
      )}
    </div>
  );
};

// View Modal Component
const ViewModal = ({ isOpen, onClose, entity, fields, title }) => {
  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">View {title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {fields.map(field => (
            <div key={field.name} className="border-b border-gray-100 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="text-gray-900">
                {Array.isArray(entity[field.name]) 
                  ? entity[field.name].join(', ') || 'None'
                  : entity[field.name] || 'N/A'
                }
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EntityManager;
