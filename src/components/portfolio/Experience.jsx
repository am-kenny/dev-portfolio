import { usePortfolio } from '../../context/PortfolioContext';
import { formatEnumValue } from '../../utils/formatters';

const Experience = () => {
  const { data, loading } = usePortfolio();
  
  if (loading || !data) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-lg text-gray-400 dark:text-gray-500">Loading...</div>
        </div>
      </section>
    );
  }
  
  const { experience } = data;

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">Experience</h2>
        <div className="max-w-4xl mx-auto">
          {experience?.jobs?.map((job, index) => (
            <div 
              key={index} 
              className={`relative pl-8 ${
                index !== experience.jobs.length - 1 ? 'pb-12' : ''
              }`}
            >
              {/* Timeline line */}
              {index !== experience.jobs.length - 1 && (
                <div className="absolute left-[11px] top-6 w-0.5 h-full bg-blue-200 dark:bg-blue-800"></div>
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-5 h-5 rounded-full border-4 border-blue-500 bg-white dark:bg-gray-900"></div>
              
              {/* Content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{job.title}</h3>
                    <div className="text-blue-600 dark:text-blue-400 font-semibold">{job.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600 dark:text-gray-400">
                      {job.startDate}
                      {job.isCurrent ? ' - Present' : job.endDate ? ` - ${job.endDate}` : ''}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {formatEnumValue(job.location)}
                      {job.city && job.country ? ` • ${job.city}, ${job.country}` : ''}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{job.description}</p>
                
                {job.achievements?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Key Achievements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {job.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!experience?.jobs || experience.jobs.length === 0) && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No experience entries yet. Add some from the admin panel!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience; 