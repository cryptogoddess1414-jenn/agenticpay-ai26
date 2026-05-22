import React, { createContext, useContext } from 'react';
import { useDashboardData } from './useDashboardData';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const data = useDashboardData();
  return <DashboardContext.Provider value={data}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  return useContext(DashboardContext);
}