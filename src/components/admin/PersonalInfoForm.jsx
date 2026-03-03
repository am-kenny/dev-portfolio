import { useState } from 'react';
import FadeButtonGroup from '../common/FadeButtonGroup';

const PersonalInfoForm = ({ initialData, onSave, onCancel, loading, disabled, onEdit }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    title: initialData?.title || '',
    location: initialData?.location || '',
    bio: initialData?.bio || ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await onSave(form);
      setSuccess(true);
    } catch {
      setError('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = disabled
    ? 'w-full border border-gray-200 dark:border-gray-600 rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors duration-300 ease'
    : 'w-full border border-gray-200 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ease focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400';

  return (
    <form onSubmit={handleSubmit} className={disabled ? 'space-y-4' : 'space-y-4'}>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
          required
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass}
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className={inputClass}
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className={inputClass}
          minLength={10}
          maxLength={500}
          rows={disabled ? 2 : 4}
          disabled={disabled}
        />
      </div>
      <FadeButtonGroup
        mode={disabled ? 'view' : 'edit'}
        onEdit={onEdit}
        onSave={handleSubmit}
        onCancel={onCancel}
        loading={loading}
        disabled={disabled}
        saving={saving}
      />
      {success && <div className="text-green-600 dark:text-green-400 text-sm mt-2">Saved!</div>}
      {error && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</div>}
      {disabled && onCancel && (
        <button type="button" className="hidden" onClick={onCancel}></button>
      )}
    </form>
  );
};

export default PersonalInfoForm; 