import { useState, useEffect } from 'react';
import FadeButtonGroup from '../common/FadeButtonGroup';
import { SkillLevels } from '../../constants/skillLevels';
import { formatEnumValue } from '../../utils/formatters';

const defaultLevels = [...Object.values(SkillLevels)];

const SkillsConfigForm = ({ initialData, onSave, onCancel, loading, disabled, onEdit, onContentChange }) => {
  const [categories, setCategories] = useState(initialData?.skillCategories || {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // Notify parent on content change for resizing
  useEffect(() => {
    if (onContentChange) onContentChange();
  }, [categories]); // Removed onContentChange from dependencies since it's now memoized

  const handleAddCategory = () => {
    if (newCategory && !categories[newCategory]) {
      setCategories({ ...categories, [newCategory]: [] });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (cat) => {
    const newCats = { ...categories };
    delete newCats[cat];
    setCategories(newCats);
  };

  const handleSkillChange = (cat, idx, field, value) => {
    setCategories({
      ...categories,
      [cat]: categories[cat].map((s, i) => i === idx ? { ...s, [field]: value } : s)
    });
  };

  const handleAddSkill = (cat) => {
    setCategories({
      ...categories,
      [cat]: [...categories[cat], { name: '', level: SkillLevels.BEGINNER }]
    });
  };

  const handleRemoveSkill = (cat, idx) => {
    setCategories({
      ...categories,
      [cat]: categories[cat].filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ skillCategories: categories });
    } catch (err) {
      setError('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCategories(initialData?.skillCategories || {});
    setNewCategory('');
    setError('');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!disabled && (
        <div>
          <label className="block text-sm font-medium mb-1">Add Category</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="border border-gray-200 rounded px-3 py-2 flex-1"
            />
            <button
              type="button"
              className={`px-4 py-2 rounded text-white ${!newCategory.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
            >
              Add
            </button>
          </div>
        </div>
      )}
      {Object.entries(categories).map(([cat, skills]) => (
        <div key={cat} className="border rounded p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold">{cat}</h4>
            {!disabled && <button type="button" className="text-red-500" onClick={() => handleRemoveCategory(cat)}>Remove</button>}
          </div>
          {skills.map((skill, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill.name}
                onChange={e => handleSkillChange(cat, idx, 'name', e.target.value)}
                className="border border-gray-200 rounded px-3 py-2 flex-1"
                placeholder="Skill name"
                disabled={disabled}
              />
              <select
                value={skill.level}
                onChange={e => handleSkillChange(cat, idx, 'level', e.target.value)}
                className="border border-gray-200 rounded px-3 py-2"
                disabled={disabled}
              >
                {defaultLevels.map(lvl => <option key={lvl} value={lvl}>{formatEnumValue(lvl)}</option>)}
              </select>
              {!disabled && <button type="button" className="text-red-500" onClick={() => handleRemoveSkill(cat, idx)}>Remove</button>}
            </div>
          ))}
          {!disabled && <button type="button" className="bg-green-500 text-white px-3 py-1 rounded mt-2" onClick={() => handleAddSkill(cat)}>Add Skill</button>}
        </div>
      ))}
      <FadeButtonGroup
        mode={disabled ? 'view' : 'edit'}
        onEdit={onEdit}
        onSave={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        disabled={disabled}
        saving={saving}
      />
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
};

export default SkillsConfigForm; 