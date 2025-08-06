import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/utils';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'switch';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
  variant = 'button',
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          theme === 'dark' 
            ? 'bg-primary-600' 
            : 'bg-gray-200',
          className
        )}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        <span
          className={cn(
            'inline-block w-5 h-5 transform transition-transform duration-200 bg-white rounded-full shadow-lg ring-0',
            theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
          )}
        >
          <span className="flex items-center justify-center w-full h-full">
            {theme === 'dark' ? (
              <Moon className="w-3 h-3 text-primary-600" />
            ) : (
              <Sun className="w-3 h-3 text-yellow-500" />
            )}
          </span>
        </span>
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          'hover:bg-gray-50 dark:hover:bg-gray-700',
          'text-gray-600 dark:text-gray-300',
          sizeClasses[size],
          className
        )}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center gap-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'hover:bg-gray-50 dark:hover:bg-gray-700',
        'text-gray-700 dark:text-gray-200',
        buttonSizeClasses[size],
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4" />
          Light
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          Dark
        </>
      )}
    </button>
  );
};

export default ThemeToggle;