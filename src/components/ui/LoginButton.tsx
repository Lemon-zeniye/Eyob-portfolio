import React from "react";

interface DiagonalButtonProps {
  children: React.ReactNode;
  variant?: "filled" | "outline";
  className?: string;
  onClick?: () => void;
}

const DiagonalButton: React.FC<DiagonalButtonProps> = ({
  children,
  variant = "filled",
  className = "",
  onClick,
}) => {
  const baseClasses = `
    relative
    w-full h-12
    font-medium
    text-center
    transition-all duration-200
    focus:outline-none
    ${className}
  `;

  const variantClasses = {
    filled: `
      bg-blue-600
      text-white
      hover:bg-blue-700
    `,
    outline: `
      border-2 border-blue-600
      bg-transparent
      text-blue-600
      hover:bg-blue-50
    `,
  };

  // Clip-path for diagonal corners
  const clipPathStyle = {
    clipPath:
      "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      style={clipPathStyle}
    >
      {children}
    </button>
  );
};

export default DiagonalButton;
