import { useEffect, useState } from 'react';

const BUTTON_TRANSITION = 250; // ms

const FadeButtonGroup = ({ mode, onEdit, onSave, onCancel, loading, disabled, saving }) => {
  const [visibleGroup, setVisibleGroup] = useState(mode === 'view' ? 'edit' : 'action');
  const [fadingGroup, setFadingGroup] = useState(null);

  useEffect(() => {
    if (mode === 'view' && visibleGroup === 'action') {
      setFadingGroup('action');
      setTimeout(() => {
        setVisibleGroup('edit');
        setFadingGroup('edit');
        setTimeout(() => setFadingGroup(null), BUTTON_TRANSITION);
      }, BUTTON_TRANSITION);
    } else if (mode === 'edit' && visibleGroup === 'edit') {
      setFadingGroup('edit');
      setTimeout(() => {
        setVisibleGroup('action');
        setFadingGroup('action');
        setTimeout(() => setFadingGroup(null), BUTTON_TRANSITION);
      }, BUTTON_TRANSITION);
    }
    // eslint-disable-next-line
  }, [mode]);

  return (
    <>
      <div>
        {/* Edit button (view mode) */}
        <div className={`transition-opacity duration-300 ${visibleGroup === 'edit' && !fadingGroup ? 'opacity-100 pointer-events-auto' : (fadingGroup === 'edit' ? 'opacity-0 pointer-events-none' : 'opacity-0 pointer-events-none')}`}>
          {onEdit && mode === 'view' && (
            <button
              type="button"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              onClick={onEdit}
              disabled={visibleGroup === 'edit' && !fadingGroup ? false : true}
            >
              Edit
            </button>
          )}
        </div>
        {/* Save/Cancel buttons (edit mode) */}
        <div className={`flex gap-2 flex-wrap transition-opacity duration-300 ${visibleGroup === 'action' && !fadingGroup ? 'opacity-100 pointer-events-auto' : (fadingGroup === 'action' ? 'opacity-0 pointer-events-none' : 'opacity-0 pointer-events-none')}`}>
          {mode === 'edit' && (
            <>
              <button
                type="submit"
                className={"bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"}
                disabled={saving}
                onClick={onSave}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              {onCancel && (
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 border border-gray-300 w-full sm:w-auto"
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
    </>
  );
};

export default FadeButtonGroup; 