import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, Calendar, User, MapPin, Tag } from 'lucide-react';

const PhotoFilters = ({ filters = {}, onFiltersChange, photos = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Wyciągnij unikalne wartości z zdjęć
  const uniqueValues = useMemo(() => {
    const clients = [...new Set(photos.map(p => p.clientName).filter(Boolean))];
    const kosmetologs = [...new Set(photos.map(p => p.kosmetologName).filter(Boolean))];
    const locations = [...new Set(photos.map(p => p.location).filter(Boolean))];
    const tags = [...new Set(photos.flatMap(p => p.tags || []).filter(Boolean))];

    return { clients, kosmetologs, locations, tags };
  }, [photos]);

  const handleFilterChange = (key, value) => {
    onFiltersChange && onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange && onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange && onFiltersChange({});
    setSearchTerm('');
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm;

  const filterVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1 }
  };

  return (
    <div className="photo-filters">
      {/* Główny pasek filtrów */}
      <div className="filters-header">
        <div className="filters-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Szukaj w zdjęciach..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-controls">
          <button
            className={`filter-toggle ${isExpanded ? 'active' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter size={16} />
            <span>Filtry</span>
            {hasActiveFilters && <span className="filter-badge" />}
          </button>

          {hasActiveFilters && (
            <button
              className="clear-filters"
              onClick={clearAllFilters}
            >
              <X size={16} />
              <span>Wyczyść</span>
            </button>
          )}
        </div>
      </div>

      {/* Aktywne filtry */}
      {hasActiveFilters && (
        <motion.div
          className="active-filters"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {Object.entries(filters).map(([key, value]) => (
            <motion.div
              key={key}
              className="active-filter-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <span>{getFilterLabel(key)}: {value}</span>
              <button onClick={() => clearFilter(key)}>
                <X size={12} />
              </button>
            </motion.div>
          ))}
          {searchTerm && (
            <motion.div
              className="active-filter-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span>Szukaj: {searchTerm}</span>
              <button onClick={() => setSearchTerm('')}>
                <X size={12} />
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Rozszerzone filtry */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="filters-panel"
            variants={filterVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{ duration: 0.3 }}
          >
            <div className="filters-grid">
              {/* Filtr klienta */}
              <div className="filter-group">
                <label className="filter-label">
                  <User size={16} />
                  Klient
                </label>
                <select
                  value={filters.client || ''}
                  onChange={(e) => handleFilterChange('client', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Wszyscy klienci</option>
                  {uniqueValues.clients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>

              {/* Filtr kosmetologa */}
              <div className="filter-group">
                <label className="filter-label">
                  <User size={16} />
                  Kosmetolog
                </label>
                <select
                  value={filters.kosmetolog || ''}
                  onChange={(e) => handleFilterChange('kosmetolog', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Wszyscy kosmetolodzy</option>
                  {uniqueValues.kosmetologs.map(kosmetolog => (
                    <option key={kosmetolog} value={kosmetolog}>{kosmetolog}</option>
                  ))}
                </select>
              </div>

              {/* Filtr lokalizacji */}
              <div className="filter-group">
                <label className="filter-label">
                  <MapPin size={16} />
                  Lokalizacja
                </label>
                <select
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Wszystkie lokalizacje</option>
                  {uniqueValues.locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Filtr tagów */}
              <div className="filter-group">
                <label className="filter-label">
                  <Tag size={16} />
                  Tagi
                </label>
                <select
                  value={filters.tag || ''}
                  onChange={(e) => handleFilterChange('tag', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Wszystkie tagi</option>
                  {uniqueValues.tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Filtr daty od */}
              <div className="filter-group">
                <label className="filter-label">
                  <Calendar size={16} />
                  Data od
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="filter-input"
                />
              </div>

              {/* Filtr daty do */}
              <div className="filter-group">
                <label className="filter-label">
                  <Calendar size={16} />
                  Data do
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            {/* Dodatkowe opcje */}
            <div className="filter-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.onlyNew || false}
                  onChange={(e) => handleFilterChange('onlyNew', e.target.checked)}
                />
                <span>Tylko nowe zdjęcia</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.onlyLiked || false}
                  onChange={(e) => handleFilterChange('onlyLiked', e.target.checked)}
                />
                <span>Tylko polubione</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.withLocation || false}
                  onChange={(e) => handleFilterChange('withLocation', e.target.checked)}
                />
                <span>Tylko z lokalizacją</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getFilterLabel = (key) => {
  const labels = {
    client: 'Klient',
    kosmetolog: 'Kosmetolog',
    location: 'Lokalizacja',
    tag: 'Tag',
    dateFrom: 'Data od',
    dateTo: 'Data do',
    onlyNew: 'Tylko nowe',
    onlyLiked: 'Tylko polubione',
    withLocation: 'Z lokalizacją'
  };
  return labels[key] || key;
};

export default PhotoFilters; 