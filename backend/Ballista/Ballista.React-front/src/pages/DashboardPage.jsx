import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ProfileCard from '../components/dashboard/ProfileCard';
import StatsCard from '../components/dashboard/StatsCard';
import HistoryCard from '../components/dashboard/HistoryCard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Profile Card - 270px width */}
          <div className="col-span-3">
            <ProfileCard />
          </div>
          
          {/* Stats Cards - 495px width each */}
          <div className="col-span-9">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <StatsCard title="Текущая сессия">
                {/* Add session content here */}
              </StatsCard>
              <StatsCard title="Прогресс">
                {/* Add progress content here */}
              </StatsCard>
            </div>
            
            {/* History Card - 495px width */}
            <HistoryCard />
          </div>
        </div>
      </main>
    </div>
  );
}