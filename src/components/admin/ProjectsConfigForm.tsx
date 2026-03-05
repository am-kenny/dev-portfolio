import { useState, type ChangeEvent } from 'react'
import FadeButtonGroup from '../common/FadeButtonGroup'

export interface ProjectConfigItem {
  name: string
  description: string
  technologies: string[]
  link?: string
  github?: string
}

export interface ProjectsConfigData {
  projects?: ProjectConfigItem[]
  items?: ProjectConfigItem[]
}

export interface ProjectsConfigFormProps {
  initialData?: ProjectsConfigData | null
  onSave?: (data: { items: ProjectConfigItem[] }) => Promise<void>
  onCancel?: () => void
  loading?: boolean
  disabled: boolean
  onEdit?: () => void
}

const emptyProject: ProjectConfigItem = {
  name: '',
  description: '',
  technologies: [],
  link: '',
  github: '',
}

const ProjectsConfigForm = ({
  initialData,
  onSave,
  onCancel,
  loading,
  disabled,
  onEdit,
}: ProjectsConfigFormProps): JSX.Element => {
  const [projects, setProjects] = useState<ProjectConfigItem[]>(
    initialData?.projects || []
  )
  const [editingProject, setEditingProject] =
    useState<ProjectConfigItem>(emptyProject)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleFieldChange = (field: keyof ProjectConfigItem, value: string) => {
    setEditingProject((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTech = (): void => {
    if (!techInput.trim()) return
    setEditingProject((prev) => ({
      ...prev,
      technologies: [...prev.technologies, techInput.trim()],
    }))
    setTechInput('')
  }

  const handleRemoveTech = (idx: number): void => {
    setEditingProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== idx),
    }))
  }

  const handleEditProject = (idx: number): void => {
    setEditingIndex(idx)
    setEditingProject(projects[idx])
  }

  const handleDeleteProject = (idx: number): void => {
    setProjects(projects.filter((_, i) => i !== idx))
    if (editingIndex === idx) {
      setEditingIndex(null)
      setEditingProject(emptyProject)
    }
  }

  const handleSaveProject = (): void => {
    if (!editingProject.name || !editingProject.description) {
      setError('Name and description are required.')
      return
    }
    setError('')
    setSaving(true)

    let updatedProjects: ProjectConfigItem[]

    if (editingIndex !== null) {
      updatedProjects = projects.map((project, i) =>
        i === editingIndex ? editingProject : project
      )
      setProjects(updatedProjects)
    } else {
      updatedProjects = [...projects, editingProject]
      setProjects(updatedProjects)
    }

    if (onSave) {
      void onSave({ items: updatedProjects })
        .then(() => {
          setEditingProject(emptyProject)
          setEditingIndex(null)
          setShowAddForm(false)
          setSaving(false)
        })
        .catch(() => {
          setError('Failed to save project.')
          setSaving(false)
        })
    } else {
      setEditingProject(emptyProject)
      setEditingIndex(null)
      setShowAddForm(false)
      setSaving(false)
    }
  }

  const handleCancelEdit = (): void => {
    setEditingProject(emptyProject)
    setEditingIndex(null)
    setError('')
    setShowAddForm(false)
  }

  const handleCancel = (): void => {
    setProjects(initialData?.items || [])
    setEditingProject(emptyProject)
    setEditingIndex(null)
    setTechInput('')
    setError('')
    setShowAddForm(false)
    onCancel?.()
  }

  return (
    <form className="space-y-6">
      {!disabled && (showAddForm || editingIndex !== null) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {editingIndex !== null ? 'Edit Project' : 'Add New Project'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <input
              type="text"
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Project Name"
              value={editingProject.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFieldChange('name', e.target.value)
              }
            />
            <input
              type="url"
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Live Demo URL"
              value={editingProject.link}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFieldChange('link', e.target.value)
              }
            />
            <input
              type="url"
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="GitHub URL"
              value={editingProject.github}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFieldChange('github', e.target.value)
              }
            />
          </div>
          <textarea
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Description"
            value={editingProject.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleFieldChange('description', e.target.value)
            }
            rows={3}
          />
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Technologies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Add technology"
                value={techInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTechInput(e.target.value)
                }
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-2 rounded"
                onClick={handleAddTech}
                disabled={!techInput}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editingProject.technologies?.map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    className="ml-2 text-red-500 dark:text-red-400"
                    onClick={() => handleRemoveTech(idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleSaveProject}
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingIndex !== null
                  ? 'Update Project'
                  : 'Add Project'}
            </button>
            {(editingIndex !== null || showAddForm) && (
              <button
                type="button"
                className="bg-gray-300 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm mt-2">
              {error}
            </div>
          )}
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
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Projects List
        </h3>
        {projects.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400">
            No projects added yet.
          </div>
        )}
        <ul className="space-y-4">
          {projects.map((project, idx) => (
            <li
              key={project.name}
              className="border border-gray-200 dark:border-gray-600 rounded p-4 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    {project.name}
                  </span>
                </div>
                <div className="flex gap-2">
                  {!disabled && (
                    <button
                      type="button"
                      className="text-blue-500 dark:text-blue-400"
                      onClick={() => handleEditProject(idx)}
                    >
                      Edit
                    </button>
                  )}
                  {!disabled && (
                    <button
                      type="button"
                      className="text-red-500 dark:text-red-400"
                      onClick={() => handleDeleteProject(idx)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-300 mb-1">
                {project.description}
              </div>
              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline mr-4"
                  >
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    GitHub
                  </a>
                )}
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
  )
}

export default ProjectsConfigForm
