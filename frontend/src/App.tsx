import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import {
  EmployeeProvider,
  useEmployeeContext,
} from "./src/contexts/EmployeeContext";
import { EmployeeForm } from "./src/components/EmployeeForm";
import { EmployeeList } from "./src/components/EmployeeList";
import { AttendanceForm } from "./src/components/AttendanceForm";
import { AttendanceList } from "./src/components/AttendanceList";
import { Dashboard } from "./src/components/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Tab = "dashboard" | "employees" | "attendance";

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { selectedEmployee } = useEmployeeContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">
                  HRMS Lite
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`${
                    activeTab === "dashboard"
                      ? "border-primary-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("employees")}
                  className={`${
                    activeTab === "employees"
                      ? "border-primary-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Employees
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`${
                    activeTab === "attendance"
                      ? "border-primary-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Attendance
                </button>
              </div>
            </div>
            {selectedEmployee && activeTab === "attendance" && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600">
                  Selected:{" "}
                  <span className="font-medium">
                    {selectedEmployee.full_name}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <Dashboard />}

        {activeTab === "employees" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <EmployeeForm />
            </div>
            <div className="lg:col-span-2">
              <EmployeeList />
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <AttendanceForm />
            </div>
            <div className="lg:col-span-2">
              <AttendanceList />
            </div>
          </div>
        )}
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EmployeeProvider>
        <MainContent />
      </EmployeeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
