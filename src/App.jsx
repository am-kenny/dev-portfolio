import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import { PortfolioProvider } from './context/PortfolioContext'
import ApiHealthWrapper from './components/common/ApiHealthWrapper'
import Hero from './components/portfolio/Hero'
import About from './components/portfolio/About'
import Skills from './components/portfolio/Skills'
import Experience from './components/portfolio/Experience'
import Projects from './components/portfolio/Projects'
import Contact from './components/portfolio/Contact'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageTitles } from './constants/titleMap'

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
    <main className="min-h-screen">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </main>
  );
};

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <PageTitle />
        <Routes>
          <Route path="/" element={
            <ApiHealthWrapper>
              <Portfolio />
            </ApiHealthWrapper>
          } />
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
        </Routes>
      </Router>
    </PortfolioProvider>
  )
}

export default App
