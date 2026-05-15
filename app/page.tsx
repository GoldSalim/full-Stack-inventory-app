'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        console.log('Dashboard:', data);
        if (data && data.data) {
          setStats(data.data.overview);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xl">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalProducts || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Active: {stats.activeProducts || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalCategories || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
            <p className="text-3xl font-bold mt-2">
              ${(stats.totalValue || 0).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.lowStock || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Out of stock: {stats.outOfStock || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}