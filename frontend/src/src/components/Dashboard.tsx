import React, { useMemo } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { useAttendance } from "../hooks/useAttendance";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";

export const Dashboard: React.FC = () => {
  const {
    employees,
    isLoading: employeesLoading,
    error: employeesError,
  } = useEmployees();

  const {
    attendance,
    summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useAttendance();

  // ✅ ALL hooks must be declared before any return
  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const totalPresentToday = useMemo(() => {
    return attendance.filter(
      (record) => record.date === today && record.status === "Present",
    ).length;
  }, [attendance, today]);

  const averageAttendance = useMemo(() => {
    if (summary.length === 0) return 0;
    return (
      summary.reduce((acc, curr) => acc + curr.attendance_percentage, 0) /
      summary.length
    ).toFixed(1);
  }, [summary]);

  const topPerformers = useMemo(() => {
    return [...summary]
      .sort((a, b) => b.attendance_percentage - a.attendance_percentage)
      .slice(0, 5);
  }, [summary]);

  if (employeesLoading || summaryLoading) return <LoadingSpinner />;

  if (employeesError || summaryError) {
    return <ErrorMessage message="Failed to load dashboard data." />;
  }

  const totalEmployees = employees.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-primary-50">
          <h3 className="text-lg font-medium text-primary-900 mb-2">
            Total Employees
          </h3>
          <p className="text-3xl font-bold text-primary-700">
            {totalEmployees}
          </p>
        </div>

        <div className="card bg-green-50">
          <h3 className="text-lg font-medium text-green-900 mb-2">
            Present Today
          </h3>
          <p className="text-3xl font-bold text-green-700">
            {totalPresentToday}
          </p>
        </div>

        <div className="card bg-purple-50">
          <h3 className="text-lg font-medium text-purple-900 mb-2">
            Avg. Attendance
          </h3>
          <p className="text-3xl font-bold text-purple-700">
            {averageAttendance}%
          </p>
        </div>
      </div>

      {topPerformers.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Top Performers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Present Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Absent Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Attendance %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPerformers.map((performer) => (
                  <tr key={performer.employee_id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {performer.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {performer.employee_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {performer.total_present}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {performer.total_absent}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">
                          {performer.attendance_percentage.toFixed(1)}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 rounded-full h-2"
                            style={{
                              width: `${performer.attendance_percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
