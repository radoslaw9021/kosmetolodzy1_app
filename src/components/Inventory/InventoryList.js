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
    <div className="inventory-page" style={{ 
      background: 'var(--glass-bg, rgba(30,18,40,0.65))',
      minHeight: '100vh',
      padding: '2rem 1rem'
    }}>
      {/* Nagłówek Premium */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="stat-icon" style={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              padding: '0.8rem',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
            }}>
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{
                background: 'linear-gradient(90deg, #a18cd1, #fbc2eb 60%, #667eea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 12px rgba(168, 85, 247, 0.3)'
              }}>
                Zarządzanie zapasami
              </h1>
              <p className="text-gray-300 mt-1">Monitoruj stan magazynu i zarządzaj produktami</p>
            </div>
          </div>
          <button
            onClick={handleAddItem}
            className="btn-primary flex items-center space-x-2"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #c084fc)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.8rem 1.5rem',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 8px 32px rgba(168, 85, 247, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.3)';
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj produkt</span>
          </button>
        </div>

        {/* Statystyki Premium */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <div className="stat-card">
            <div className="stat-icon" style={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              padding: '0.8rem',
              marginBottom: '1rem'
            }}>
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Wszystkie produkty</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ 
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              borderRadius: '50%',
              padding: '0.8rem',
              marginBottom: '1rem'
            }}>
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.lowStock}</div>
              <div className="stat-label">Niski stan</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ 
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
              borderRadius: '50%',
              padding: '0.8rem',
              marginBottom: '1rem'
            }}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.outOfStock}</div>
              <div className="stat-label">Brak w magazynie</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ 
              background: 'linear-gradient(135deg, #feca57, #ff9ff3)',
              borderRadius: '50%',
              padding: '0.8rem',
              marginBottom: '1rem'
            }}>
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.expiring}</div>
              <div className="stat-label">Wkrótce przeterminowane</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ 
              background: 'linear-gradient(135deg, #ff3838, #ff6348)',
              borderRadius: '50%',
              padding: '0.8rem',
              marginBottom: '1rem'
            }}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.expired}</div>
              <div className="stat-label">Przeterminowane</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtry i wyszukiwanie Premium */}
      <div className="mb-8" style={{
        background: 'rgba(30, 28, 50, 0.5)',
        backdropFilter: 'blur(18px)',
        border: '1.5px solid rgba(255, 255, 255, 0.13)',
        borderRadius: '1.5rem',
        padding: '2rem',
        boxShadow: '0 0 32px 0 #a855f7aa, 0 1.5px 0 0 #fff1'
      }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Wyszukiwanie */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 3rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                e.target.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <style jsx>{`
              input::placeholder {
                color: rgba(255, 255, 255, 0.6);
              }
            `}</style>
          </div>

          {/* Kategoria */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.8rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
              e.target.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.3)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="" style={{ background: '#1e1b2e', color: '#fff' }}>Wszystkie kategorie</option>
            {categories.map(category => (
              <option key={category} value={category} style={{ background: '#1e1b2e', color: '#fff' }}>{category}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '0.8rem 1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
              e.target.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.3)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="" style={{ background: '#1e1b2e', color: '#fff' }}>Wszystkie statusy</option>
            <option value="low" style={{ background: '#1e1b2e', color: '#fff' }}>Niski stan</option>
            <option value="out" style={{ background: '#1e1b2e', color: '#fff' }}>Brak w magazynie</option>
            <option value="expiring" style={{ background: '#1e1b2e', color: '#fff' }}>Wkrótce przeterminowane</option>
            <option value="expired" style={{ background: '#1e1b2e', color: '#fff' }}>Przeterminowane</option>
          </select>

          {/* Sortowanie */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300 font-medium">Sortuj:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              style={{
                padding: '0.8rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                e.target.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="name-asc" style={{ background: '#1e1b2e', color: '#fff' }}>Nazwa A-Z</option>
              <option value="name-desc" style={{ background: '#1e1b2e', color: '#fff' }}>Nazwa Z-A</option>
              <option value="quantity-asc" style={{ background: '#1e1b2e', color: '#fff' }}>Ilość rosnąco</option>
              <option value="quantity-desc" style={{ background: '#1e1b2e', color: '#fff' }}>Ilość malejąco</option>
              <option value="price-asc" style={{ background: '#1e1b2e', color: '#fff' }}>Cena rosnąco</option>
              <option value="price-desc" style={{ background: '#1e1b2e', color: '#fff' }}>Cena malejąco</option>
              <option value="expiry-asc" style={{ background: '#1e1b2e', color: '#fff' }}>Data ważności</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista produktów */}
      <div className="space-y-4">
        {filteredInventory.length === 0 ? (
          <div className="text-center py-16" style={{
            background: 'rgba(30, 28, 50, 0.5)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(255, 255, 255, 0.13)',
            borderRadius: '1.5rem',
            boxShadow: '0 0 32px 0 #a855f7aa, 0 1.5px 0 0 #fff1'
          }}>
            <div className="stat-icon" style={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              padding: '1.5rem',
              margin: '0 auto 2rem auto',
              width: 'fit-content'
            }}>
              <Package className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{
              background: 'linear-gradient(90deg, #a18cd1, #fbc2eb 60%, #667eea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 12px rgba(168, 85, 247, 0.3)'
            }}>
              {inventory.length === 0 ? 'Brak produktów w magazynie' : 'Nie znaleziono produktów'}
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              {inventory.length === 0 
                ? 'Dodaj pierwszy produkt, aby rozpocząć zarządzanie zapasami.'
                : 'Spróbuj zmienić filtry wyszukiwania.'
              }
            </p>
            {inventory.length === 0 && (
              <button
                onClick={handleAddItem}
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #c084fc)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 8px 32px rgba(168, 85, 247, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.3)';
                }}
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