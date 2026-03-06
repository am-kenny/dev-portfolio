import { useEffect, useState } from 'react'

const BUTTON_TRANSITION = 250

export type FadeButtonGroupMode = 'view' | 'edit'

export interface FadeButtonGroupProps {
  mode: FadeButtonGroupMode
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
  loading?: boolean
  disabled?: boolean
  saving?: boolean
}

type VisibleGroup = 'edit' | 'action'

const FadeButtonGroup = ({
  mode,
  onEdit,
  onSave,
  onCancel,
  saving = false,
}: FadeButtonGroupProps): JSX.Element => {
  const [visibleGroup, setVisibleGroup] = useState<VisibleGroup>(
    mode === 'view' ? 'edit' : 'action'
  )
  const [fadingGroup, setFadingGroup] = useState<VisibleGroup | null>(null)

  useEffect(() => {
    if (mode === 'view' && visibleGroup === 'action') {
      setFadingGroup('action')
      window.setTimeout(() => {
        setVisibleGroup('edit')
        setFadingGroup('edit')
        window.setTimeout(() => setFadingGroup(null), BUTTON_TRANSITION)
      }, BUTTON_TRANSITION)
    } else if (mode === 'edit' && visibleGroup === 'edit') {
      setFadingGroup('edit')
      window.setTimeout(() => {
        setVisibleGroup('action')
        setFadingGroup('action')
        window.setTimeout(() => setFadingGroup(null), BUTTON_TRANSITION)
      }, BUTTON_TRANSITION)
    }
    // Intentionally only run when mode changes to avoid double transition
    // eslint-disable-next-line react-hooks/exhaustive-deps -- visibleGroup omitted on purpose
  }, [mode])

  return (
    <div>
      <div
        className={`transition-opacity duration-300 ${
          visibleGroup === 'edit' && !fadingGroup
            ? 'opacity-100 pointer-events-auto'
            : fadingGroup === 'edit'
              ? 'opacity-0 pointer-events-none'
              : 'opacity-0 pointer-events-none'
        }`}
      >
        {onEdit && mode === 'view' && (
          <button
            type="button"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={onEdit}
            disabled={!(visibleGroup === 'edit' && !fadingGroup)}
          >
            Edit
          </button>
        )}
      </div>

      <div
        className={`flex gap-2 flex-wrap transition-opacity duration-300 ${
          visibleGroup === 'action' && !fadingGroup
            ? 'opacity-100 pointer-events-auto'
            : fadingGroup === 'action'
              ? 'opacity-0 pointer-events-none'
              : 'opacity-0 pointer-events-none'
        }`}
      >
        {mode === 'edit' && (
          <>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 w-full sm:w-auto"
              disabled={saving}
              onClick={onSave}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            {onCancel && (
              <button
                type="button"
                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 w-full sm:w-auto"
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default FadeButtonGroup
