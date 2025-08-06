import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import AnimatedSectionWrapper from './AnimatedSectionWrapper.jsx';

const BUTTON_TRANSITION = 150;



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
  const [contentChangeTrigger, setContentChangeTrigger] = useState(0);
  const [showActionBtns, setShowActionBtns] = useState(false);

  // Handle content changes from child components - memoized to prevent infinite loops
  const handleContentChange = useCallback(() => {
    setContentChangeTrigger(prev => prev + 1);
  }, []);

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
    <AnimatedSectionWrapper
      isExpanded={expanded}
      onToggle={handleExpand}
      header={
        <>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold capitalize text-gray-900">{section}</h2>
          </div>
          <div className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
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
              onContentChange: handleContentChange
            })}
          </>
        ) : (
          <>
            {renderView({ data, onEdit: handleEdit, onContentChange: handleContentChange })}
          </>
        )}
      </div>
    </AnimatedSectionWrapper>
  );
};

export default EditableSectionCard; 