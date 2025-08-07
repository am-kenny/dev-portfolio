import { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import AdminHeader from '../components/admin/AdminHeader';
import AdminBackground from '../components/admin/AdminBackground';
import AdminLoadingState from '../components/admin/AdminLoadingState';
import SectionRenderer from '../components/admin/SectionRenderer';
import SectionIcon from '../components/admin/SectionIcon';
import EditableSectionCard from '../components/common/EditableSectionCard';
import AnimatedSectionWrapper from '../components/common/AnimatedSectionWrapper';
import LinkedInImport from '../components/admin/LinkedInImport';
import SkillsStructureManager from '../components/admin/SkillsStructureManager';
import { FaLinkedin, FaChevronRight, FaCogs } from 'react-icons/fa';

export const Admin = () => {
  const { data, loading, error, sectionLoading, handleLogout, handleSectionSave, refreshData } = useAdmin();
  const [showLinkedInImport, setShowLinkedInImport] = useState(false);
  const [showSkillsStructure, setShowSkillsStructure] = useState(false);

  // Show loading or error state
  if (loading || error) {
    return <AdminLoadingState loading={loading} error={error} />;
  }

  const handleLinkedInImport = () => {
    // Refresh the data after successful import
    refreshData && refreshData();
  };

  return (
    <div className="min-h-screen relative pb-10">
      <AdminBackground />
      
      <AdminHeader onLogout={handleLogout} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        <div className="flex flex-col gap-3 overflow-hidden mb-8">
          {Object.entries(data || {}).map(([section, sectionData]) => {
            const { renderView, renderForm } = SectionRenderer({ section });

            return (
              <EditableSectionCard
                key={section}
                section={<SectionIcon section={section} />}
                data={sectionData}
                loading={sectionLoading[section]}
                onSave={(newData) => handleSectionSave(section, newData)}
                renderView={renderView}
                renderForm={renderForm}
              />
            );
          })}
        </div>

        {/* Skills Structure Management Section */}
        <AnimatedSectionWrapper
          isExpanded={showSkillsStructure}
          onToggle={() => setShowSkillsStructure(!showSkillsStructure)}
          header={
            <>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <FaCogs className="text-purple-600 w-6 h-6" />
                  <h2 className="text-xl font-semibold text-gray-900">Skills Structure Management</h2>
                </div>
                <p className="text-sm text-gray-600">Configure skill categorization and LinkedIn import settings</p>
              </div>
              <div className={`transition-transform duration-200 ${showSkillsStructure ? 'rotate-90' : ''}`}>
                <FaChevronRight className="text-gray-400" />
              </div>
            </>
          }
        >
          <SkillsStructureManager />
        </AnimatedSectionWrapper>

        {/* LinkedIn Import Section */}
        <AnimatedSectionWrapper
          isExpanded={showLinkedInImport}
          onToggle={() => setShowLinkedInImport(!showLinkedInImport)}
          header={
            <>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <FaLinkedin className="text-blue-600 w-6 h-6" />
                  <h2 className="text-xl font-semibold text-gray-900">LinkedIn Import</h2>
                </div>
                <p className="text-sm text-gray-600">Import your LinkedIn data to automatically populate your portfolio</p>
              </div>
              <div className={`transition-transform duration-200 ${showLinkedInImport ? 'rotate-90' : ''}`}>
                <FaChevronRight className="text-gray-400" />
              </div>
            </>
          }
        >
          <LinkedInImport onImport={handleLinkedInImport} />
        </AnimatedSectionWrapper>
      </main>
    </div>
  );
};

export default Admin; 