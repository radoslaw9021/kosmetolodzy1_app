import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, User, Edit, Trash2, Heart, Share2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const PhotoCard = ({ 
  photo, 
  onClick, 
  onDelete, 
  onEdit, 
  onLike,
  onShare,
  onDownload,
  variant = 'grid', // 'grid' | 'timeline'
  showMetadata = true,
  showActions = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(photo.isLiked || false);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike && onLike(photo.id, !isLiked);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    onShare && onShare(photo);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    onDownload && onDownload(photo);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit && onEdit(photo);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć to zdjęcie?')) {
      onDelete && onDelete(photo.id);
    }
  };

  const cardVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1 }
  };

  const actionVariants = {
    initial: { opacity: 0, y: 10 },
    hover: { opacity: 1, y: 0 }
  };

  if (variant === 'timeline') {
    return (
      <motion.div
        className="photo-card-timeline"
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        onClick={onClick}
      >
        <div className="timeline-photo">
          <img 
            src={photo.url} 
            alt={photo.label || 'Zdjęcie'} 
            className="timeline-image"
          />
          {showActions && (
            <motion.div 
              className="timeline-actions"
              variants={actionVariants}
            >
              <button onClick={handleLike} className={`action-btn ${isLiked ? 'liked' : ''}`}>
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button onClick={handleShare} className="action-btn">
                <Share2 size={16} />
              </button>
              <button onClick={handleDownload} className="action-btn">
                <Download size={16} />
              </button>
            </motion.div>
          )}
        </div>
        
        <div className="timeline-content">
          <div className="timeline-header">
            <h4>{photo.label || 'Bez tytułu'}</h4>
            <div className="timeline-actions-main">
              {onEdit && (
                <button onClick={handleEdit} className="action-btn">
                  <Edit size={16} />
                </button>
              )}
              {onDelete && (
                <button onClick={handleDelete} className="action-btn delete">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          
          {showMetadata && (
            <div className="timeline-metadata">
              {photo.date && (
                <div className="metadata-item">
                  <Calendar size={14} />
                  <span>{format(new Date(photo.date), 'dd MMM yyyy', { locale: pl })}</span>
                </div>
              )}
              {photo.clientName && (
                <div className="metadata-item">
                  <User size={14} />
                  <span>{photo.clientName}</span>
                </div>
              )}
              {photo.location && (
                <div className="metadata-item">
                  <MapPin size={14} />
                  <span>{photo.location}</span>
                </div>
              )}
            </div>
          )}
          
          {photo.description && (
            <p className="timeline-description">{photo.description}</p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="photo-card"
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="photo-container">
        <img 
          src={photo.url} 
          alt={photo.label || 'Zdjęcie'} 
          className="photo-image"
          loading="lazy"
        />
        
        {/* Overlay z akcjami */}
        <motion.div 
          className="photo-overlay"
          variants={overlayVariants}
        >
          <div className="overlay-actions">
            <motion.button 
              onClick={handleLike} 
              className={`action-btn ${isLiked ? 'liked' : ''}`}
              variants={actionVariants}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            </motion.button>
            
            <motion.button 
              onClick={handleShare} 
              className="action-btn"
              variants={actionVariants}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={18} />
            </motion.button>
            
            <motion.button 
              onClick={handleDownload} 
              className="action-btn"
              variants={actionVariants}
              whileTap={{ scale: 0.9 }}
            >
              <Download size={18} />
            </motion.button>
            
            {onEdit && (
              <motion.button 
                onClick={handleEdit} 
                className="action-btn"
                variants={actionVariants}
                whileTap={{ scale: 0.9 }}
              >
                <Edit size={18} />
              </motion.button>
            )}
            
            {onDelete && (
              <motion.button 
                onClick={handleDelete} 
                className="action-btn delete"
                variants={actionVariants}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 size={18} />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Badge dla nowych zdjęć */}
        {photo.isNew && (
          <div className="new-badge">NOWE</div>
        )}
      </div>

      {/* Metadata */}
      {showMetadata && (
        <div className="photo-metadata">
          <h4 className="photo-title">{photo.label || 'Bez tytułu'}</h4>
          
          <div className="metadata-grid">
            {photo.date && (
              <div className="metadata-item">
                <Calendar size={12} />
                <span>{format(new Date(photo.date), 'dd MMM yyyy', { locale: pl })}</span>
              </div>
            )}
            
            {photo.clientName && (
              <div className="metadata-item">
                <User size={12} />
                <span>{photo.clientName}</span>
              </div>
            )}
            
            {photo.location && (
              <div className="metadata-item">
                <MapPin size={12} />
                <span>{photo.location}</span>
              </div>
            )}
          </div>

          {photo.description && (
            <p className="photo-description">{photo.description}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PhotoCard; 