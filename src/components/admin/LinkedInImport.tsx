import { useState, type ChangeEvent } from 'react'
import config from '../../services/config'
import { authService } from '../../services/auth'

export interface LinkedInImportResult {
  fileCount: number
  sections: string[]
}

export interface LinkedInImportPreview {
  portfolioData: Record<string, unknown>
}

export interface LinkedInImportProps {
  onImport?: () => void
}

type Step = 'upload' | 'preview' | 'success'

const LinkedInImport = ({ onImport }: LinkedInImportProps): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewData, setPreviewData] = useState<LinkedInImportPreview | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [step, setStep] = useState<Step>('upload')

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files ?? [])
    setSelectedFiles(files)
    setError('')
  }

  const handlePreview = async (): Promise<void> => {
    if (selectedFiles.length === 0) {
      setError('Please select CSV files')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = authService.getToken()
      const formData = new FormData()

      selectedFiles.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch(
        config.getApiUrl('/api/linkedin/preview-csv'),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string }
        throw new Error(errorData.error || 'Failed to preview CSV data')
      }

      const result = (await response.json()) as LinkedInImportPreview
      setPreviewData(result)
      setStep('preview')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (): Promise<void> => {
    setLoading(true)
    setError('')

    try {
      const token = authService.getToken()
      const formData = new FormData()

      selectedFiles.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch(
        config.getApiUrl('/api/linkedin/upload-csv'),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string }
        throw new Error(errorData.error || 'Failed to import CSV data')
      }

      const result = (await response.json()) as LinkedInImportResult
      setSuccess(
        `Successfully imported data from ${result.fileCount} files to ${result.sections.join(', ')} sections`
      )
      setStep('success')
      if (onImport) onImport()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = (): void => {
    setSelectedFiles([])
    setPreviewData(null)
    setError('')
    setSuccess('')
    setStep('upload')
  }

  const renderSkillsPreview = (skills: unknown): JSX.Element | null => {
    if (
      !skills ||
      typeof skills !== 'object' ||
      !('skillCategories' in skills)
    ) {
      return null
    }

    const rawCategories = (skills as { skillCategories?: unknown })
      .skillCategories

    if (
      !rawCategories ||
      typeof rawCategories !== 'object' ||
      Array.isArray(rawCategories)
    ) {
      return null
    }

    const skillCategories = rawCategories as Record<string, unknown>

    return (
      <div className="space-y-2">
        {Object.entries(skillCategories).map(([category, categorySkills]) => (
          <div
            key={category}
            className="border-l-2 border-blue-200 dark:border-blue-700 pl-3"
          >
            <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {category}
            </h6>
            {Array.isArray(categorySkills) ? (
              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                {categorySkills.length} skills
              </div>
            ) : (
              <div className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                {Object.entries(
                  categorySkills as Record<string, unknown[]>
                ).map(([subcategory, subcategorySkills]) => (
                  <div key={subcategory}>
                    {subcategory}:{' '}
                    {Array.isArray(subcategorySkills)
                      ? subcategorySkills.length
                      : 0}{' '}
                    skills
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
              Import Successful!
            </h3>
          </div>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300 mb-4">
          {success}
        </p>
        <button
          onClick={resetForm}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Import More Files
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          LinkedIn CSV Import
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Upload your LinkedIn CSV export files. The system will automatically
          parse and import your data with smart skill categorization.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Supported Files:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>
              • <strong>Profile.csv</strong> - Your basic profile information
            </li>
            <li>
              • <strong>Positions.csv</strong> - Your work experience
            </li>
            <li>
              • <strong>Skills.csv</strong> - Your skills and endorsements
            </li>
            <li>
              • <strong>Education.csv</strong> - Your educational background
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Import Settings
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            LinkedIn imports will use the categorization settings configured in
            the <strong>Skills Structure Management</strong> section above.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select CSV Files
            </label>
            <input
              type="file"
              multiple
              accept=".csv"
              onChange={handleFileSelect}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              disabled={loading}
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selected files:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {selectedFiles.map((file) => (
                    <li key={file.name} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePreview}
              disabled={loading || selectedFiles.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Preview Data'}
            </button>
          </div>
        </div>
      )}

      {step === 'preview' && previewData && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              Preview - Portfolio Data
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              {Object.entries(previewData.portfolioData).map(
                ([section, data]) => (
                  <div
                    key={section}
                    className="border-b border-blue-100 dark:border-blue-800 pb-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{section}:</span>
                      <span>
                        {section === 'skills' ? (
                          <span className="text-purple-600">
                            Smart categorization applied
                          </span>
                        ) : Array.isArray(data) ? (
                          `${(data as unknown[]).length} items`
                        ) : typeof data === 'object' ? (
                          `${
                            Object.keys(data as Record<string, unknown>).length
                          } fields`
                        ) : (
                          '1 field'
                        )}
                      </span>
                    </div>
                    {section === 'skills' && renderSkillsPreview(data)}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleImport}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import to Portfolio'}
            </button>
            <button
              type="button"
              onClick={() => setStep('upload')}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
            >
              Back to Upload
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkedInImport
