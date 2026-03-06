import { useState, useLayoutEffect, useCallback, type ReactNode } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import AnimatedSectionWrapper from './AnimatedSectionWrapper'

const BUTTON_TRANSITION = 150

export interface EditableSectionRenderViewProps<TData> {
  data: TData
  onEdit: () => void
  onContentChange: () => void
}

export interface EditableSectionRenderFormProps<TData> {
  data: TData
  onSave: (formData: TData) => Promise<void> | void
  onCancel: () => void
  loading?: boolean
  onContentChange: () => void
}

// TODO: Tighten generics so SectionRenderer (and other callers) can pass typed
// onSave without casting; renderForm currently uses TData=unknown at call sites.
export interface EditableSectionCardProps<TData = unknown> {
  section: ReactNode
  data: TData
  renderView: (args: EditableSectionRenderViewProps<TData>) => ReactNode
  renderForm: (args: EditableSectionRenderFormProps<TData>) => ReactNode
  onSave: (newData: TData) => Promise<void> | void
  loading?: boolean
}

const EditableSectionCard = <TData,>({
  section,
  data,
  renderView,
  renderForm,
  onSave,
  loading,
}: EditableSectionCardProps<TData>): JSX.Element => {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [_contentChangeTrigger, setContentChangeTrigger] = useState(0)
  const [_showActionBtns, setShowActionBtns] = useState(false)

  const handleContentChange = useCallback(() => {
    setContentChangeTrigger((prev) => prev + 1)
  }, [])

  useLayoutEffect(() => {
    if (editing) {
      window.setTimeout(() => setShowActionBtns(true), BUTTON_TRANSITION)
    } else {
      setShowActionBtns(false)
    }
  }, [editing])

  const handleEdit = (): void => setEditing(true)
  const handleCancel = (): void => setEditing(false)
  const handleExpand = (): void => setExpanded((prev) => !prev)

  const handleSave = async (formData: TData): Promise<void> => {
    await onSave(formData)
    setEditing(false)
  }

  return (
    <AnimatedSectionWrapper
      isExpanded={expanded}
      onToggle={handleExpand}
      header={
        <>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold capitalize text-gray-900 dark:text-gray-100">
              {section}
            </h2>
          </div>
          <div
            className={`transition-transform duration-300 ease ${
              expanded ? 'rotate-90' : ''
            }`}
          >
            <FaChevronRight className="text-gray-400" />
          </div>
        </>
      }
    >
      <div className="relative min-h-[56px]">
        {editing ? (
          <>
            {renderForm({
              data,
              onSave: handleSave,
              onCancel: handleCancel,
              loading,
              onContentChange: handleContentChange,
            })}
          </>
        ) : (
          <>
            {renderView({
              data,
              onEdit: handleEdit,
              onContentChange: handleContentChange,
            })}
          </>
        )}
      </div>
    </AnimatedSectionWrapper>
  )
}

export default EditableSectionCard
