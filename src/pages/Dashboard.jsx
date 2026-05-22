import React from 'react';
import Navbar from '../components/landing/Navbar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import MetricCards from '../components/dashboard/MetricCards';
import ApiUsageChart from '../components/dashboard/ApiUsageChart';
import RevenueChart from '../components/dashboard/RevenueChart';
import ErrorRateChart from '../components/dashboard/ErrorRateChart';
import TopEndpointsTable from '../components/dashboard/TopEndpointsTable';
import { DashboardProvider } from '../components/dashboard/DashboardContext';

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#F6F9FC]">
        <Navbar />
        <div className="pt-[70px]">
          <div className="max-w-[1200px] mx-auto px-6 py-10">
            <DashboardHeader />
            <MetricCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <ApiUsageChart />
              </div>
              <div>
                <ErrorRateChart />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <TopEndpointsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}