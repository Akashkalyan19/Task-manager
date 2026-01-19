import { useEffect, useState } from 'react';
import { getProjects, createProject, getDashboardStats } from '../api';
import { Link } from 'react-router-dom';
import { Plus, Folder, Clock, CheckCircle, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  const fetchData = async () => {
    try {
      const [projectsData, statsData] = await Promise.all([getProjects(), getDashboardStats()]);
      setProjects(projectsData);
      setStats(statsData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      toast.success('Project created');
      setShowModal(false);
      setNewProject({ title: '', description: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" /> New Project
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                    <Folder className="w-6 h-6 text-blue-600" />
                </div>
            </div>
            
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {(stats.tasksByStatus?.Todo || 0) + (stats.tasksByStatus?.['In Progress'] || 0)}
                    </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-full">
                    <Clock className="w-6 h-6 text-yellow-600" />
                </div>
            </div>

             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.tasksByStatus?.Done || 0}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
            </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
            <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="group block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all"
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate pr-4 group-hover:text-indigo-600 transition-colors">
                        {project.title}
                    </h3>
                    <Folder className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" />
                </div>
                <p className="text-gray-600 h-10 line-clamp-2 text-sm mb-4">
                    {project.description || 'No description provided.'}
                </p>
                <div className="flex items-center text-xs text-gray-400 pt-4 border-t border-gray-50">
                    <span>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
            </Link>
            ))}
            
            {projects.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <Folder className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Create a project to get started.</p>
                </div>
            )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website Redesign"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  placeholder="Brief description of the project..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
