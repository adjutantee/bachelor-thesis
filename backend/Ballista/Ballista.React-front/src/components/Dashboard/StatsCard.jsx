import React from 'react';

export default function StatsCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-[70vh]">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}