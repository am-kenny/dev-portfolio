import { usePortfolio } from '../../context/PortfolioContext';

const Projects = () => {
  const { data, loading } = usePortfolio();
  
  if (loading || !data) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="col-span-full text-center text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }
  
  const { projects } = data;

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">My Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.projects?.map((project, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4">
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-blue-500 hover:text-blue-600 font-semibold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project →
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      className="text-gray-500 hover:text-gray-600 font-semibold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(!projects?.projects || projects.projects.length === 0) && (
            <div className="col-span-full text-center text-gray-500">
              No projects added yet. Add some from the admin panel!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects; 