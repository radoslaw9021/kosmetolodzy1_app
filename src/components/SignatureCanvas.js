import React, { useRef, useEffect, useState } from 'react';
import { Download, RotateCcw, Check, X } from 'lucide-react';

const SignatureCanvas = ({ onSave, onCancel, clientName }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Ustaw rozmiar canvas
    canvas.width = 400;
    canvas.height = 200;
    
    // Ustaw styl linii
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setHasSignature(true);
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    if (!hasSignature) {
      alert('Proszę podpisać dokument przed zapisaniem.');
      return;
    }
    
    // Konwertuj canvas do base64
    const signatureData = canvasRef.current.toDataURL('image/png');
    
    // Zapisuj podpis z metadanymi
    const signature = {
      data: signatureData,
      clientId: clientName,
      signedAt: new Date().toISOString(),
      type: 'rodo-consent'
    };
    
    // Zapisz do localStorage (tymczasowo, w przyszłości do backendu)
    const existingSignatures = JSON.parse(localStorage.getItem('signatures') || '[]');
    existingSignatures.push(signature);
    localStorage.setItem('signatures', JSON.stringify(existingSignatures));
    
    onSave(signature);
  };

  // Obsługa touch events dla urządzeń mobilnych
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    draw(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(168, 85, 247, 0.1)',
      border: '1px solid #f3f4f6'
    }}>
      <h3 style={{ marginBottom: '1rem', color: '#374151' }}>
        Podpis elektroniczny - {clientName}
      </h3>
      
      <div style={{ 
        border: '2px dashed #d1d5db', 
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
        background: '#f9fafb'
      }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.25rem',
            background: '#fff',
            cursor: 'crosshair',
            width: '100%',
            maxWidth: '400px',
            height: '200px'
          }}
        />
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={clearCanvas}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            border: 'none',
            background: '#6b7280',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={16} />
          Wyczyść
        </button>
        
        <button
          onClick={saveSignature}
          disabled={!hasSignature}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            border: 'none',
            background: hasSignature ? '#10b981' : '#9ca3af',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            cursor: hasSignature ? 'pointer' : 'not-allowed',
            opacity: hasSignature ? 1 : 0.7
          }}
        >
          <Check size={16} />
          Zapisz podpis
        </button>
        
        <button
          onClick={onCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            border: 'none',
            background: '#ef4444',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <X size={16} />
          Anuluj
        </button>
      </div>
      
      <div style={{ 
        marginTop: '1rem', 
        fontSize: '0.875rem', 
        color: '#6b7280',
        textAlign: 'center'
      }}>
        Podpisz dokument używając myszki lub palca na urządzeniu dotykowym.
      </div>
    </div>
  );
};

export default SignatureCanvas; 