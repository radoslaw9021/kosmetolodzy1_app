import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Map, Grid, List, Upload as UploadIcon } from 'lucide-react';
import PhotoGrid from './PhotoGrid';
import PhotoUpload from './PhotoUpload';
import ImageGalleryModal from '../ImageGalleryModal';
import './Gallery.css';

const Gallery = ({ 
  photos = [], 
  clients = [], 
  kosmetologs = [],
  onPhotoUpload,
  onPhotoDelete,
  onPhotoEdit,
  onPhotoLike,
  onPhotoShare,
  onPhotoDownload
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid');

  // Przykładowe zdjęcia dla demo
  const demoPhotos = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=300&fit=crop',
      label: 'Przed zabiegiem',
      date: '2024-01-15',
      clientName: 'Anna Kowalska',
      kosmetologName: 'Maria Nowak',
      location: 'Warszawa, Mokotów',
      description: 'Stan skóry przed peelingiem chemicznym',
      tags: ['przed', 'peeling', 'twarz'],
      isNew: true,
      isLiked: false
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      label: 'Po zabiegu',
      date: '2024-01-15',
      clientName: 'Anna Kowalska',
      kosmetologName: 'Maria Nowak',
      location: 'Warszawa, Mokotów',
      description: 'Rezultat po 2 tygodniach od peelingu',
      tags: ['po', 'peeling', 'rezultat'],
      isNew: false,
      isLiked: true
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
      label: 'Makijaż wieczorowy',
      date: '2024-01-10',
      clientName: 'Katarzyna Wiśniewska',
      kosmetologName: 'Ewa Kowalczyk',
      location: 'Warszawa, Śródmieście',
      description: 'Makijaż na wesele',
      tags: ['makijaż', 'wieczorowy', 'wesele'],
      isNew: false,
      isLiked: false
    }
  ];

  const allPhotos = [...demoPhotos, ...photos];

  const handlePhotoClick = (photo, index) => {
    setSelectedPhotoIndex(index);
  };

  const handlePhotoClose = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePhotoUpload = async (uploadData) => {
    try {
      await onPhotoUpload(uploadData);
      setShowUpload(false);
    } catch (error) {
      console.error('Błąd uploadu:', error);
    }
  };

  const handlePhotoDelete = async (photoId) => {
    try {
      await onPhotoDelete(photoId);
    } catch (error) {
      console.error('Błąd usuwania:', error);
    }
  };

  const handlePhotoEdit = async (photo) => {
    try {
      await onPhotoEdit(photo);
    } catch (error) {
      console.error('Błąd edycji:', error);
    }
  };

  const handlePhotoLike = async (photoId, isLiked) => {
    try {
      await onPhotoLike(photoId, isLiked);
    } catch (error) {
      console.error('Błąd polubienia:', error);
    }
  };

  const handlePhotoShare = async (photo) => {
    try {
      await onPhotoShare(photo);
    } catch (error) {
      console.error('Błąd udostępniania:', error);
    }
  };

  const handlePhotoDownload = async (photo) => {
    try {
      await onPhotoDownload(photo);
    } catch (error) {
      console.error('Błąd pobierania:', error);
    }
  };

  return (
    <div className="gallery-page">
      {/* Header */}
      <div className="gallery-page-header">
        <div className="gallery-page-title">
          <h1>Galeria Zdjęć</h1>
          <p>Przeglądaj i zarządzaj zdjęciami z zabiegów</p>
        </div>
        
        <div className="gallery-page-actions">
          <button
            onClick={() => setShowUpload(true)}
            className="upload-btn-primary"
          >
            <UploadIcon size={18} />
            Dodaj zdjęcia
          </button>
        </div>
      </div>

      {/* Główna galeria */}
      <PhotoGrid
        photos={allPhotos}
        onPhotoClick={handlePhotoClick}
        onPhotoDelete={handlePhotoDelete}
        onPhotoEdit={handlePhotoEdit}
        onPhotoLike={handlePhotoLike}
        onPhotoShare={handlePhotoShare}
        onPhotoDownload={handlePhotoDownload}
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
      />

      {/* Modal upload */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PhotoUpload
                onUpload={handlePhotoUpload}
                onCancel={() => setShowUpload(false)}
                clients={clients}
                kosmetologs={kosmetologs}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal podglądu zdjęcia */}
      {selectedPhotoIndex !== null && (
        <ImageGalleryModal
          images={allPhotos}
          openIndex={selectedPhotoIndex}
          onClose={handlePhotoClose}
        />
      )}
    </div>
  );
};

export default Gallery; 