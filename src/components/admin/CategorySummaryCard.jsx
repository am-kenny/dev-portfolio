import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

// Reusable CategorySummaryCard component
const CategorySummaryCard = ({
  category,
  categorySkills,
  variant = 'predefined',
}) => {
  const isHierarchical = Array.isArray(categorySkills) ? false : true
  const subcategories = isHierarchical ? Object.keys(categorySkills) : []
  const totalSkills = isHierarchical
    ? Object.values(categorySkills).flat().length
    : categorySkills.length

  const [showAllSubcategories, setShowAllSubcategories] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [visibleCount, setVisibleCount] = useState(
    Math.min(subcategories.length, 5)
  )
  const subcategoriesRef = useRef(null)
  const lastCalculatedCountRef = useRef(Math.min(subcategories.length, 5))
  const tooltipTriggerRef = useRef(null)

  const getVariantStyles = () => {
    switch (variant) {
      case 'predefined':
        return {
          container:
            'bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md border border-blue-200 dark:border-blue-700 transition-colors duration-300',
          title:
            'font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300',
          subcategory:
            'inline-block bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs mr-1 flex-shrink-0 transition-colors duration-300',
        }
      case 'custom':
        return {
          container:
            'bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-md border border-yellow-200 dark:border-yellow-700 transition-colors duration-300',
          title:
            'font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300',
          subcategory:
            'inline-block bg-yellow-100 dark:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded text-xs mr-1 flex-shrink-0 transition-colors duration-300',
        }
      case 'available':
        return {
          container:
            'bg-gray-50 dark:bg-gray-800 p-2 rounded-md transition-colors duration-300',
          title:
            'font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300',
          subcategory:
            'inline-block bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs mr-1 flex-shrink-0 transition-colors duration-300',
        }
      default:
        return {
          container:
            'bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md border border-blue-200 dark:border-blue-700 transition-colors duration-300',
          title:
            'font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300',
          subcategory:
            'inline-block bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs mr-1 flex-shrink-0 transition-colors duration-300',
        }
    }
  }

  const styles = getVariantStyles()

  // Function to check if subcategories fit in one line
  const checkFit = useCallback(() => {
    if (!subcategoriesRef.current || subcategories.length === 0) return

    const container = subcategoriesRef.current
    const containerWidth = container.offsetWidth
    const subcategoryElements = container.querySelectorAll(
      'span[data-subcategory]'
    )

    // Estimate width for "+X more" indicator (approximate based on typical text length)
    const moreIndicatorWidth = 80 // Approximate width for "+X more" text
    const margin = 4 // mr-1 = 4px

    let totalWidth = 0
    let fitCount = 0

    for (let i = 0; i < subcategoryElements.length; i++) {
      const element = subcategoryElements[i]
      const elementWidth = element.offsetWidth

      // Check if adding this element plus the "+X more" indicator would fit
      if (
        totalWidth + elementWidth + margin + moreIndicatorWidth <=
        containerWidth
      ) {
        totalWidth += elementWidth + margin
        fitCount++
      } else {
        break
      }
    }

    // Only update if the count actually changed
    if (fitCount !== lastCalculatedCountRef.current) {
      setVisibleCount(fitCount)
      lastCalculatedCountRef.current = fitCount
    }
  }, [subcategories.length])

  useEffect(() => {
    // Use setTimeout to ensure DOM is rendered
    const timer = setTimeout(() => {
      checkFit()
    }, 100)

    window.addEventListener('resize', checkFit)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkFit)
    }
  }, [subcategories.length, checkFit])

  return (
    <div className={styles.container}>
      <div className="flex justify-between items-start mb-2">
        <h5 className={styles.title}>{category}</h5>
        <div
          className={`text-xs px-2 py-1 rounded font-medium transition-colors duration-300 ${
            isHierarchical
              ? 'bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {isHierarchical ? 'Hierarchical' : 'Flat'}
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
        <div className="mb-0.5">
          <span className="font-medium">Total Skills:</span> {totalSkills}
        </div>
        {isHierarchical && subcategories.length > 0 ? (
          <div>
            <span className="font-medium">Subcategories:</span>
            <div
              className="mt-1 flex flex-nowrap overflow-hidden w-full"
              ref={subcategoriesRef}
            >
              {subcategories
                .slice(
                  0,
                  showAllSubcategories ? subcategories.length : visibleCount
                )
                .map((subcategory) => (
                  <span
                    key={subcategory}
                    className={styles.subcategory}
                    data-subcategory
                  >
                    {subcategory} ({categorySkills[subcategory].length})
                  </span>
                ))}
              {!showAllSubcategories &&
                visibleCount < subcategories.length &&
                (showAllSubcategories ? (
                  <button
                    onClick={() => setShowAllSubcategories(false)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline ml-1 transition-colors duration-300"
                  >
                    Show less
                  </button>
                ) : (
                  <span
                    ref={tooltipTriggerRef}
                    className={`${styles.subcategory} cursor-help`}
                    style={{ cursor: 'help' }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    +{subcategories.length - visibleCount} more
                  </span>
                ))}
            </div>
            {showTooltip &&
              tooltipTriggerRef.current &&
              createPortal(
                <div
                  className="fixed z-[9999] bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg max-w-md min-w-xs"
                  style={{
                    left:
                      tooltipTriggerRef.current.getBoundingClientRect().left +
                      tooltipTriggerRef.current.offsetWidth / 2,
                    top:
                      tooltipTriggerRef.current.getBoundingClientRect().top -
                      12,
                    transform: 'translateX(-50%) translateY(-100%)',
                  }}
                >
                  <div className="font-medium mb-2">All subcategories:</div>
                  <div className="space-y-1">
                    {subcategories.slice(visibleCount).map((subcategory) => (
                      <div
                        key={subcategory}
                        className="flex justify-between items-center"
                      >
                        <span className="truncate mr-2 flex-1">
                          {subcategory}
                        </span>
                        <span className="text-gray-300 flex-shrink-0">
                          ({categorySkills[subcategory].length})
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>,
                document.body
              )}
          </div>
        ) : (
          <div className="mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 italic transition-colors duration-300">
              No subcategories
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategorySummaryCard
