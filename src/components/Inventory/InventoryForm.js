import React, { useState, useEffect } from 'react';
import { 
  Package, 
  X, 
  Save, 
  Tag, 
  TrendingDown,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';

export default function InventoryForm({ 
  item = null, 
  onSave, 
  onCancel, 
  categories = [] 
}) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    category: '',
    description: '',
    quantity: 0,
    minQuantity: 0,
    price: '',
    expiryDate: '',
    supplier: '',
    location: '',
    shopLink: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        sku: item.sku || '',
        brand: item.brand || '',
        category: item.category || '',
        description: item.description || '',
        quantity: item.quantity || 0,
        minQuantity: item.minQuantity || 0,
        price: item.price || '',
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
        supplier: item.supplier || '',
        location: item.location || '',
        shopLink: item.shopLink || ''
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nazwa produktu jest wymagana';
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU jest wymagane';
    }
    if (formData.quantity < 0) {
      newErrors.quantity = 'Ilość nie może być ujemna';
    }
    if (formData.minQuantity < 0) {
      newErrors.minQuantity = 'Minimalna ilość nie może być ujemna';
    }
    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Cena nie może być ujemna';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const productData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      quantity: parseInt(formData.quantity),
      minQuantity: parseInt(formData.minQuantity),
      id: item?.id || Date.now().toString(),
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(productData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  function getDomain(url) {
    try {
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              {item ? 'Edytuj produkt' : 'Dodaj nowy produkt'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nazwa produktu *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nazwa produktu"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="SKU-001"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marka
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nazwa marki"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Wybierz kategorię</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="custom">Dodaj nową...</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opis
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Opis produktu..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ilość w magazynie
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                min="0"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimalna ilość
              </label>
              <input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => handleInputChange('minQuantity', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.minQuantity ? 'border-red-500' : 'border-gray-300'}`}
                min="0"
              />
              {errors.minQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.minQuantity}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cena (zł)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                min="0"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data ważności
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dostawca
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nazwa dostawcy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokalizacja w magazynie
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="np. Regał A, Półka 2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link do sklepu
            </label>
            <div className="relative group">
              <input
                type="url"
                value={formData.shopLink}
                onChange={(e) => handleInputChange('shopLink', e.target.value)}
                className="w-full h-10 px-4 py-2 rounded-lg border-none bg-[#1a1a1a] text-white placeholder:text-neutral-500 shadow-[0_2px_8px_0_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-cyan-400 focus:outline-none transition"
                placeholder="https://adres.sklepu.pl/oferta"
                autoComplete="off"
              />
              <span className="pointer-events-none absolute inset-0 rounded-lg group-hover:shadow-[0_0_0_2px_#67e8f9] transition-shadow duration-300"></span>
            </div>
            {formData.shopLink && (
              <div className="mt-3 bg-[#232334]/80 rounded-xl p-4 flex flex-col gap-2 shadow-lg border border-cyan-700/40 backdrop-blur-md">
                <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold">
                  <span className="inline-block bg-cyan-800/60 rounded-full px-2 py-1 text-xs mr-2">🛒 Zamów w: {getDomain(formData.shopLink)}</span>
                </div>
                <div className="text-xs text-cyan-200 truncate">{formData.shopLink}</div>
                <a
                  href={formData.shopLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow hover:from-cyan-600 hover:to-blue-600 transition-colors text-sm text-center"
                >
                  Przejdź do sklepu →
                </a>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{item ? 'Zapisz zmiany' : 'Dodaj produkt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 