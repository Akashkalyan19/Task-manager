import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, deleteProject, getTasksByProject, createTask, updateTask, deleteTask } from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, ArrowLeft, Calendar, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';


const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null); // If set, we are editing
  const [taskForm, setTaskForm] = useState({ 
    title: '', 
    description: '', 
    status: 'Todo', 
    priority: 'Medium',
    dueDate: '' 
  });

  const fetchData = async () => {
    try {
      const [projectData, tasksData] = await Promise.all([
        getProjectById(id),
        getTasksByProject(id)
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      toast.error('Failed to load project details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteProject = async () => {
    if(!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (currentTask) {
        await updateTask(currentTask._id, taskForm);
        toast.success('Task updated');
      } else {
        await createTask(id, taskForm);
        toast.success('Task created');
      }
      setShowTaskModal(false);
      resetTaskForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if(!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      toast.success('Task deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const openEditTask = (task) => {
    setCurrentTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setShowTaskModal(true);
  };

  const resetTaskForm = () => {
    setCurrentTask(null);
    setTaskForm({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!project) return null;

  const tasksByStatus = {
    Todo: tasks.filter(t => t.status === 'Todo'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    Done: tasks.filter(t => t.status === 'Done'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex space-x-2">
             {/* Only show delete if admin or owner? Assuming backend handles authz, frontend just tries. 
                 Ideally check user.id === project.owner._id if owner populated, or project.owner if just ID 
             */}
             <button
              onClick={handleDeleteProject}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center text-sm font-medium transition"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete Project
            </button>
            <button
              onClick={() => { resetTaskForm(); setShowTaskModal(true); }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center text-sm font-medium transition"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Todo', 'In Progress', 'Done'].map((status) => (
          <div key={status} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
              {status}
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tasksByStatus[status].length}
              </span>
            </h3>
            
            <div className="space-y-3">
              {tasksByStatus[status].map((task) => (
                <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
                    <div className="flex space-x-1">
                      <button onClick={() => openEditTask(task)} className="p-1 text-gray-400 hover:text-indigo-600">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDeleteTask(task._id)} className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                     <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
               {tasksByStatus[status].length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-sm border border-dashed border-gray-200 rounded-md">
                    No tasks
                  </div>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              {currentTask ? 'Edit Task' : 'New Task'}
            </h3>
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700">Status</label>
                   <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                   >
                     <option value="Todo">Todo</option>
                     <option value="In Progress">In Progress</option>
                     <option value="Done">Done</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Priority</label>
                   <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                   >
                     <option value="Low">Low</option>
                     <option value="Medium">Medium</option>
                     <option value="High">High</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
