import { useEffect, lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
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
import { pageTitles } from './constants/titleMap'
import { isAdminEnabled } from './services/dataSource'
import DataErrorPage from './components/common/DataErrorPage'
import NotFound from './pages/NotFound'
import type { ReactNode } from 'react'

const Debug =
  import.meta.env.VITE_APP_DEBUG === 'true'
    ? lazy(async () => import('./pages/Debug'))
    : null

const PortfolioLayout = (): JSX.Element => (
  <>
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>
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
  const content = <PortfolioLayout />
  if (isAdminEnabled()) {
    return (
      <ApiHealthWrapper onApiRecovered={refreshData}>
        {content}
      </ApiHealthWrapper>
    )
  }
  return content
}

const PageTitle = (): null => {
  const location = useLocation()

  useEffect(() => {
    const title = pageTitles[location.pathname] || pageTitles['/']
    document.title = title
  }, [location.pathname])

  return null
}

const Portfolio = (): JSX.Element => (
  <main className="min-h-screen bg-white dark:bg-gray-900">
    <Hero />
    <About />
    <Skills />
    <Experience />
    <Projects />
    <Contact />
    <Footer />
  </main>
)

export interface AdminRouteProps {
  children: ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps): JSX.Element =>
  isAdminEnabled() ? (
    <ApiHealthWrapper>{children}</ApiHealthWrapper>
  ) : (
    <Navigate to="/" replace />
  )

const DebugRoute = (): JSX.Element => {
  if (!Debug) return <Navigate to="/" replace />
  const content = (
    <Suspense fallback={null}>
      <Debug />
    </Suspense>
  )
  return isAdminEnabled() ? (
    <ApiHealthWrapper>{content}</ApiHealthWrapper>
  ) : (
    content
  )
}

function App(): JSX.Element {
  return (
    <PortfolioProvider>
      <Router>
        <PageTitle />
        <Routes>
          <Route path="/" element={<PortfolioWithDataCheck />} />
          <Route
            path="/admin/login"
            element={
              <AdminRoute>
                <AdminLogin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/debug"
            element={Debug ? <DebugRoute /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </PortfolioProvider>
  )
}

export default App
