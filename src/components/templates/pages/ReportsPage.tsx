import React, { useState, useCallback, useMemo } from 'react';
import { ReportsPageProps } from '../../../types';

export const ReportsPage: React.FC<ReportsPageProps> = ({
  id,
  title = 'Reports & Analytics',
  description = 'View and analyze your data with comprehensive reports',
  reports = [],
  charts = [],
  metrics = [],
  filters = [],
  dateRanges = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Custom', value: 'custom' }
  ],
  selectedDateRange = '30d',
  showFilters = true,
  showExport = true,
  showSchedule = true,
  refreshInterval = 0,
  autoRefresh = false,
  size = 'md',
  layout = 'grid',
  onFilterChange,
  onDateRangeChange,
  onReportGenerate,
  onExport,
  onSchedule,
  onRefresh,
  onChartInteraction,
  className = '',
  style = {},
  children,
  allowedActions = [],
}) => {
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [currentDateRange, setCurrentDateRange] = useState(selectedDateRange);
  const [customDateStart, setCustomDateStart] = useState('');
  const [customDateEnd, setCustomDateEnd] = useState('');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['metrics']));

  // Auto-refresh functionality
  React.useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleFilterChange = useCallback((filterKey: string, value: any) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  }, [activeFilters, onFilterChange]);

  const handleDateRangeChange = useCallback((range: string) => {
    setCurrentDateRange(range);
    onDateRangeChange?.(range, range === 'custom' ? { start: customDateStart, end: customDateEnd } : undefined);
  }, [customDateStart, customDateEnd, onDateRangeChange]);

  const handleCustomDateChange = useCallback(() => {
    if (currentDateRange === 'custom' && customDateStart && customDateEnd) {
      onDateRangeChange?.('custom', { start: customDateStart, end: customDateEnd });
    }
  }, [currentDateRange, customDateStart, customDateEnd, onDateRangeChange]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  }, [onRefresh]);

  const handleReportGenerate = useCallback((reportId: string, config?: any) => {
    onReportGenerate?.(reportId, config);
  }, [onReportGenerate]);

  const handleExport = useCallback((format: string, reportIds?: string[]) => {
    onExport?.(format, reportIds || selectedReports);
  }, [selectedReports, onExport]);

  const handleSchedule = useCallback((reportId: string, schedule: any) => {
    onSchedule?.(reportId, schedule);
  }, [onSchedule]);

  const handleChartInteraction = useCallback((chartId: string, interaction: any) => {
    onChartInteraction?.(chartId, interaction);
  }, [onChartInteraction]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  const sizeClasses = {
    sm: 'max-w-5xl',
    md: 'max-w-7xl',
    lg: 'max-w-full'
  };

  const layoutClasses = {
    grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    list: 'grid-cols-1',
    masonry: 'columns-1 md:columns-2 lg:columns-3'
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true;
        return report.filters?.[key] === value;
      });
    });
  }, [reports, activeFilters]);

  const renderFiltersAndControls = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Range Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Date Range:</label>
            <select
              value={currentDateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Date Range */}
          {currentDateRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={customDateStart}
                onChange={(e) => setCustomDateStart(e.target.value)}
                onBlur={handleCustomDateChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customDateEnd}
                onChange={(e) => setCustomDateEnd(e.target.value)}
                onBlur={handleCustomDateChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && filters.map(filter => (
            <div key={filter.key} className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">{filter.label}:</label>
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {/* Auto-refresh indicator */}
          {autoRefresh && refreshInterval > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-blue-500' : 'bg-green-500'}`} />
              <span>Auto-refresh: {refreshInterval / 1000}s</span>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <span className={`inline-block ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
            Refresh
          </button>

          {/* Export Button */}
          {showExport && allowedActions.includes('export_reports') && (
            <div className="relative">
              <button
                onClick={() => {
                  const dropdown = document.getElementById('export-dropdown');
                  dropdown?.classList.toggle('hidden');
                }}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                📤 Export
              </button>
              <div id="export-dropdown" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => {
    if (metrics.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
          <button
            onClick={() => toggleSection('metrics')}
            className="text-gray-500 hover:text-gray-700"
          >
            {expandedSections.has('metrics') ? '▼' : '▶'}
          </button>
        </div>

        {expandedSections.has('metrics') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    {metric.change && (
                      <p className={`text-sm ${
                        metric.change.startsWith('+') ? 'text-green-600' : 
                        metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change} {metric.changeLabel || 'vs previous period'}
                      </p>
                    )}
                  </div>
                  {metric.icon && (
                    <div className="p-3 bg-blue-100 rounded-full">
                      <span className="text-blue-600 text-xl">{metric.icon}</span>
                    </div>
                  )}
                </div>
                {metric.trend && (
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-1">Trend</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          metric.trend === 'up' ? 'bg-green-500' : 
                          metric.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${metric.trendPercentage || 50}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCharts = () => {
    if (charts.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Charts & Visualizations</h2>
          <button
            onClick={() => toggleSection('charts')}
            className="text-gray-500 hover:text-gray-700"
          >
            {expandedSections.has('charts') ? '▼' : '▶'}
          </button>
        </div>

        {expandedSections.has('charts') && (
          <div className={`grid gap-6 ${layoutClasses[layout]}`}>
            {charts.map((chart) => (
              <div key={chart.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{chart.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleChartInteraction(chart.id, 'fullscreen')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Fullscreen"
                    >
                      ⛶
                    </button>
                    <button
                      onClick={() => handleExport('image', [chart.id])}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Export"
                    >
                      📤
                    </button>
                  </div>
                </div>
                
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  {chart.content || (
                    <div className="text-center">
                      <div className="text-4xl mb-2">{chart.type === 'line' ? '📈' : chart.type === 'bar' ? '📊' : '🥧'}</div>
                      <p className="text-gray-600">{chart.title} Chart</p>
                      <p className="text-sm text-gray-500">Chart implementation would go here</p>
                    </div>
                  )}
                </div>

                {chart.description && (
                  <p className="mt-3 text-sm text-gray-600">{chart.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderReports = () => {
    if (filteredReports.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
          <button
            onClick={() => toggleSection('reports')}
            className="text-gray-500 hover:text-gray-700"
          >
            {expandedSections.has('reports') ? '▼' : '▶'}
          </button>
        </div>

        {expandedSections.has('reports') && (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={(e) => {
                          setSelectedReports(prev => 
                            e.target.checked 
                              ? [...prev, report.id]
                              : prev.filter(id => id !== report.id)
                          );
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'ready' ? 'bg-green-100 text-green-800' :
                      report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>

                    <button
                      onClick={() => handleReportGenerate(report.id)}
                      disabled={report.status === 'generating'}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Generate
                    </button>

                    {showSchedule && allowedActions.includes('schedule_reports') && (
                      <button
                        onClick={() => handleSchedule(report.id, { frequency: 'weekly' })}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Schedule
                      </button>
                    )}
                  </div>
                </div>

                {report.lastGenerated && (
                  <div className="mt-3 text-sm text-gray-500">
                    Last generated: {new Date(report.lastGenerated).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id={id}
      className={`reports-page ${className}`}
      style={style}
      role="main"
      aria-label="Reports Page"
    >
      <div className="py-8">
        <div className={`mx-auto px-6 ${sizeClasses[size]}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Action Buttons */}
            </div>
          </div>

          {renderFiltersAndControls()}
          {renderMetrics()}
          {renderCharts()}
          {renderReports()}

          {children}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;