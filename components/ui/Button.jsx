// components/ui/Button.jsx
export default function Button({ 
  children, 
  variant = 'teal', 
  size = 'md', 
  className = '', 
  disabled = false, 
  loading = false,
  ...props 
}) {
  const variants = {
    teal: 'bg-teal text-cream-light hover:bg-teal-deep hover:-translate-y-0.5 hover:shadow-soft',
    dark: 'bg-dark text-cream-light hover:bg-ink hover:-translate-y-0.5 hover:shadow-soft',
    amber: 'bg-amber text-dark hover:bg-amber-deep',
    primary: 'bg-cream-light text-teal-deep hover:bg-amber hover:text-dark hover:-translate-y-0.5',
    outline: 'bg-transparent text-cream-light border-[1.5px] border-cream-light/50 hover:bg-cream-light/15 hover:border-cream-light',
    outlineDark: 'bg-transparent text-teal-deep border-[1.5px] border-teal hover:bg-teal-pale',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 cursor-pointer
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}