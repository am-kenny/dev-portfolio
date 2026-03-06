import {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import FadeButtonGroup from '../common/FadeButtonGroup'
import { SkillLevels } from '../../constants/skillLevels'
import { formatEnumValue } from '../../utils/formatters'
import type { SkillsSection, SkillEntry, SkillCategoryValue } from '../../types'

const defaultLevels = [...Object.values(SkillLevels)]

export interface SkillsConfigFormProps {
  initialData?: SkillsSection | null
  onSave?: (data: SkillsSection) => Promise<void> | void
  onCancel?: () => void
  loading?: boolean
  disabled: boolean
  onEdit?: () => void
  onContentChange?: () => void
}

const SkillsConfigForm = ({
  initialData,
  onSave,
  onCancel,
  loading,
  disabled,
  onEdit,
  onContentChange,
}: SkillsConfigFormProps): JSX.Element => {
  const [categories, setCategories] = useState<
    SkillsSection['skillCategories']
  >(initialData?.skillCategories || {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newSubcategory, setNewSubcategory] = useState('')
  const [addingSubcategoryFor, setAddingSubcategoryFor] = useState<
    string | null
  >(null)

  useEffect(() => {
    if (onContentChange) onContentChange()
  }, [categories, onContentChange])

  const handleAddCategory = (): void => {
    if (newCategory && !categories[newCategory]) {
      setCategories((prev) => ({ ...prev, [newCategory]: [] }))
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (cat: string): void => {
    setCategories((prev) => {
      const next = { ...prev }
      delete next[cat]
      return next
    })
  }

  const handleSkillChange = (
    cat: string,
    idx: number,
    field: keyof SkillEntry,
    value: string
  ): void => {
    const current = categories[cat]
    if (!Array.isArray(current)) return
    setCategories({
      ...categories,
      [cat]: current.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    })
  }

  const handleAddSkill = (cat: string): void => {
    const current = categories[cat]
    if (!Array.isArray(current)) return
    setCategories({
      ...categories,
      [cat]: [...current, { name: '', level: SkillLevels.BEGINNER }],
    })
  }

  const handleRemoveSkill = (cat: string, idx: number): void => {
    const current = categories[cat]
    if (!Array.isArray(current)) return
    setCategories({
      ...categories,
      [cat]: current.filter((_, i) => i !== idx),
    })
  }

  const handleHierarchicalSkillChange = (
    cat: string,
    subcat: string,
    idx: number,
    field: keyof SkillEntry,
    value: string
  ): void => {
    const current = categories[cat]
    if (!current || Array.isArray(current)) return
    setCategories({
      ...categories,
      [cat]: {
        ...current,
        [subcat]: current[subcat].map((s: SkillEntry, i: number) =>
          i === idx ? { ...s, [field]: value } : s
        ),
      },
    })
  }

  const handleStartAddSubcategory = (cat: string): void => {
    setAddingSubcategoryFor(cat)
    setNewSubcategory('')
  }

  const handleCancelAddSubcategory = (): void => {
    setAddingSubcategoryFor(null)
    setNewSubcategory('')
  }

  const handleConfirmAddSubcategory = (cat: string): void => {
    if (!newSubcategory || !newSubcategory.trim()) return
    const trimmedSubcategory = newSubcategory.trim()
    const current = categories[cat] as SkillCategoryValue

    if (
      current &&
      !Array.isArray(current) &&
      (current as Record<string, SkillEntry[]>)[trimmedSubcategory]
    ) {
      setError(
        `Subcategory "${trimmedSubcategory}" already exists in "${cat}".`
      )
      return
    }

    if (Array.isArray(current)) {
      const existingSkills = [...current]
      setCategories({
        ...categories,
        [cat]: {
          [trimmedSubcategory]: existingSkills,
        },
      })
    } else {
      setCategories({
        ...categories,
        [cat]: {
          ...(current || {}),
          [trimmedSubcategory]: [],
        },
      })
    }

    setAddingSubcategoryFor(null)
    setNewSubcategory('')
    setError('')
  }

  const handleRemoveSubcategory = (cat: string, subcat: string): void => {
    const current = categories[cat]
    if (!current || Array.isArray(current)) return
    const newCat = { ...current }
    delete newCat[subcat]
    setCategories({
      ...categories,
      [cat]: newCat,
    })
  }

  const handleAddHierarchicalSkill = (cat: string, subcat: string): void => {
    const current = categories[cat]
    if (!current || Array.isArray(current)) return
    setCategories({
      ...categories,
      [cat]: {
        ...current,
        [subcat]: [
          ...(current[subcat] as SkillEntry[]),
          { name: '', level: SkillLevels.BEGINNER },
        ],
      },
    })
  }

  const handleRemoveHierarchicalSkill = (
    cat: string,
    subcat: string,
    idx: number
  ): void => {
    const current = categories[cat]
    if (!current || Array.isArray(current)) return
    setCategories({
      ...categories,
      [cat]: {
        ...current,
        [subcat]: (current[subcat] as SkillEntry[]).filter(
          (_: SkillEntry, i: number) => i !== idx
        ),
      },
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!onSave) {
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({ skillCategories: categories })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = (): void => {
    setCategories(initialData?.skillCategories || {})
    setNewCategory('')
    setNewSubcategory('')
    setAddingSubcategoryFor(null)
    setError('')
    onCancel?.()
  }

  const renderSkills = (
    cat: string,
    skills: SkillCategoryValue
  ): JSX.Element =>
    Array.isArray(skills) ? (
      <div>
        {skills.map((skill, idx) => (
          <div key={skill.name} className="flex gap-2 mb-2">
            <input
              type="text"
              value={skill.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleSkillChange(cat, idx, 'name', e.target.value)
              }
              className="border border-gray-200 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Skill name"
              disabled={disabled}
            />
            <select
              value={skill.level}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleSkillChange(cat, idx, 'level', e.target.value)
              }
              className="border border-gray-200 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={disabled}
            >
              {defaultLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {formatEnumValue(lvl)}
                </option>
              ))}
            </select>
            {!disabled && (
              <button
                type="button"
                className="text-red-500 dark:text-red-400"
                onClick={() => handleRemoveSkill(cat, idx)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {!disabled && (
          <button
            type="button"
            className="bg-green-500 text-white px-3 py-1 rounded mt-2"
            onClick={() => handleAddSkill(cat)}
          >
            Add Skill
          </button>
        )}
        {!disabled && (
          <div className="mt-2">
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => handleStartAddSubcategory(cat)}
            >
              Convert to Subcategories
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Organize skills into subcategories for better structure
            </p>
          </div>
        )}

        {!disabled && addingSubcategoryFor === cat && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Add subcategory to &quot;{cat}&quot;:
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubcategory}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewSubcategory(e.target.value)
                }
                className="border border-blue-300 dark:border-blue-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter subcategory name..."
                onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleConfirmAddSubcategory(cat)
                  }
                }}
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
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              <span className="font-medium">Suggestions:</span>
              {cat === 'Other'
                ? ' General, Soft Skills, Certifications'
                : cat === 'Frontend Development'
                  ? ' Languages, Frameworks, Styling'
                  : cat === 'Backend Development'
                    ? ' Languages, Frameworks, APIs'
                    : cat === 'Tools & Platforms'
                      ? ' Version Control, Development, Testing'
                      : ' Common, Advanced, Specialized'}
            </div>
          </div>
        )}
      </div>
    ) : (
      <div>
        {Object.entries(skills as Record<string, SkillEntry[]>).map(
          ([subcat, subcatSkills]) => (
            <div
              key={subcat}
              className="border-l-2 border-blue-200 dark:border-blue-700 pl-4 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {subcat}
                </h6>
                {!disabled && (
                  <button
                    type="button"
                    className="text-red-500 dark:text-red-400 text-xs"
                    onClick={() => handleRemoveSubcategory(cat, subcat)}
                  >
                    Remove
                  </button>
                )}
              </div>
              {subcatSkills.map((skill, idx) => (
                <div
                  key={`${subcat}-${skill.name}`}
                  className="flex gap-2 mb-2"
                >
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleHierarchicalSkillChange(
                        cat,
                        subcat,
                        idx,
                        'name',
                        e.target.value
                      )
                    }
                    className="border border-gray-200 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Skill name"
                    disabled={disabled}
                  />
                  <select
                    value={skill.level}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleHierarchicalSkillChange(
                        cat,
                        subcat,
                        idx,
                        'level',
                        e.target.value
                      )
                    }
                    className="border border-gray-200 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    disabled={disabled}
                  >
                    {defaultLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {formatEnumValue(lvl)}
                      </option>
                    ))}
                  </select>
                  {!disabled && (
                    <button
                      type="button"
                      className="text-red-500 dark:text-red-400"
                      onClick={() =>
                        handleRemoveHierarchicalSkill(cat, subcat, idx)
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {!disabled && (
                <button
                  type="button"
                  className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                  onClick={() => handleAddHierarchicalSkill(cat, subcat)}
                >
                  Add Skill
                </button>
              )}
            </div>
          )
        )}
        {!disabled && (
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
            onClick={() => handleStartAddSubcategory(cat)}
          >
            Add Subcategory
          </button>
        )}

        {!disabled && addingSubcategoryFor === cat && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Add subcategory to &quot;{cat}&quot;:
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubcategory}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewSubcategory(e.target.value)
                }
                className="border border-blue-300 dark:border-blue-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter subcategory name..."
                onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleConfirmAddSubcategory(cat)
                  }
                }}
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
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              <span className="font-medium">Suggestions:</span>
              {cat === 'Other'
                ? ' General, Soft Skills, Certifications'
                : cat === 'Frontend Development'
                  ? ' Languages, Frameworks, Styling'
                  : cat === 'Backend Development'
                    ? ' Languages, Frameworks, APIs'
                    : cat === 'Tools & Platforms'
                      ? ' Version Control, Development, Testing'
                      : ' Common, Advanced, Specialized'}
            </div>
          </div>
        )}
      </div>
    )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!disabled && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            How to Organize Skills
          </h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>
              • <strong>Flat Structure:</strong> All skills listed together
              (good for small categories)
            </p>
            <p>
              • <strong>Hierarchical Structure:</strong> Skills organized into
              subcategories (better for large categories)
            </p>
            <p>
              • <strong>Any Category:</strong> You can add subcategories to any
              category, including &quot;Other&quot;
            </p>
            <p>
              • <strong>Convert:</strong> Use &quot;Convert to
              Subcategories&quot; to organize flat categories
            </p>
            <p>
              • <strong>Easy Input:</strong> Inline form with suggestions for
              common subcategory names
            </p>
          </div>
        </div>
      )}

      {!disabled && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Add Category
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewCategory(e.target.value)
              }
              className="border border-gray-200 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              className={`px-4 py-2 rounded text-white ${
                !newCategory.trim()
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              }`}
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {Object.entries(categories).map(([cat, skills]) => (
        <div
          key={cat}
          className="border border-gray-200 dark:border-gray-600 rounded p-4 mb-4 bg-gray-50 dark:bg-gray-800"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {cat}
            </h4>
            {!disabled && (
              <button
                type="button"
                className="text-red-500 dark:text-red-400"
                onClick={() => handleRemoveCategory(cat)}
              >
                Remove
              </button>
            )}
          </div>
          {renderSkills(cat, skills as SkillCategoryValue)}
        </div>
      ))}

      <FadeButtonGroup
        mode={disabled ? 'view' : 'edit'}
        onEdit={onEdit}
        onCancel={handleCancel}
        loading={loading}
        disabled={disabled}
        saving={saving}
      />
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm mt-2">
          {error}
        </div>
      )}
    </form>
  )
}

export default SkillsConfigForm
