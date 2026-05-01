function PageHeader({ title, subtitle, action }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 p-6 lg:p-8 text-white shadow-xl">

      {/* Glow */}
      <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            {title}
          </h1>

          <p className="text-sm text-indigo-100 mt-2 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {action && (
          <div>
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;