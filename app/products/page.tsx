'use client';

import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pQuantity, setPQuantity] = useState('');
  const [pCategory, setPCategory] = useState('');

  // Category form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [cName, setCName] = useState('');
  const [cDesc, setCDesc] = useState('');

  const loadData = () => {
    fetch('http://localhost:5000/api/products?limit=100')
      .then(r => r.json()).then(d => setProducts(d.data || []));
    fetch('http://localhost:5000/api/categories')
      .then(r => r.json()).then(d => setCategories(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  // PRODUCT HANDLERS
  const openAddProduct = () => {
    setEditingProduct(null);
    setPName(''); setPSku(''); setPPrice(''); setPQuantity(''); setPCategory('');
    setShowProductForm(true);
  };

  const openEditProduct = (p: any) => {
    setEditingProduct(p);
    setPName(p.name); setPSku(p.sku); setPPrice(p.price);
    setPQuantity(p.quantity); setPCategory(p.category?._id || '');
    setShowProductForm(true);
  };

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const body = JSON.stringify({
      name: pName, sku: pSku,
      price: parseFloat(pPrice),
      quantity: parseInt(pQuantity),
      category: pCategory,
      minQuantity: 10
    });

    const url = editingProduct
      ? `http://localhost:5000/api/products/${editingProduct._id}`
      : 'http://localhost:5000/api/products';

    fetch(url, {
      method: editingProduct ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    }).then(() => { setShowProductForm(false); loadData(); });
  };

  const deleteProduct = (id: string) => {
    if (confirm('Delete product?')) {
      fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' })
        .then(() => loadData());
    }
  };

  // CATEGORY HANDLERS
  const openAddCategory = () => {
    setCName(''); setCDesc('');
    setShowCategoryForm(true);
  };

  const submitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cName, description: cDesc })
    }).then(() => { setShowCategoryForm(false); loadData(); });
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading...</div>;

  return (
    <div className="p-6">
      {/* Header with buttons */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
        <h1 style={{fontSize: 28, fontWeight: 'bold'}}>Products ({products.length})</h1>
        <div style={{display: 'flex', gap: 10}}>
          <button onClick={openAddCategory} style={btnSecondary}>
            + Add Category
          </button>
          <button onClick={openAddProduct} style={btnPrimary}>
            + Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div style={{background: 'white', borderRadius: 8, overflow: 'hidden', marginBottom: 30}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#f9fafb'}}>
              <th style={th}>Name</th><th style={th}>SKU</th><th style={th}>Category</th>
              <th style={th}>Price</th><th style={th}>Qty</th><th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p._id} style={{borderBottom: '1px solid #e5e7eb'}}>
                <td style={td}>{p.name}</td>
                <td style={{...td, color: '#6b7280'}}>{p.sku}</td>
                <td style={{...td, color: '#6b7280'}}>{p.category?.name || '-'}</td>
                <td style={td}>${p.price?.toFixed(2)}</td>
                <td style={td}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 13,
                    backgroundColor: p.quantity === 0 ? '#fee2e2' : p.quantity <= 10 ? '#fef3c7' : '#d1fae5',
                    color: p.quantity === 0 ? '#991b1b' : p.quantity <= 10 ? '#92400e' : '#065f46'
                  }}>{p.quantity}</span>
                </td>
                <td style={td}>
                  <button onClick={() => openEditProduct(p)} style={iconBtn}>✏️</button>
                  <button onClick={() => deleteProduct(p._id)} style={iconBtn}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Categories List */}
      <h2 style={{fontSize: 22, fontWeight: 'bold', marginBottom: 15}}>Categories ({categories.length})</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15}}>
        {categories.map((c: any) => (
          <div key={c._id} style={{background: 'white', padding: 15, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <p style={{fontWeight: 600}}>{c.name}</p>
            <p style={{fontSize: 13, color: '#6b7280'}}>{c.productCount || 0} products</p>
          </div>
        ))}
      </div>

      {/* PRODUCT MODAL */}
      {showProductForm && (
        <Modal onClose={() => setShowProductForm(false)}>
          <h2 style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </h2>
          <form onSubmit={submitProduct}>
            <Input label="Name *" value={pName} onChange={setPName} />
            <Input label="SKU *" value={pSku} onChange={setPSku} />
            <div style={{marginBottom: 15}}>
              <label style={labelStyle}>Category *</label>
              <select required value={pCategory} onChange={e => setPCategory(e.target.value)} style={inputStyle}>
                <option value="">Select</option>
                {categories.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15}}>
              <Input label="Price *" value={pPrice} onChange={setPPrice} type="number" />
              <Input label="Quantity *" value={pQuantity} onChange={setPQuantity} type="number" />
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20}}>
              <button type="button" onClick={() => setShowProductForm(false)} style={btnCancel}>Cancel</button>
              <button type="submit" style={btnPrimary}>{editingProduct ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryForm && (
        <Modal onClose={() => setShowCategoryForm(false)}>
          <h2 style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>Add Category</h2>
          <form onSubmit={submitCategory}>
            <Input label="Name *" value={cName} onChange={setCName} />
            <div style={{marginBottom: 15}}>
              <label style={labelStyle}>Description</label>
              <textarea value={cDesc} onChange={e => setCDesc(e.target.value)} rows={3} style={inputStyle} />
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20}}>
              <button type="button" onClick={() => setShowCategoryForm(false)} style={btnCancel}>Cancel</button>
              <button type="submit" style={btnPrimary}>Create</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Reusable components
function Modal({ children, onClose }: any) {
  return (
    <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
      <div style={{background: 'white', borderRadius: 12, padding: 30, width: 500, maxHeight: '90vh', overflow: 'auto'}}>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: any) {
  return (
    <div style={{marginBottom: 15}}>
      <label style={labelStyle}>{label}</label>
      <input type={type} required={label.includes('*')} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} step={type === 'number' ? '0.01' : undefined} min={0} />
    </div>
  );
}

// Styles
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 5, fontWeight: 500, fontSize: 14 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 };
const th: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' };
const td: React.CSSProperties = { padding: '12px 16px', fontSize: 14 };
const btnPrimary: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14 };
const btnSecondary: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14 };
const btnCancel: React.CSSProperties = { padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: 6, background: 'white', cursor: 'pointer' };
const iconBtn: React.CSSProperties = { marginRight: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 18 };