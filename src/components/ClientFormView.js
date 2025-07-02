import React from "react";

export default function ClientFormView({ client }) {
  const renderCheckboxes = (data = {}, labels = {}) => {
    const selected = Object.entries(data).filter(([, v]) => v);
    if (selected.length === 0) return <p className="client-form-empty">-</p>;
    return (
      <ul className="client-form-list">
        {selected.map(([key]) => (
          <li key={key} className="client-form-list-item">
            {labels[key] || key}
          </li>
        ))}
      </ul>
    );
  };

  const contraindicationLabels = {
    pregnancy: "Ciąża / okres karmienia",
    diabetes: "Cukrzyca",
    syncope: "Tendencja do omdleń",
    varicoseVeins: "Żylaki",
    thyroidDiseases: "Choroby tarczycy",
    anemia: "Anemia",
    ulcers: "Choroba wrzodowa",
    kidneyFailure: "Niewydolność nerek",
    pacemaker: "Rozrusznik serca",
    substanceAbuse: "Nadużywanie alkoholu/narkotyków",
    cancer5Years: "Nowotwór w ciągu ostatnich 5 lat",
    epilepsy: "Epilepsja",
    claustrophobia: "Klaustrofobia",
    activeInfection: "Aktywne infekcje",
    seriousIllness: "Poważne schorzenia",
    cardioDisease: "Choroby układu krążenia",
  };

  const lifestyleLabels = {
    sports: "Uprawiam sport",
    healthyNutrition: "Regularne odżywianie",
    plannedPregnancy: "Planuję ciążę",
    metalImplants: "Metalowe implanty",
    pacemaker: "Posiadam rozrusznik serca",
    contactLenses: "Noszę soczewki kontaktowe",
    claustrophobiaC: "Mam klaustrofobię",
    vacationWarmCountries: "Wakacje w ciepłych krajach",
  };

  const skinIssueLabels = {
    acne: "Trądzik",
    pigmentation: "Przebarwienia",
    blackheads: "Wągry",
    comedones: "Zaskórniki",
    granulomas: "Ziarniniaki",
    milia: "Milia",
    scars: "Blizny",
    wrinkles: "Zmarszczki",
    erythema: "Rumień",
    lossOfFirmness: "Brak jędrności",
    dryness: "Suchość",
    overSebum: "Nadmiar sebum",
    psoriasis: "Łuszczyca",
    eczema: "Egzema",
    seborrheicDermatitis: "Łojotokowe zapalenie skóry",
    openComedones: "Zaskórniki otwarte/zamknięte",
    melasma: "Melasma",
    solarLentigo: "Lentigo",
    telangiectasia: "Teleangiektazje",
    keratosisPilaris: "Keratoza pilaris",
    postInflammatoryHyperpigmentation: "Przebarwienia pozapalne",
    reactiveSkin: "Skóra reaktywna",
    contactDermatitis: "Kontaktowe uczulenie",
  };

  const lifestyleData = Object.fromEntries(
    Object.keys(lifestyleLabels).map((key) => [key, client[key]])
  );

  return (
    <div className="client-form-container">
      <div className="client-form-section">
        <div className="client-form-title">A. Dane osobowe i kontaktowe</div>
        <p><span className="client-form-label">Imię:</span> <span className="client-form-value">{client.firstName || "-"}</span></p>
        <p><span className="client-form-label">Nazwisko:</span> <span className="client-form-value">{client.lastName || "-"}</span></p>
        <p><span className="client-form-label">Email:</span> <span className="client-form-value">{client.email || "-"}</span></p>
        <p><span className="client-form-label">Telefon:</span> <span className="client-form-value">{client.phone || "-"}</span></p>
        <p><span className="client-form-label">Płeć:</span> <span className="client-form-value">{client.gender === "female" ? "Kobieta" : client.gender === "male" ? "Mężczyzna" : "-"}</span></p>
      </div>

      <div className="client-form-section">
        <div className="client-form-title">B. Informacje medyczne i przeciwwskazania</div>
        <p><span className="client-form-label">Choroby przewlekłe:</span> <span className="client-form-value">{client.chronicDiseases || "-"}</span></p>
        <p className="client-form-label">Przeciwwskazania:</p>
        {renderCheckboxes(client.contraindications, contraindicationLabels)}
        <p><span className="client-form-label">Uwagi:</span> <span className="client-form-value">{client.additionalNotes || "-"}</span></p>
      </div>

      <div className="client-form-section">
        <div className="client-form-title">C. Styl życia i zwyczaje</div>
        {renderCheckboxes(lifestyleData, lifestyleLabels)}
        <div style={{ height: "0.75rem" }} />
        <p><span className="client-form-label">Leki:</span> <span className="client-form-value">{client.medications || "-"}</span></p>
        <p><span className="client-form-label">Suplementy:</span> <span className="client-form-value">{client.supplements || "-"}</span></p>
        <p><span className="client-form-label">Alergie:</span> <span className="client-form-value">{client.allergies || "-"}</span></p>
      </div>

      <div className="client-form-section">
        <div className="client-form-title">D. Problemy skórne</div>
        {renderCheckboxes(client.skinIssues, skinIssueLabels)}
        <p><span className="client-form-label">Inne problemy:</span> <span className="client-form-value">{client.otherSkinIssue || "-"}</span></p>
      </div>

      <div className="client-form-section">
        <div className="client-form-title">E. Zgody</div>
        <p><span className="client-form-label">Zgoda RODO:</span> <span className="client-form-value">{client.rodoConsent ? "✓" : "✗"}</span></p>
        <p><span className="client-form-label">Zgoda na newsletter:</span> <span className="client-form-value">{client.marketingConsent ? "✓" : "✗"}</span></p>
        <p><span className="client-form-label">Rezygnacja z newslettera:</span> <span className="client-form-value">{client.unsubscribed ? "✓" : "✗"}</span></p>
      </div>
    </div>
  );
}
