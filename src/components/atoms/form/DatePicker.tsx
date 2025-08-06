import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { DatePickerProps, CommerceState } from '../../../types';
import { cn } from '../../../utils/utils';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      id = '',
      name = '',
      placeholder = 'Select date',
      value,
      defaultValue = '',
      disabled = false,
      readonly = false,
      required = false,
      autoComplete = 'off',
      autoFocus = false,
      min,
      max,
      size = 'md',
      variant = 'default',
      status = 'default',
      label = '',
      helperText = '',
      errorMessage = '',
      format = 'YYYY-MM-DD',
      showTime = false,
      timeOnly = false,
      timeFormat = 'HH:mm',
      disabledDates = [],
      highlightedDates = [],
      firstDayOfWeek = 0,
      showWeekNumbers = false,
      monthsToShow = 1,
      closeOnSelect = true,
      className = '',
      style = {},
      onChange = () => {},
      onBlur = () => {},
      onFocus = () => {},
      onDateChange = () => {},
      onCalendarOpen = () => {},
      onCalendarClose = () => {},
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : ''
    );
    const [isFocused, setIsFocused] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState({ hours: '12', minutes: '00', period: 'AM' });
    const [inputErrors, setInputErrors] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    // Determine display mode
    const isTimeOnly = timeOnly;
    const isDateAndTime = showTime && !timeOnly;
    const isDateOnly = !showTime && !timeOnly;

    // Initialize tab based on mode
    useEffect(() => {
      if (isTimeOnly) {
        setActiveTab('time');
      } else {
        setActiveTab('date');
      }
    }, [isTimeOnly]);

    // Update internal value when external value changes
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
        const parsedResult = parseDateTime(value);
        if (parsedResult.date) {
          setSelectedDate(parsedResult.date);
          setCurrentMonth(new Date(parsedResult.date.getFullYear(), parsedResult.date.getMonth(), 1));
        }
        if (parsedResult.time) {
          setSelectedTime(parsedResult.time);
        }
      }
    }, [value]);

    // Initialize with default value
    useEffect(() => {
      if (defaultValue && !value) {
        const parsedResult = parseDateTime(defaultValue);
        if (parsedResult.date) {
          setSelectedDate(parsedResult.date);
          setCurrentMonth(new Date(parsedResult.date.getFullYear(), parsedResult.date.getMonth(), 1));
        }
        if (parsedResult.time) {
          setSelectedTime(parsedResult.time);
        }
      }
    }, [defaultValue, value]);

    // Close calendar when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsCalendarOpen(false);
          if (onCalendarClose && typeof onCalendarClose === 'function') {
            onCalendarClose();
          }
        }
      };

      if (isCalendarOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isCalendarOpen, onCalendarClose]);

    // Parse date and time from string
    const parseDateTime = (dateTimeString: string): { date: Date | null, time: { hours: string, minutes: string, period: string } | null } => {
      if (!dateTimeString) return { date: null, time: null };
      
      let date: Date | null = null;
      let time: { hours: string, minutes: string, period: string } | null = null;
      
      // Handle time-only format (HH:mm or HH:mm AM/PM)
      if (isTimeOnly) {
        const timeMatch = dateTimeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2];
          const period = timeMatch[3] || (hours < 12 ? 'AM' : 'PM');
          
          if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
          if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
          
          const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
          const displayPeriod = hours < 12 ? 'AM' : 'PM';
          
          time = {
            hours: displayHours.toString().padStart(2, '0'),
            minutes: minutes,
            period: displayPeriod
          };
        }
        return { date, time };
      }
      
      // Handle date formats
      let dateStr = dateTimeString;
      let timeStr = '';
      // Check if string contains time
      const dateTimeMatch = dateTimeString.match(/^(.+?)\s+(\d{1,2}:\d{2}(?:\s*[AP]M)?)$/i);
      if (dateTimeMatch) {
        dateStr = dateTimeMatch[1];
        timeStr = dateTimeMatch[2];
      }
      
      // Parse date
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        }
      } else {
        date = new Date(dateStr);
      }
      
      if (date && isNaN(date.getTime())) {
        date = null;
      }
      
      // Parse time
      if (timeStr) {
        const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2];
          const period = timeMatch[3] || (hours < 12 ? 'AM' : 'PM');
          
          if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
          if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
          
          const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
          const displayPeriod = hours < 12 ? 'AM' : 'PM';
          
          time = {
            hours: displayHours.toString().padStart(2, '0'),
            minutes: minutes,
            period: displayPeriod
          };
        }
      }
      
      return { date, time };
    };

    // Format date for display
    const formatDate = (date: Date): string => {
      if (!date || isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };

    // Format date for display in input (more user-friendly)
    const formatDateForInput = (date: Date): string => {
      if (!date || isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${month}/${day}/${year}`;
    };

    // Format time for display
    const formatTime = (time: { hours: string, minutes: string, period: string }): string => {
      return `${time.hours}:${time.minutes} ${time.period}`;
    };

    // Format complete date-time value
    const formatCompleteValue = (): string => {
      if (isTimeOnly) {
        return formatTime(selectedTime);
      } else if (isDateOnly) {
        return selectedDate ? formatDateForInput(selectedDate) : '';
      } else if (isDateAndTime) {
        const dateStr = selectedDate ? formatDateForInput(selectedDate) : '';
        const timeStr = formatTime(selectedTime);
        return dateStr && timeStr ? `${dateStr} ${timeStr}` : dateStr || timeStr;
      }
      return '';
    };

    // Validate date and time
    const validateDateTime = (date: Date | null, time: { hours: string, minutes: string, period: string }, valueString: string): string[] => {
      const errors: string[] = [];
      
      if (required && !valueString) {
        errors.push(isTimeOnly ? 'Time is required' : isDateOnly ? 'Date is required' : 'Date and time are required');
        return errors;
      }
      
      if (isTimeOnly) {
        // Time-only validation
        const hours = parseInt(time.hours);
        const minutes = parseInt(time.minutes);
        
        if (isNaN(hours) || hours < 1 || hours > 12) {
          errors.push('Invalid hour');
        }
        if (isNaN(minutes) || minutes < 0 || minutes > 59) {
          errors.push('Invalid minutes');
        }
        
        return errors;
      }
      
      if (!date && !isTimeOnly) {
        return errors;
      }
      
      // Date validation
      if (date) {
        // Check min date
        if (min) {
          const minDate = new Date(min);
          minDate.setHours(0, 0, 0, 0);
          const checkDate = new Date(date);
          checkDate.setHours(0, 0, 0, 0);
          if (checkDate < minDate) {
            errors.push(`Date must be on or after ${formatDateForInput(minDate)}`);
          }
        }
        
        // Check max date
        if (max) {
          const maxDate = new Date(max);
          maxDate.setHours(23, 59, 59, 999);
          const checkDate = new Date(date);
          checkDate.setHours(0, 0, 0, 0);
          if (checkDate > maxDate) {
            errors.push(`Date must be on or before ${formatDateForInput(maxDate)}`);
          }
        }
        
        // Check disabled dates
        const formattedDate = formatDate(date);
        if (disabledDates.includes(formattedDate)) {
          errors.push('This date is not available');
        }
      }
      
      return errors;
    };

    // Check if date is disabled
    const isDateDisabled = (date: Date): boolean => {
      if (!date) return false;
      
      const dateStr = formatDate(date);
      const errors = validateDateTime(date, selectedTime, dateStr);
      return errors.length > 0;
    };

    // Handle value changes with audit trail
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInternalValue(newValue);
      
      const parsedResult = parseDateTime(newValue);
      if (parsedResult.date) setSelectedDate(parsedResult.date);
      if (parsedResult.time) setSelectedTime(parsedResult.time);
      
      // Validate the new value
      const errors = validateDateTime(parsedResult.date, parsedResult.time || selectedTime, newValue);
      setInputErrors(errors);
      
      
      // Call external callbacks
      if (onChange && typeof onChange === 'function') {
        onChange(event);
      }
      
      if (onDateChange && typeof onDateChange === 'function') {
        onDateChange(parsedResult.date, newValue);
      }
    };

    // Handle date selection from calendar
    const handleDateSelect = (date: Date) => {
      if (isDateDisabled(date)) return;
      
      setSelectedDate(date);
      
      const newValue = formatCompleteValue();
      setInternalValue(newValue);
      
      // Validate the selected value
      const errors = validateDateTime(date, selectedTime, newValue);
      setInputErrors(errors);
      
      // Close calendar if configured to do so and not showing time
      if (closeOnSelect && isDateOnly) {
        setIsCalendarOpen(false);
        if (onCalendarClose && typeof onCalendarClose === 'function') {
          onCalendarClose();
        }
      }
      
      // Call external callbacks
      triggerCallbacks(newValue, date);
    };

    // Handle time selection
    const handleTimeSelect = (timeComponent: 'hours' | 'minutes' | 'period', value: string) => {
      const newTime = { ...selectedTime, [timeComponent]: value };
      setSelectedTime(newTime);
      
      const newValue = formatCompleteValue();
      setInternalValue(newValue);
      
      // Validate the selected value
      const errors = validateDateTime(selectedDate, newTime, newValue);
      setInputErrors(errors);
      
      // Call external callbacks
      triggerCallbacks(newValue, selectedDate);
    };

    // Trigger external callbacks
    const triggerCallbacks = (value: string, date: Date | null) => {
      // Create synthetic event for onChange
      const syntheticEvent = {
        target: { value: value, name: name || id || '' },
        currentTarget: { value: value, name: name || id || '' }
      } as React.ChangeEvent<HTMLInputElement>;
      
      if (onChange && typeof onChange === 'function') {
        onChange(syntheticEvent);
      }
      
      if (onDateChange && typeof onDateChange === 'function') {
        onDateChange(date, value);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus && typeof onFocus === 'function') {
        onFocus(event);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur && typeof onBlur === 'function') {
        onBlur(event);
      }
    };

    const handleCalendarToggle = () => {
      if (disabled || readonly) return;
      
      const newOpenState = !isCalendarOpen;
      setIsCalendarOpen(newOpenState);
      
      if (newOpenState) {
        // Set current month based on selected date or today
        const baseDate = selectedDate || new Date();
        setCurrentMonth(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
        
        if (onCalendarOpen && typeof onCalendarOpen === 'function') {
          onCalendarOpen();
        }
      } else {
        if (onCalendarClose && typeof onCalendarClose === 'function') {
          onCalendarClose();
        }
      }
    };

    // Calendar navigation
    const navigateMonth = (direction: 'prev' | 'next') => {
      setCurrentMonth(prev => {
        const newMonth = new Date(prev);
        if (direction === 'prev') {
          newMonth.setMonth(prev.getMonth() - 1);
        } else {
          newMonth.setMonth(prev.getMonth() + 1);
        }
        return newMonth;
      });
    };

    // Generate calendar days
    const generateCalendarDays = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = (firstDay.getDay() - firstDayOfWeek + 7) % 7;
      
      const days: (Date | null)[] = [];
      
      // Previous month's trailing days
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      // Current month's days
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      return days;
    };

    // Handle today button click
    const handleTodayClick = () => {
      const today = new Date();
      handleDateSelect(today);
    };

    // Handle now button click (for time)
    const handleNowClick = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const period = hours < 12 ? 'AM' : 'PM';
      
      const newTime = {
        hours: displayHours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        period: period
      };
      
      setSelectedTime(newTime);
      
      if (isTimeOnly) {
        const newValue = formatTime(newTime);
        setInternalValue(newValue);
        triggerCallbacks(newValue, null);
      } else {
        const newValue = formatCompleteValue();
        setInternalValue(newValue);
        triggerCallbacks(newValue, selectedDate);
      }
    };

    // Generate hour options
    const generateHourOptions = () => {
      const hours = [];
      for (let i = 1; i <= 12; i++) {
        hours.push(i.toString().padStart(2, '0'));
      }
      return hours;
    };

    // Generate minute options
    const generateMinuteOptions = () => {
      const minutes = [];
      for (let i = 0; i < 60; i += 5) {
        minutes.push(i.toString().padStart(2, '0'));
      }
      return minutes;
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm h-9',
      md: 'px-4 py-3 text-base h-12',
      lg: 'px-5 py-4 text-lg h-14'
    };

    // Variant classes
    const variantClasses = {
      default: 'border border-gray-300 bg-white',
      outlined: 'border-2 border-gray-300 bg-transparent',
      filled: 'border-0 bg-gray-100'
    };

    // Status classes
    const statusClasses = {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500'
    };


    // Build input classes
    const inputClasses = cn(
      'w-full rounded-md transition-all duration-200 pr-10',
      'font-sans',
      'focus:outline-none focus:ring-2 focus:ring-opacity-50',
      'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
      'readonly:bg-gray-50 readonly:cursor-default',
      sizeClasses[size] || sizeClasses.md,
      variantClasses[variant] || variantClasses.default,
      (inputErrors.length > 0 || status === 'error') ? statusClasses.error : 
      status !== 'default' && statusClasses[status] ? statusClasses[status] : statusClasses.default,
      className || ''
    );

    // Label classes
    const labelClasses = cn(
      'block text-sm font-medium text-gray-700 mb-2',
      required && 'after:content-["*"] after:text-red-500 after:ml-1'
    );

    // Helper text classes
    const helperTextClasses = cn(
      'mt-2 text-sm text-gray-500',
      (inputErrors.length > 0 || status === 'error') && 'text-red-500',
      status === 'warning' && 'text-yellow-500',
      status === 'success' && 'text-green-500'
    );

    // Icons using Lucide
    const CalendarIcon = ({ className = "w-5 h-5", ...props }) => (
      <Calendar className={className} {...props} />
    );

    const ClockIcon = ({ className = "w-5 h-5", ...props }) => (
      <Clock className={className} {...props} />
    );

    const ChevronLeftIcon = ({ className = "w-4 h-4", ...props }) => (
      <ChevronLeft className={className} {...props} />
    );

    const ChevronRightIcon = ({ className = "w-4 h-4", ...props }) => (
      <ChevronRight className={className} {...props} />
    );

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const adjustedDayNames = [...dayNames.slice(firstDayOfWeek), ...dayNames.slice(0, firstDayOfWeek)];

    // Update the displayed value based on current selections
    useEffect(() => {
      const newValue = formatCompleteValue();
      if (newValue !== internalValue) {
        setInternalValue(newValue);
      }
    }, [selectedDate, selectedTime, isTimeOnly, isDateOnly, isDateAndTime]);

    return (
      <div ref={containerRef} className="relative w-full" style={style}>
        {label && label !== '' && (
          <label htmlFor={id || ''} className={labelClasses}>
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={inputRef}
            id={id || ''}
            name={name || ''}
            type="text"
            placeholder={placeholder || (isTimeOnly ? 'Select time' : isDateAndTime ? 'Select date and time' : 'Select date')}
            value={internalValue}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            className={inputClasses}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={inputErrors.length > 0 || status === 'error'}
            aria-describedby={
              (helperText && helperText !== '') || (errorMessage && errorMessage !== '') || inputErrors.length > 0
                ? `${id || 'datepicker'}-description`
                : undefined
            }
            {...props}
          />
          
          <button
            type="button"
            onClick={handleCalendarToggle}
            disabled={disabled || readonly}
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2',
              'w-5 h-5 text-gray-400 hover:text-blue-500',
              'disabled:cursor-not-allowed disabled:text-gray-300',
              'transition-colors duration-200',
              (isFocused || isCalendarOpen) && 'text-blue-500'
            )}
            aria-label="Open calendar"
          >
            {isTimeOnly ? <ClockIcon /> : <CalendarIcon />}
          </button>
        </div>
        
        {/* Custom Calendar/Time Picker Dropdown */}
        {isCalendarOpen && (
          <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-80 left-0">
            {/* Tabs for date and time (if both are shown) */}
            {isDateAndTime && (
              <div className="flex border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('date')}
                  className={cn(
                    'flex-1 py-2 px-4 text-sm font-medium transition-colors',
                    activeTab === 'date' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <CalendarIcon className="w-4 h-4 inline mr-2" />
                  Date
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('time')}
                  className={cn(
                    'flex-1 py-2 px-4 text-sm font-medium transition-colors',
                    activeTab === 'time' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <ClockIcon className="w-4 h-4 inline mr-2" />
                  Time
                </button>
              </div>
            )}
            
            <div className="p-4">
              {/* Date Picker */}
              {(activeTab === 'date' || isDateOnly) && (
                <div>
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeftIcon />
                    </button>
                    
                    <h3 className="text-lg font-semibold text-gray-900">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    
                    <button
                      type="button"
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                  
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {adjustedDayNames.map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays().map((date, index) => {
                      if (!date) {
                        return <div key={index} className="p-2" />;
                      }
                      
                      const isSelected = selectedDate && 
                        date.getDate() === selectedDate.getDate() &&
                        date.getMonth() === selectedDate.getMonth() &&
                        date.getFullYear() === selectedDate.getFullYear();
                      
                      const isToday = new Date().toDateString() === date.toDateString();
                      const isDisabledDate = isDateDisabled(date);
                      const isHighlighted = highlightedDates.includes(formatDate(date));
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDateSelect(date)}
                          disabled={isDisabledDate}
                          className={cn(
                            'w-8 h-8 text-sm rounded-full transition-all duration-200',
                            'hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                            'disabled:cursor-not-allowed disabled:hover:bg-transparent',
                            isSelected && 'bg-blue-500 text-white hover:bg-blue-600',
                            isToday && !isSelected && 'bg-blue-100 text-blue-600 font-semibold',
                            isHighlighted && !isSelected && 'bg-green-100 text-green-600',
                            isDisabledDate && 'text-gray-300 cursor-not-allowed',
                            !isSelected && !isToday && !isHighlighted && !isDisabledDate && 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Today button */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleTodayClick}
                      className="w-full py-2 px-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Today
                    </button>
                  </div>
                </div>
              )}
              
              {/* Time Picker */}
              {(activeTab === 'time' || isTimeOnly) && (
                <div>
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Select Time</h3>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    {/* Hours */}
                    <div className="flex flex-col items-center">
                      <label className="text-xs font-medium text-gray-500 mb-1">Hours</label>
                      <select
                        value={selectedTime.hours}
                        onChange={(e) => handleTimeSelect('hours', e.target.value)}
                        className="w-16 py-2 px-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {generateHourOptions().map(hour => (
                          <option key={hour} value={hour}>{hour}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="text-2xl font-bold text-gray-400 mt-6">:</div>
                    
                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                      <label className="text-xs font-medium text-gray-500 mb-1">Minutes</label>
                      <select
                        value={selectedTime.minutes}
                        onChange={(e) => handleTimeSelect('minutes', e.target.value)}
                        className="w-16 py-2 px-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {generateMinuteOptions().map(minute => (
                          <option key={minute} value={minute}>{minute}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* AM/PM */}
                    <div className="flex flex-col items-center">
                      <label className="text-xs font-medium text-gray-500 mb-1">Period</label>
                      <select
                        value={selectedTime.period}
                        onChange={(e) => handleTimeSelect('period', e.target.value)}
                        className="w-16 py-2 px-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Current time display */}
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(selectedTime)}
                    </div>
                  </div>
                  
                  {/* Now button */}
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleNowClick}
                      className="w-full py-2 px-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Now
                    </button>
                  </div>
                </div>
              )}
              
              {/* Apply button for date and time mode */}
              {isDateAndTime && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCalendarOpen(false);
                      if (onCalendarClose && typeof onCalendarClose === 'function') {
                        onCalendarClose();
                      }
                    }}
                    className="w-full py-2 px-3 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Error and Helper Messages */}
        {((helperText && helperText !== '') || (errorMessage && errorMessage !== '') || inputErrors.length > 0) && (
          <div id={`${id || 'datepicker'}-description`} className={helperTextClasses}>
            {inputErrors.length > 0 ? (
              <div className="space-y-1">
                {inputErrors.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm">{error}</p>
                ))}
              </div>
            ) : status === 'error' && errorMessage && errorMessage !== '' ? (
              <p>{errorMessage}</p>
            ) : (
              helperText && <p>{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;