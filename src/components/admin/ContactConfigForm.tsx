import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import FadeButtonGroup from '../common/FadeButtonGroup'
import type { ContactSection, SocialLink } from '../../types'

export interface ContactConfigFormProps {
  initialData?: ContactSection | null
  onSave?: (data: ContactSection) => Promise<void> | void
  onCancel?: () => void
  loading?: boolean
  disabled: boolean
  onEdit?: () => void
  onContentChange?: () => void
}

const ContactConfigForm = ({
  initialData,
  onSave,
  onCancel,
  loading,
  disabled,
  onEdit,
  onContentChange,
}: ContactConfigFormProps): JSX.Element => {
  const [contact, setContact] = useState<ContactSection>(
    initialData || {
      email: '',
      phone: '',
      socialLinks: [],
    }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newPlatform, setNewPlatform] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingPlatform, setEditingPlatform] = useState('')
  const [editingUrl, setEditingUrl] = useState('')

  useEffect(() => {
    if (onContentChange) {
      const timer = window.setTimeout(() => {
        onContentChange()
      }, 10)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [editingIndex, onContentChange])

  useEffect(() => {
    if (disabled && editingIndex !== null) {
      setEditingIndex(null)
      setEditingPlatform('')
      setEditingUrl('')
    }
  }, [disabled, editingIndex])

  const handleFieldChange = (
    field: keyof ContactSection,
    value: string
  ): void => {
    setContact((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddSocialLink = (): void => {
    if (!newPlatform.trim() || !newUrl.trim()) return
    setContact((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: newPlatform.trim(), url: newUrl.trim() },
      ],
    }))
    setNewPlatform('')
    setNewUrl('')
    onContentChange?.()
  }

  const handleRemoveSocialLink = (idx: number): void => {
    setContact((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
    }))
    onContentChange?.()
  }

  const handleEditSocialLink = (idx: number): void => {
    const link = contact.socialLinks[idx]
    setEditingIndex(idx)
    setEditingPlatform(link.platform)
    setEditingUrl(link.url)
    onContentChange?.()
  }

  const handleSaveSocialLink = (idx: number): void => {
    if (!editingPlatform.trim() || !editingUrl.trim()) return

    setContact((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === idx
          ? { platform: editingPlatform.trim(), url: editingUrl.trim() }
          : link
      ),
    }))

    setEditingIndex(null)
    setEditingPlatform('')
    setEditingUrl('')
    onContentChange?.()
  }

  const handleCancelEdit = (): void => {
    setEditingIndex(null)
    setEditingPlatform('')
    setEditingUrl('')
    onContentChange?.()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (onSave) {
        await onSave(contact)
      }
    } catch {
      setError('Failed to save contact information.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="your@email.com"
            value={contact.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFieldChange('email', e.target.value)
            }
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <input
            type="tel"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="123-456-7890"
            value={contact.phone ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFieldChange('phone', e.target.value)
            }
            disabled={disabled}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Social Links
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Platform (e.g., GitHub, Twitter)"
              value={newPlatform}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewPlatform(e.target.value)
              }
              disabled={disabled}
            />
            <input
              type="url"
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="URL"
              value={newUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewUrl(e.target.value)
              }
              disabled={disabled}
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-2 rounded"
              onClick={handleAddSocialLink}
              disabled={disabled || !newPlatform || !newUrl}
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {contact.socialLinks?.map((link: SocialLink, idx: number) => (
              <div
                key={link.platform}
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded border border-transparent dark:border-gray-700"
              >
                {editingIndex === idx ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Platform"
                        value={editingPlatform}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setEditingPlatform(e.target.value)
                        }
                        disabled={disabled}
                      />
                      <input
                        type="url"
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="URL"
                        value={editingUrl}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setEditingUrl(e.target.value)
                        }
                        disabled={disabled}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleSaveSocialLink(idx)}
                        disabled={
                          disabled ||
                          !editingPlatform.trim() ||
                          !editingUrl.trim()
                        }
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                        onClick={handleCancelEdit}
                        disabled={disabled}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {link.platform}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        {link.url}
                      </span>
                    </div>
                    {!disabled && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-blue-500 dark:text-blue-400 text-sm"
                          onClick={() => handleEditSocialLink(idx)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-500 dark:text-red-400 text-sm"
                          onClick={() => handleRemoveSocialLink(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}

      {/* Save button has type="submit", so form onSubmit handles submission */}
      <FadeButtonGroup
        mode={disabled ? 'view' : 'edit'}
        onEdit={onEdit}
        onCancel={onCancel}
        loading={loading}
        disabled={disabled}
        saving={saving}
      />
    </form>
  )
}

export default ContactConfigForm
