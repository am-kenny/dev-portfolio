import { FaUser, FaInfoCircle, FaBriefcase, FaProjectDiagram, FaEnvelope, FaTools } from 'react-icons/fa';

const sectionIcons = {
  personalInfo: <FaUser className="text-blue-600 w-6 h-6" />,
  about: <FaInfoCircle className="text-green-600 w-6 h-6" />,
  skills: <FaTools className="text-indigo-600 w-6 h-6" />,
  experience: <FaBriefcase className="text-yellow-600 w-6 h-6" />,
  projects: <FaProjectDiagram className="text-purple-600 w-6 h-6" />,
  contact: <FaEnvelope className="text-pink-600 w-6 h-6" />,
};

const SectionIcon = ({ section }) => {
  const formatSectionName = (sectionName) => {
    return sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <span className="flex items-center gap-2">
      {sectionIcons[section] || ''}
      <span className="capitalize">{formatSectionName(section)}</span>
    </span>
  );
};

export default SectionIcon; 