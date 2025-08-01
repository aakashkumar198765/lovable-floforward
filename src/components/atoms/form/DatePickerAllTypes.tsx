import React, { useState } from 'react';
import DatePicker from './DatePicker';

const DatePickerAllTypes: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [errorDate, setErrorDate] = useState('');
  const [readonlyDate, setReadonlyDate] = useState('2024-01-15');
  const [rangeDate, setRangeDate] = useState('');

  const handleDateChange = (date: Date | null, dateString: string) => {
    setSelectedDate(dateString);
    console.log('Basic date selected:', date, dateString);
  };

  const handleDateTimeChange = (date: Date | null, dateString: string) => {
    setSelectedDateTime(dateString);
    console.log('Date & time selected:', date, dateString);
  };

  const handleTimeChange = (date: Date | null, dateString: string) => {
    setSelectedTime(dateString);
    console.log('Time selected:', date, dateString);
  };

  const handleErrorDateChange = (date: Date | null, dateString: string) => {
    setErrorDate(dateString);
    console.log('Error date selected:', date, dateString);
  };

  const handleReadonlyDateChange = (date: Date | null, dateString: string) => {
    setReadonlyDate(dateString);
    console.log('Readonly date selected:', date, dateString);
  };

  const handleRangeDateChange = (date: Date | null, dateString: string) => {
    setRangeDate(dateString);
    console.log('Range date selected:', date, dateString);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Date Picker</h3>
        <DatePicker
          id="basic-date"
          name="basicDate"
          label="Basic Date Picker"
          placeholder="Select a date"
          helperText="Choose any date"
          value={selectedDate}
          onDateChange={handleDateChange}
        />
        {selectedDate && (
          <div className="mt-2 p-2 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">Selected: {selectedDate}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Date & Time Picker</h3>
        <DatePicker
          id="datetime-picker"
          name="datetimePicker"
          label="Date & Time Picker"
          placeholder="Select date and time"
          showTime={true}
          commerceState="initiation"
          required
          helperText="Select both date and time with tabbed interface"
          value={selectedDateTime}
          onDateChange={handleDateTimeChange}
        />
        {selectedDateTime && (
          <div className="mt-2 p-2 bg-green-50 rounded-md">
            <p className="text-sm text-green-800">Selected: {selectedDateTime}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Only Picker</h3>
        <DatePicker
          id="time-only-picker"
          name="timeOnlyPicker"
          label="Time Only Picker"
          placeholder="Select time"
          timeOnly={true}
          required
          helperText="Select time only with AM/PM format"
          value={selectedTime}
          onDateChange={handleTimeChange}
        />
        {selectedTime && (
          <div className="mt-2 p-2 bg-purple-50 rounded-md">
            <p className="text-sm text-purple-800">Selected: {selectedTime}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Picker with Error State</h3>
        <DatePicker
          id="error-date"
          name="errorDate"
          label="Date with Error"
          placeholder="Select a date"
          status="error"
          errorMessage="Please select a valid date"
          variant="outlined"
          value={errorDate}
          onDateChange={handleErrorDateChange}
        />
        {errorDate && (
          <div className="mt-2 p-2 bg-red-50 rounded-md">
            <p className="text-sm text-red-800">Selected: {errorDate}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Read-only Date Picker (Completion State)</h3>
        <DatePicker
          id="readonly-date"
          name="readonlyDate"
          label="Read-only Date (Completion State)"
          placeholder="Select a date"
          commerceState="completion"
          value={readonlyDate}
          onDateChange={handleReadonlyDateChange}
          helperText="This field is read-only in completion state"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Picker with Min/Max Range</h3>
        <DatePicker
          id="min-max-date"
          name="minMaxDate"
          label="Date with Min/Max Range"
          placeholder="Select a date"
          min="2024-01-01"
          max="2024-12-31"
          helperText="Only dates in 2024 are allowed"
          disabledDates={['2024-07-04', '2024-12-25']}
          highlightedDates={['2024-07-20', '2024-12-01']}
          value={rangeDate}
          onDateChange={handleRangeDateChange}
        />
        {rangeDate && (
          <div className="mt-2 p-2 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">Selected: {rangeDate}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Picker Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePicker
            id="default-variant default-variant-date"
            name="defaultVariant"
            label="Default Variant"
            placeholder="Select a date"
            variant="default"
            helperText="Default styling"
          />
          <DatePicker
            id="outlined-variant outlined-variant-date"
            name="outlinedVariant"
            label="Outlined Variant"
            placeholder="Select a date"
            variant="outlined"
            helperText="Outlined styling"
          />
          <DatePicker
            id="filled-variant filled-variant-date"
            name="filledVariant"
            label="Filled Variant"
            placeholder="Select a date"
            variant="filled"
            helperText="Filled styling"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Picker Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePicker
            id="small-size"
            name="smallSize"
            label="Small Size"
            placeholder="Select a date"
            size="sm"
            helperText="Small size picker"
          />
          <DatePicker
            id="medium-size"
            name="mediumSize"
            label="Medium Size"
            placeholder="Select a date"
            size="md"
            helperText="Medium size picker"
          />
          <DatePicker
            id="large-size"
            name="largeSize"
            label="Large Size"
            placeholder="Select a date"
            size="lg"
            helperText="Large size picker"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Picker Status States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            id="warning-status"
            name="warningStatus"
            label="Warning Status"
            placeholder="Select a date"
            status="warning"
            helperText="This is a warning state"
          />
          <DatePicker
            id="success-status"
            name="successStatus"
            label="Success Status"
            placeholder="Select a date"
            status="success"
            helperText="This is a success state"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Commerce State Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            id="initiation-state"
            name="initiationState"
            label="Initiation State"
            placeholder="Select a date"
            commerceState="initiation"
            helperText="Full editing capabilities"
          />
          <DatePicker
            id="agreement-state"
            name="agreementState"
            label="Agreement State"
            placeholder="Select a date"
            commerceState="agreement"
            helperText="Partial restrictions may apply"
          />
          <DatePicker
            id="execution-state"
            name="executionState"
            label="Execution State"
            placeholder="Select a date"
            commerceState="execution"
            helperText="Active state with full features"
          />
          <DatePicker
            id="settlement-state"
            name="settlementState"
            label="Settlement State"
            placeholder="Select a date"
            commerceState="settlement"
            helperText="Limited editing based on permissions"
            allowedActions={['edit']}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Advanced Time Picker Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            id="custom-time-format"
            name="customTimeFormat"
            label="Custom Time Format"
            placeholder="Select date and time"
            showTime={true}
            timeFormat="HH:mm"
            helperText="24-hour format"
          />
          <DatePicker
            id="time-12hr-format"
            name="time12hrFormat"
            label="12-Hour Time Format"
            placeholder="Select time"
            timeOnly={true}
            timeFormat="hh:mm A"
            helperText="12-hour format with AM/PM"
          />
        </div>
      </div>
    </div>
  );
};

export default DatePickerAllTypes;