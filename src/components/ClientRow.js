import React from "react";
import { FaEye, FaPhone, FaRegCalendarAlt } from "react-icons/fa";

// props: { client, onPreview }
export default function ClientRow({ client, onPreview }) {
  // Avatar z inicjałów
  const getAvatar = (firstName, lastName) => {
    const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    return initials || '?';
  };

  return (
    <div className="client-list-grid-row">
      {/* Avatar + Imię i nazwisko */}
      <div className="client-list-grid-cell flex items-center gap-3">
        <div className="client-avatar flex items-center justify-center text-white font-bold text-base rounded-full w-10 h-10 bg-gradient-to-br from-fuchsia-600 to-blue-400">
          {getAvatar(client.firstName, client.lastName)}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-white text-base">{client.firstName}</span>
          <span className="font-semibold text-white text-base">{client.lastName}</span>
        </div>
      </div>
      {/* Email */}
      <div className="client-list-grid-cell">
        <span className="inline-block bg-fuchsia-900/60 text-fuchsia-200 px-3 py-1 rounded-lg text-sm font-medium">
          {client.email}
        </span>
      </div>
      {/* Telefon */}
      <div className="client-list-grid-cell flex items-center gap-2">
        <FaPhone className="text-fuchsia-400" />
        <span className="text-white font-medium">{client.phone}</span>
      </div>
      {/* Data ostatniego zabiegu */}
      <div className="client-list-grid-cell flex items-center gap-2">
        <FaRegCalendarAlt className="text-fuchsia-400" />
        <span className="text-white font-medium">{client.lastTreatmentDate}</span>
      </div>
      {/* Przycisk Podgląd */}
      <div className="client-list-grid-cell flex justify-end items-center">
        <button
          className="btn-podglad"
          onClick={onPreview}
        >
          <FaEye className="text-white" />
          Podgląd
        </button>
      </div>
    </div>
  );
} 