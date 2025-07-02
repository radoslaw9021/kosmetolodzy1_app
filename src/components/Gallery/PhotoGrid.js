import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Calendar, User, Filter, Grid, List } from 'lucide-react';
import PhotoCard from './PhotoCard';
import PhotoFilters from './PhotoFilters';
import './Gallery.css';

const PhotoGrid = ({ 
  photos = [], 
  onPhotoClick, 
  onPhotoDelete,
  onPhotoEdit,
  filters = {},
  onFiltersChange,
  viewMode = 'grid' // 'grid' | 'timeline' | 'map'
}) => {
  const [selectedView, setSelectedView] = useState(viewMode);
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'client' | 'location'

  // Filtrowanie i sortowanie zdjęć
  const filteredAndSortedPhotos = useMemo(() => {
    let filtered = photos.filter(photo => {
      if (filters.client && photo.clientId !== filters.client) return false;
      if (filters.kosmetolog && photo.kosmetologId !== filters.kosmetolog) return false;
      if (filters.dateFrom && new Date(photo.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(photo.date) > new Date(filters.dateTo)) return false;
      if (filters.location && !photo.location?.includes(filters.location)) return false;
      return true;
    });

    // Sortowanie
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'client':
          return (a.clientName || '').localeCompare(b.clientName || '');
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [photos, filters, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="photo-gallery-container">
      {/* Header z kontrolkami */}
      <div className="gallery-header">
        <div className="gallery-title">
          <Camera className="gallery-icon" />
          <h2>Galeria Zdjęć</h2>
          <span className="photo-count">{filteredAndSortedPhotos.length} zdjęć</span>
        </div>
        
        <div className="gallery-controls">
          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${selectedView === 'grid' ? 'active' : ''}`}
              onClick={() => setSelectedView('grid')}
              title="Widok siatki"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${selectedView === 'timeline' ? 'active' : ''}`}
              onClick={() => setSelectedView('timeline')}
              title="Widok osi czasu"
            >
              <List size={18} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sortuj po dacie</option>
            <option value="client">Sortuj po kliencie</option>
            <option value="location">Sortuj po lokalizacji</option>
          </select>
        </div>
      </div>

      {/* Filtry */}
      <PhotoFilters 
        filters={filters}
        onFiltersChange={onFiltersChange}
        photos={photos}
      />

      {/* Grid/Timeline View */}
      <AnimatePresence mode="wait">
        {selectedView === 'grid' ? (
          <motion.div
            key="grid"
            className="photo-grid-masonry"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredAndSortedPhotos.map((photo, index) => (
              <motion.div
                key={photo.id || index}
                variants={itemVariants}
                className="photo-grid-item"
                layout
              >
                <PhotoCard
                  photo={photo}
                  onClick={() => onPhotoClick && onPhotoClick(photo, index)}
                  onDelete={() => onPhotoDelete && onPhotoDelete(photo.id)}
                  onEdit={() => onPhotoEdit && onPhotoEdit(photo)}
                  showMetadata={true}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            className="photo-timeline"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredAndSortedPhotos.map((photo, index) => (
              <motion.div
                key={photo.id || index}
                variants={itemVariants}
                className="timeline-item"
              >
                <PhotoCard
                  photo={photo}
                  onClick={() => onPhotoClick && onPhotoClick(photo, index)}
                  onDelete={() => onPhotoDelete && onPhotoDelete(photo.id)}
                  onEdit={() => onPhotoEdit && onPhotoEdit(photo)}
                  variant="timeline"
                  showMetadata={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredAndSortedPhotos.length === 0 && (
        <motion.div
          className="empty-gallery"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Camera size={48} />
          <h3>Brak zdjęć</h3>
          <p>Nie znaleziono zdjęć spełniających kryteria wyszukiwania</p>
        </motion.div>
      )}
    </div>
  );
};

export default PhotoGrid; 