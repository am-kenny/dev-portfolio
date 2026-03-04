import { useState } from 'react'
import FadeButtonGroup from '../common/FadeButtonGroup'

const AboutConfigForm = ({
  initialData,
  onSave,
  onCancel,
  loading,
  disabled,
  onEdit,
}) => {
  const [content, setContent] = useState(initialData?.content || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({ content })
    } catch {
      setError('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = disabled
    ? 'w-full border border-gray-200 dark:border-gray-600 rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors duration-300 ease'
    : 'w-full border border-gray-200 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300 ease'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm mt-2">
          {error}
        </div>
      )}
    </form>
  )
}

export default AboutConfigForm
