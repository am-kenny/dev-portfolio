import { usePortfolio } from '../../context/PortfolioContext';

const About = () => {
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
  
  const { about } = data;

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">About Me</h2>
          <p className="text-lg text-gray-600 mb-12">
            {about.content}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About; 