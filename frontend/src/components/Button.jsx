import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  style = {},
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'gold':
        return 'btn-gold';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-primary';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.5rem 1.15rem', fontSize: '0.82rem' };
      case 'lg':
        return { padding: '0.95rem 2rem', fontSize: '1rem' };
      default:
        return {};
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn ${getVariantClass()} ${className}`}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        ...getSizeStyle(),
        ...style
      }}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
