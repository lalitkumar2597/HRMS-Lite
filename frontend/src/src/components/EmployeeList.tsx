import React from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeContext } from '../contexts/EmployeeContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { Employee } from '../types';

export const EmployeeList: React.FC = () => {
  const { employees, isLoading, error, deleteEmployee, isDeleting } = useEmployees();
  const { setSelectedEmployee } = useEmployeeContext();

  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    return <ErrorMessage message="Failed to load employees. Please try again." />;
  }

  if (employees.length === 0) {
    return (
      <EmptyState
        title="No Employees Found"
        description="Get started by adding your first employee."
        icon={
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Employee List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee: Employee) => (
              <tr 
                key={employee.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedEmployee(employee)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {employee.employee_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this employee?')) {
                        deleteEmployee(employee.employee_id);
                      }
                    }}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};