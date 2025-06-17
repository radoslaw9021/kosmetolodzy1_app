import React from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const ControlPanel = ({
  selectedDate,
  statusFilter,
  setStatusFilter,
  onNewAppointment,
  onQuickAddClient,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      {/* Filtr statusu klientów */}
      <div className="flex items-center space-x-2">
        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
          Status klienta:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">Wszyscy</option>
          <option value="pending">Oczekujący</option>
          <option value="active">Stali klienci</option>
        </select>
      </div>

      {/* Przyciski akcji */}
      <div className="flex gap-2">
        <button
          onClick={onNewAppointment}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Dodaj Nową Wizytę
        </button>
        <button
          onClick={onQuickAddClient}
          className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
        >
          Szybkie Dodawanie Klienta
        </button>
      </div>
    </div>
  );
};

export default ControlPanel; 