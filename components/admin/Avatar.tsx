'use client';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'green' | 'blue' | 'purple' | 'orange';
  className?: string;
}

const sizeStyles = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-sm',
  xl: 'h-12 w-12 text-base',
};

const variantStyles = {
  default: 'bg-gray-500',
  green: 'bg-gradient-to-r from-green-400 to-green-600',
  blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
  purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
  orange: 'bg-gradient-to-r from-orange-400 to-orange-600',
};

export default function Avatar({ 
  name, 
  size = 'md', 
  variant = 'green',
  className = '' 
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`
      ${sizeStyles[size]} 
      ${variantStyles[variant]} 
      rounded-full 
      flex 
      items-center 
      justify-center 
      font-medium 
      text-white 
      flex-shrink-0
      ${className}
    `}>
      {initials}
    </div>
  );
}
