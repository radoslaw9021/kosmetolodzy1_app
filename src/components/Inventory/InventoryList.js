import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  AlertTriangle,
  TrendingDown,
  Calendar,
  Tag,
  SortAsc,
  SortDesc
} from 'lucide-react';
import InventoryItem from './InventoryItem';
import InventoryForm from './InventoryForm';

export default function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Przykładowe dane produktów
  const sampleProducts = [
    {
      id: '1',
      name: 'Krem nawilżający z kwasem hialuronowym',
      sku: 'CREAM-001',
      brand: 'DermaLux',
      category: 'Kremy',
      description: 'Intensywnie nawilżający krem z kwasem hialuronowym dla wszystkich typów skóry',
      quantity: 15,
      minQuantity: 5,
      price: 89.99,
      expiryDate: '2024-12-31',
      supplier: 'DermaLux Sp. z o.o.',
      location: 'Regał A, Półka 1',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Serum z witaminą C',
      sku: 'SERUM-002',
      brand: 'SkinGlow',
      category: 'Sera',
      description: 'Antyoksydacyjne serum z 20% witaminą C dla rozjaśnienia skóry',
      quantity: 3,
      minQuantity: 5,
      price: 129.99,
      expiryDate: '2024-06-15',
      supplier: 'SkinGlow Cosmetics',
      location: 'Regał B, Półka 2',
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      name: 'Peeling enzymatyczny',
      sku: 'PEEL-003',
      brand: 'BioCare',
      category: 'Peelingi',
      description: 'Delikatny peeling enzymatyczny z papainą dla wrażliwej skóry',
      quantity: 0,
      minQuantity: 3,
      price: 75.50,
      expiryDate: '2024-08-20',
      supplier: 'BioCare Laboratories',
      location: 'Regał C, Półka 1',
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '4',
      name: 'Maska algowa',
      sku: 'MASK-004',
      brand: 'OceanBeauty',
      category: 'Maski',
      description: 'Odżywcza maska z algami morskimi dla skóry suchej',
      quantity: 8,
      minQuantity: 4,
      price: 45.00,
      expiryDate: '2024-03-10',
      supplier: 'OceanBeauty Ltd.',
      location: 'Regał A, Półka 3',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '5',
      name: 'Tonik oczyszczający',
      sku: 'TONIC-005',
      brand: 'PureSkin',
      category: 'Toniki',
      description: 'Łagodny tonik oczyszczający z kwasem salicylowym',
      quantity: 12,
      minQuantity: 6,
      price: 35.99,
      supplier: 'PureSkin Cosmetics',
      location: 'Regał B, Półka 1',
      createdAt: '2024-01-08T11:20:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ];

  // Wczytaj dane z localStorage
  useEffect(() => {
    const stored = localStorage.getItem('inventory');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInventory(parsed);
      } catch (error) {
        console.error('Błąd wczytywania inventory:', error);
        setInventory([]);
      }
    } else {
      // Jeśli brak danych, dodaj przykładowe produkty
      setInventory(sampleProducts);
    }
  }, []);

  // Zapisz do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Filtrowanie i sortowanie
  useEffect(() => {
    let filtered = [...inventory];

    // Filtrowanie po wyszukiwaniu
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrowanie po kategorii
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filtrowanie po statusie
    if (selectedStatus) {
      filtered = filtered.filter(item => {
        const stockStatus = getStockStatus(item);
        const expiryStatus = getExpiryStatus(item);
        
        switch (selectedStatus) {
          case 'low':
            return stockStatus.status === 'low';
          case 'out':
            return stockStatus.status === 'out';
          case 'expired':
            return expiryStatus.status === 'expired';
          case 'expiring':
            return expiryStatus.status === 'warning';
          default:
            return true;
        }
      });
    }

    // Sortowanie
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'expiry':
          aValue = a.expiryDate ? new Date(a.expiryDate) : new Date('9999-12-31');
          bValue = b.expiryDate ? new Date(b.expiryDate) : new Date('9999-12-31');
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const getStockStatus = (item) => {
    if (item.quantity <= 0) return { status: 'out', text: 'Brak' };
    if (item.quantity <= item.minQuantity) return { status: 'low', text: 'Niski' };
    return { status: 'ok', text: 'OK' };
  };

  const getExpiryStatus = (item) => {
    if (!item.expiryDate) return { status: 'none' };
    
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired' };
    if (diffDays <= 30) return { status: 'warning' };
    return { status: 'ok' };
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      setInventory(prev => prev.map(item => 
        item.id === editingItem.id ? itemData : item
      ));
    } else {
      setInventory(prev => [...prev, itemData]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      setInventory(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setInventory(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Statystyki
  const stats = {
    total: inventory.length,
    lowStock: inventory.filter(item => getStockStatus(item).status === 'low').length,
    outOfStock: inventory.filter(item => getStockStatus(item).status === 'out').length,
    expiring: inventory.filter(item => getExpiryStatus(item).status === 'warning').length,
    expired: inventory.filter(item => getExpiryStatus(item).status === 'expired').length
  };

  // Kategorie
  const categories = [...new Set(inventory.map(item => item.category).filter(Boolean))];

  return (
    <div className="inventory-page">
      {/* Nagłówek */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Zarządzanie zapasami</h1>
          </div>
          <button
            onClick={handleAddItem}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj produkt</span>
          </button>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="stat-card">
            <div className="stat-icon bg-blue-100">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Wszystkie produkty</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon bg-orange-100">
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.lowStock}</div>
              <div className="stat-label">Niski stan</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.outOfStock}</div>
              <div className="stat-label">Brak w magazynie</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon bg-yellow-100">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.expiring}</div>
              <div className="stat-label">Wkrótce przeterminowane</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.expired}</div>
              <div className="stat-label">Przeterminowane</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtry i wyszukiwanie */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Wyszukiwanie */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Kategoria */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Wszystkie statusy</option>
            <option value="low">Niski stan</option>
            <option value="out">Brak w magazynie</option>
            <option value="expiring">Wkrótce przeterminowane</option>
            <option value="expired">Przeterminowane</option>
          </select>

          {/* Sortowanie */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sortuj:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name-asc">Nazwa A-Z</option>
              <option value="name-desc">Nazwa Z-A</option>
              <option value="quantity-asc">Ilość rosnąco</option>
              <option value="quantity-desc">Ilość malejąco</option>
              <option value="price-asc">Cena rosnąco</option>
              <option value="price-desc">Cena malejąco</option>
              <option value="expiry-asc">Data ważności</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista produktów */}
      <div className="space-y-4">
        {filteredInventory.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {inventory.length === 0 ? 'Brak produktów w magazynie' : 'Nie znaleziono produktów'}
            </h3>
            <p className="text-gray-600 mb-4">
              {inventory.length === 0 
                ? 'Dodaj pierwszy produkt, aby rozpocząć zarządzanie zapasami.'
                : 'Spróbuj zmienić filtry wyszukiwania.'
              }
            </p>
            {inventory.length === 0 && (
              <button
                onClick={handleAddItem}
                className="btn-primary"
              >
                Dodaj pierwszy produkt
              </button>
            )}
          </div>
        ) : (
          filteredInventory.map(item => (
            <InventoryItem
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))
        )}
      </div>

      {/* Formularz */}
      {showForm && (
        <InventoryForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          categories={categories}
        />
      )}
    </div>
  );
} 