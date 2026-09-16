import React from 'react';

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse pb-12">
    <div className="h-44 rounded-2xl bg-navy-card/60 border border-white/5" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-64 rounded-2xl bg-navy-card/60 border border-white/5" />
      <div className="h-64 rounded-2xl bg-navy-card/60 border border-white/5" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-56 rounded-2xl bg-navy-card/60 border border-white/5" />
      <div className="h-56 rounded-2xl bg-navy-card/60 border border-white/5" />
      <div className="h-56 rounded-2xl bg-navy-card/60 border border-white/5" />
    </div>
  </div>
);

export const OpportunitySkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="h-64 rounded-2xl bg-navy-card/60 border border-white/5 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-12 h-12 rounded-xl bg-white/5" />
          <div className="w-20 h-5 rounded-full bg-white/5" />
        </div>
        <div className="w-3/4 h-6 rounded bg-white/5" />
        <div className="w-1/2 h-4 rounded bg-white/5" />
        <div className="w-full h-10 rounded bg-white/5" />
      </div>
    ))}
  </div>
);
