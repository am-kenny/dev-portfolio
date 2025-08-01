import { useState, useRef, useLayoutEffect, useEffect } from 'react';

const Chevron = ({ expanded }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-90' : 'rotate-0'}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const BUTTON_TRANSITION = 250; // ms

const EditableSectionCard = ({
  section,
  data,
  renderView,
  renderForm,
  onSave,
  loading
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [showActionBtns, setShowActionBtns] = useState(false);
  const [contentChangeTrigger, setContentChangeTrigger] = useState(0);

  // ResizeObserver to handle dynamic content changes (e.g., adding/removing categories/skills)
  useEffect(() => {
    if (!expanded || !contentRef.current) return;
    const node = contentRef.current;
    const resizeObserver = new window.ResizeObserver(() => {
      setContentHeight(node.scrollHeight);
    });
    resizeObserver.observe(node);
    // Initial set
    setContentHeight(node.scrollHeight);
    return () => resizeObserver.disconnect();
  }, [expanded, editing, contentChangeTrigger]);

  // Fallback: recalculate height on data change (for React state changes not caught by ResizeObserver)
  useLayoutEffect(() => {
    if (expanded && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, editing, data, contentChangeTrigger]);

  // Handle content changes from child components
  const handleContentChange = () => {
    setContentChangeTrigger(prev => prev + 1);
    if (expanded && contentRef.current) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      }, 0);
    }
  };

  // Cross-fade logic for Save/Cancel buttons
  useLayoutEffect(() => {
    if (editing) {
      setTimeout(() => setShowActionBtns(true), BUTTON_TRANSITION);
    } else {
      setShowActionBtns(false);
    }
  }, [editing]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleExpand = () => setExpanded((prev) => !prev);

  const handleSave = async (formData) => {
    await onSave(formData);
    setEditing(false);
  };

  return (
    <div
      className={
        `relative group border border-gray-200 bg-white transition-all duration-300 ` +
        `hover:border-blue-200`
      }
      style={{ minHeight: expanded ? contentHeight + 60 : undefined, transition: 'min-height 0.3s cubic-bezier(0.4,0,0.2,1)' }}
    >
      <div className="flex justify-between items-center px-4 py-3 cursor-pointer select-none" onClick={handleExpand}>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold capitalize text-gray-800">{section}</h2>
        </div>
        <Chevron expanded={expanded} />
      </div>
      <div className="border-t border-gray-100 mx-4" />
      <div
        ref={contentRef}
        style={{
          maxHeight: expanded ? contentHeight : 0,
          opacity: expanded ? 1 : 0,
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
          willChange: 'max-height, opacity',
        }}
      >
        <div className="px-4 py-4 bg-white relative min-h-[56px]">
          {editing ? (
            <>
              {renderForm({
                data,
                onSave: handleSave,
                onCancel: handleCancel,
                loading,
                onContentChange: handleContentChange
              })}
            </>
          ) : (
            <>
              {renderView({ data, onEdit: handleEdit, onContentChange: handleContentChange })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableSectionCard; 