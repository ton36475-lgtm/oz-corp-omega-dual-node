import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-emerald-green text-white font-semibold hover:bg-emerald-700 ${className}`}
    >
      {children}
    </button>
  );
};
