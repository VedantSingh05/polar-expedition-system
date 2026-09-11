import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import AlertBanner from '../../components/ui/AlertBanner.jsx';
import InventoryForm from './InventoryForm.jsx';
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../../api/inventory.api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Plus, Edit2, Trash2, Search, AlertTriangle, CheckCircle, Archive, Shield } from 'lucide-react';

export default function InventoryPage() {
  const { user } = useAuth();
  const canWrite = user?.role === 'commander' || user?.role === 'logistics_officer';

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await getInventory();
      setInventory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to fetch station inventory records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete inventory record "${name}"?`)) return;
    try {
      await deleteInventoryItem(id);
      setAlert({ type: 'success', message: `Inventory item "${name}" removed.` });
      fetchInventory();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.error || 'Failed to delete item.' });
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingItem) {
        await updateInventoryItem(editingItem.id, formData);
        setAlert({ type: 'success', message: 'Inventory item updated successfully.' });
      } else {
        await createInventoryItem(formData);
        setAlert({ type: 'success', message: 'New inventory item added to catalog.' });
      }
      setModalOpen(false);
      fetchInventory();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.error || 'Error saving inventory item.' });
    } finally {
      setFormLoading(false);
    }
  };

  const lowStockCount = inventory.filter(i => i.is_low_stock || i.quantity <= i.min_threshold).length;

  const filtered = inventory.filter(item => {
    const isLow = item.is_low_stock || item.quantity <= item.min_threshold;
    const matchesLowStock = !onlyLowStock || isLow;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLowStock && matchesCategory && matchesSearch;
  });

  const columns = [
    {
      key: 'name',
      label: 'Inventory Item',
      render: (_, row) => {
        const isLow = row.is_low_stock || row.quantity <= row.min_threshold;
        return (
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-[#F9FAFB]">{row.name}</p>
              {isLow && (
                <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Low Stock
                </span>
              )}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{row.location || 'General Stores'}</p>
          </div>
        );
      }
    },
    {
      key: 'category',
      label: 'Category',
      render: (val) => <Badge value={val} />
    },
    {
      key: 'quantity',
      label: 'Stock Level / Unit',
      render: (val, row) => {
        const isLow = row.is_low_stock || row.quantity <= row.min_threshold;
        return (
          <div>
            <span className={`font-semibold text-sm ${isLow ? 'text-red-400 font-bold' : 'text-[#F9FAFB]'}`}>
              {val}
            </span>
            <span className="text-xs text-[#9CA3AF] ml-1">{row.unit}</span>
          </div>
        );
      }
    },
    {
      key: 'min_threshold',
      label: 'Min Safety Threshold',
      render: (val, row) => (
        <span className="text-xs text-[#9CA3AF]">
          {val} {row.unit}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Stock Status',
      render: (_, row) => {
        const isLow = row.is_low_stock || row.quantity <= row.min_threshold;
        return isLow ? (
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Reorder Urgent</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[#34D399] text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-[#34D399]" />
            <span>Adequate</span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        canWrite ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(row)}
              className="p-1.5 bg-[#1F2937] hover:bg-[#1F2937]/80 text-[#38BDF8] rounded transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(row.id, row.name)}
              className="p-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-[#9CA3AF] italic">Stock Monitored</span>
        )
      )
    }
  ];

  return (
    <PageWrapper title="Inventory & Base Station Stores">
      <AlertBanner
        type={alert?.type}
        message={alert?.message}
        onClose={() => setAlert(null)}
      />

      {/* Low stock notice banner */}
      {lowStockCount > 0 && (
        <div className="bg-red-950/50 border border-red-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse flex-shrink-0" />
            <div>
              <p className="text-red-200 font-semibold text-sm">
                CRITICAL INVENTORY ALERT: {lowStockCount} ITEM{lowStockCount > 1 ? 'S' : ''} BELOW SAFETY THRESHOLD
              </p>
              <p className="text-red-300 text-xs mt-0.5">
                Immediate requisition required to avoid stockouts in polar winter conditions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className="bg-red-900 hover:bg-red-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            {onlyLowStock ? 'Show All Items' : 'Filter Low Stock'}
          </button>
        </div>
      )}

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[#F9FAFB] text-xl font-bold">Station Supplies & Warehouse Catalog</h2>
          <p className="text-[#9CA3AF] text-xs mt-0.5">
            Monitor reserve quantities, safety buffers, and consumable depletion rates
          </p>
        </div>
        {canWrite ? (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#38BDF8] text-[#0B1120] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-[#7DD3FC] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Inventory Item
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-700/40 rounded-lg">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-medium">Read-Only: Central Stores Catalog</span>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search supplies, storage bay..."
            className="w-full bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        {/* Dropdown & Toggle Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              onlyLowStock
                ? 'bg-red-600 text-white'
                : 'bg-[#1F2937] text-[#9CA3AF] hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Low Stock Only ({lowStockCount})
          </button>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="all">All Categories</option>
            <option value="equipment">Equipment & Spares</option>
            <option value="safety">Safety Suits</option>
            <option value="scientific">Scientific</option>
            <option value="fuel">Fuel Reserves</option>
            <option value="food">Rations</option>
            <option value="medical">Medical</option>
            <option value="other">General</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#111827] border border-[#1E3A5F] rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-[#38BDF8]">Loading inventory stock records...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            rowClassName={(row) => (row.is_low_stock || row.quantity <= row.min_threshold) ? 'bg-red-950/20' : ''}
            emptyMessage="No inventory items match the current criteria."
          />
        )}
      </div>

      {/* Modal */}
      {canWrite && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem ? 'Edit Inventory Item' : 'Add Item to Inventory Catalog'}
        >
          <InventoryForm
            initialData={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalOpen(false)}
            loading={formLoading}
          />
        </Modal>
      )}
    </PageWrapper>
  );
}
