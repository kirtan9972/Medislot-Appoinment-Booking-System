import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState([
    { _id: '1', name: 'Paracetamol 500mg', category: 'Medicine', stock: 1500, unit: 'Tablets', status: 'In Stock' },
    { _id: '2', name: 'Surgical Masks', category: 'Supplies', stock: 50, unit: 'Boxes', status: 'Low Stock' },
    { _id: '3', name: 'Amoxicillin', category: 'Antibiotics', stock: 200, unit: 'Capsules', status: 'In Stock' },
    { _id: '4', name: 'Hand Sanitizer 500ml', category: 'Supplies', stock: 0, unit: 'Bottles', status: 'Out of Stock' },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock': return <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2 x-small fw-bold">IN STOCK</span>;
      case 'Low Stock': return <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-2 x-small fw-bold">LOW STOCK</span>;
      case 'Out of Stock': return <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2 x-small fw-bold">OUT OF STOCK</span>;
      default: return <span className="badge rounded-pill bg-secondary px-3 py-2 x-small fw-bold">UNKNOWN</span>;
    }
  };

  return (
    <div className="p-3 p-md-4 p-lg-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-4 mb-md-5">
        <div>
          <h2 className="serif h2 mb-1 text-dark">Inventory Management</h2>
          <p className="text-muted small mb-0 fw-medium">Monitor and manage hospital medical supplies and pharmacy stock.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2 rounded-pill px-4 py-2.5 shadow-lg hover:scale-105 transition-all fw-bold">
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-[32px] bg-white overflow-hidden">
        <div className="card-header bg-white py-4 px-4 px-md-5 border-0">
          <div className="position-relative" style={{ maxWidth: '400px' }}>
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
            <input 
              type="text" 
              className="form-control ps-5 py-2.5 rounded-pill border-light bg-light focus:bg-white focus:border-primary shadow-none transition-all" 
              placeholder="Search inventory..." 
            />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 px-md-5 py-3 border-0 text-muted small fw-bold uppercase tracking-wider x-small">Item Name</th>
                <th className="py-3 border-0 text-muted small fw-bold uppercase tracking-wider x-small">Category</th>
                <th className="py-3 border-0 text-muted small fw-bold uppercase tracking-wider x-small">Stock Level</th>
                <th className="py-3 border-0 text-muted small fw-bold uppercase tracking-wider x-small">Status</th>
                <th className="py-3 border-0 text-end px-4 px-md-5 text-muted small fw-bold uppercase tracking-wider x-small">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className="transition-all">
                  <td className="px-4 px-md-5 py-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light p-2 rounded-xl text-primary">
                        <Package size={20} />
                      </div>
                      <span className="fw-bold text-dark serif">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-muted small fw-medium">{item.category}</span>
                  </td>
                  <td className="py-4">
                    <div className="d-flex align-items-center gap-2 fw-bold text-dark small">
                      {item.stock} {item.unit}
                      {item.stock < 100 && <AlertCircle size={16} className="text-warning animate-pulse" />}
                    </div>
                  </td>
                  <td className="py-4">{getStatusBadge(item.status)}</td>
                  <td className="py-4 text-end px-4 px-md-5">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-light p-2.5 rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-sm btn-light p-2.5 rounded-xl text-danger hover:bg-danger hover:text-white transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
