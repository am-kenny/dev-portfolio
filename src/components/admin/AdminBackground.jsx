const AdminBackground = () => {
  return (
    <svg className="absolute inset-0 w-full h-full -z-10 opacity-40" aria-hidden="true">
      <defs>
        <radialGradient id="bg-gradient" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-gradient)" />
      <circle cx="80%" cy="20%" r="180" fill="#a5b4fc" fillOpacity="0.18" />
      <circle cx="20%" cy="80%" r="120" fill="#f472b6" fillOpacity="0.13" />
      <circle cx="60%" cy="70%" r="90" fill="#34d399" fillOpacity="0.10" />
    </svg>
  );
};

export default AdminBackground; 