import { scrollToSection } from "../../utils/scroll";
import { usePortfolio } from '../../context/PortfolioContext';

const Hero = () => {
  const { data, loading } = usePortfolio();
  
  if (loading || !data) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-2xl">Loading...</div>
      </section>
    );
  }
  
  const { personalInfo } = data;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Hi, I'm <span className="text-blue-500">{personalInfo?.name}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            {personalInfo?.title}
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition duration-300"
            >
              View My Work
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className="border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold transition duration-300"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 