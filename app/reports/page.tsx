'use client';

import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  quantity: number;
  minQuantity: number;
  category: { name: string };
  status: string;
  supplier: string;
  location: string;
}

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('inventory');

  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xl">Loading reports...</div>;
  }

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
  const totalProfit = totalValue - totalCost;
  const profitMargin = totalValue > 0 ? ((totalProfit / totalValue) * 100).toFixed(1) : '0';
  
  const activeProducts = products.filter(p => p.status === 'active').length;
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= p.minQuantity).length;
  const healthyStock = products.filter(p => p.quantity > p.minQuantity).length;

  // Products by category
  const categoryStats = products.reduce((acc: any, product) => {
    const catName = product.category?.name || 'Uncategorized';
    if (!acc[catName]) {
      acc[catName] = { count: 0, value: 0, quantity: 0 };
    }
    acc[catName].count++;
    acc[catName].value += product.price * product.quantity;
    acc[catName].quantity += product.quantity;
    return acc;
  }, {});

  // Products by supplier
  const supplierStats = products.reduce((acc: any, product) => {
    const supplier = product.supplier || 'Unknown';
    if (!acc[supplier]) {
      acc[supplier] = { count: 0, value: 0 };
    }
    acc[supplier].count++;
    acc[supplier].value += product.price * product.quantity;
    return acc;
  }, {});

  // Products by location
  const locationStats = products.reduce((acc: any, product) => {
    const location = product.location || 'Unknown';
    if (!acc[location]) {
      acc[location] = { count: 0, value: 0 };
    }
    acc[location].count++;
    acc[location].value += product.price * product.quantity;
    return acc;
  }, {});

  // Top 5 most valuable products
  const topValuable = [...products]
    .map(p => ({ name: p.name, value: p.price * p.quantity, quantity: p.quantity }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Top 5 products with highest profit margin
  const topMargin = [...products]
    .filter(p => p.costPrice > 0)
    .map(p => ({
      name: p.name,
      margin: ((p.price - p.costPrice) / p.price * 100).toFixed(1),
      profit: p.price - p.costPrice
    }))
    .sort((a, b) => parseFloat(b.margin) - parseFloat(a.margin))
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setReportType('inventory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              reportType === 'inventory' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Inventory Summary
          </button>
          <button
            onClick={() => setReportType('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              reportType === 'categories' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setReportType('suppliers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              reportType === 'suppliers' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            By Supplier
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold">{totalProducts}</p>
          <p className="text-xs text-gray-500">{activeProducts} active</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Inventory Value</p>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Cost: ${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Potential Profit</p>
          <p className="text-2xl font-bold text-green-600">${totalProfit.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{profitMargin}% margin</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Stock Health</p>
          <p className="text-2xl font-bold">{healthyStock}</p>
          <p className="text-xs text-red-500">{outOfStock} out of stock, {lowStock} low</p>
        </div>
      </div>

      {/* Inventory Summary Report */}
      {reportType === 'inventory' && (
        <div className="space-y-6">
          {/* Stock Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Stock Status Distribution</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{healthyStock}</p>
                <p className="text-sm text-gray-600">Healthy Stock</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">{lowStock}</p>
                <p className="text-sm text-gray-600">Low Stock</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">{outOfStock}</p>
                <p className="text-sm text-gray-600">Out of Stock</p>
              </div>
            </div>
          </div>

          {/* Top 5 Most Valuable Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Top 5 Most Valuable Products</h2>
            <div className="space-y-3">
              {topValuable.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-blue-600">${product.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Profit Margins */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Top 5 Products by Profit Margin</h2>
            <div className="space-y-3">
              {topMargin.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">Profit: ${product.profit.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {product.margin}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Categories Report */}
      {reportType === 'categories' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% of Inventory</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(categoryStats).map(([category, stats]: [string, any]) => (
                <tr key={category}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{stats.count}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{stats.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${stats.value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {totalValue > 0 ? ((stats.value / totalValue) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Suppliers Report */}
      {reportType === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% of Inventory</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(supplierStats).map(([supplier, stats]: [string, any]) => (
                  <tr key={supplier}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{supplier}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{stats.count}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${stats.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {totalValue > 0 ? ((stats.value / totalValue) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Location Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Inventory by Location</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(locationStats).map(([location, stats]: [string, any]) => (
                <div key={location} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{location}</p>
                  <p className="text-sm text-gray-500">{stats.count} products</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">${stats.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Print Button */}
      <div className="mt-6 text-right">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🖨️ Print Report
        </button>
      </div>
    </div>
  );
}