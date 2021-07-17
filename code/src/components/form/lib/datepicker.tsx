import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

export function DatePicker({ placeholderText }: DatePickerProps) {
  const [startDate, setStartDate] = useState<any>(new Date());
  return (
    <ReactDatePicker
      dateFormat={'dd/MM/yyyy'}
      dropdownMode={'select'}
      isClearable={true}
      maxDate={new Date()}
      onChange={(date) => setStartDate(date)}
      placeholderText={placeholderText}
      selected={startDate}
      showMonthDropdown={true}
      showYearDropdown={true}
    />
  );
}

interface DatePickerProps {
  placeholderText: string;
}
