import React, { useState, useEffect } from 'react';
import SignatureCanvas from './SignatureCanvas';

const TreatmentConsentModal = ({ isOpen, onClose, client, onSave, onPrint }) => {
  const [signature, setSignature] = useState('');
  const [hasConsented, setHasConsented] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Sprawdź czy klientka już ma zapisaną zgodę
  useEffect(() => {
    if (client) {
      const existingConsents = JSON.parse(localStorage.getItem('treatmentConsents') || '[]');
      const existingConsent = existingConsents.find(
        consent => consent.clientId === client.id && consent.type === 'treatment-consent'
      );
      
      if (existingConsent) {
        setHasConsented(true);
        setSignature(existingConsent.signature || '');
      }
    }
  }, [client]);

  const handleConsentChange = (e) => {
    setHasConsented(e.target.checked);
  };

  const handleSignatureSave = (signatureData) => {
    setSignature(signatureData);
  };

  const handleSave = () => {
    if (!hasConsented) {
      alert('Musisz zaznaczyć zgodę na zabieg');
      return;
    }

    if (!signature) {
      alert('Musisz podpisać dokument');
      return;
    }

    const consentData = {
      clientId: client.id,
      type: 'treatment-consent',
      signedAt: new Date().toISOString(),
      signature: signature,
      hasConsented: hasConsented
    };

    // Zapisz w localStorage
    const existingConsents = JSON.parse(localStorage.getItem('treatmentConsents') || '[]');
    const updatedConsents = existingConsents.filter(
      consent => !(consent.clientId === client.id && consent.type === 'treatment-consent')
    );
    updatedConsents.push(consentData);
    localStorage.setItem('treatmentConsents', JSON.stringify(updatedConsents));

    if (onSave) {
      onSave(consentData);
    }

    onClose();
  };

  const handlePrint = () => {
    if (!hasConsented || !signature) {
      alert('Musisz zaznaczyć zgodę i podpisać dokument przed wydrukiem');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8">
        <title>Zgoda na zabieg kosmetyczny</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #000;
          }
          h1, h2 {
            text-align: center;
            margin-bottom: 0;
          }
          h1 {
            font-size: 16pt;
            font-weight: bold;
          }
          h2 {
            font-size: 12pt;
            font-weight: normal;
            margin-top: 0;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-weight: bold;
            font-size: 12pt;
            margin-bottom: 5px;
            border-bottom: 1px solid #999;
            padding-bottom: 3px;
          }
          ul {
            margin: 0;
            padding-left: 20px;
          }
          .signature-block {
            margin-top: 30px;
          }
          .signature {
            margin-top: 40px;
            border-top: 1px solid #000;
            width: 250px;
            text-align: center;
              padding-top: 5px;
            font-size: 10pt;
          }
          .signature-image {
            max-width: 200px;
            max-height: 100px;
            border: 1px solid #000;
            margin: 10px 0;
          }
          .signature-date {
            margin-top: 10px;
            font-size: 9pt;
            text-align: center;
          }
        </style>
      </head>
      <body>

      <h1>ZGODA NA ZABIEG KOSMETYCZNY</h1>
      <h2>Pacjent: ${client?.firstName} ${client?.lastName} &nbsp;&nbsp;&nbsp; Data: ${new Date().toLocaleDateString('pl-PL')}</h2>

      <div class="section">
        <div class="section-title">1. Oświadczenie pacjenta</div>
        <p>Oświadczam, że przed rozpoczęciem zabiegu udzieliłam/udzieliłem pełnych, prawdziwych i wyczerpujących odpowiedzi na pytania, które zadawano mi w trakcie wywiadu oraz w pisemnej ankiecie, dotyczące:</p>
        <ul>
          <li>mojego stanu zdrowia,</li>
          <li>istnienia lub braku ciąży,</li>
          <li>przyjmowanych leków,</li>
          <li>przebytych zabiegów.</li>
        </ul>
        <p>Zostałam/zostałem wyczerpująco poinformowana/y o:</p>
        <ul>
          <li>wskazaniach i przeciwwskazaniach do wykonania zabiegu,</li>
          <li>technice i sposobie przeprowadzenia zabiegu,</li>
          <li>pochodzeniu i działaniu preparatów użytych podczas zabiegu,</li>
          <li>efektach możliwych do osiągnięcia w moim przypadku oraz różnicach u innych pacjentów,</li>
          <li>ilości zabiegów potrzebnych do uzyskania lub utrzymania oczekiwanego efektu,</li>
          <li>możliwych następstwach i powikłaniach zabiegu,</li>
          <li>możliwości wystąpienia dolegliwości bólowych w trakcie lub po zabiegu,</li>
          <li>zaleceniach dotyczących pielęgnacji domowej i postępowania po zabiegu,</li>
          <li>skutkach niezastosowania się do zaleceń pozabiegowych,</li>
          <li>czasie utrzymywania się efektów oraz czasie możliwego wykonania kolejnego zabiegu.</li>
        </ul>
        <p>Jeżeli zabieg tego wymaga, przyjmuję do wiadomości, że konieczne może być prowadzenie kuracji domowej, a szczegółowe informacje otrzymałam/em na piśmie.</p>
      </div>

      <div class="section">
        <div class="section-title">2. Świadomość ryzyka</div>
        <p>Rozumiem, że:</p>
        <ul>
          <li>podstawą moich roszczeń odszkodowawczych nie może być wystąpienie negatywnych następstw lub powikłań zabiegu, o których zostałam/em poinformowana/y,</li>
          <li>podstawą roszczeń nie może być rozbieżność między efektami zabiegu a moimi oczekiwaniami,</li>
          <li>podstawą roszczeń nie mogą być powikłania wynikające z niepodania przeze mnie pełnych i prawdziwych informacji o stanie zdrowia.</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">3. Zgoda na dokumentację</div>
        <p>Wyrażam zgodę na wykonanie dokumentacji związanej z zabiegiem, w tym fotografowanie oraz nagrywanie obrazu i dźwięku dla celów medycznych, naukowych lub edukacyjnych, z zastrzeżeniem, że moja tożsamość nie zostanie ujawniona.</p>
        <p>Wyrażam zgodę na obecność osób niezbędnych do przeprowadzenia zabiegu oraz osób obserwujących w celach edukacyjnych.</p>
        <p>Dokumentacja zabiegu będzie przechowywana zgodnie z obowiązującymi przepisami o ochronie danych osobowych.</p>
      </div>

      <div class="section">
        <div class="section-title">4. Potwierdzenie zgody</div>
        <p>Oświadczam, że jestem osobą pełnoletnią i posiadam pełną zdolność do czynności prawnych.</p>
        <p>Zapoznałam/em się z treścią niniejszego dokumentu, potwierdzam prawdziwość oświadczeń w nim zawartych i wyrażam świadomą zgodę na wykonanie zabiegu.</p>
      </div>

      <div class="signature-block">
        ${signature ? 
          `<div>
            <div class="signature">Podpis pacjenta</div>
            <img src="${signature}" alt="Podpis elektroniczny" class="signature-image" />
            <div class="signature-date">Data podpisu: ${new Date().toLocaleDateString('pl-PL')} ${new Date().toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'})}</div>
          </div>` : 
          `<div class="signature">Podpis pacjenta</div>`
        }
        <div class="signature">Podpis osoby wykonującej zabieg</div>
      </div>

      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Zgoda na zabieg</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="consent-section">
            <label className="consent-checkbox">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={handleConsentChange}
              />
              <span className="checkmark"></span>
              Oświadczam, że zostałem poinformowany o charakterze zabiegu, możliwych skutkach ubocznych i zobowiązuję się do przestrzegania zaleceń pozabiegowych
            </label>
          </div>
          
          <div className="signature-section">
            <h3>Podpis elektroniczny</h3>
            <SignatureCanvas onSave={handleSignatureSave} />
            {signature && (
              <div className="signature-preview">
                <img src={signature} alt="Podpis" />
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Anuluj
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            Drukuj
          </button>
          <button 
            className="btn-success" 
            onClick={handleSave}
            disabled={!hasConsented || !signature}
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentConsentModal;
