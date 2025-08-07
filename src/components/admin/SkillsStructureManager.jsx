import { useState, useEffect } from 'react';
import { getSkillsStructure, getSkillsCategorization, configureSkillsCategorization } from '../../services/skills';
import config from '../../services/config';
import FadeButtonGroup from '../common/FadeButtonGroup';
import CategorySummaryCard from './CategorySummaryCard';

const SkillsStructureManager = () => {
  const [skillsStructure, setSkillsStructure] = useState(null);
  const [currentSkills, setCurrentSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categorization, setCategorization] = useState({
    useSubcategories: true,
    minSkillsForSubcategory: 3,
    categoryOverrides: {}
  });
  const [originalCategorization, setOriginalCategorization] = useState({
    useSubcategories: true,
    minSkillsForSubcategory: 3,
    categoryOverrides: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [structure, skills, categorizationSettings] = await Promise.all([
        getSkillsStructure(),
        fetch(config.getApiUrl(config.endpoints.portfolio) + '/skills').then(res => res.json()),
        getSkillsCategorization().catch(() => ({
          useSubcategories: true,
          minSkillsForSubcategory: 3,
          categoryOverrides: {}
        }))
      ]);
      setSkillsStructure(structure);
      setCurrentSkills(skills);
      setCategorization(categorizationSettings);
      setOriginalCategorization(categorizationSettings);
    } catch (error) {
      setError('Failed to load skills data');
      console.error('Error loading skills data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategorization = async () => {
    try {
      setSaving(true);
      setError('');
      await configureSkillsCategorization(categorization);
      setOriginalCategorization(categorization);
      setIsEditing(false);
      setSuccess('Categorization preferences saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to save categorization preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCategorization(originalCategorization);
    setError('');
    setSuccess('');
  };

  const handleCategoryOverride = (role, value) => {
    setCategorization(prev => ({
      ...prev,
      categoryOverrides: {
        ...prev.categoryOverrides,
        [role]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Get actual categories from current skills data
  const actualCategories = currentSkills?.skillCategories ? Object.keys(currentSkills.skillCategories) : [];
  
  // Get predefined categories from structure
  const predefinedCategories = skillsStructure?.availableRoles || [];
  
  // Find categories that exist in predefined but not in current
  const missingPredefinedCategories = predefinedCategories.filter(
    category => !actualCategories.includes(category)
  );
  
  // Find categories that exist in current but not in predefined
  const customCategories = actualCategories.filter(
    category => !predefinedCategories.includes(category)
  );

  return (
    <div className="bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Structure Management</h3>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {skillsStructure && (
        <div className="space-y-6">
          {/* Predefined Categories */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Predefined Categories</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {actualCategories
                .filter(category => predefinedCategories.includes(category))
                .map((category) => {
                const categorySkills = currentSkills.skillCategories[category];
                return (
                  <CategorySummaryCard
                    key={category}
                    category={category}
                    categorySkills={categorySkills}
                    variant="predefined"
                  />
                );
              })}
            </div>
          </div>

          {/* Available Predefined Categories */}
          {missingPredefinedCategories.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">Available Predefined Categories</h4>
              <p className="text-sm text-gray-600 mb-3">These predefined categories are available for LinkedIn imports but not currently used in your skills.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {missingPredefinedCategories.map((role) => (
                  <CategorySummaryCard
                    key={role}
                    category={role}
                    categorySkills={skillsStructure.roleSubcategories[role]}
                    variant="available"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Custom Categories */}
          {customCategories.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">Custom Categories</h4>
              <p className="text-sm text-gray-600 mb-3">These are your custom categories that aren't part of the predefined set.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customCategories.map((category) => {
                  const categorySkills = currentSkills.skillCategories[category];
                  return (
                                      <CategorySummaryCard
                    key={category}
                    category={category}
                    categorySkills={categorySkills}
                    variant="custom"
                  />
                  );
                })}
              </div>
            </div>
          )}

          {/* Categorization Settings */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-800 mb-3">Skills Categorization Settings</h4>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={categorization.useSubcategories}
                    onChange={(e) => setCategorization({
                      ...categorization,
                      useSubcategories: e.target.checked
                    })}
                    disabled={!isEditing}
                    className={`mr-2 ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  Use subcategories for better organization
                </label>
                <p className="text-sm text-gray-600 ml-6 mt-1">
                  When enabled, skills will be organized into subcategories within each main category.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum skills for subcategory:
                </label>
                <input
                  type="number"
                  value={categorization.minSkillsForSubcategory}
                  onChange={(e) => setCategorization({
                    ...categorization,
                    minSkillsForSubcategory: parseInt(e.target.value)
                  })}
                  disabled={!isEditing}
                  className={`border border-gray-300 rounded px-3 py-2 w-20 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                  min="1"
                  max="10"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Categories with fewer skills will be flattened automatically.
                </p>
              </div>

              {/* Category Overrides */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Category Overrides</h5>
                <p className="text-sm text-gray-600 mb-3">Configure how specific predefined categories should be structured during LinkedIn imports.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {actualCategories
                    .filter(category => predefinedCategories.includes(category))
                    .map((role) => (
                    <div key={role} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700">{role}</span>
                      <select
                        value={categorization.categoryOverrides[role] || 'auto'}
                        onChange={(e) => handleCategoryOverride(role, e.target.value)}
                        disabled={!isEditing}
                        className={`text-sm border border-gray-300 rounded px-2 py-1 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                      >
                        <option value="auto">Auto (Default)</option>
                        <option value="flat">Always Flat</option>
                        <option value="subcategories">Always Subcategories</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <FadeButtonGroup
                mode={isEditing ? 'edit' : 'view'}
                onEdit={handleEdit}
                onSave={handleSaveCategorization}
                onCancel={handleCancel}
                loading={loading}
                disabled={!isEditing}
                saving={saving}
              />
              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            </div>
          </div>


        </div>
      )}
    </div>
  );
};

export default SkillsStructureManager; 