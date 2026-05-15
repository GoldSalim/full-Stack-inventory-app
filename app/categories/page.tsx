'use client';

import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        console.log('Categories:', data);
        if (data && data.data) {
          setCategories(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xl">Loading categories...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Categories ({categories.length})</h1>
      
      {categories.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl mb-2">No categories found</p>
          <p>Categories will appear here once added to the database</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
            <div key={category._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description || 'No description'}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  <strong>{category.productCount || 0}</strong> products
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  {category.status || 'active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}