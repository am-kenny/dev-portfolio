import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Debug from './pages/Debug'
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext'
import ApiHealthWrapper from './components/common/ApiHealthWrapper'
import ThemeToggle from './components/common/ThemeToggle'
import Hero from './components/portfolio/Hero'
import About from './components/portfolio/About'
import Skills from './components/portfolio/Skills'
import Experience from './components/portfolio/Experience'
import Projects from './components/portfolio/Projects'
import Contact from './components/portfolio/Contact'
import Footer from './components/portfolio/Footer'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageTitles } from './constants/titleMap'

const PortfolioWithApiCheck = () => {
  const { refreshData } = usePortfolio();
  return (
    <ApiHealthWrapper onApiRecovered={refreshData}>
      <>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <Portfolio />
      </>
    </ApiHealthWrapper>
  );
};

const PageTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    const title = pageTitles[location.pathname] || pageTitles['/'];
    document.title = title;
  }, [location.pathname]);
  
  return null;
};



const Portfolio = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
};

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <PageTitle />
        <Routes>
          <Route path="/" element={<PortfolioWithApiCheck />} />
          <Route path="/admin/login" element={
            <ApiHealthWrapper>
              <AdminLogin />
            </ApiHealthWrapper>
          } />
          <Route path="/admin" element={
            <ApiHealthWrapper>
              <Admin />
            </ApiHealthWrapper>
          } />
          <Route path="/debug" element={
            <ApiHealthWrapper>
              <Debug />
            </ApiHealthWrapper>
          } />
        </Routes>
      </Router>
    </PortfolioProvider>
  )
}

export default App
