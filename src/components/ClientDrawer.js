import React from 'react';

const ClientDrawer = ({ client, onClose }) => {
  if (!client) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 p-6 overflow-y-auto transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{client.clientName}</h2>
        <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <span className="font-semibold">Email:</span> {client.email || '—'}
        </div>
        <div>
          <span className="font-semibold">Telefon:</span> {client.phone || '—'}
        </div>
        <div>
          <span className="font-semibold">Opis wizyty:</span><br />
          {client.description || 'Brak opisu'}
        </div>
        <div>
          <span className="font-semibold">Szacowany czas:</span> {client.estimatedDuration} min
        </div>

        {/* Możesz rozbudować o inne sekcje jak historia wizyt */}
      </div>
    </div>
  );
};

export default ClientDrawer; 