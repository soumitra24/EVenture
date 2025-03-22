import React from 'react';
import { AdminData } from './page';

type StoreStatsProps = {
  adminData: AdminData;
};

const StoreStats: React.FC<StoreStatsProps> = ({ adminData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-600 mb-2">Store ID</h2>
        <p className="text-3xl font-bold">{adminData.store_id}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-600 mb-2">Vehicles</h2>
        <p className="text-3xl font-bold">{adminData.number_of_vehicles}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Revenue</h2>
        <p className="text-3xl font-bold">${adminData.total_revenue.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default StoreStats;