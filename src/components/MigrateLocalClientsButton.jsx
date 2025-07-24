// components/MigrateLocalClientsButton.jsx

import React, { useState } from 'react';
import { Database, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { clientAPI } from '../services/apiService';

const MigrateLocalClientsButton = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      setMigrationResult(null);

      // Pobierz dane z localStorage
      const localClients = JSON.parse(localStorage.getItem('clients') || '[]');
      
      if (localClients.length === 0) {
        setMigrationResult({
          type: 'warning',
          message: 'Brak danych klientek w localStorage do migracji.',
          added: 0,
          skipped: 0
        });
        return;
      }

      let added = 0;
      let skipped = 0;
      const errors = [];

      // Migruj każdą klientkę
      for (const localClient of localClients) {
        try {
          // Sprawdź czy klientka już istnieje w backendzie
          const existingClients = await clientAPI.getAll();
          const exists = existingClients.data?.some(
            existing => existing.email === localClient.email || 
                       (existing.personalData && existing.personalData.email === localClient.email)
          );

          if (exists) {
            skipped++;
            continue;
          }

          // Przygotuj dane do wysłania
          const clientData = {
            firstName: localClient.firstName || localClient.personalData?.firstName || '',
            lastName: localClient.lastName || localClient.personalData?.lastName || '',
            email: localClient.email || localClient.personalData?.email || '',
            phone: localClient.phone || localClient.personalData?.phone || '',
            birthDate: localClient.birthDate || localClient.personalData?.birthDate || null,
            gender: localClient.gender || localClient.personalData?.gender || '',
            address: localClient.address || localClient.personalData?.address || '',
            city: localClient.city || localClient.personalData?.city || '',
            postalCode: localClient.postalCode || localClient.personalData?.postalCode || '',
            consents: {
              rodo: localClient.consents?.rodo || false,
              marketing: localClient.consents?.marketing || false,
              newsletter: localClient.consents?.newsletter || false
            },
            archived: localClient.archived || false,
            archivedAt: localClient.archivedAt || null,
            notes: localClient.notes || localClient.personalData?.notes || '',
            createdAt: localClient.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Wyślij do backendu
          const response = await clientAPI.create(clientData);
          
          if (response.success) {
            added++;
          } else {
            errors.push(`Błąd przy dodawaniu ${clientData.firstName} ${clientData.lastName}: ${response.error}`);
          }
        } catch (error) {
          console.error('Error migrating client:', error);
          errors.push(`Błąd przy migracji klientki: ${error.message}`);
        }
      }

      // Ustaw wynik
      setMigrationResult({
        type: errors.length > 0 ? 'error' : 'success',
        message: `Migracja zakończona: ${added} dodano, ${skipped} pominięto${errors.length > 0 ? `, ${errors.length} błędów` : ''}`,
        added,
        skipped,
        errors
      });

    } catch (error) {
      console.error('Migration error:', error);
      setMigrationResult({
        type: 'error',
        message: `Błąd migracji: ${error.message}`,
        added: 0,
        skipped: 0,
        errors: [error.message]
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const clearResult = () => {
    setMigrationResult(null);
  };

  return (
    <div className="migrate-local-clients">
      <div className="migrate-header">
        <Database size={24} color="#a855f7" />
        <h3>Migracja danych lokalnych</h3>
      </div>
      
      <div className="migrate-content">
        <p className="migrate-description">
          Przenieś klientki zapisane lokalnie (localStorage) do bazy danych MongoDB.
          Ta operacja jest jednorazowa i bezpieczna.
        </p>
        
        <button
          onClick={handleMigration}
          disabled={isMigrating}
          className={`btn btn-primary migrate-btn ${isMigrating ? 'loading' : ''}`}
        >
          {isMigrating ? (
            <>
              <Loader size={16} className="animate-spin" />
              Migracja w toku...
            </>
          ) : (
            <>
              <Database size={16} />
              Przenieś dane lokalne do backendu
            </>
          )}
        </button>
      </div>

      {/* Wynik migracji */}
      {migrationResult && (
        <div className={`migration-result ${migrationResult.type}`}>
          <div className="result-header">
            {migrationResult.type === 'success' && <CheckCircle size={20} color="#10b981" />}
            {migrationResult.type === 'error' && <AlertCircle size={20} color="#ef4444" />}
            {migrationResult.type === 'warning' && <AlertCircle size={20} color="#f59e0b" />}
            <span className="result-message">{migrationResult.message}</span>
            <button onClick={clearResult} className="close-result">×</button>
          </div>
          
          {migrationResult.added > 0 && (
            <div className="result-details">
              <span className="detail-item success">✓ Dodano: {migrationResult.added}</span>
            </div>
          )}
          
          {migrationResult.skipped > 0 && (
            <div className="result-details">
              <span className="detail-item warning">⚠ Pominięto: {migrationResult.skipped}</span>
            </div>
          )}
          
          {migrationResult.errors && migrationResult.errors.length > 0 && (
            <div className="result-errors">
              <h4>Błędy:</h4>
              <ul>
                {migrationResult.errors.map((error, index) => (
                  <li key={index} className="error-item">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MigrateLocalClientsButton;