import { lazy, Suspense, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

import CanvasBackground from './components/common/CanvasBackground'
import DataErrorPage from './components/common/DataErrorPage'
import SectionNav from './components/common/SectionNav'
import ThemeToggle from './components/common/ThemeToggle'
import About from './components/portfolio/About'
import Contact from './components/portfolio/Contact'
import Experience from './components/portfolio/Experience'
import Footer from './components/portfolio/Footer'
import Hero from './components/portfolio/Hero'
import Projects from './components/portfolio/Projects'
import Skills from './components/portfolio/Skills'
import { pageTitles } from './constants/titleMap'
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext'
import NotFound from './pages/NotFound'

const Debug =
  import.meta.env.VITE_APP_DEBUG === 'true'
    ? lazy(async () => import('./pages/Debug'))
    : null

const PortfolioLayout = (): JSX.Element => (
  <>
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>
    <SectionNav />
    <Portfolio />
  </>
)

const PortfolioWithDataCheck = (): JSX.Element => {
  const { loading, error, errorKind, refreshData } = usePortfolio()
  if (!loading && error) {
    return (
      <DataErrorPage
        message={error}
        isConfigError={errorKind === 'config'}
        onRetry={refreshData}
      />
    )
  }
  return <PortfolioLayout />
}

const PageTitle = (): null => {
  const location = useLocation()

  useEffect(() => {
    const title = pageTitles[location.pathname] ?? pageTitles['*']
    document.title = title
  }, [location.pathname])

  return null
}

const Portfolio = (): JSX.Element => (
  <main className="relative min-h-screen overflow-x-hidden text-slate-900 dark:text-slate-100">
    <CanvasBackground />
    <div className="relative z-10">
      <Hero /> {/* Cauising lag on theme change */}
      <About /> {/* Cauising lag on theme change */}
      <Skills /> {/* OK */}
      <Experience />
      <Projects /> {/* Cauising lag on theme change */}
      <Contact /> {/* Cauising lag on theme change */}
      <Footer /> {/* OK */}
    </div>
  </main>
)

function App(): JSX.Element {
  return (
    <PortfolioProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <PageTitle />
        <Routes>
          <Route path="/" element={<PortfolioWithDataCheck />} />
          <Route
            path="/debug"
            element={
              Debug ? (
                <Suspense fallback={null}>
                  <Debug />
                </Suspense>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </PortfolioProvider>
  )
}

export default App
