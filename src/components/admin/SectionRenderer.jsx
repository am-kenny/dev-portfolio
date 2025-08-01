import PersonalInfoForm from './PersonalInfoForm';
import AboutConfigForm from './AboutConfigForm';
import SkillsConfigForm from './SkillsConfigForm';
import ExperienceConfigForm from './ExperienceConfigForm';
import ProjectsConfigForm from './ProjectsConfigForm';
import ContactConfigForm from './ContactConfigForm';

// Placeholder components for sections without specific forms
const SectionView = ({ data, onEdit }) => (
  <div>
    <pre className="bg-gray-50 p-4 rounded-md overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    {onEdit && (
      <button
        type="button"
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        onClick={onEdit}
      >
        Edit
      </button>
    )}
  </div>
);

const SectionForm = ({ data, onSave, onCancel, loading }) => (
  <div>
    <div className="mb-2 text-gray-500">Editing not implemented yet.</div>
    <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={onCancel}>Cancel</button>
  </div>
);

const SectionRenderer = ({ section }) => {
  const renderView = (props) => {
    switch (section) {
      case 'personalInfo':
        return <PersonalInfoForm initialData={props.data} disabled={true} onEdit={props.onEdit} />;
      case 'about':
        return <AboutConfigForm initialData={props.data} disabled={true} onEdit={props.onEdit} />;
      case 'skills':
        return <SkillsConfigForm initialData={props.data} disabled={true} onEdit={props.onEdit} onContentChange={props.onContentChange} />;
      case 'experience':
        return <ExperienceConfigForm initialData={props.data} disabled={true} onEdit={props.onEdit} onContentChange={props.onContentChange} />;
      case 'projects':
        return <ProjectsConfigForm initialData={props.data} disabled={true} onEdit={props.onEdit} />;
      case 'contact':
        return <ContactConfigForm initialData={props.data} disabled={true} onEdit={props.onEdit} onContentChange={props.onContentChange} />;
      default:
        return <SectionView {...props} />;
    }
  };

  const renderForm = (props) => {
    switch (section) {
      case 'personalInfo':
        return <PersonalInfoForm initialData={props.data} onSave={props.onSave} onCancel={props.onCancel} loading={props.loading} disabled={false} />;
      case 'about':
        return <AboutConfigForm initialData={props.data} onSave={props.onSave} onCancel={props.onCancel} loading={props.loading} disabled={false} />;
      case 'skills':
        return <SkillsConfigForm initialData={props.data} onSave={props.onSave} onCancel={props.onCancel} loading={props.loading} disabled={false} onContentChange={props.onContentChange} />;
      case 'experience':
        return <ExperienceConfigForm initialData={props.data} onSave={props.onSave} onCancel={props.onCancel} loading={props.loading} disabled={false} onContentChange={props.onContentChange} />;
      case 'projects':
        return <ProjectsConfigForm initialData={props.data} onSave={props.onSave} onCancel={props.onCancel} loading={props.loading} disabled={false} />;
      case 'contact':
        return <ContactConfigForm initialData={props.data} onSave={props.onSave} onCancel={props.onCancel} loading={props.loading} disabled={false} onContentChange={props.onContentChange} />;
      default:
        return <SectionForm {...props} />;
    }
  };

  return { renderView, renderForm };
};

export default SectionRenderer; 