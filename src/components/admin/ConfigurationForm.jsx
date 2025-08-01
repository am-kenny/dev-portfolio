import { useState, useEffect } from 'react';
import BaseConfigForm from './BaseConfigForm';
import { SkillLevels } from '../../constants/skillLevels';

const FieldTypes = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  EMAIL: 'email',
  URL: 'url',
  SELECT: 'select',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  SOCIAL_LINKS: 'social_links'
};

const ConfigurationForm = ({
  title,
  section,
  fields,
  initialData,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => {
      if (fieldName.includes('.')) {
        const [parent, child] = fieldName.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [fieldName]: value
      };
    });
  };

  const renderField = (field) => {
    const value = field.name.includes('.')
      ? formData[field.name.split('.')[0]]?.[field.name.split('.')[1]]
      : formData[field.name];

    switch (field.type) {
      case FieldTypes.TEXTAREA:
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={field.rows || 4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case FieldTypes.SELECT:
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={field.required}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case FieldTypes.SKILLS:
        return (
          <SkillsEditor
            skills={value || {}}
            onChange={(newSkills) => handleChange(field.name, newSkills)}
          />
        );

      case FieldTypes.PROJECTS:
        return (
          <ProjectsEditor
            projects={value || []}
            onChange={(newProjects) => handleChange(field.name, newProjects)}
          />
        );

      case FieldTypes.SOCIAL_LINKS:
        return (
          <SocialLinksEditor
            links={value || {}}
            onChange={(newLinks) => handleChange(field.name, newLinks)}
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(section, formData);
  };

  return (
    <BaseConfigForm title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            {field.description && (
              <p className="text-sm text-gray-500 mb-2">{field.description}</p>
            )}
            {renderField(field)}
          </div>
        ))}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </BaseConfigForm>
  );
};

// Sub-components for complex field types
const SkillsEditor = ({ skills, onChange }) => {
  const [newSkill, setNewSkill] = useState({ category: '', name: '', level: SkillLevels.INTERMEDIATE });

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.category) return;

    onChange({
      ...skills,
      [newSkill.category]: [
        ...(skills[newSkill.category] || []),
        { name: newSkill.name, level: newSkill.level }
      ]
    });

    setNewSkill(prev => ({ ...prev, name: '' }));
  };

  const handleRemoveSkill = (category, skillName) => {
    onChange({
      ...skills,
      [category]: skills[category].filter(skill => skill.name !== skillName)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={newSkill.category}
          onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
          placeholder="Category"
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <input
          type="text"
          value={newSkill.name}
          onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Skill name"
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <select
          value={newSkill.level}
          onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
          className="px-3 py-2 border rounded-lg"
        >
          <option value={SkillLevels.BEGINNER}>Beginner</option>
          <option value={SkillLevels.INTERMEDIATE}>Intermediate</option>
          <option value={SkillLevels.ADVANCED}>Advanced</option>
          <option value={SkillLevels.EXPERT}>Expert</option>
        </select>
        <button
          type="button"
          onClick={handleAddSkill}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Add
        </button>
      </div>

      {Object.entries(skills).map(([category, categorySkills]) => (
        <div key={category} className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">{category}</h4>
          <div className="space-y-2">
            {categorySkills.map((skill, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>{skill.name} - {skill.level}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(category, skill.name)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProjectsEditor = ({ projects, onChange }) => {
  const [editingProject, setEditingProject] = useState({
    title: '',
    description: '',
    tech: [],
    image: '',
    link: '',
    github: ''
  });

  const handleAddProject = () => {
    if (!editingProject.title) return;
    onChange([...projects, { ...editingProject }]);
    setEditingProject({
      title: '',
      description: '',
      tech: [],
      image: '',
      link: '',
      github: ''
    });
  };

  const handleRemoveProject = (index) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 space-y-4">
        <input
          type="text"
          value={editingProject.title}
          onChange={(e) => setEditingProject(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Project title"
          className="w-full px-3 py-2 border rounded-lg"
        />
        <textarea
          value={editingProject.description}
          onChange={(e) => setEditingProject(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Project description"
          className="w-full px-3 py-2 border rounded-lg"
        />
        <button
          type="button"
          onClick={handleAddProject}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Add Project
        </button>
      </div>

      {projects.map((project, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between">
            <h4 className="font-medium">{project.title}</h4>
            <button
              type="button"
              onClick={() => handleRemoveProject(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
          <p className="text-gray-600">{project.description}</p>
        </div>
      ))}
    </div>
  );
};

const SocialLinksEditor = ({ links, onChange }) => {
  const handleChange = (platform, value) => {
    onChange({
      ...links,
      [platform]: value
    });
  };

  return (
    <div className="space-y-4">
      {Object.entries(links).map(([platform, url]) => (
        <div key={platform}>
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {platform}
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => handleChange(platform, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder={`Enter your ${platform} URL`}
          />
        </div>
      ))}
    </div>
  );
};

export { ConfigurationForm, FieldTypes }; 