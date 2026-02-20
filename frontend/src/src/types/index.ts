export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  status: 'Present' | 'Absent';
  created_at: string;
}

export interface AttendanceSummary {
  employee_id: string;
  full_name: string;
  total_present: number;
  total_absent: number;
  attendance_percentage: number;
}

export interface EmployeeFormData {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface AttendanceFormData {
  employee_id: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface ApiError {
  message: string;
  statusCode?: number;
}