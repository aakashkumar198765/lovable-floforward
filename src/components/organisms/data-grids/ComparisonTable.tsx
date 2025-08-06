import React, { useState, useCallback, useMemo } from 'react';
import { ComparisonTableProps } from '../../../types';
import { cn } from '../../../utils/cn';
import Button from '../../atoms/form/Button';
import Badge from '../../atoms/display/Badge';
import Icon from '../../atoms/display/Icon';
import Tooltip from '../../atoms/display/Tooltip';
import Modal from '../../atoms/feedback/Modal';
import Toast from '../../atoms/feedback/Toast';
import StatusCard from '../../molecules/display/StatusCard';
import MetricCard from '../../molecules/display/MetricCard';

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  id = 'comparison-table',
  items = [],
  criteria = [],
  scoring = { enabled: true, method: 'weighted' },
  layout = 'horizontal',
  size = 'md',
  showScores = true,
  showRanking = true,
  highlightBest = true,
  exportable = true,
  className = '',
  style = {},
  onItemSelect,
  onCompare,
  onExport,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<{ show: boolean; item: any }>({
    show: false,
    item: null
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false, message: '', type: 'info'
  });


  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);

  // Calculate scores for each item
  const calculateScore = useCallback((item: any) => {
    if (!scoring.enabled || !criteria.length) return 0;

    if (scoring.method === 'custom' && scoring.customScorer) {
      return scoring.customScorer(item, criteria);
    }

    let totalScore = 0;
    let totalWeight = 0;

    criteria.forEach(criterion => {
      const value = item.data?.[criterion.key!];
      const weight = criterion.weight || 1;
      let score = 0;

      switch (criterion.type) {
        case 'numeric':
          score = Number(value) || 0;
          break;
        case 'rating':
          score = Number(value) || 0;
          break;
        case 'boolean':
          score = value ? 10 : 0;
          break;
        case 'text':
          score = value ? value.length : 0;
          break;
        default:
          score = Number(value) || 0;
      }

      if (scoring.method === 'weighted') {
        totalScore += score * weight;
        totalWeight += weight;
      } else {
        totalScore += score;
        totalWeight++;
      }
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }, [criteria, scoring]);

  // Get scored and ranked items
  const scoredItems = useMemo(() => {
    return items
      .map(item => ({
        ...item,
        score: calculateScore(item),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  }, [items, calculateScore]);

  // Handle item selection
  const handleItemSelect = useCallback((itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    onItemSelect?.(item);
    showToast(`Selected: ${item.name}`, 'success');
  }, [items, onItemSelect, showToast]);

  // Handle comparison
  const handleCompare = useCallback((itemIds: string[]) => {
    const compareItems = items.filter(item => itemIds.includes(item.id!));
    onCompare?.(compareItems);
    showToast(`Comparing ${compareItems.length} items`, 'info');
  }, [items, onCompare, showToast]);

  // Handle export
  const handleExport = useCallback((format: string) => {
    onExport?.(format);
    setShowExportModal(false);
    showToast(`Comparison exported as ${format.toUpperCase()}`, 'success');
  }, [items, onExport, showToast]);

  // Format cell value based on criterion type
  const formatValue = useCallback((value: any, criterion: any) => {
    if (criterion.formatter) {
      return criterion.formatter(value);
    }

    switch (criterion.type) {
      case 'numeric':
        return Number(value).toLocaleString();
      case 'rating':
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Icon
                key={star}
                name="star"
                size="xs"
                className={star <= value ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
            <span className="ml-1 text-xs">({value})</span>
          </div>
        );
      case 'boolean':
        return value ? (
          <Icon name="check" className="text-green-500" size="sm" />
        ) : (
          <Icon name="x" className="text-red-500" size="sm" />
        );
      case 'text':
        return String(value);
      default:
        return String(value);
    }
  }, []);

  // Get the best value for each criterion
  const getBestValues = useCallback(() => {
    const bestValues: Record<string, any> = {};

    criteria.forEach(criterion => {
      const values = items.map(item => item.data?.[criterion.key!]).filter(Boolean);
      
      if (values.length === 0) return;

      switch (criterion.type) {
        case 'numeric':
        case 'rating':
          bestValues[criterion.key!] = Math.max(...values.map(Number));
          break;
        case 'boolean':
          bestValues[criterion.key!] = true;
          break;
        default:
          bestValues[criterion.key!] = values[0];
      }
    });

    return bestValues;
  }, [items, criteria]);

  const bestValues = getBestValues();

  // Check if a value is the best for its criterion
  const isBestValue = useCallback((value: any, criterionKey: string, criterion: any) => {
    if (!highlightBest || !bestValues[criterionKey]) return false;

    switch (criterion.type) {
      case 'numeric':
      case 'rating':
        return Number(value) === Number(bestValues[criterionKey]);
      case 'boolean':
        return value === true;
      default:
        return value === bestValues[criterionKey];
    }
  }, [bestValues, highlightBest]);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (layout === 'vertical') {
    return (
      <div 
        className={cn(
          'rounded-lg border p-4',
          sizeClasses[size],
          className
        )}
        style={style}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Comparison Results</h3>
          <div className="flex gap-2">
            {selectedItems.length > 1 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCompare(selectedItems)}
                iconLeft={<Icon name="compare" />}
              >
                Compare Selected
              </Button>
            )}
            {exportable && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowExportModal(true)}
                iconLeft={<Icon name="download" />}
              >
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Vertical Layout - Cards */}
        <div className="space-y-4">
          {scoredItems.map((item) => (
            <StatusCard
              key={item.id}
              title={item.name}
              status={showRanking ? `Rank #${item.rank}` : 'Active'}
              statusVariant="primary"
              description={`Score: ${item.score.toFixed(2)}`}
              actions={[
                {
                  key: 'select',
                  label: 'Select',
                  variant: 'primary',
                },
                {
                  key: 'details',
                  label: 'Details',
                  variant: 'secondary',
                },
              ]}
              showActions
              clickable
              onClick={() => handleItemSelect(item.id!)}
              onAction={(actionKey) => {
                if (actionKey === 'select') {
                  handleItemSelect(item.id!);
                } else if (actionKey === 'details') {
                  setShowDetailsModal({ show: true, item });
                }
              }}
              className={cn(
                'cursor-pointer transition-colors hover:bg-gray-50',
                item.rank === 1 && highlightBest && 'ring-2 ring-green-500'
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  // Horizontal Layout - Table
  return (
    <div 
      className={cn(
        'bg-gray-50',
        className
      )}
      style={style}
    >
      <div className={cn(
        'bg-white rounded-lg border shadow-sm',
        sizeClasses[size]
      )}>
      {/* Header */}
      <div className="flex items-center justify-between m-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Item Comparison</h2>
          <p className="text-gray-600 text-sm mt-1">Compare items across multiple criteria with weighted scoring and detailed analysis.</p>
          <div className="flex items-center gap-4 mt-2">
            {showScores && scoring.enabled && (
              <Badge variant="info" size="sm">
                Scoring: {scoring.method}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {exportable && <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setShowExportModal(true)}>
            Export
          </button>}
          {selectedItems.length > 1 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCompare(selectedItems)}
              iconLeft={<Icon name="compare" />}
              className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
            >
              Compare ({selectedItems.length})
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto m-6">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  <span>Item</span>
                  {showRanking && <span className="text-xs">(Rank)</span>}
                </div>
              </th>
              {criteria.map((criterion) => (
                <th
                  key={criterion.key}
                  className="px-6 py-4 text-center text-sm font-medium text-gray-900"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{criterion.label}</span>
                    {criterion.weight && criterion.weight !== 1 && (
                      <Badge variant="secondary" size="xs">
                        Weight: {criterion.weight}
                      </Badge>
                    )}
                  </div>
                </th>
              ))}
              {showScores && scoring.enabled && (
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                  Score
                </th>
              )}
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody>
            {scoredItems.map((item, index) => (
              <tr
                key={item.id}
                className={cn(
                  'border-b border-gray-200 hover:bg-gray-50 transition-colors',
                  item.rank === 1 && highlightBest && 'bg-green-50',
                  selectedItems.includes(item.id!) && 'bg-blue-50',
                  index % 2 === 0 && 'bg-white',
                  index % 2 === 1 && 'bg-gray-50'
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id!)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(prev => [...prev, item.id!]);
                        } else {
                          setSelectedItems(prev => prev.filter(id => id !== item.id));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {showRanking && (
                          <Badge
                            variant={item.rank === 1 ? 'success' : item.rank <= 3 ? 'warning' : 'secondary'}
                            size="xs"
                          >
                            #{item.rank}
                          </Badge>
                        )}
                      </div>
                      {item.metadata?.category && (
                        <span className="text-xs text-gray-500">{item.metadata.category}</span>
                      )}
                    </div>
                  </div>
                </td>

                {criteria.map((criterion) => {
                  const value = item.data?.[criterion.key!];
                  const isBest = isBestValue(value, criterion.key!, criterion);
                  
                  return (
                    <td
                      key={criterion.key}
                      className={cn(
                        'px-6 py-4 text-center text-sm',
                        isBest && 'bg-green-100 font-semibold text-green-800'
                      )}
                    >
                      <Tooltip content={`${criterion.label}: ${value}`}>
                        <div className="flex justify-center">
                          {formatValue(value, criterion)}
                          {isBest && (
                            <Icon name="star" size="xs" className="ml-1 text-yellow-400" />
                          )}
                        </div>
                      </Tooltip>
                    </td>
                  );
                })}

                {showScores && scoring.enabled && (
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold">{item.score.toFixed(1)}</span>
                      <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all duration-300',
                            item.rank === 1 ? 'bg-green-500' :
                            item.rank <= 3 ? 'bg-yellow-500' : 'bg-gray-400'
                          )}
                          style={{ width: `${(item.score / Math.max(...scoredItems.map(i => i.score))) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                )}

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleItemSelect(item.id!)}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs px-3 py-1"
                    >
                      Select
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowDetailsModal({ show: true, item })}
                      className="text-gray-700 border-gray-300 hover:bg-gray-50 text-xs px-3 py-1"
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      {scoredItems.length > 0 && (
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Items"
              metric={{ value: scoredItems.length, format: 'number' }}
              size="sm"
              variant="minimal"
            />
            <MetricCard
              title="Avg Score"
              metric={{
                value: scoredItems.reduce((sum, item) => sum + item.score, 0) / scoredItems.length,
                format: 'decimal',
                precision: 1
              }}
              size="sm"
              variant="minimal"
            />
            <MetricCard
              title="Best Score"
              metric={{
                value: Math.max(...scoredItems.map(item => item.score)),
                format: 'decimal',
                precision: 1
              }}
              size="sm"
              variant="minimal"
            />
            <MetricCard
              title="Selected"
              metric={{ value: selectedItems.length, format: 'number' }}
              size="sm"
              variant="minimal"
            />
          </div>
        </div>
      )}

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Comparison"
        size="md"
      >
        <div className="space-y-4">
          <p>Choose export format:</p>
          <div className="grid grid-cols-2 gap-2">
            {['csv', 'excel', 'json', 'pdf'].map(format => (
              <Button
                key={format}
                variant="secondary"
                onClick={() => handleExport(format)}
                fullWidth
              >
                {format.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Item Details Modal */}
      <Modal
        isOpen={showDetailsModal.show}
        onClose={() => setShowDetailsModal({ show: false, item: null })}
        title={`Details: ${showDetailsModal.item?.name}`}
        size="lg"
      >
        {showDetailsModal.item && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="ml-2">{showDetailsModal.item.name}</span>
                  </div>
                  {showRanking && (
                    <div>
                      <span className="text-sm text-gray-600">Rank:</span>
                      <Badge variant="primary" size="sm" className="ml-2">
                        #{showDetailsModal.item.rank}
                      </Badge>
                    </div>
                  )}
                  {showScores && (
                    <div>
                      <span className="text-sm text-gray-600">Score:</span>
                      <span className="ml-2 font-semibold">{showDetailsModal.item.score.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Criteria Values</h4>
                <div className="space-y-2">
                  {criteria.map(criterion => (
                    <div key={criterion.key}>
                      <span className="text-sm text-gray-600">{criterion.label}:</span>
                      <div className="ml-2">
                        {formatValue(showDetailsModal.item.data?.[criterion.key!], criterion)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowDetailsModal({ show: false, item: null })}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleItemSelect(showDetailsModal.item.id!);
                  setShowDetailsModal({ show: false, item: null });
                }}
              >
                Select This Item
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          title={toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
          description={toast.message}
          variant={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          position="bottom-right"
        />
      )}
      </div>
    </div>
  );
};

export default ComparisonTable;