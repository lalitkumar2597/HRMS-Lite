import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AttendanceFormData } from '../types';
import { useAttendance } from '../hooks/useAttendance';
import { useEmployeeContext } from '../contexts/EmployeeContext';

export const AttendanceForm: React.FC = () => {
  const { selectedEmployee } = useEmployeeContext();
  const { markAttendance, isMarking } = useAttendance(selectedEmployee?.employee_id);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AttendanceFormData>();

  useEffect(() => {
    if (selectedEmployee) {
      setValue('employee_id', selectedEmployee.employee_id);
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setValue('date', today);
    }
  }, [selectedEmployee, setValue]);

  const onSubmit = async (data: AttendanceFormData) => {
    markAttendance(data);
    reset();
  };

  if (!selectedEmployee) {
    return (
      <div className="card">
        <p className="text-gray-500 text-center">
          Select an employee from the list to mark attendance
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">
        Mark Attendance for {selectedEmployee.full_name}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('employee_id')} />

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            className="input-field"
            {...register('date', { required: 'Date is required' })}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="status"
            className="input-field"
            {...register('status', { required: 'Status is required' })}
          >
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isMarking}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMarking ? 'Marking...' : 'Mark Attendance'}
        </button>
      </form>
    </div>
  );
};