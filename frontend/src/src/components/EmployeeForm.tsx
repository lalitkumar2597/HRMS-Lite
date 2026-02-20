import React from 'react';
import { useForm } from 'react-hook-form';
import { EmployeeFormData } from '../types';
import { useEmployees } from '../hooks/useEmployees';

export const EmployeeForm: React.FC = () => {
  const { addEmployee, isAdding } = useEmployees();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>();

  const onSubmit = async (data: EmployeeFormData) => {
    addEmployee(data);
    reset();
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Add New Employee</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">
            Employee ID *
          </label>
          <input
            type="text"
            id="employee_id"
            className="input-field"
            placeholder="e.g., EMP001"
            {...register('employee_id', {
              required: 'Employee ID is required',
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: 'Employee ID must be alphanumeric',
              },
              minLength: {
                value: 3,
                message: 'Employee ID must be at least 3 characters',
              },
            })}
          />
          {errors.employee_id && (
            <p className="mt-1 text-sm text-red-600">{errors.employee_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            className="input-field"
            placeholder="John Doe"
            {...register('full_name', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            className="input-field"
            placeholder="john.doe@company.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <select
            id="department"
            className="input-field"
            {...register('department', { required: 'Department is required' })}
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};