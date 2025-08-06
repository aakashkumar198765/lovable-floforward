import React, { useState, useCallback } from 'react';
import { CommerceState, SummaryItem, SummaryPanelProps } from '../../../types';
import { cn } from '../../../utils/utils';
import Badge from '../../atoms/display/Badge';
import Button from '../../atoms/form/Button';
import { RefreshCw, Download, ChevronDown, Copy } from 'lucide-react';

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  id = 'summary-panel',
  title = '',
  subtitle = '',
  sections = [],
  defaultCollapsed = false,
  collapsibleSections = true,
  showSectionBadges = true,
  showSectionActions = true,
  layout = 'vertical',
  columns = 2,
  size = 'md',
  variant = 'default',
  spacing = 'normal',
  itemLayout = 'rows',
  showEmptyItems = false,
  searchable = false,
  exportable = false,
  refreshable = false,
  loading = false,
  isDisabled = false,
  isReadonly = false,
  className = '',
  style = {},
  onSectionToggle = () => {},
  onSectionAction = () => {},
  onItemClick = () => {},
  onExport = () => {},
  onRefresh = () => {},
}) => {
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>(() => {
    const initial: { [key: string]: boolean } = {};
    sections.forEach(section => {
      section.key && (initial[section.key] = section.collapsed ?? defaultCollapsed);
    });
    return initial;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);


  // Format value based on format type
  const formatValue = (value: string | number | React.ReactNode, format?: string) => {
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value as number);
      case 'percentage':
        return `${((value as number) * 100).toFixed(1)}%`;
      case 'date':
        return new Date(value as number | string).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'number':
        return new Intl.NumberFormat('en-US').format(value as number);
      default:
        return String(value);
    }
  };

  // Handle section toggle
  const handleSectionToggle = useCallback((sectionKey: string) => {
    const newCollapsed = !collapsedSections[sectionKey];
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: newCollapsed,
    }));
    
    onSectionToggle(sectionKey, newCollapsed);

  }, [collapsedSections, onSectionToggle]);

  // Handle section action
  const handleSectionAction = useCallback((sectionKey: string, actionKey: string) => {
    onSectionAction(sectionKey, actionKey);
  }, [onSectionAction]);

  // Handle item click
  const handleItemClick = useCallback((sectionKey: string, itemKey: string, item: SummaryItem) => {
    if (item.clickable && !isDisabled) {
      onItemClick(sectionKey, itemKey);
      
    }
  }, [isDisabled, onItemClick]);

  // Handle copy to clipboard
  const handleCopy = useCallback(async (value: string | number) => {
    try {
      await navigator.clipboard.writeText(String(value));
      // Could show a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (!refreshable || isRefreshing || isDisabled) return;
    
    setIsRefreshing(true);
    
    try {
      await onRefresh();
      

    } finally {
      setIsRefreshing(false);
    }
  }, [refreshable, isRefreshing, isDisabled, onRefresh]);

  // Filter sections and items based on search
  const filteredSections = sections
    .filter(section => section.visible !== false)
    .filter(section => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        (section.title?.toLowerCase().includes(query)) ||
        (section.items || []).some(item => 
          (item.label?.toLowerCase().includes(query)) ||
          String(item.value).toLowerCase().includes(query)
        )
      );
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Build container classes
  const containerClasses = cn(
    'summary-panel',
    size === 'sm' && 'text-sm',
    size === 'lg' && 'text-lg',
    variant === 'default' && 'bg-white border border-gray-200 rounded-lg shadow-sm',
    variant === 'outlined' && 'bg-transparent border-2 border-gray-300 rounded-lg',
    variant === 'filled' && 'bg-gray-50 border border-gray-200 rounded-lg',
    variant === 'minimal' && 'bg-transparent border-0',
    spacing === 'tight' && 'space-y-2',
    spacing === 'normal' && 'space-y-4',
    spacing === 'relaxed' && 'space-y-6',
    loading && 'animate-pulse',
    className
  );

  // Build sections container classes
  const sectionsClasses = cn(
    layout === 'grid' && `grid gap-4 grid-cols-1 md:grid-cols-${columns}`,
    layout === 'horizontal' && 'flex flex-wrap gap-4',
    layout === 'vertical' && 'space-y-4',
    layout === 'compact' && 'space-y-2'
  );

  // Build item classes
  const getItemClasses = (item: SummaryItem) => cn(
    'flex justify-between items-center',
    itemLayout === 'columns' && 'flex-col items-start space-y-1',
    itemLayout === 'inline' && 'inline-flex gap-2',
    size === 'sm' && 'py-1',
    size === 'md' && 'py-2',
    size === 'lg' && 'py-3',
    item.clickable && !isDisabled && 'cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2',
    item.highlight && 'bg-primary-50 border border-primary-200 rounded px-2 -mx-2',
    isDisabled && 'opacity-60'
  );

  // Icons
  const RefreshIcon = () => (
    <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
  );

  const ExportIcon = () => (
    <Download className="w-4 h-4" />
  );

  const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
    <ChevronDown className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
  );

  const CopyIcon = () => (
    <Copy className="w-3 h-3" />
  );

  return (
    <div className={containerClasses} style={style}>
      {/* Header */}
      {(title || subtitle || searchable || exportable || refreshable) && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            {title && (
              <h2 className={cn(
                'font-semibold text-gray-900',
                size === 'sm' && 'text-base',
                size === 'md' && 'text-lg',
                size === 'lg' && 'text-xl'
              )}>
                {title}
              </h2>
            )}
            
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {searchable && (
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isDisabled}
              />
            )}
            
            {exportable && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={onExport}
                disabled={isDisabled}
                iconLeft={<ExportIcon />}
              >
                Export
              </Button>
            )}
            
            {refreshable && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || isDisabled}
                iconLeft={<RefreshIcon />}
              >
                Refresh
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className={cn('p-4', sectionsClasses)}>
        {filteredSections.map((section) => {
          const isCollapsed = section.key ? collapsedSections[section.key] : false;
          const visibleItems = (section.items || [])
            .filter(item => item.visible !== false)
            .filter(item => showEmptyItems || (item.value !== '' && item.value !== null && item.value !== undefined))
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          if (visibleItems.length === 0 && !showEmptyItems) return null;

          return (
            <div
              key={section.key}
              className={cn(
                'summary-section',
                variant !== 'minimal' && 'border border-gray-200 rounded-lg overflow-hidden'
              )}
            >
              {/* Section Header */}
              <div
                className={cn(
                  'flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200',
                  collapsibleSections && 'cursor-pointer hover:bg-gray-100 transition-colors'
                )}
                onClick={collapsibleSections && section.key ? () => handleSectionToggle(section?.key || '') : undefined}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{section.title}</h3>
                  
                  {showSectionBadges && section.badge && (
                    <Badge variant={section.badge.variant || 'primary'} size="sm">
                      {section.badge.text}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {showSectionActions && section.actions && section.actions.length > 0 && (
                    <div className="flex items-center gap-1">
                      {section.actions.map((action) => (
                        <Button
                          key={action.key}
                          variant={action.variant || 'tertiary'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            section.key && action.key && handleSectionAction(section.key, action.key);
                          }}
                          disabled={action.disabled || isDisabled}
                          iconLeft={action.icon}
                          className="text-xs px-2 py-1"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {collapsibleSections && (
                    <CollapseIcon collapsed={isCollapsed} />
                  )}
                </div>
              </div>

              {/* Section Description */}
              {section.description && !isCollapsed && (
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 border-b border-gray-200">
                  {section.description}
                </div>
              )}

              {/* Section Content */}
              {!isCollapsed && (
                <div className="p-3 space-y-1">
                  {visibleItems.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No items to display</p>
                  ) : (
                    visibleItems.map((item) => (
                      <div
                        key={item.key}
                        className={getItemClasses(item)}
                        onClick={() => section.key && item.key && handleItemClick(section.key, item.key, item)}
                      >
                        <div className={cn(
                          'flex items-center gap-2',
                          itemLayout === 'columns' && 'w-full'
                        )}>
                          <span className={cn(
                            'text-gray-700',
                            item.emphasis === 'strong' && 'font-semibold text-gray-900',
                            item.emphasis === 'muted' && 'text-gray-500'
                          )}>
                            {item.label}:
                          </span>
                          
                          {itemLayout === 'columns' && <br />}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'text-gray-900',
                            item.emphasis === 'strong' && 'font-semibold',
                            item.emphasis === 'muted' && 'text-gray-500',
                            itemLayout === 'columns' && 'w-full'
                          )}>
                            {formatValue(item.value, item.format)}
                          </span>
                          
                          {item.copyable && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(item.value as string | number);
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <CopyIcon />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredSections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No sections to display</p>
            {searchQuery && (
              <p className="text-sm mt-1">Try adjusting your search criteria</p>
            )}
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      )}
    </div>
  );
};

SummaryPanel.displayName = 'SummaryPanel';

export default SummaryPanel;