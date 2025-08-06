import React, { forwardRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PaginationProps } from '../../../types';
import { cn } from '../../../utils/cn';

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      current = 1,
      total,
      pageSize = 10,
      showSizeChanger = false,
      showQuickJumper = false,
      showTotal = false,
      size = 'md',
      simple = false,
      disabled = false,
      hideOnSinglePage = false,
      pageSizeOptions = [10, 20, 50, 100],
      showPrevNextJumpers = true,
      showFirstLastJumpers = false,
      onChange,
      onShowSizeChange,
      formatTotal,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const [jumpPage, setJumpPage] = useState('');
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);

    // Calculate total pages
    const totalPages = Math.ceil((total || 0) / currentPageSize);

    // Don't render if should hide on single page
    if (hideOnSinglePage && totalPages <= 1) {
      return null;
    }

    // Handle page change
    const handlePageChange = (page: number) => {
      if (page < 1 || page > totalPages || page === current || disabled) return;


      if (onChange && typeof onChange === 'function') {
        onChange(page, currentPageSize);
      }
    };

    // Handle page size change
    const handlePageSizeChange = (newSize: number) => {
      setCurrentPageSize(newSize);
      const newPage = Math.min(current, Math.ceil((total || 0) / newSize));
      
      if (onShowSizeChange && typeof onShowSizeChange === 'function') {
        onShowSizeChange(newPage, newSize);
      }

      if (onChange && typeof onChange === 'function') {
        onChange(newPage, newSize);
      }
    };

    // Handle quick jump
    const handleQuickJump = () => {
      const page = parseInt(jumpPage);
      if (page >= 1 && page <= totalPages) {
        handlePageChange(page);
        setJumpPage('');
      }
    };

    // Handle Enter key in quick jump
    const handleQuickJumpKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleQuickJump();
      }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages = [];
      const delta = 2;
      const left = Math.max(1, current - delta);
      const right = Math.min(totalPages, current + delta);

      if (left > 1) {
        pages.push(1);
        if (left > 2) pages.push('...');
      }

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      if (right < totalPages) {
        if (right < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }

      return pages;
    };

    // Size classes
    const sizeClasses = {
      sm: {
        button: 'h-8 px-3 text-sm min-w-[32px]',
        input: 'h-8 px-2 text-sm w-16',
        select: 'h-8 px-2 text-sm'
      },
      md: {
        button: 'h-10 px-4 text-base min-w-[40px]',
        input: 'h-10 px-3 text-base w-20',
        select: 'h-10 px-3 text-base'
      },
      lg: {
        button: 'h-12 px-5 text-lg min-w-[48px]',
        input: 'h-12 px-4 text-lg w-24',
        select: 'h-12 px-4 text-lg'
      }
    };


    // Button classes
    const getButtonClasses = (isActive = false, isDisabled = false) => {
      return cn(
        'inline-flex items-center justify-center border border-gray-300 font-medium transition-colors duration-200 font-work-sans',
        sizeClasses[size].button,
        isActive
          ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700'
          : 'dark:bg-transparent bg-white dark:text-white text-gray-700 hover:bg-gray-50 hover:border-gray-400',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none hover:bg-white hover:border-gray-300'
      );
    };

    // Format total text
    const getTotalText = () => {
      const totalCount = total || 0;
      const start = (current - 1) * currentPageSize + 1;
      const end = Math.min(current * currentPageSize, totalCount);
      
      if (formatTotal && typeof formatTotal === 'function') {
        return formatTotal(totalCount, [start, end]);
      }
      
      return `${start}-${end} of ${totalCount} items`;
    };

    // Simple pagination
    if (simple) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center justify-center space-x-2 font-work-sans',
            className
          )}
          style={style}
          {...props}
        >
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(current - 1)}
            disabled={current <= 1 || disabled}
            className={cn(
              getButtonClasses(false, current <= 1 || disabled),
              'rounded-l-md border-r-0'
            )}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page info */}
          <div className={cn(
            'flex items-center justify-center border-t border-b border-gray-300 dark:bg-transparent bg-white px-4 font-work-sans',
            sizeClasses[size].button,
            'dark:text-white text-gray-700'
          )}>
            <span className="text-sm">
              {current} / {totalPages}
            </span>
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageChange(current + 1)}
            disabled={current >= totalPages || disabled}
            className={cn(
              getButtonClasses(false, current >= totalPages || disabled),
              'rounded-r-md border-l-0'
            )}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    // Full pagination
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between space-x-4 font-work-sans',
          className
        )}
        style={style}
        {...props}
      >
        {/* Left side - Total info and page size changer */}
        <div className="flex items-center space-x-4">
          {/* Total info */}
          {showTotal && (
            <div className="text-sm dark:text-white text-gray-700 whitespace-nowrap">
              {getTotalText()}
            </div>
          )}

          {/* Page size changer */}
          {showSizeChanger && (
            <div className="flex items-center space-x-2">
              <span className="text-sm dark:text-white text-gray-700 whitespace-nowrap">Show:</span>
              <select
                value={currentPageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                disabled={disabled}
                className={cn(
                  'border border-gray-300 rounded-md dark:bg-transparent bg-white dark:text-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200',
                  sizeClasses[size].select,
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Center - Pagination buttons */}
        <div className="flex items-center space-x-1">
          {/* First page */}
          {showFirstLastJumpers && (
            <button
              onClick={() => handlePageChange(1)}
              disabled={current <= 1 || disabled}
              className={cn(getButtonClasses(false, current <= 1 || disabled), 'rounded-l-md')}
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          )}

          {/* Previous page */}
          {showPrevNextJumpers && (
            <button
              onClick={() => handlePageChange(current - 1)}
              disabled={current <= 1 || disabled}
              className={cn(
                getButtonClasses(false, current <= 1 || disabled),
                !showFirstLastJumpers && 'rounded-l-md'
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 dark:text-white text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  disabled={disabled}
                  className={cn(
                    getButtonClasses(page === current, disabled),
                    'rounded-md'
                  )}
                  aria-label={`Page ${page}`}
                  aria-current={page === current ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Next page */}
          {showPrevNextJumpers && (
            <button
              onClick={() => handlePageChange(current + 1)}
              disabled={current >= totalPages || disabled}
              className={cn(
                getButtonClasses(false, current >= totalPages || disabled),
                !showFirstLastJumpers && 'rounded-r-md'
              )}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Last page */}
          {showFirstLastJumpers && (
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={current >= totalPages || disabled}
              className={cn(getButtonClasses(false, current >= totalPages || disabled), 'rounded-r-md')}
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side - Quick jumper */}
        <div className="flex items-center space-x-2">
          {showQuickJumper && (
            <>
              <span className="text-sm dark:text-white text-gray-700 whitespace-nowrap">Go to:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyPress={handleQuickJumpKeyPress}
                disabled={disabled}
                className={cn(
                  'border border-gray-300 rounded-md dark:bg-transparent dark:text-white bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200',
                  sizeClasses[size].input,
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                placeholder="Page"
              />
              <button
                onClick={handleQuickJump}
                disabled={disabled || !jumpPage}
                className={cn(
                  'px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 font-work-sans',
                  (disabled || !jumpPage) && 'opacity-50 cursor-not-allowed hover:bg-primary-600',
                  sizeClasses[size].button.split(' ')[0]
                )}
              >
                Go
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';

export default Pagination;