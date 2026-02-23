import { useState } from 'react';
import { useEffect } from 'react';
import FadeButtonGroup from '../common/FadeButtonGroup';
import { LocationTypes } from '../../constants/locationTypes';
import { formatEnumValue } from '../../utils/formatters';
import { getMaxMonth, isFutureMonth } from '../../utils/experienceDateValidation';

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

// Ensure date fields are always strings for API validation (backend expects string, not null)
const normalizeJob = (job) => ({
  ...job,
  startDate: job.startDate != null ? String(job.startDate) : '',
  endDate: job.isCurrent || job.endDate == null ? '' : String(job.endDate),
  achievements: Array.isArray(job.achievements) ? job.achievements : [],
  skills: Array.isArray(job.skills) ? job.skills : [],
});

// Validation aligned with backend: required fields + dates must not be in the future
const validateJob = (job) => {
  if (!job.title?.trim()) return 'Title is required.';
  if (!job.company?.trim()) return 'Company is required.';
  if (!job.startDate?.trim()) return 'Start date is required.';
  if (isFutureMonth(job.startDate)) return 'Start date cannot be in the future.';
  if (!job.country?.trim()) return 'Country is required.';
  if (!job.city?.trim()) return 'City is required.';
  if (!job.isCurrent && isFutureMonth(job.endDate)) return 'End date cannot be in the future.';
  return null;
};

const ExperienceConfigForm = ({ initialData, onSave, onCancel, loading, disabled, onEdit, onContentChange }) => {
  const [jobs, setJobs] = useState(() => (initialData?.jobs || []).map(normalizeJob));
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
    setEditingJob(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'isCurrent' && value) next.endDate = '';
      return next;
    });
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
    setEditingJob(normalizeJob(jobs[idx]));
  };

  const handleDeleteJob = (idx) => {
    setJobs(jobs.filter((_, i) => i !== idx));
    if (editingIndex === idx) {
      setEditingIndex(null);
      setEditingJob(emptyJob);
    }
  };

  const handleSaveJob = () => {
    const validationError = validateJob(editingJob);
    if (validationError) {
      setError(validationError);
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
    setJobs((initialData?.jobs || []).map(normalizeJob));
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
    setError('');
    const normalizedJobs = jobs.map(normalizeJob);
    const firstInvalid = normalizedJobs.findIndex((job) => validateJob(job));
    if (firstInvalid !== -1) {
      setError(validateJob(normalizedJobs[firstInvalid]));
      return;
    }
    setSaving(true);
    try {
      await onSave({ jobs: normalizedJobs });
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!disabled && (showAddForm || editingIndex !== null) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{editingIndex !== null ? 'Edit Job' : 'Add New Job'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <input type="text" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Title (required)" value={editingJob.title} onChange={e => handleFieldChange('title', e.target.value)} />
            <input type="text" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Company (required)" value={editingJob.company} onChange={e => handleFieldChange('company', e.target.value)} />
            <input type="month" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Start Date (required)" value={editingJob.startDate} max={getMaxMonth()} onChange={e => handleFieldChange('startDate', e.target.value)} />
            <input type="month" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="End Date" value={editingJob.endDate} max={getMaxMonth()} onChange={e => handleFieldChange('endDate', e.target.value)} disabled={editingJob.isCurrent} />
            <div className="flex items-center gap-2 col-span-2">
              <input type="checkbox" id="isCurrent" checked={editingJob.isCurrent} onChange={e => handleFieldChange('isCurrent', e.target.checked)} />
              <label htmlFor="isCurrent" className="text-sm text-gray-700 dark:text-gray-300">Current Position</label>
            </div>
            <select className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" value={editingJob.location} onChange={e => handleFieldChange('location', e.target.value)}>
              <option value={LocationTypes.REMOTE}>Remote</option>
              <option value={LocationTypes.ON_SITE}>On-Site</option>
              <option value={LocationTypes.HYBRID}>Hybrid</option>
            </select>
            <input type="text" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Country (required)" value={editingJob.country} onChange={e => handleFieldChange('country', e.target.value)} />
            <input type="text" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="City (required)" value={editingJob.city} onChange={e => handleFieldChange('city', e.target.value)} />
          </div>
          <textarea className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Description" value={editingJob.description} onChange={e => handleFieldChange('description', e.target.value)} rows={2} />
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Achievements</label>
            <div className="flex gap-2 mb-2">
              <input type="text" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Add achievement" value={achievementInput} onChange={e => setAchievementInput(e.target.value)} />
              <button type="button" className="bg-blue-500 text-white px-3 py-2 rounded" onClick={handleAddAchievement} disabled={!achievementInput}>Add</button>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {editingJob.achievements.map((ach, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{ach}</span>
                  <button type="button" className="text-red-500 dark:text-red-400 ml-2" onClick={() => handleRemoveAchievement(idx)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Skills</label>
            <div className="flex gap-2 mb-2">
              <input type="text" className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Add skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} />
              <button type="button" className="bg-blue-500 text-white px-3 py-2 rounded" onClick={handleAddSkill} disabled={!skillInput}>Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editingJob.skills.map((skill, idx) => (
                <span key={idx} className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm flex items-center">
                  {skill}
                  <button type="button" className="ml-2 text-red-500 dark:text-red-400" onClick={() => handleRemoveSkill(idx)}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSaveJob}>{editingIndex !== null ? 'Update Job' : 'Add Job'}</button>
            {(editingIndex !== null || showAddForm) && <button type="button" className="bg-gray-300 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded" onClick={handleCancelEdit}>Cancel</button>}
          </div>
          {error && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</div>}
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
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Experience List</h3>
        {jobs.length === 0 && <div className="text-gray-500 dark:text-gray-400">No jobs added yet.</div>}
        <ul className="space-y-4">
          {jobs.map((job, idx) => (
            <li key={idx} className="border border-gray-200 dark:border-gray-600 rounded p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="font-bold text-gray-800 dark:text-gray-100">{job.title}</span> <span className="text-gray-700 dark:text-gray-300">at</span> <span className="text-blue-600 dark:text-blue-400 font-semibold">{job.company}</span>
                </div>
                <div className="flex gap-2">
                  {!disabled && <button type="button" className="text-blue-500 dark:text-blue-400" onClick={() => handleEditJob(idx)}>Edit</button>}
                  {!disabled && <button type="button" className="text-red-500 dark:text-red-400" onClick={() => handleDeleteJob(idx)}>Delete</button>}
                </div>
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                {job.startDate}
                {job.isCurrent ? ' - Present' : job.endDate ? ` - ${job.endDate}` : ''}
                {job.location ? ` | ${formatEnumValue(job.location)}` : ''}
                {job.city && job.country ? ` | ${job.city}, ${job.country}` : ''}
              </div>
              <div className="text-gray-700 dark:text-gray-300 mb-1">{job.description}</div>
              {job.achievements.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm mb-1">
                  {job.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                </ul>
              )}
              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => <span key={i} className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm">{skill}</span>)}
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