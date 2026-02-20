/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Employee, EmployeeFormData } from '../types';
import toast from 'react-hot-toast';

export const useEmployees = () => {
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await apiClient.get<Employee[]>('/employees');
      return response.data;
    },
  });

  const addEmployee = useMutation({
    mutationFn: async (employeeData: EmployeeFormData) => {
      const response = await apiClient.post<Employee>('/employees', employeeData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee added successfully');
    },
    onError: (error: any) => {
      console.error('Error adding employee:', error);
    },
  });

  const deleteEmployee = useMutation({
    mutationFn: async (employeeId: string) => {
      await apiClient.delete(`/employees/${employeeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Employee deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting employee:', error);
    },
  });

  return {
    employees,
    isLoading,
    error,
    addEmployee: addEmployee.mutate,
    deleteEmployee: deleteEmployee.mutate,
    isAdding: addEmployee.isPending,
    isDeleting: deleteEmployee.isPending,
  };
};