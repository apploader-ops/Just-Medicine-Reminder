import React from 'react';
import { PillIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <PillIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Just Medicine Reminder</h1>
        </div>
        <p className="text-slate-500 mt-1">Your simple, multi-person medicine reminder.</p>
      </div>
    </header>
  );
};
