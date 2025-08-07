import { usePortfolio } from '../../context/PortfolioContext';
import { formatEnumValue } from '../../utils/formatters';

const Skills = () => {
  const { data, loading } = usePortfolio();
  
  if (loading || !data) {
    return (
      <section className="py-12 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  const { skills } = data;

  // Helper function to get level color
  const getLevelStyles = (level) => {
    switch (level) {
      case 'expert':
        return {
          color: 'text-purple-700',
          bg: 'bg-purple-100',
          border: 'border-purple-200'
        };
      case 'advanced':
        return {
          color: 'text-green-700',
          bg: 'bg-green-100',
          border: 'border-green-200'
        };
      case 'intermediate':
        return {
          color: 'text-blue-700',
          bg: 'bg-blue-100',
          border: 'border-blue-200'
        };
      case 'beginner':
        return {
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        };
      default:
        return {
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        };
    }
  };

  // Helper function to render skills as tags
  const renderSkillTags = (skills) => {
    if (Array.isArray(skills)) {
      // Flat structure
      return (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => {
            const levelStyles = getLevelStyles(skill.level);
            return (
              <div 
                key={index} 
                className={`group relative inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${levelStyles.bg} ${levelStyles.color} ${levelStyles.border} hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <span className="transition-all duration-300">{skill.name}</span>
                                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none bg-white shadow-lg rounded-lg px-2 py-1 text-xs border">
                    {formatEnumValue(skill.level)}
                  </span>
              </div>
            );
          })}
        </div>
      );
    } else {
      // Hierarchical structure with subcategories
      return Object.entries(skills).map(([subcategory, subcategorySkills]) => (
        <div key={subcategory} className="mb-3">
          <h5 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            {subcategory}
          </h5>
          <div className="flex flex-wrap gap-2">
            {subcategorySkills.map((skill, index) => {
              const levelStyles = getLevelStyles(skill.level);
              return (
                <div 
                  key={index} 
                  className={`group relative inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${levelStyles.bg} ${levelStyles.color} ${levelStyles.border} hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                  <span className="transition-all duration-300">{skill.name}</span>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none bg-white shadow-lg rounded-lg px-2 py-1 text-xs border">
                    {formatEnumValue(skill.level)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ));
    }
  };

  return (
    <section id="skills" className="py-12 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
              Skills & Technologies
            </h2>
            <p className="text-sm text-gray-600">
              Technical expertise and proficiency levels
            </p>
          </div>

          {/* Skills - Single column with flexible sizing */}
          <div className="space-y-4">
            {Object.entries(skills?.skillCategories || {}).map(([category, categorySkills]) => (
              <div 
                key={category} 
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20"
              >
                {/* Category header */}
                <div className="mb-3">
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">
                    {category}
                  </h4>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                
                {/* Skills tags */}
                <div>
                  {renderSkillTags(categorySkills)}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
              <span className="text-xs font-medium text-gray-600">Proficiency:</span>
              <div className="flex items-center space-x-2">
                {['expert', 'advanced', 'intermediate', 'beginner'].map((level) => {
                  let legendColor;
                  switch (level) {
                    case 'expert':
                      legendColor = 'bg-purple-400 border-purple-500';
                      break;
                    case 'advanced':
                      legendColor = 'bg-green-400 border-green-500';
                      break;
                    case 'intermediate':
                      legendColor = 'bg-blue-400 border-blue-500';
                      break;
                    case 'beginner':
                      legendColor = 'bg-gray-400 border-gray-500';
                      break;
                    default:
                      legendColor = 'bg-gray-400 border-gray-500';
                  }
                  return (
                    <div key={level} className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${legendColor}`}></div>
                      <span className="text-xs font-medium text-gray-600 capitalize">
                        {formatEnumValue(level)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills; 