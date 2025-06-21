export const treatmentColorMap = {
    "Konsultacja kosmetologiczna": "#4A90E2",
    "Oczyszczanie wodorowe": "#50E3C2",
    "Peeling kawitacyjny": "#F5A623",
    "Mikrodermabrazja": "#BD10E0",
    "Mezoterapia bezigłowa": "#9013FE",
    "Fale radiowe RF": "#F8E71C",
    "Zabieg bankietowy": "#D0021B",
    "Masaż twarzy": "#E55986",
    "Regulacja brwi": "#7ED321",
    "Henna brwi i rzęs": "#417505",
    "default": "#CCCCCC"
};

export const getTreatmentColor = (treatmentName) => {
    return treatmentColorMap[treatmentName] || treatmentColorMap.default;
};

export const getTextColorForBg = (hexColor) => {
    if (!hexColor) return '#000000';
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 140) ? '#000000' : '#ffffff';
}; 