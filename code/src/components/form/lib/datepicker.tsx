import React from 'react';
import ReactDatePicker from 'react-datepicker';

export function DatePicker({
  name,
  className,
  onChange,
  value,
  minDate,
  maxDate,
  placeholderText
}: DatePickerProps) {
  return (
    <ReactDatePicker
      autoComplete={'off'}
      calendarStartDay={1}
      className={className}
      dateFormat={'dd/MM/yyyy'}
      dropdownMode={'select'}
      formatWeekDay={(weekday) => weekday.substr(0, 3)}
      isClearable={true}
      minDate={minDate}
      maxDate={maxDate}
      name={name}
      onChange={onChange}
      placeholderText={placeholderText}
      selected={value}
      showMonthDropdown={true}
      showYearDropdown={true}
    />
  );
}

interface DatePickerProps {
  name: string;
  value: Date | undefined;
  minDate?: Date | undefined;
  maxDate: Date | undefined;
  placeholderText: string;
  onChange: (date: Date) => void;
  className?: string;
}
