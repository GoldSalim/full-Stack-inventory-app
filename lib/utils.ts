export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStockStatusColor = (quantity: number, minQuantity: number): string => {
  if (quantity === 0) return 'bg-red-100 text-red-800';
  if (quantity <= minQuantity) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

export const getStockStatusText = (quantity: number, minQuantity: number): string => {
  if (quantity === 0) return 'Out of Stock';
  if (quantity <= minQuantity) return 'Low Stock';
  return 'In Stock';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'discontinued': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};