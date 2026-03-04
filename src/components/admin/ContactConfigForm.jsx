import { useState, useEffect } from 'react'
import FadeButtonGroup from '../common/FadeButtonGroup'

const ContactConfigForm = ({
  initialData,
  onSave,
  onCancel,
  loading,
  disabled,
  onEdit,
  onContentChange,
}) => {
  const [contact, setContact] = useState(
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
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingPlatform, setEditingPlatform] = useState('')
  const [editingUrl, setEditingUrl] = useState('')

  // Trigger height recalculation when editing state changes
  useEffect(() => {
    if (onContentChange) {
      // Use a small delay to ensure DOM has updated
      const timer = setTimeout(() => {
        onContentChange()
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [editingIndex, onContentChange])

  // Clear editing state when form is cancelled (disabled changes from false to true)
  useEffect(() => {
    if (disabled && editingIndex !== null) {
      setEditingIndex(null)
      setEditingPlatform('')
      setEditingUrl('')
    }
  }, [disabled, editingIndex])

  const handleFieldChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddSocialLink = () => {
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

  const handleRemoveSocialLink = (idx) => {
    setContact((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
    }))
    onContentChange?.()
  }

  const handleEditSocialLink = (idx) => {
    const link = contact.socialLinks[idx]
    setEditingIndex(idx)
    setEditingPlatform(link.platform)
    setEditingUrl(link.url)
    onContentChange?.()
  }

  const handleSaveSocialLink = (idx) => {
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

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingPlatform('')
    setEditingUrl('')
    onContentChange?.()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await onSave(contact)
      setSaving(false)
    } catch {
      setError('Failed to save contact information.')
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
            onChange={(e) => handleFieldChange('email', e.target.value)}
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
            value={contact.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
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
              onChange={(e) => setNewPlatform(e.target.value)}
              disabled={disabled}
            />
            <input
              type="url"
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
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
            {contact.socialLinks?.map((link, idx) => (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded border border-transparent dark:border-gray-700"
              >
                {editingIndex === idx ? (
                  // Edit mode
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Platform"
                        value={editingPlatform}
                        onChange={(e) => setEditingPlatform(e.target.value)}
                        disabled={disabled}
                      />
                      <input
                        type="url"
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="URL"
                        value={editingUrl}
                        onChange={(e) => setEditingUrl(e.target.value)}
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
                  // View mode
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

      <FadeButtonGroup
        mode={disabled ? 'view' : 'edit'}
        onEdit={onEdit}
        onSave={handleSubmit}
        onCancel={onCancel}
        loading={loading}
        disabled={disabled}
        saving={saving}
      />
    </form>
  )
}

export default ContactConfigForm
