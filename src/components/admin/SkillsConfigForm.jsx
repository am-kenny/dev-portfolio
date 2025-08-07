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
  const [newSubcategory, setNewSubcategory] = useState('');
  const [addingSubcategoryFor, setAddingSubcategoryFor] = useState(null);

  // Notify parent on content change for resizing
  useEffect(() => {
    if (onContentChange) onContentChange();
  }, [categories]);

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

  // Handle hierarchical skill changes
  const handleHierarchicalSkillChange = (cat, subcat, idx, field, value) => {
    setCategories({
      ...categories,
      [cat]: {
        ...categories[cat],
        [subcat]: categories[cat][subcat].map((s, i) => i === idx ? { ...s, [field]: value } : s)
      }
    });
  };

  const handleStartAddSubcategory = (cat) => {
    setAddingSubcategoryFor(cat);
    setNewSubcategory('');
  };

  const handleCancelAddSubcategory = () => {
    setAddingSubcategoryFor(null);
    setNewSubcategory('');
  };

  const handleConfirmAddSubcategory = (cat) => {
    if (newSubcategory && newSubcategory.trim()) {
      const trimmedSubcategory = newSubcategory.trim();
      
      // Check if subcategory already exists
      if (categories[cat] && typeof categories[cat] === 'object' && categories[cat][trimmedSubcategory]) {
        setError(`Subcategory "${trimmedSubcategory}" already exists in "${cat}".`);
        return;
      }
      
      // If category is currently flat, convert it to hierarchical
      if (Array.isArray(categories[cat])) {
        const existingSkills = [...categories[cat]];
        setCategories({
          ...categories,
          [cat]: {
            [trimmedSubcategory]: existingSkills
          }
        });
      } else {
        // Category is already hierarchical, add new subcategory
        setCategories({
          ...categories,
          [cat]: {
            ...categories[cat],
            [trimmedSubcategory]: []
          }
        });
      }
      
      setAddingSubcategoryFor(null);
      setNewSubcategory('');
      setError('');
    }
  };

  const handleRemoveSubcategory = (cat, subcat) => {
    const newCat = { ...categories[cat] };
    delete newCat[subcat];
    setCategories({
      ...categories,
      [cat]: newCat
    });
  };

  const handleAddHierarchicalSkill = (cat, subcat) => {
    setCategories({
      ...categories,
      [cat]: {
        ...categories[cat],
        [subcat]: [...categories[cat][subcat], { name: '', level: SkillLevels.BEGINNER }]
      }
    });
  };

  const handleRemoveHierarchicalSkill = (cat, subcat, idx) => {
    setCategories({
      ...categories,
      [cat]: {
        ...categories[cat],
        [subcat]: categories[cat][subcat].filter((_, i) => i !== idx)
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ skillCategories: categories });
    } catch (err) {
      // Handle detailed validation errors
      if (err.response?.data?.details) {
        const details = err.response.data.details;
        if (Array.isArray(details)) {
          setError(`Validation errors: ${details.join(', ')}`);
        } else if (typeof details === 'object') {
          const errorMessages = Object.entries(details)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
          setError(`Validation errors: ${errorMessages}`);
        } else {
          setError(`Validation error: ${details}`);
        }
      } else {
        setError('Failed to save.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCategories(initialData?.skillCategories || {});
    setNewCategory('');
    setNewSubcategory('');
    setAddingSubcategoryFor(null);
    setError('');
    onCancel();
  };

  const renderSkills = (cat, skills) => {
    if (Array.isArray(skills)) {
      // Flat structure
      return (
        <div>
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
          {!disabled && (
            <div className="mt-2">
              <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleStartAddSubcategory(cat)}>
                Convert to Subcategories
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Organize skills into subcategories for better structure
              </p>
            </div>
          )}
          
          {/* Inline subcategory input */}
          {!disabled && addingSubcategoryFor === cat && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-blue-800">
                  Add subcategory to "{cat}":
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={e => setNewSubcategory(e.target.value)}
                  className="border border-blue-300 rounded px-3 py-2 flex-1"
                  placeholder="Enter subcategory name..."
                  onKeyPress={e => e.key === 'Enter' && handleConfirmAddSubcategory(cat)}
                  autoFocus
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleConfirmAddSubcategory(cat)}
                  disabled={!newSubcategory.trim()}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  onClick={handleCancelAddSubcategory}
                >
                  Cancel
                </button>
              </div>
              <div className="mt-2 text-xs text-blue-600">
                <span className="font-medium">Suggestions:</span> 
                {cat === 'Other' ? ' General, Soft Skills, Certifications' :
                 cat === 'Frontend Development' ? ' Languages, Frameworks, Styling' :
                 cat === 'Backend Development' ? ' Languages, Frameworks, APIs' :
                 cat === 'Tools & Platforms' ? ' Version Control, Development, Testing' :
                 ' Common, Advanced, Specialized'}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // Hierarchical structure
      return (
        <div>
          {Object.entries(skills).map(([subcat, subcatSkills]) => (
            <div key={subcat} className="border-l-2 border-blue-200 pl-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h6 className="text-sm font-medium text-gray-600">{subcat}</h6>
                {!disabled && <button type="button" className="text-red-500 text-xs" onClick={() => handleRemoveSubcategory(cat, subcat)}>Remove</button>}
              </div>
              {subcatSkills.map((skill, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={e => handleHierarchicalSkillChange(cat, subcat, idx, 'name', e.target.value)}
                    className="border border-gray-200 rounded px-3 py-2 flex-1"
                    placeholder="Skill name"
                    disabled={disabled}
                  />
                  <select
                    value={skill.level}
                    onChange={e => handleHierarchicalSkillChange(cat, subcat, idx, 'level', e.target.value)}
                    className="border border-gray-200 rounded px-3 py-2"
                    disabled={disabled}
                  >
                    {defaultLevels.map(lvl => <option key={lvl} value={lvl}>{formatEnumValue(lvl)}</option>)}
                  </select>
                  {!disabled && <button type="button" className="text-red-500" onClick={() => handleRemoveHierarchicalSkill(cat, subcat, idx)}>Remove</button>}
                </div>
              ))}
              {!disabled && <button type="button" className="bg-green-500 text-white px-3 py-1 rounded mt-2" onClick={() => handleAddHierarchicalSkill(cat, subcat)}>Add Skill</button>}
            </div>
          ))}
          {!disabled && <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded mt-2" onClick={() => handleStartAddSubcategory(cat)}>Add Subcategory</button>}
          
          {/* Inline subcategory input for hierarchical structure */}
          {!disabled && addingSubcategoryFor === cat && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-blue-800">
                  Add subcategory to "{cat}":
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={e => setNewSubcategory(e.target.value)}
                  className="border border-blue-300 rounded px-3 py-2 flex-1"
                  placeholder="Enter subcategory name..."
                  onKeyPress={e => e.key === 'Enter' && handleConfirmAddSubcategory(cat)}
                  autoFocus
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleConfirmAddSubcategory(cat)}
                  disabled={!newSubcategory.trim()}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  onClick={handleCancelAddSubcategory}
                >
                  Cancel
                </button>
              </div>
              <div className="mt-2 text-xs text-blue-600">
                <span className="font-medium">Suggestions:</span> 
                {cat === 'Other' ? ' General, Soft Skills, Certifications' :
                 cat === 'Frontend Development' ? ' Languages, Frameworks, Styling' :
                 cat === 'Backend Development' ? ' Languages, Frameworks, APIs' :
                 cat === 'Tools & Platforms' ? ' Version Control, Development, Testing' :
                 ' Common, Advanced, Specialized'}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Helpful Guidance */}
      {!disabled && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">How to Organize Skills</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Flat Structure:</strong> All skills listed together (good for small categories)</p>
            <p>• <strong>Hierarchical Structure:</strong> Skills organized into subcategories (better for large categories)</p>
            <p>• <strong>Any Category:</strong> You can add subcategories to any category, including "Other"</p>
            <p>• <strong>Convert:</strong> Use "Convert to Subcategories" to organize flat categories</p>
            <p>• <strong>Easy Input:</strong> Inline form with suggestions for common subcategory names</p>
          </div>
        </div>
      )}

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
          {renderSkills(cat, skills)}
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