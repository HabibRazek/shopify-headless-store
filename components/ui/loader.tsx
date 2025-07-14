'use client';

import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`loader ${sizeClasses[size]} ${className}`}>
      <style jsx>{`
        .loader {
          margin: 0 auto;
          position: relative;
          display: block;
        }

        .loader:before {
          content: '';
          width: 100%;
          height: 10%;
          background: #22c55e50;
          position: absolute;
          top: 125%;
          left: 0;
          border-radius: 50%;
          animation: shadow324 0.5s linear infinite;
        }

        .loader:after {
          content: '';
          width: 100%;
          height: 100%;
          background: #22c55e;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 4px;
          animation: jump7456 0.5s linear infinite;
        }

        @keyframes jump7456 {
          15% {
            border-bottom-right-radius: 3px;
          }

          25% {
            transform: translateY(9px) rotate(22.5deg);
          }

          50% {
            transform: translateY(18px) scale(1, .9) rotate(45deg);
            border-bottom-right-radius: 40px;
          }

          75% {
            transform: translateY(9px) rotate(67.5deg);
          }

          100% {
            transform: translateY(0) rotate(90deg);
          }
        }

        @keyframes shadow324 {
          0%, 100% {
            transform: scale(1, 1);
          }

          50% {
            transform: scale(1.2, 1);
          }
        }
      `}</style>
    </div>
  );
};

// Full screen loader component
export const FullScreenLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center">
        <Loader size="lg" />
        <p className="mt-6 text-gray-600 font-medium">Chargement...</p>
      </div>
    </div>
  );
};

// Inline loader for smaller sections
export const InlineLoader: React.FC<{ text?: string }> = ({ text = "Chargement..." }) => {
  return (
    <div className="flex items-center justify-center py-12 w-full">
      <div className="flex flex-col items-center justify-center text-center">
        <Loader size="md" />
        <p className="mt-4 text-gray-600 text-sm font-medium">{text}</p>
      </div>
    </div>
  );
};

// Centered loader wrapper for any container
export const CenteredLoader: React.FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  text = "Chargement...",
  size = 'md'
}) => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div className="flex flex-col items-center justify-center text-center">
        <Loader size={size} />
        <p className="mt-4 text-gray-600 text-sm font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
