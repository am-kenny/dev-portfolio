import { useState } from 'react';
import FadeButtonGroup from '../common/FadeButtonGroup';

const AboutConfigForm = ({ initialData, onSave, onCancel, loading, disabled, onEdit }) => {
  const [content, setContent] = useState(initialData?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ content });
    } catch (err) {
      setError('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = disabled
    ? 'w-full border border-gray-200 rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed transition-all duration-200'
    : 'w-full border border-gray-200 rounded px-3 py-2 bg-white transition-all duration-200';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          name="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          className={inputClass}
          minLength={10}
          maxLength={1000}
          rows={4}
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
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
};

export default AboutConfigForm; 