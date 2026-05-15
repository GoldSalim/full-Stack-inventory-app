'use client';

import { useEffect, useState } from 'react';

export default function LowStockPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products/low-stock/all')
      .then(res => res.json())
      .then(data => {
        console.log('Low stock data:', data);
        if (data && data.data) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        // Fallback: get all products and filter low stock
        fetch('http://localhost:5000/api/products?limit=100')
          .then(res => res.json())
          .then(data => {
            if (data && data.data) {
              const lowStockProducts = data.data.filter((p: any) => 
                p.quantity <= p.minQuantity
              );
              setProducts(lowStockProducts);
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-3xl">⚠️</span>
          <h1 className="text-3xl font-bold text-gray-800">Low Stock Alerts</h1>
        </div>
        <div className="text-center py-10 text-xl">Loading low stock items...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">⚠️</span>
        <h1 className="text-3xl font-bold text-gray-800">
          Low Stock Alerts ({products.length})
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <span className="text-5xl mb-4 block">🎉</span>
          <p className="text-xl text-green-600 font-semibold">All products are well stocked!</p>
          <p className="text-gray-500 mt-2">No items need restocking at this time.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product: any) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.description?.substring(0, 50)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.category?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.quantity === 0 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.minQuantity}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.quantity === 0 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.quantity === 0 ? 'OUT OF STOCK' : 'LOW STOCK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-6 text-sm">
              <span>
                <span className="font-semibold text-red-600">
                  {products.filter(p => p.quantity === 0).length}
                </span> Out of Stock
              </span>
              <span>
                <span className="font-semibold text-yellow-600">
                  {products.filter(p => p.quantity > 0).length}
                </span> Low Stock
              </span>
              <span>
                <span className="font-semibold text-gray-600">
                  {products.length}
                </span> Total Alerts
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}