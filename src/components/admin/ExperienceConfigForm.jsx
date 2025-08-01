import { useState } from 'react';
import { useEffect } from 'react';
import FadeButtonGroup from '../common/FadeButtonGroup';
import { LocationTypes } from '../../constants/locationTypes';
import { formatEnumValue } from '../../utils/formatters';

const emptyJob = {
  title: '',
  company: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  location: LocationTypes.REMOTE,
  country: '',
  city: '',
  description: '',
  achievements: [],
  skills: [],
};

const ExperienceConfigForm = ({ initialData, onSave, onCancel, loading, disabled, onEdit, onContentChange }) => {
  const [jobs, setJobs] = useState(initialData?.jobs || []);
  const [editingJob, setEditingJob] = useState(emptyJob);
  const [editingIndex, setEditingIndex] = useState(null);
  const [achievementInput, setAchievementInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Notify parent on content change for resizing
  useEffect(() => {
    if (onContentChange) onContentChange();
  }, [jobs, editingJob, showAddForm, editingIndex, onContentChange]);

  const handleFieldChange = (field, value) => {
    setEditingJob(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAchievement = () => {
    if (!achievementInput.trim()) return;
    setEditingJob(prev => ({ ...prev, achievements: [...prev.achievements, achievementInput.trim()] }));
    setAchievementInput('');
  };

  const handleRemoveAchievement = (idx) => {
    setEditingJob(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    setEditingJob(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  };

  const handleRemoveSkill = (idx) => {
    setEditingJob(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
  };

  const handleEditJob = (idx) => {
    setEditingIndex(idx);
    setEditingJob(jobs[idx]);
  };

  const handleDeleteJob = (idx) => {
    setJobs(jobs.filter((_, i) => i !== idx));
    if (editingIndex === idx) {
      setEditingIndex(null);
      setEditingJob(emptyJob);
    }
  };

  const handleSaveJob = () => {
    if (!editingJob.title || !editingJob.company) {
      setError('Title and company are required.');
      return;
    }
    setError('');
    if (editingIndex !== null) {
      setJobs(jobs.map((job, i) => (i === editingIndex ? editingJob : job)));
    } else {
      setJobs([...jobs, editingJob]);
    }
    setEditingJob(emptyJob);
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingJob(emptyJob);
    setEditingIndex(null);
    setError('');
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setJobs(initialData?.jobs || []);
    setEditingJob(emptyJob);
    setEditingIndex(null);
    setAchievementInput('');
    setSkillInput('');
    setError('');
    setShowAddForm(false);
    onCancel();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ jobs });
    } catch (err) {
      setError('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!disabled && (showAddForm || editingIndex !== null) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{editingIndex !== null ? 'Edit Job' : 'Add New Job'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <input type="text" className="border rounded px-3 py-2" placeholder="Title" value={editingJob.title} onChange={e => handleFieldChange('title', e.target.value)} />
            <input type="text" className="border rounded px-3 py-2" placeholder="Company" value={editingJob.company} onChange={e => handleFieldChange('company', e.target.value)} />
            <input type="month" className="border rounded px-3 py-2" placeholder="Start Date" value={editingJob.startDate} onChange={e => handleFieldChange('startDate', e.target.value)} />
            <input type="month" className="border rounded px-3 py-2" placeholder="End Date" value={editingJob.endDate} onChange={e => handleFieldChange('endDate', e.target.value)} disabled={editingJob.isCurrent} />
            <div className="flex items-center gap-2 col-span-2">
              <input type="checkbox" id="isCurrent" checked={editingJob.isCurrent} onChange={e => handleFieldChange('isCurrent', e.target.checked)} />
              <label htmlFor="isCurrent" className="text-sm">Current Position</label>
            </div>
            <select className="border rounded px-3 py-2" value={editingJob.location} onChange={e => handleFieldChange('location', e.target.value)}>
              <option value={LocationTypes.REMOTE}>Remote</option>
              <option value={LocationTypes.ON_SITE}>On-Site</option>
              <option value={LocationTypes.HYBRID}>Hybrid</option>
            </select>
            <input type="text" className="border rounded px-3 py-2" placeholder="Country" value={editingJob.country} onChange={e => handleFieldChange('country', e.target.value)} />
            <input type="text" className="border rounded px-3 py-2" placeholder="City" value={editingJob.city} onChange={e => handleFieldChange('city', e.target.value)} />
          </div>
          <textarea className="border rounded px-3 py-2 w-full mb-2" placeholder="Description" value={editingJob.description} onChange={e => handleFieldChange('description', e.target.value)} rows={2} />
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Achievements</label>
            <div className="flex gap-2 mb-2">
              <input type="text" className="border rounded px-3 py-2 flex-1" placeholder="Add achievement" value={achievementInput} onChange={e => setAchievementInput(e.target.value)} />
              <button type="button" className="bg-blue-500 text-white px-3 py-2 rounded" onClick={handleAddAchievement} disabled={!achievementInput}>Add</button>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {editingJob.achievements.map((ach, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{ach}</span>
                  <button type="button" className="text-red-500 ml-2" onClick={() => handleRemoveAchievement(idx)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Skills</label>
            <div className="flex gap-2 mb-2">
              <input type="text" className="border rounded px-3 py-2 flex-1" placeholder="Add skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} />
              <button type="button" className="bg-blue-500 text-white px-3 py-2 rounded" onClick={handleAddSkill} disabled={!skillInput}>Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editingJob.skills.map((skill, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm flex items-center">
                  {skill}
                  <button type="button" className="ml-2 text-red-500" onClick={() => handleRemoveSkill(idx)}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSaveJob}>{editingIndex !== null ? 'Update Job' : 'Add Job'}</button>
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
            Add New Job
          </button>
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold mb-2">Experience List</h3>
        {jobs.length === 0 && <div className="text-gray-500">No jobs added yet.</div>}
        <ul className="space-y-4">
          {jobs.map((job, idx) => (
            <li key={idx} className="border rounded p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="font-bold text-gray-800">{job.title}</span> at <span className="text-blue-600 font-semibold">{job.company}</span>
                </div>
                <div className="flex gap-2">
                  {!disabled && <button type="button" className="text-blue-500" onClick={() => handleEditJob(idx)}>Edit</button>}
                  {!disabled && <button type="button" className="text-red-500" onClick={() => handleDeleteJob(idx)}>Delete</button>}
                </div>
              </div>
              <div className="text-gray-600 text-sm mb-1">
                {job.startDate}
                {job.isCurrent ? ' - Present' : job.endDate ? ` - ${job.endDate}` : ''}
                {job.location ? ` | ${formatEnumValue(job.location)}` : ''}
                {job.city && job.country ? ` | ${job.city}, ${job.country}` : ''}
              </div>
              <div className="text-gray-700 mb-1">{job.description}</div>
              {job.achievements.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 text-sm mb-1">
                  {job.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                </ul>
              )}
              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => <span key={i} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm">{skill}</span>)}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <FadeButtonGroup
        mode={disabled ? 'view' : 'edit'}
        onEdit={onEdit}
        onSave={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        disabled={disabled}
        saving={saving}
      />
    </form>
  );
};

export default ExperienceConfigForm; 