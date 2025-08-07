import { useState, useEffect } from 'react';
import config from '../../services/config.js';
import { authService } from '../../services/auth.js';

const LinkedInImport = ({ onImport }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState('upload'); // 'upload', 'preview', 'success'



  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setError('');
  };

  const handlePreview = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select CSV files');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = authService.getToken();
      const formData = new FormData();
      
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(config.getApiUrl('/api/linkedin/preview-csv'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to preview CSV data');
      }

      const result = await response.json();
      setPreviewData(result.portfolioData);
      setStep('preview');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setError('');

    try {
      const token = authService.getToken();
      const formData = new FormData();
      
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(config.getApiUrl('/api/linkedin/upload-csv'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import CSV data');
      }

      const result = await response.json();
      setSuccess(`Successfully imported data from ${result.fileCount} files to ${result.sections.join(', ')} sections`);
      setStep('success');
      onImport && onImport();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const resetForm = () => {
    setSelectedFiles([]);
    setPreviewData(null);
    setError('');
    setSuccess('');
    setStep('upload');
  };

  // Helper function to render skills preview
  const renderSkillsPreview = (skills) => {
    if (!skills || !skills.skillCategories) return null;

    return (
      <div className="space-y-2">
        {Object.entries(skills.skillCategories).map(([category, categorySkills]) => (
          <div key={category} className="border-l-2 border-blue-200 pl-3">
            <h6 className="text-sm font-medium text-gray-700">{category}</h6>
            {Array.isArray(categorySkills) ? (
              // Flat structure
              <div className="text-xs text-gray-600 ml-2">
                {categorySkills.length} skills
              </div>
            ) : (
              // Hierarchical structure
              <div className="text-xs text-gray-600 ml-2">
                {Object.entries(categorySkills).map(([subcategory, subcategorySkills]) => (
                  <div key={subcategory}>
                    {subcategory}: {subcategorySkills.length} skills
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (step === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Import Successful!</h3>
          </div>
        </div>
        <p className="text-sm text-green-700 mb-4">{success}</p>
        <button
          onClick={resetForm}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Import More Files
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn CSV Import</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload your LinkedIn CSV export files. The system will automatically parse and import your data with smart skill categorization.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Supported Files:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Profile.csv</strong> - Your basic profile information</li>
            <li>• <strong>Positions.csv</strong> - Your work experience</li>
            <li>• <strong>Skills.csv</strong> - Your skills and endorsements</li>
            <li>• <strong>Education.csv</strong> - Your educational background</li>
          </ul>
        </div>

        {/* Note about categorization settings */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Import Settings</h4>
          <p className="text-sm text-blue-700">
            LinkedIn imports will use the categorization settings configured in the <strong>Skills Structure Management</strong> section above.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV Files
            </label>
            <input
              type="file"
              multiple
              accept=".csv"
              onChange={handleFileSelect}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="text-sm text-gray-700 mt-1">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
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
              onClick={handlePreview}
              disabled={loading || selectedFiles.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Preview Data'}
            </button>
          </div>
        </div>
      )}

      {step === 'preview' && previewData && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Preview - Portfolio Data</h4>
            <div className="text-sm text-blue-700 space-y-2">
              {Object.entries(previewData).map(([section, data]) => (
                <div key={section} className="border-b border-blue-100 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{section}:</span>
                    <span>
                      {section === 'skills' ? (
                        <span className="text-purple-600">Smart categorization applied</span>
                      ) : Array.isArray(data) ? `${data.length} items` : 
                         typeof data === 'object' ? Object.keys(data).length + ' fields' : 
                         '1 field'}
                    </span>
                  </div>
                  {section === 'skills' && renderSkillsPreview(data)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleImport}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import to Portfolio'}
            </button>
            <button
              onClick={() => setStep('upload')}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Back to Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInImport; 