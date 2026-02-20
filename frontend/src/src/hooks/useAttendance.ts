/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Attendance, AttendanceFormData, AttendanceSummary } from '../types';
import toast from 'react-hot-toast';

export const useAttendance = (employeeId?: string) => {
  const queryClient = useQueryClient();

  // Fetch attendance for specific employee OR all attendance
  const { data: attendance = [], isLoading, error } = useQuery({
    queryKey: ['attendance', employeeId || 'all'],
    queryFn: async () => {
      if (employeeId) {
        const response = await apiClient.get<Attendance[]>(`/attendance/employee/${employeeId}`);
        return response.data;
      } else {
        const response = await apiClient.get<Attendance[]>('/attendance/all');
        return response.data;
      }
    },
    enabled: true, 
  });

  const { data: summary = [] } = useQuery({
    queryKey: ['attendance-summary'],
    queryFn: async () => {
      const response = await apiClient.get<AttendanceSummary[]>('/attendance/summary');
      return response.data;
    },
  });

  const markAttendance = useMutation({
    mutationFn: async (attendanceData: AttendanceFormData) => {
      const response = await apiClient.post<Attendance>('/attendance', attendanceData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', variables.employee_id] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-summary'] });
      toast.success('Attendance marked successfully');
    },
    onError: (error: any) => {
      console.error('Error marking attendance:', error);
    },
  });

  return {
    attendance,
    summary,
    isLoading,
    error,
    markAttendance: markAttendance.mutate,
    isMarking: markAttendance.isPending,
  };
};