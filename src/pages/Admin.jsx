import { useAdmin } from '../hooks/useAdmin';
import AdminHeader from '../components/admin/AdminHeader';
import AdminBackground from '../components/admin/AdminBackground';
import AdminLoadingState from '../components/admin/AdminLoadingState';
import SectionRenderer from '../components/admin/SectionRenderer';
import SectionIcon from '../components/admin/SectionIcon';
import EditableSectionCard from '../components/common/EditableSectionCard';

export const Admin = () => {
  const { data, loading, error, sectionLoading, handleLogout, handleSectionSave } = useAdmin();

  // Show loading or error state
  if (loading || error) {
    return <AdminLoadingState loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen relative pb-10">
      <AdminBackground />
      
      <AdminHeader onLogout={handleLogout} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="p-0 sm:p-2 flex flex-col gap-1 overflow-hidden">
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
      </main>
    </div>
  );
};

export default Admin; 