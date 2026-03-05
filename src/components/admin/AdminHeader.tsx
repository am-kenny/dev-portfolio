import { FaSignOutAlt } from 'react-icons/fa'
import ThemeToggle from '../common/ThemeToggle'

export interface AdminHeaderProps {
  onLogout: () => void
}

const AdminHeader = ({ onLogout }: AdminHeaderProps): JSX.Element => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-sm py-6 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-1">
          Portfolio Admin
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
          Manage your portfolio sections and import LinkedIn data
        </p>
      </div>
      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="mt-4 sm:mt-0 px-6 py-2 border border-transparent text-base font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 shadow flex items-center gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </header>
  )
}

export default AdminHeader
