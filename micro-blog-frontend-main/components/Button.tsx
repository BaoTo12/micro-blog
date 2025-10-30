
import React from 'react';

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'facebook';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  // FIX: Added disabled styles for opacity, cursor, and to prevent transform effects.
  const baseStyles = 'px-6 py-2.5 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variantStyles = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    facebook: 'bg-facebook-blue text-white hover:bg-blue-700 focus:ring-blue-500 flex items-center justify-center space-x-2',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      // FIX: Pass the disabled prop to the underlying button element.
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
