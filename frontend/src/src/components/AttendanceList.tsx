import React, { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useEmployeeContext } from '../contexts/EmployeeContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { format } from 'date-fns';

export const AttendanceList: React.FC = () => {
  const { selectedEmployee } = useEmployeeContext();
  const { attendance, isLoading, error } = useAttendance(selectedEmployee?.employee_id);
  const [filterDate, setFilterDate] = useState('');

  if (!selectedEmployee) {
    return (
      <div className="card">
        <p className="text-gray-500 text-center">
          Select an employee to view attendance records
        </p>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return <ErrorMessage message="Failed to load attendance records." />;
  }

  const filteredAttendance = filterDate
    ? attendance.filter(record => record.date === filterDate)
    : attendance;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Attendance Records - {selectedEmployee.full_name}
        </h2>
        <div className="w-64">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="input-field text-sm"
            placeholder="Filter by date"
          />
        </div>
      </div>

      {filteredAttendance.length === 0 ? (
        <EmptyState
          title="No Attendance Records"
          description="No attendance records found for this employee."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marked At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'Present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(record.created_at), 'MMM dd, yyyy HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};