import { useState } from 'react';
import FadeButtonGroup from '../common/FadeButtonGroup';

const emptyProject = {
  name: '',
  description: '',
  technologies: [],
  link: '',
  github: ''
};

const ProjectsConfigForm = ({ initialData, onSave, onCancel, loading, disabled, onEdit }) => {
  const [projects, setProjects] = useState(initialData?.projects || []);
  const [editingProject, setEditingProject] = useState(emptyProject);
  const [editingIndex, setEditingIndex] = useState(null);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleFieldChange = (field, value) => {
    setEditingProject(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    setEditingProject(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
    setTechInput('');
  };

  const handleRemoveTech = (idx) => {
    setEditingProject(prev => ({ ...prev, technologies: prev.technologies.filter((_, i) => i !== idx) }));
  };

  const handleEditProject = (idx) => {
    setEditingIndex(idx);
    setEditingProject(projects[idx]);
  };

  const handleDeleteProject = (idx) => {
    setProjects(projects.filter((_, i) => i !== idx));
    if (editingIndex === idx) {
      setEditingIndex(null);
      setEditingProject(emptyProject);
    }
  };

  const handleSaveProject = () => {
    if (!editingProject.name || !editingProject.description) {
      setError('Name and description are required.');
      return;
    }
    setError('');
    setSaving(true);
    
    // Add or update project in the list
    if (editingIndex !== null) {
      setProjects(projects.map((project, i) => (i === editingIndex ? editingProject : project)));
    } else {
      setProjects([...projects, editingProject]);
    }
    
    // Save to backend immediately
    const updatedProjects = editingIndex !== null 
      ? projects.map((project, i) => (i === editingIndex ? editingProject : project))
      : [...projects, editingProject];
    
    onSave({ items: updatedProjects }).then(() => {
      setEditingProject(emptyProject);
      setEditingIndex(null);
      setShowAddForm(false);
      setSaving(false);
    }).catch((err) => {
      setError('Failed to save project.');
      setSaving(false);
    });
  };

  const handleCancelEdit = () => {
    setEditingProject(emptyProject);
    setEditingIndex(null);
    setError('');
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setProjects(initialData?.items || []);
    setEditingProject(emptyProject);
    setEditingIndex(null);
    setTechInput('');
    setError('');
    setShowAddForm(false);
    onCancel();
  };

  return (
    <form className="space-y-6">
      {!disabled && (showAddForm || editingIndex !== null) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{editingIndex !== null ? 'Edit Project' : 'Add New Project'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <input type="text" className="border rounded px-3 py-2" placeholder="Project Name" value={editingProject.name} onChange={e => handleFieldChange('name', e.target.value)} />
            <input type="url" className="border rounded px-3 py-2" placeholder="Live Demo URL" value={editingProject.link} onChange={e => handleFieldChange('link', e.target.value)} />
            <input type="url" className="border rounded px-3 py-2" placeholder="GitHub URL" value={editingProject.github} onChange={e => handleFieldChange('github', e.target.value)} />
          </div>
          <textarea className="border rounded px-3 py-2 w-full mb-2" placeholder="Description" value={editingProject.description} onChange={e => handleFieldChange('description', e.target.value)} rows={3} />
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input type="text" className="border rounded px-3 py-2 flex-1" placeholder="Add technology" value={techInput} onChange={e => setTechInput(e.target.value)} />
              <button type="button" className="bg-blue-500 text-white px-3 py-2 rounded" onClick={handleAddTech} disabled={!techInput}>Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editingProject.technologies?.map((tech, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm flex items-center">
                  {tech}
                  <button type="button" className="ml-2 text-red-500" onClick={() => handleRemoveTech(idx)}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSaveProject} disabled={saving}>
              {saving ? 'Saving...' : (editingIndex !== null ? 'Update Project' : 'Add Project')}
            </button>
            {(editingIndex !== null || showAddForm) && <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={handleCancelEdit}>Cancel</button>}
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </div>
      )}
      {!disabled && !showAddForm && editingIndex === null && (
        <div className="mb-6">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowAddForm(true)}
          >
            Add New Project
          </button>
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold mb-2">Projects List</h3>
        {projects.length === 0 && <div className="text-gray-500">No projects added yet.</div>}
        <ul className="space-y-4">
          {projects.map((project, idx) => (
            <li key={idx} className="border rounded p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="font-bold text-gray-800">{project.name}</span>
                </div>
                <div className="flex gap-2">
                  {!disabled && <button type="button" className="text-blue-500" onClick={() => handleEditProject(idx)}>Edit</button>}
                  {!disabled && <button type="button" className="text-red-500" onClick={() => handleDeleteProject(idx)}>Delete</button>}
                </div>
              </div>
              <div className="text-gray-700 mb-1">{project.description}</div>
              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {project.technologies?.map((tech, i) => <span key={i} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm">{tech}</span>)}
                </div>
              )}
              <div className="text-gray-600 text-sm">
                {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mr-4">Live Demo</a>}
                {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <FadeButtonGroup
        mode={disabled ? 'view' : 'edit'}
        onEdit={onEdit}
        onCancel={handleCancel}
        loading={loading}
        disabled={disabled}
      />
    </form>
  );
};

export default ProjectsConfigForm; 