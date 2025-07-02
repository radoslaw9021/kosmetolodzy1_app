import React, { useState } from 'react';
import { 
  Package, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  TrendingDown,
  Calendar,
  Tag
} from 'lucide-react';

export default function InventoryItem({ 
  item, 
  onEdit, 
  onDelete, 
  onUpdateQuantity 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState(item.quantity);

  const getStockStatus = () => {
    if (item.quantity <= 0) return { status: 'out', text: 'Brak', color: 'text-red-500' };
    if (item.quantity <= item.minQuantity) return { status: 'low', text: 'Niski', color: 'text-orange-500' };
    return { status: 'ok', text: 'OK', color: 'text-green-500' };
  };

  const stockStatus = getStockStatus();

  const handleQuantityUpdate = () => {
    if (editQuantity !== item.quantity) {
      onUpdateQuantity(item.id, parseInt(editQuantity) || 0);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuantityUpdate();
    } else if (e.key === 'Escape') {
      setEditQuantity(item.quantity);
      setIsEditing(false);
    }
  };

  const formatExpiryDate = (date) => {
    if (!date) return 'Brak daty';
    const expiryDate = new Date(date);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Przeterminowany';
    if (diffDays <= 30) return `${diffDays} dni`;
    return expiryDate.toLocaleDateString('pl-PL');
  };

  const getExpiryStatus = () => {
    if (!item.expiryDate) return { status: 'none', color: 'text-gray-400' };
    
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', color: 'text-red-500' };
    if (diffDays <= 30) return { status: 'warning', color: 'text-orange-500' };
    return { status: 'ok', color: 'text-green-500' };
  };

  const expiryStatus = getExpiryStatus();

  return (
    <div className="inventory-item bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="inventory-item-icon">
            <Package className="w-6 h-6 text-blue-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {item.name}
              </h3>
              {item.category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Tag className="w-3 h-3 mr-1" />
                  {item.category}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span>SKU:</span>
                <span className="font-mono">{item.sku}</span>
              </div>
              
              {item.brand && (
                <div className="flex items-center space-x-1">
                  <span>Marka:</span>
                  <span className="font-medium">{item.brand}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Stan magazynowy */}
          <div className="text-center">
            <div className="flex items-center space-x-1 mb-1">
              <TrendingDown className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Stan</span>
            </div>
            
            {isEditing ? (
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <button
                  onClick={handleQuantityUpdate}
                  className="text-green-600 hover:text-green-700"
                >
                  ✓
                </button>
              </div>
            ) : (
              <div 
                className="flex items-center space-x-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                onClick={() => setIsEditing(true)}
              >
                <span className={`font-semibold ${stockStatus.color}`}>
                  {item.quantity}
                </span>
                <span className="text-xs text-gray-500">szt.</span>
                {stockStatus.status !== 'ok' && (
                  <AlertTriangle className="w-3 h-3 text-orange-500" />
                )}
              </div>
            )}
            
            <div className={`text-xs ${stockStatus.color}`}>
              {stockStatus.text}
            </div>
          </div>

          {/* Data ważności */}
          {item.expiryDate && (
            <div className="text-center">
              <div className="flex items-center space-x-1 mb-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Ważność</span>
              </div>
              <div className={`text-sm font-medium ${expiryStatus.color}`}>
                {formatExpiryDate(item.expiryDate)}
              </div>
            </div>
          )}

          {/* Cena */}
          {item.price && (
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Cena</div>
              <div className="font-semibold text-gray-900">
                {item.price.toFixed(2)} zł
              </div>
            </div>
          )}

          {/* Akcje */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edytuj produkt"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Usuń produkt"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Opis */}
      {item.description && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      )}
    </div>
  );
} 