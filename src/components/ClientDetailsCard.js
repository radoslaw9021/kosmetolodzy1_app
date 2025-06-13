export default function ClientDetailsCard({
  client,
  onClose,
  onEdit,
  onDelete,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-3xl shadow-2xl bg-white p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-[#C8373B] text-2xl transition"
        >
          ✕
        </button>
        <div className="flex flex-col items-center gap-2 pb-4 border-b">
          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-2 text-3xl font-semibold text-[#C8373B]">
            {/* Możesz wstawić inicjały klientki */}
            {client.firstName[0]}
            {client.lastName[0]}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#222] mt-2 mb-1">
            {client.firstName} {client.lastName}
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 text-gray-500 text-base">
            <span>{client.email}</span>
            <span>{client.phone}</span>
          </div>
        </div>
        <div className="mt-8 space-y-5">
          <div className="flex justify-between gap-6">
            <div>
              <div className="text-sm text-gray-400">Ilość zabiegów:</div>
              <div className="font-bold text-lg">
                {client.treatments.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Ostatni zabieg:</div>
              <div className="font-bold text-lg">
                {client.lastTreatmentDate}
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2 font-semibold">
              Historia zabiegów:
            </div>
            <ul className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {client.treatments.map((t, idx) => (
                <li
                  key={idx}
                  className="bg-[#faf9f8] rounded-lg p-2 text-sm text-gray-700"
                >
                  <span className="font-medium text-[#C8373B]">{t.name}</span> –{" "}
                  {t.date}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3 mt-7 justify-end">
            <button
              onClick={onEdit}
              className="px-5 py-2 rounded-lg font-semibold border-2 border-[#C8373B] text-[#C8373B] bg-white hover:bg-[#ffe5e6] transition"
            >
              Edytuj
            </button>
            <button
              onClick={onDelete}
              className="px-5 py-2 rounded-lg bg-[#C8373B] text-white font-semibold hover:bg-[#b22c2f] transition"
            >
              Usuń
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
