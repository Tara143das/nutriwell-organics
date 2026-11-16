// components/ui/Badge.jsx
export default function Badge({ type = 'new', children, className = '' }) {
  const styles = {
    bestseller: 'bg-amber text-dark',
    new: 'bg-teal text-cream-light',
    sale: 'bg-terracotta text-white',
  };

  const labels = {
    bestseller: 'Bestseller',
    new: 'New Launch',
    sale: 'Sale',
  };

  return (
    <span
      className={`
        absolute top-4 left-4 px-3 py-1.5 rounded-full
        text-[10px] font-bold tracking-wider uppercase
        ${styles[type]}
        ${className}
      `}
    >
      {children || labels[type]}
    </span>
  );
}