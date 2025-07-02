import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MapPin, Camera, X, Plus, Image, FileText, User, Tag } from 'lucide-react';

const PhotoUpload = ({ 
  onUpload, 
  onCancel, 
  clients = [], 
  kosmetologs = [],
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    clientId: '',
    kosmetologId: '',
    treatmentType: '',
    tags: [],
    description: ''
  });
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Geolokalizacja
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('Geolokalizacja nie jest obsługiwana w tej przeglądarce');
      return;
    }

    setLocationLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Pobierz nazwę lokalizacji z koordynatów
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const locationName = data.display_name || `${latitude}, ${longitude}`;
        
        setLocation({
          latitude,
          longitude,
          name: locationName
        });
      } catch (error) {
        setLocation({
          latitude,
          longitude,
          name: `${latitude}, ${longitude}`
        });
      }
    } catch (error) {
      console.error('Błąd geolokalizacji:', error);
      alert('Nie udało się pobrać lokalizacji');
    } finally {
      setLocationLoading(false);
    }
  }, []);

  // Obsługa drag & drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList).filter(file => 
      acceptedTypes.includes(file.type)
    );

    if (files.length + newFiles.length > maxFiles) {
      alert(`Możesz dodać maksymalnie ${maxFiles} zdjęć`);
      return;
    }

    const filesWithPreview = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
  }, [files, maxFiles, acceptedTypes]);

  const removeFile = useCallback((fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Wybierz przynajmniej jedno zdjęcie');
      return;
    }

    setUploading(true);
    try {
      const uploadData = files.map(fileData => ({
        file: fileData.file,
        metadata: {
          ...metadata,
          location,
          uploadDate: new Date().toISOString(),
          originalName: fileData.name,
          fileSize: fileData.size
        }
      }));

      await onUpload(uploadData);
      setFiles([]);
      setMetadata({
        clientId: '',
        kosmetologId: '',
        treatmentType: '',
        tags: [],
        description: ''
      });
      setLocation(null);
    } catch (error) {
      console.error('Błąd uploadu:', error);
      alert('Wystąpił błąd podczas uploadu zdjęć');
    } finally {
      setUploading(false);
    }
  };

  const addTag = (tag) => {
    if (tag && !metadata.tags.includes(tag)) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <motion.div
      className="photo-upload"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="upload-header">
        <h3>Dodaj nowe zdjęcia</h3>
        <button onClick={onCancel} className="close-btn">
          <X size={20} />
        </button>
      </div>

      <div className="upload-content">
        {/* Drag & Drop Area */}
        <div
          className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: 'none' }}
          />
          
          <div className="dropzone-content">
            <Upload size={48} />
            <h4>Przeciągnij zdjęcia tutaj lub kliknij</h4>
            <p>Obsługiwane formaty: JPEG, PNG, WebP</p>
            <p>Maksymalnie {maxFiles} zdjęć</p>
          </div>
        </div>

        {/* Wybrane pliki */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              className="selected-files"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4>Wybrane zdjęcia ({files.length})</h4>
              <div className="files-grid">
                {files.map((fileData) => (
                  <motion.div
                    key={fileData.id}
                    className="file-preview"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <img src={fileData.preview} alt={fileData.name} />
                    <div className="file-info">
                      <span className="file-name">{fileData.name}</span>
                      <span className="file-size">
                        {(fileData.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(fileData.id)}
                      className="remove-file"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metadane */}
        <div className="upload-metadata">
          <h4>Informacje o zdjęciach</h4>
          
          <div className="metadata-grid">
            {/* Klient */}
            <div className="metadata-field">
              <label>
                <User size={16} />
                Klient
              </label>
              <select
                value={metadata.clientId}
                onChange={(e) => setMetadata(prev => ({ ...prev, clientId: e.target.value }))}
              >
                <option value="">Wybierz klienta</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            {/* Kosmetolog */}
            <div className="metadata-field">
              <label>
                <User size={16} />
                Kosmetolog
              </label>
              <select
                value={metadata.kosmetologId}
                onChange={(e) => setMetadata(prev => ({ ...prev, kosmetologId: e.target.value }))}
              >
                <option value="">Wybierz kosmetologa</option>
                {kosmetologs.map(kosmetolog => (
                  <option key={kosmetolog.id} value={kosmetolog.id}>{kosmetolog.name}</option>
                ))}
              </select>
            </div>

            {/* Typ zabiegu */}
            <div className="metadata-field">
              <label>
                <Camera size={16} />
                Typ zabiegu
              </label>
              <input
                type="text"
                value={metadata.treatmentType}
                onChange={(e) => setMetadata(prev => ({ ...prev, treatmentType: e.target.value }))}
                placeholder="np. Peeling, Masaż, Makijaż"
              />
            </div>

            {/* Lokalizacja */}
            <div className="metadata-field">
              <label>
                <MapPin size={16} />
                Lokalizacja
              </label>
              <div className="location-controls">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="location-btn"
                >
                  {locationLoading ? 'Pobieranie...' : 'Pobierz lokalizację'}
                </button>
                {location && (
                  <span className="location-name">{location.name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Opis */}
          <div className="metadata-field full-width">
            <label>
              <FileText size={16} />
              Opis
            </label>
            <textarea
              value={metadata.description}
              onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Dodaj opis zdjęć..."
              rows={3}
            />
          </div>

          {/* Tagi */}
          <div className="metadata-field full-width">
            <label>
              <Tag size={16} />
              Tagi
            </label>
            <div className="tags-container">
              {metadata.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Dodaj tag i naciśnij Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Akcje */}
      <div className="upload-actions">
        <button onClick={onCancel} className="cancel-btn">
          Anuluj
        </button>
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="upload-btn"
        >
          {uploading ? 'Uploadowanie...' : `Uploaduj ${files.length} zdjęć`}
        </button>
      </div>
    </motion.div>
  );
};

export default PhotoUpload; 