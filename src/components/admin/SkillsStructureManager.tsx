import { useState, useEffect, type ChangeEvent } from 'react'
import {
  getSkillsStructure,
  getSkillsCategorization,
  configureSkillsCategorization,
  type SkillsStructure,
  type SkillsCategorizationSettings,
} from '../../services/skills'
import type { SkillCategoryValue } from '../../types'
import config from '../../services/config'
import FadeButtonGroup from '../common/FadeButtonGroup'
import CategorySummaryCard from './CategorySummaryCard'

export interface SkillsResponse {
  skillCategories: Record<string, SkillCategoryValue>
}

const SkillsStructureManager = (): JSX.Element => {
  const [skillsStructure, setSkillsStructure] =
    useState<SkillsStructure | null>(null)
  const [currentSkills, setCurrentSkills] = useState<SkillsResponse | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categorization, setCategorization] =
    useState<SkillsCategorizationSettings>({
      useSubcategories: true,
      minSkillsForSubcategory: 3,
      categoryOverrides: {} as Record<string, unknown>,
    })
  const [originalCategorization, setOriginalCategorization] =
    useState<SkillsCategorizationSettings>({
      useSubcategories: true,
      minSkillsForSubcategory: 3,
      categoryOverrides: {} as Record<string, unknown>,
    })

  useEffect(() => {
    void loadData()
  }, [])

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true)
      const [structure, skills, categorizationSettings] = await Promise.all([
        getSkillsStructure(),
        fetch(config.getApiUrl(config.endpoints.portfolio) + '/skills').then(
          async (res) => (await res.json()) as SkillsResponse
        ),
        getSkillsCategorization().catch(() => ({
          useSubcategories: true,
          minSkillsForSubcategory: 3,
          categoryOverrides: {},
        })),
      ])
      setSkillsStructure(structure)
      setCurrentSkills(skills)
      setCategorization(categorizationSettings)
      setOriginalCategorization(categorizationSettings)
    } catch (err) {
      setError('Failed to load skills data')
      console.error('Error loading skills data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCategorization = async (): Promise<void> => {
    try {
      setSaving(true)
      setError('')
      await configureSkillsCategorization(categorization)
      setOriginalCategorization(categorization)
      setIsEditing(false)
      setSuccess('Categorization preferences saved successfully!')
      window.setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to save categorization preferences'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (): void => {
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = (): void => {
    setIsEditing(false)
    setCategorization(originalCategorization)
    setError('')
    setSuccess('')
  }

  const handleCategoryOverride = (role: string, value: string): void => {
    setCategorization((prev) => ({
      ...prev,
      categoryOverrides: {
        ...prev.categoryOverrides,
        [role]: value,
      },
    }))
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 transition-colors duration-300"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded transition-colors duration-300"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 transition-colors duration-300"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <div className="text-red-600 dark:text-red-400 mb-4 transition-colors duration-300">
          {error}
        </div>
        <button
          onClick={() => void loadData()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
        >
          Retry
        </button>
      </div>
    )
  }

  const actualCategories = currentSkills?.skillCategories
    ? Object.keys(currentSkills.skillCategories)
    : []

  const predefinedCategories = skillsStructure?.availableRoles || []
  const roleSubcategories = skillsStructure?.roleSubcategories || {}

  const missingPredefinedCategories = predefinedCategories.filter(
    (category) => !actualCategories.includes(category)
  )

  const customCategories = actualCategories.filter(
    (category) => !predefinedCategories.includes(category)
  )

  return (
    <div className="bg-white dark:bg-transparent transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
        Skills Structure Management
      </h3>

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md transition-colors duration-300">
          <p className="text-sm text-green-700 dark:text-green-300">
            {success}
          </p>
        </div>
      )}

      {skillsStructure && currentSkills && (
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300">
              Predefined Categories
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {actualCategories
                .filter((category) => predefinedCategories.includes(category))
                .map((category) => {
                  const categorySkills = currentSkills.skillCategories[category]
                  return (
                    <CategorySummaryCard
                      key={category}
                      category={category}
                      categorySkills={categorySkills}
                      variant="predefined"
                    />
                  )
                })}
            </div>
          </div>

          {missingPredefinedCategories.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300">
                Available Predefined Categories
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
                These predefined categories are available for LinkedIn imports
                but not currently used in your skills.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {missingPredefinedCategories.map((role) => (
                  <CategorySummaryCard
                    key={role}
                    category={role}
                    categorySkills={roleSubcategories[role] || []}
                    variant="available"
                  />
                ))}
              </div>
            </div>
          )}

          {customCategories.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300">
                Custom Categories
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
                These are your custom categories that aren&apos;t part of the
                predefined set.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customCategories.map((category) => {
                  const categorySkills = currentSkills.skillCategories[category]
                  return (
                    <CategorySummaryCard
                      key={category}
                      category={category}
                      categorySkills={categorySkills}
                      variant="custom"
                    />
                  )
                })}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 transition-colors duration-300">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300">
              Skills Categorization Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={categorization.useSubcategories}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCategorization({
                        ...categorization,
                        useSubcategories: e.target.checked,
                      })
                    }
                    disabled={!isEditing}
                    className={`mr-2 ${
                      !isEditing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  Use subcategories for better organization
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-6 mt-1 transition-colors duration-300">
                  When enabled, skills will be organized into subcategories
                  within each main category.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum skills for subcategory:
                </label>
                <input
                  type="number"
                  value={categorization.minSkillsForSubcategory}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCategorization({
                      ...categorization,
                      minSkillsForSubcategory: Number.parseInt(
                        e.target.value,
                        10
                      ),
                    })
                  }
                  disabled={!isEditing}
                  className={`border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-20 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
                    !isEditing
                      ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-700'
                  }`}
                  min={1}
                  max={10}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                  Categories with fewer skills will be flattened automatically.
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Category Overrides
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
                  Configure how specific predefined categories should be
                  structured during LinkedIn imports.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {actualCategories
                    .filter((category) =>
                      predefinedCategories.includes(category)
                    )
                    .map((role) => (
                      <div
                        key={role}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded transition-colors duration-300"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          {role}
                        </span>
                        <select
                          value={
                            (categorization.categoryOverrides[
                              role
                            ] as string) || 'auto'
                          }
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            handleCategoryOverride(role, e.target.value)
                          }
                          disabled={!isEditing}
                          className={`text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
                            !isEditing
                              ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed'
                              : 'bg-white dark:bg-gray-700'
                          }`}
                        >
                          <option value="auto">Auto (Default)</option>
                          <option value="flat">Always Flat</option>
                          <option value="subcategories">
                            Always Subcategories
                          </option>
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
              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm mt-2 transition-colors duration-300">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillsStructureManager
