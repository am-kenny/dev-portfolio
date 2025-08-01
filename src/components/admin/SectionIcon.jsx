import { FaUser, FaInfoCircle, FaBriefcase, FaProjectDiagram, FaEnvelope, FaTools } from 'react-icons/fa';

const sectionIcons = {
  personalInfo: <FaUser className="text-blue-500 w-7 h-7" />,
  about: <FaInfoCircle className="text-green-500 w-7 h-7" />,
  skills: <FaTools className="text-indigo-500 w-7 h-7" />,
  experience: <FaBriefcase className="text-yellow-500 w-7 h-7" />,
  projects: <FaProjectDiagram className="text-purple-500 w-7 h-7" />,
  contact: <FaEnvelope className="text-pink-500 w-7 h-7" />,
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