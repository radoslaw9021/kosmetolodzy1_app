import React from "react";
import { StarBorder } from "./StarBorder";

const wizyty = [
  {
    id: 1,
    clientName: "Zdziś Tymon",
    type: "Klientka",
    start: "12:00",
    end: "13:00",
  },
  {
    id: 2,
    clientName: "Róża Tymon",
    type: "Z",
    start: "16:00",
    end: "17:00",
  },
  {
    id: 3,
    clientName: "R2 Tymon",
    type: "R",
    start: "14:20",
    end: "15:20",
  },
];

// const currentTime = new Date();
// function isNow(start: string, end: string): boolean {
//   const [sH, sM] = start.split(":").map(Number);
//   const [eH, eM] = end.split(":").map(Number);
//   const now = currentTime.getHours() * 60 + currentTime.getMinutes();
//   const startMin = sH * 60 + sM;
//   const endMin = eH * 60 + eM;
//   return now >= startMin && now < endMin;
// }

export default function NajblizszeWizyty() {
  if (wizyty.length === 0) {
    return (
      <p className="text-gray-500 italic mt-4">Brak zaplanowanych wizyt.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {wizyty.map((wizyta, idx) => {
        // Pierwszy kafelek z animowaną obwódką
        if (idx === 0) {
          return (
            <StarBorder key={wizyta.id}>
              <div style={{ padding: "1rem 2rem", color: "white" }}>
                <div style={{ fontWeight: 600 }}>{wizyta.clientName} – {wizyta.type}</div>
                <div style={{ fontSize: 14 }}>{wizyta.start} – {wizyta.end}</div>
              </div>
            </StarBorder>
          );
        }
        // Pozostałe kafelki
        return (
          <div
            key={wizyta.id}
            className="bg-gradient-to-br from-purple-800/30 to-fuchsia-800/10 border border-purple-700/30 rounded-2xl p-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{wizyta.clientName}</p>
                <p className="text-sm text-gray-400">{wizyta.type}</p>
              </div>
              <div className="text-sm text-white/80 font-medium">
                {wizyta.start} – {wizyta.end}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 