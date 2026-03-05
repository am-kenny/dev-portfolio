import { useState, type ChangeEvent, type FormEvent } from 'react'
import FadeButtonGroup from '../common/FadeButtonGroup'

export interface AboutConfig {
  content: string
}

export interface AboutConfigFormProps {
  initialData?: AboutConfig | null
  onSave?: (data: AboutConfig) => Promise<void> | void
  onCancel?: () => void
  loading?: boolean
  disabled: boolean
  onEdit?: () => void
}

const AboutConfigForm = ({
  initialData,
  onSave,
  onCancel,
  loading,
  disabled,
  onEdit,
}: AboutConfigFormProps): JSX.Element => {
  const [content, setContent] = useState<string>(initialData?.content || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    if (e && 'preventDefault' in e) {
      e.preventDefault()
    }
    if (!onSave) return
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(e.target.value)
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
          onChange={handleChange}
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
