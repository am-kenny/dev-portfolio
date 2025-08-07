import { usePortfolio } from '../../context/PortfolioContext';
import { formatEnumValue } from '../../utils/formatters';

const Skills = () => {
  const { data, loading } = usePortfolio();
  
  if (loading || !data) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-lg text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }
  
  const { skills } = data;

  // Helper function to render skills (handles both flat and hierarchical)
  const renderSkills = (skills) => {
    if (Array.isArray(skills)) {
      // Flat structure
      return skills.map((skill, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-gray-800">{skill.name}</span>
          <span className={`text-sm px-3 py-1 rounded-full ${
            skill.level === 'advanced' 
              ? 'bg-green-100 text-green-700'
              : skill.level === 'intermediate'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {formatEnumValue(skill.level)}
          </span>
        </div>
      ));
    } else {
      // Hierarchical structure with subcategories
      return Object.entries(skills).map(([subcategory, subcategorySkills]) => (
        <div key={subcategory} className="mb-4">
          <h5 className="text-sm font-medium text-gray-600 mb-2">{subcategory}</h5>
          <div className="space-y-2 ml-4">
            {subcategorySkills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-800">{skill.name}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  skill.level === 'advanced' 
                    ? 'bg-green-100 text-green-700'
                    : skill.level === 'intermediate'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {formatEnumValue(skill.level)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ));
    }
  };

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(skills?.skillCategories || {}).map(([category, categorySkills]) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-4 text-blue-600">{category}</h4>
                <div className="space-y-3">
                  {renderSkills(categorySkills)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills; 