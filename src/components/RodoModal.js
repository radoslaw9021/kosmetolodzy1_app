import React from "react";

export default function RodoModal({ open, onClose, companyName }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.22)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "1.4rem",
          boxShadow: "0 6px 36px 0 rgba(80,80,80,0.12)",
          padding: "2.2rem 2rem 1.5rem 2rem",
          maxWidth: 550,
          width: "97vw",
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          style={{
            position: "absolute",
            right: 22,
            top: 18,
            background: "none",
            border: "none",
            fontSize: 26,
            cursor: "pointer",
            color: "#888",
          }}
          onClick={onClose}
        >
          ✕
        </button>
        <h2
          style={{
            marginTop: 0,
            marginBottom: 18,
            fontWeight: 700,
            fontSize: "1.26rem",
          }}
        >
          Zgoda RODO – Pełna treść
        </h2>
        <div style={{ fontSize: "1.07rem", lineHeight: 1.7, color: "#232323" }}>
          <b>Kto przetwarza Twoje dane?</b>
          <br />
          Administratorem Twoich danych osobowych przekazywanych w związku ze
          świadczeniem usług jest <b>{companyName}</b>.
          <br />
          <br />
          <b>W jakim celu przetwarzamy dane?</b>
          <br />
          Twoje dane osobowe są wykorzystywane wyłącznie do realizacji usług,
          wykonywania i rozliczania umów oraz wypełnienia obowiązków prawnych
          (np. podatkowych, administracyjnych).
          <br />
          <br />
          <b>Jak długo będziemy przetwarzać dane?</b>
          <br />
          Dane są przetwarzane do zakończenia świadczenia usługi/umowy, a
          następnie do upływu terminu przedawnienia roszczeń z tytułu tej umowy.
          <br />
          <br />
          <b>Jakie masz prawa?</b>
          <ul style={{ margin: "0 0 0 1.4em", padding: 0 }}>
            <li>dostępu do swoich danych,</li>
            <li>ich poprawiania i sprostowania,</li>
            <li>usunięcia lub ograniczenia przetwarzania,</li>
            <li>przenoszenia danych,</li>
            <li>wniesienia sprzeciwu wobec przetwarzania,</li>
            <li>cofnięcia zgody w dowolnym momencie,</li>
            <li>złożenia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
          </ul>
          <br />
          <b>Podstawa prawna:</b>
          <br />
          Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z 27
          kwietnia 2016 r. (RODO).
          <br />
          <br />
          <b>Zgoda na przetwarzanie danych osobowych</b>
          <br />
          Wyrażam zgodę na przetwarzanie i zbieranie moich danych osobowych
          przez <b>{companyName}</b> w celu korzystania z usług kosmetycznych, a
          także na kontakt w sprawach wizyt oraz otrzymywanie informacji drogą
          elektroniczną i telefoniczną.
          <br />
          <br />
          Oświadczam, że zgoda została mi przedstawiona w zrozumiałej formie i
          wiem, że mogę ją w każdej chwili wycofać.
          <br />
          <br />
          <i>
            Oświadczam, że dane podane przeze mnie są prawdziwe i zobowiązuję
            się zgłaszać wszelkie zmiany dotyczące mojego stanu zdrowia w czasie
            kolejnych wizyt.
            <br />
            Jestem świadomy/a odpowiedzialności karnej za składanie fałszywych
            oświadczeń.
          </i>
        </div>
        <button
          style={{
            marginTop: 24,
            background: "#232323",
            color: "#fff",
            border: "none",
            borderRadius: "2rem",
            padding: "0.7rem 1.7rem",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onClick={onClose}
        >
          Akceptuję i zamykam
        </button>
      </div>
    </div>
  );
}
