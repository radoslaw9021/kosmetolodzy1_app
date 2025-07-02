import React, { useState } from 'react';
import { Package, Edit, Trash2, AlertTriangle, TrendingDown, Calendar, Tag } from 'lucide-react';

export default function InventoryItem({ item, onEdit, onDelete, onUpdateQuantity }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState(item.quantity);

  const getStockStatus = () => {
    if (item.quantity <= 0) return { status: 'out', text: 'Brak', color: '#f87171' };
    if (item.quantity <= item.minQuantity) return { status: 'low', text: 'Niski', color: '#fbbf24' };
    return { status: 'ok', text: 'OK', color: '#34d399' };
  };
  const stockStatus = getStockStatus();

  const handleQuantityUpdate = () => {
    if (editQuantity !== item.quantity) {
      onUpdateQuantity(item.id, parseInt(editQuantity) || 0);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleQuantityUpdate();
    else if (e.key === 'Escape') {
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
    if (!item.expiryDate) return { status: 'none', color: '#a1a1aa' };
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { status: 'expired', color: '#f87171' };
    if (diffDays <= 30) return { status: 'warning', color: '#fbbf24' };
    return { status: 'ok', color: '#34d399' };
  };
  const expiryStatus = getExpiryStatus();

  return (
    <div
      className="inventory-item-premium mb-6"
      style={{
        background: 'rgba(30, 28, 50, 0.55)',
        backdropFilter: 'blur(18px)',
        border: '1.5px solid rgba(168, 85, 247, 0.13)',
        borderRadius: '1.5rem',
        padding: '2rem',
        boxShadow: '0 0 32px 0 #a855f7aa, 0 1.5px 0 0 #fff1',
        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
        cursor: 'pointer',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 0 48px 0 #a855f7cc, 0 2px 0 0 #fff2';
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 0 32px 0 #a855f7aa, 0 1.5px 0 0 #fff1';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-6">
        {/* Ikona i dane główne */}
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div style={{
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            borderRadius: '50%',
            padding: '1rem',
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.18)'
          }}>
            <Package className="icon-premium" size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold truncate" style={{
                background: 'linear-gradient(90deg, #a18cd1, #fbc2eb 60%, #667eea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 8px rgba(168, 85, 247, 0.3)'
              }}>{item.name}</h3>
              {item.category && (
                <span style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(99, 102, 241, 0.18))',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  color: '#e9d5ff',
                  borderRadius: '999px',
                  padding: '0.3rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backdropFilter: 'blur(8px)'
                }}>
                  <Tag size={14} style={{ marginRight: 4 }} />
                  {item.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span style={{ color: '#a1a1aa' }}>SKU:</span>
                <span className="font-mono text-white font-medium">{item.sku}</span>
              </div>
              {item.brand && (
                <div className="flex items-center gap-2">
                  <span style={{ color: '#a1a1aa' }}>Marka:</span>
                  <span className="font-medium text-white">{item.brand}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Dane szczegółowe */}
        <div className="flex items-center gap-7 flex-wrap">
          {/* Stan magazynowy */}
          <div className="text-center min-w-[90px]">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown size={18} style={{ color: '#a1a1aa' }} />
              <span className="text-sm" style={{ color: '#e0e7ef' }}>Stan</span>
            </div>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editQuantity}
                  onChange={e => setEditQuantity(e.target.value)}
                  onKeyDown={handleKeyPress}
                  style={{
                    width: 48,
                    padding: '0.3rem 0.5rem',
                    borderRadius: 8,
                    border: '1px solid #a855f7',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontWeight: 600,
                    outline: 'none',
                    fontSize: '1rem',
                    textAlign: 'center',
                    boxShadow: '0 0 8px #a855f733',
                    transition: 'all 0.18s'
                  }}
                  min="0"
                  autoFocus
                />
                <button
                  onClick={handleQuantityUpdate}
                  style={{ color: '#34d399', fontWeight: 700, fontSize: 18, marginLeft: 2, background: 'none', border: 'none', cursor: 'pointer' }}
                  title="Zapisz"
                >✓</button>
              </div>
            ) : (
              <div
                className="flex items-center gap-1 cursor-pointer hover:scale-105 hover:shadow-lg transition-all"
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'rgba(168, 85, 247, 0.08)',
                  borderRadius: 8,
                  padding: '0.2rem 0.7rem',
                  fontWeight: 600
                }}
              >
                <span style={{ color: stockStatus.color, fontWeight: 700 }}>{item.quantity}</span>
                <span className="text-xs" style={{ color: '#e0e7ef' }}>szt.</span>
                {stockStatus.status !== 'ok' && (
                  <AlertTriangle size={13} style={{ color: '#fbbf24', marginLeft: 2 }} />
                )}
              </div>
            )}
            <div className="text-xs mt-1" style={{ color: stockStatus.color, fontWeight: 600 }}>{stockStatus.text}</div>
          </div>
          {/* Data ważności */}
          {item.expiryDate && (
            <div className="text-center min-w-[110px]">
              <div className="flex items-center gap-1 mb-1">
                <Calendar size={18} style={{ color: '#a1a1aa' }} />
                <span className="text-sm" style={{ color: '#e0e7ef' }}>Ważność</span>
              </div>
              <div className="text-sm font-medium" style={{ color: expiryStatus.color }}>
                {formatExpiryDate(item.expiryDate)}
              </div>
            </div>
          )}
          {/* Cena */}
          {item.price && (
            <div className="text-center min-w-[90px]">
              <div className="text-sm mb-1" style={{ color: '#e0e7ef' }}>Cena</div>
              <div className="font-semibold text-lg" style={{ color: '#fff' }}>
                {item.price.toFixed(2)} zł
              </div>
            </div>
          )}
          {/* Akcje */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="icon-premium icon-premium--primary"
              style={{
                background: 'none',
                border: 'none',
                borderRadius: 8,
                padding: 8,
                cursor: 'pointer',
                transition: 'all 0.18s',
                fontSize: 18
              }}
              title="Edytuj produkt"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="icon-premium icon-premium--danger"
              style={{
                background: 'none',
                border: 'none',
                borderRadius: 8,
                padding: 8,
                cursor: 'pointer',
                transition: 'all 0.18s',
                fontSize: 18
              }}
              title="Usuń produkt"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
      {/* Opis */}
      {item.description && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-300">{item.description}</p>
        </div>
      )}
    </div>
  );
} 