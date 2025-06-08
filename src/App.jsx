import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Trash2, Filter, SortAsc, Search, CheckCircle2, Circle, Star, Calendar } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputError, setInputError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const validateInput = (text) => {
    if (!text.trim()) {
      setInputError('Task cannot be empty');
      return false;
    }
    if (text.trim().length > 200) {
      setInputError('Task must be less than 200 characters');
      return false;
    }
    if (tasks.some(task => task.text.toLowerCase() === text.trim().toLowerCase())) {
      setInputError('Task already exists');
      return false;
    }
    setInputError('');
    return true;
  };

  const addTask = () => {
    if (!validateInput(inputText)) return;

    const newTask = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };

    setTasks(prev => [newTask, ...prev]);
    setInputText('');
    inputRef.current?.focus();
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTaskPriority = (id, priority) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, priority } : task
      )
    );
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks;

    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (filter) {
      case 'active':
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;
    }

    switch (sort) {
      case 'alphabetical':
        filteredTasks.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'date':
      default:
        filteredTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return filteredTasks;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const filteredTasks = getFilteredAndSortedTasks();
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            TaskFlow
          </h1>
          <p className="text-gray-600 text-lg">Stay organized, stay productive</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 md:p-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (inputError) setInputError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new task..."
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200"
                />
                {inputError && (
                  <p className="text-red-500 text-sm mt-1 ml-1">{inputError}</p>
                )}
              </div>
              <button
                onClick={addTask}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
              <div className="text-blue-700 font-medium">Total Tasks</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
              <div className="text-2xl font-bold text-amber-600">{activeCount}</div>
              <div className="text-amber-700 font-medium">Active</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-green-700 font-medium">Completed</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Filter & Sort Panel */}
          {showFilters && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filter Options */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Filter by Status</h3>
                  <div className="flex gap-2">
                    {['all', 'active', 'completed'].map((filterType) => (
                      <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          filter === filterType
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Sort by</h3>
                  <div className="flex gap-2">
                    {[
                      { key: 'date', label: 'Date' },
                      { key: 'alphabetical', label: 'A-Z' },
                      { key: 'priority', label: 'Priority' }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setSort(key)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          sort === key
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {completedCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearCompleted}
                    className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                  >
                    Clear Completed Tasks
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <CheckCircle2 size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">
                  {tasks.length === 0 
                    ? "No tasks yet. Add one above to get started!" 
                    : "No tasks match your current filters."}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    task.completed
                      ? 'bg-gray-50 border-gray-200 opacity-75'
                      : `${getPriorityBg(task.priority)} hover:shadow-lg`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Completion Toggle */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 transition-colors duration-200 ${
                        task.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                      }`}
                    >
                      {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-lg transition-all duration-200 ${
                        task.completed 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-800'
                      }`}>
                        {task.text}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {task.createdAt.toLocaleDateString()}
                        </span>
                        <span className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                          <Star size={14} />
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {/* Priority Selector */}
                    {!task.completed && (
                      <select
                        value={task.priority}
                        onChange={(e) => updateTaskPriority(task.id, e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Built by Sahil Wadhwa , Chandigarh University</p>
        </div>
      </div>
    </div>
  );
}

export default App;