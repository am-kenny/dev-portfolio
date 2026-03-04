import { useState, useRef, useEffect } from 'react'

const AnimatedSectionWrapper = ({
  children,
  isExpanded,
  onToggle,
  header,
  className = '',
}) => {
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef(null)

  // Calculate content height when expanded
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [isExpanded])

  // Recalculate height when content changes
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        setContentHeight(contentRef.current.scrollHeight)
      })

      resizeObserver.observe(contentRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [isExpanded])

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={onToggle}
      >
        {header}
      </div>

      {/* Animated Content */}
      <div
        className="border-t border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
        style={{
          maxHeight: isExpanded ? contentHeight : 0,
          opacity: isExpanded ? 1 : 0,
          transition:
            'max-height var(--theme-transition-duration) var(--theme-transition-easing), opacity var(--theme-transition-duration) var(--theme-transition-easing), border-color var(--theme-transition-duration) var(--theme-transition-easing)',
          willChange: 'max-height, opacity',
        }}
      >
        <div ref={contentRef} className="pt-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AnimatedSectionWrapper
