import React from "react";

const containerStyle = {
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  color: "#333",
  lineHeight: 1.6,
  margin: 0,
  padding: 0,
};
const sectionStyle = {
  margin: "1.5rem 0",
  padding: "1.2rem",
  backgroundColor: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: "6px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};
const titleStyle = {
  fontSize: "1.3rem",
  fontWeight: "600",
  marginBottom: "0.75rem",
  color: "#2c3e50",
  borderBottom: "2px solid #ecf0f1",
  paddingBottom: "0.5rem",
};
const listStyle = {
  paddingLeft: "1.4rem",
  marginTop: 0,
  marginBottom: "1rem",
};
const itemStyle = {
  marginBottom: "0.3rem",
};
const textStyle = {
  margin: "0.5rem 0",
};

export default function ClientFormView({ client }) {
  const renderCheckboxes = (data = {}, labels = {}) => {
    const selected = Object.entries(data).filter(([, v]) => v);
    if (selected.length === 0) return <p style={textStyle}>-</p>;
    return (
      <ul style={listStyle}>
        {selected.map(([key]) => (
          <li key={key} style={itemStyle}>
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
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <div style={titleStyle}>A. Dane osobowe i kontaktowe</div>
        <p style={textStyle}>
          <strong>Imię:</strong> {client.firstName || "-"}
        </p>
        <p style={textStyle}>
          <strong>Nazwisko:</strong> {client.lastName || "-"}
        </p>
        <p style={textStyle}>
          <strong>Email:</strong> {client.email || "-"}
        </p>
        <p style={textStyle}>
          <strong>Telefon:</strong> {client.phone || "-"}
        </p>
        <p style={textStyle}>
          <strong>Płeć:</strong>{" "}
          {client.gender === "female"
            ? "Kobieta"
            : client.gender === "male"
            ? "Mężczyzna"
            : "-"}
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={titleStyle}>B. Informacje medyczne i przeciwwskazania</div>
        <p style={textStyle}>
          <strong>Choroby przewlekłe:</strong> {client.chronicDiseases || "-"}
        </p>
        <p style={textStyle}>
          <strong>Przeciwwskazania:</strong>
        </p>
        {renderCheckboxes(client.contraindications, contraindicationLabels)}
        <p style={textStyle}>
          <strong>Uwagi:</strong> {client.additionalNotes || "-"}
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={titleStyle}>C. Styl życia i zwyczaje</div>
        {renderCheckboxes(lifestyleData, lifestyleLabels)}
        <div style={{ height: "0.75rem" }} />
        <p style={textStyle}>
          <strong>Leki:</strong> {client.medications || "-"}
        </p>
        <p style={textStyle}>
          <strong>Suplementy:</strong> {client.supplements || "-"}
        </p>
        <p style={textStyle}>
          <strong>Alergie:</strong> {client.allergies || "-"}
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={titleStyle}>D. Problemy skórne</div>
        {renderCheckboxes(client.skinIssues, skinIssueLabels)}
        <p style={textStyle}>
          <strong>Inne problemy:</strong> {client.otherSkinIssue || "-"}
        </p>
      </div>

      <div style={sectionStyle}>
        <div style={titleStyle}>E. Zgody</div>
        <p style={textStyle}>
          <strong>Zgoda RODO:</strong> {client.rodoConsent ? "✓" : "✗"}
        </p>
        <p style={textStyle}>
          <strong>Zgoda na newsletter:</strong>{" "}
          {client.marketingConsent ? "✓" : "✗"}
        </p>
        <p style={textStyle}>
          <strong>Rezygnacja z newslettera:</strong>{" "}
          {client.unsubscribed ? "✓" : "✗"}
        </p>
      </div>
    </div>
  );
}
