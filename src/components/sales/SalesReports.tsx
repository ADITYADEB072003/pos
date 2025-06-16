import React, { useState, useMemo } from 'react';
import { Sale, User } from '../../types';
import { DailySalesView } from './DailySalesView';
import { SalesHistory } from './SalesHistory';
import { SalesAnalytics } from './SalesAnalytics';
import { Calendar, TrendingUp, History } from 'lucide-react';

interface SalesReportsProps {
  sales: Sale[];
  currentUser: User;
}

export const SalesReports: React.FC<SalesReportsProps> = ({ 
  sales, 
  currentUser 
}) => {
  const [activeTab, setActiveTab] = useState('daily');

  const tabs = [
    { id: 'daily', label: 'Daily Sales', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'history', label: 'Sales History', icon: History },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Reports</h1>
        <p className="text-gray-600">Track your sales performance and analyze trends</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'daily' && <DailySalesView sales={sales} />}
      {activeTab === 'analytics' && <SalesAnalytics sales={sales} />}
      {activeTab === 'history' && <SalesHistory sales={sales} />}
    </div>
  );
};