import { FaSignOutAlt } from 'react-icons/fa';

const AdminHeader = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur shadow-sm py-6 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between border-b border-gray-200">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1">Portfolio Admin</h1>
        <p className="text-lg text-gray-500 font-medium">Manage your portfolio sections below</p>
      </div>
      <button
        onClick={onLogout}
        className="mt-4 sm:mt-0 px-6 py-2 border border-transparent text-base font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 shadow flex items-center gap-2"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </header>
  );
};

export default AdminHeader; 