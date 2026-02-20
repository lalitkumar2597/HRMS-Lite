/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee } from '../types';

interface EmployeeContextType {
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
  refreshEmployees: boolean;
  triggerRefresh: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [refreshEmployees, setRefreshEmployees] = useState(false);

  const triggerRefresh = () => {
    setRefreshEmployees(prev => !prev);
  };

  return (
    <EmployeeContext.Provider
      value={{
        selectedEmployee,
        setSelectedEmployee,
        refreshEmployees,
        triggerRefresh,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
};