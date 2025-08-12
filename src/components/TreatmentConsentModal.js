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

    const consentText = `ZGODA NA ZABIEG

Pacjent: ${client?.firstName} ${client?.lastName}
Data: ${new Date().toLocaleDateString('pl-PL')}

Ja, niżej podpisana/podpisany, oświadczam, że:

1. Zostałam/em poinformowana/y o charakterze i przebiegu zabiegu kosmetologicznego
2. Zostałam/em poinformowana/y o możliwych skutkach ubocznych i powikłaniach
3. Zostałam/em poinformowana/y o przeciwwskazaniach do wykonania zabiegu
4. Zostałam/em poinformowana/y o konieczności przestrzegania zaleceń pozabiegowych
5. Zostałam/em poinformowana/y o możliwych reakcjach skóry po zabiegu
6. Zostałam/em poinformowana/y o konieczności ochrony przeciwsłonecznej po zabiegu
7. Zostałam/em poinformowana/y o możliwych ograniczeniach w stosowaniu kosmetyków po zabiegu
8. Zostałam/em poinformowana/y o konieczności konsultacji w przypadku niepokojących objawów

Oświadczam, że:
- Rozumiem wszystkie informacje przekazane przez kosmetologa
- Akceptuję ryzyko związane z wykonaniem zabiegu
- Zobowiązuję się do przestrzegania zaleceń pozabiegowych
- Zobowiązuję się do informowania o wszelkich niepokojących objawach

Data podpisu: ${new Date().toLocaleDateString('pl-PL')}
Podpis pacjenta: [PODPIS]

Zgoda została udzielona dobrowolnie i świadomie.`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Zgoda na zabieg</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 11pt;
              line-height: 1.6;
              color: #2c3e50;
              background: white;
              padding: 2cm;
            }
            
            .clinic-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #3498db;
            }
            
            .clinic-logo {
              font-size: 24pt;
              font-weight: bold;
              color: #3498db;
              margin-bottom: 5px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .document-title {
              text-align: center;
              font-size: 18pt;
              font-weight: bold;
              color: #2c3e50;
              margin: 30px 0;
              padding: 20px;
              background: linear-gradient(135deg, #3498db, #2980b9);
              color: white;
              border-radius: 10px;
              box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
            }
            
            .patient-info {
              background: linear-gradient(135deg, #3498db, #2980b9);
              color: white;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 30px;
              box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
            }
            
            .patient-info h2 {
              margin: 0;
              font-size: 14pt;
              text-align: center;
            }
            
            .section {
              margin-bottom: 25px;
              padding: 20px;
              background: linear-gradient(135deg, #f8f9fa, #e9ecef);
              border-left: 5px solid #3498db;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .section-title {
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 15px;
              font-size: 12pt;
              background: linear-gradient(135deg, #3498db, #2980b9);
              color: white;
              padding: 10px;
              border-radius: 5px;
              margin: -20px -20px 15px -20px;
            }
            
            .section-number {
              display: inline-block;
              background: #e74c3c;
              color: white;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              text-align: center;
              line-height: 25px;
              margin-right: 10px;
              font-weight: bold;
            }
            
            ul {
              margin: 0;
              padding-left: 20px;
            }
            
            li {
              margin-bottom: 8px;
              position: relative;
            }
            
            li:before {
              content: "•";
              color: #3498db;
              font-weight: bold;
              font-size: 18px;
              position: absolute;
              left: -20px;
            }
            
            p {
              margin: 8px 0;
              line-height: 1.6;
            }
            
            .highlight-box {
              background: linear-gradient(135deg, #f39c12, #e67e22);
              color: white;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              border: 2px solid #d68910;
              box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
            }
            
            .signature-block {
              margin-top: 40px;
              padding: 25px;
              background: linear-gradient(135deg, #9b59b6, #8e44ad);
              color: white;
              border-radius: 10px;
              border: 2px solid #8e44ad;
              box-shadow: 0 4px 15px rgba(155, 89, 181, 0.3);
            }
            
            .signature {
              text-align: center;
              font-size: 14pt;
              font-weight: bold;
              margin: 20px 0;
              padding: 20px;
              border: 2px dashed #fff;
              border-radius: 8px;
              background: rgba(255,255,255,0.1);
            }
            
            .signature-image {
              max-width: 200px;
              max-height: 100px;
              border: 2px solid #fff;
              border-radius: 5px;
              margin: 10px 0;
            }
            
            .signature-date {
              text-align: center;
              font-size: 11pt;
              margin-top: 15px;
              padding: 10px;
              background: rgba(255,255,255,0.2);
              border-radius: 5px;
            }
            
            @media print {
              @page {
                size: A4;
                margin: 2cm !important;
              }
              
              @page :first {
                margin-top: 2cm !important;
                margin-bottom: 2cm !important;
              }
              
              @page :left {
                margin-left: 2cm !important;
                margin-right: 2cm !important;
                margin-top: 2cm !important;
                margin-bottom: 2cm !important;
              }
              
              @page :right {
                margin-left: 2cm !important;
                margin-right: 2cm !important;
                margin-top: 2cm !important;
                margin-bottom: 2cm !important;
              }
              
              body {
                margin: 0 !important;
                padding: 0 !important;
                background: white;
                font-size: 11pt;
                line-height: 1.5;
              }
              
              .header { page-break-after: avoid; }
              .signature-block { page-break-inside: avoid; }
              .section { page-break-inside: avoid; }
              .clinic-header { page-break-after: avoid; }
              .document-title { page-break-after: avoid; }
              .patient-info { page-break-after: avoid; }
              
              .signature-doctor {
                display: none !important;
              }
              
              html, body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              body::before, body::after {
                display: none !important;
                content: none !important;
              }
              
              html {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="clinic-header">
            <div class="clinic-logo">Gabinet Kosmetologiczny</div>
          </div>
          
          <div class="document-title">ZGODA NA ZABIEG</div>
          
          <div class="patient-info">
            <h2>Pacjent: ${client?.firstName} ${client?.lastName} &nbsp;&nbsp;&nbsp; Data: ${new Date().toLocaleDateString('pl-PL')}</h2>
          </div>
          
          <div class="section">
            <div class="section-title">
              <span class="section-number">1</span>
              Informacje o zabiegu
            </div>
            <p>Zostałam/em poinformowana/y o charakterze i przebiegu zabiegu kosmetologicznego, który ma zostać wykonany.</p>
          </div>
          
          <div class="section">
            <div class="section-title">
              <span class="section-number">2</span>
              Skutki uboczne i powikłania
            </div>
            <p>Zostałam/em poinformowana/y o możliwych skutkach ubocznych i powikłaniach, które mogą wystąpić po wykonaniu zabiegu.</p>
          </div>
          
          <div class="section">
            <div class="section-title">
              <span class="section-number">3</span>
              Przeciwwskazania
            </div>
            <p>Zostałam/em poinformowana/y o przeciwwskazaniach do wykonania zabiegu i potwierdzam, że nie występują u mnie żadne z nich.</p>
          </div>
          
          <div class="section">
            <div class="section-title">
              <span class="section-number">4</span>
              Zalecenia pozabiegowe
            </div>
            <p>Zostałam/em poinformowana/y o konieczności przestrzegania zaleceń pozabiegowych, które są niezbędne dla prawidłowego gojenia się skóry.</p>
          </div>
          
          <div class="section">
            <div class="section-title">
              <span class="section-number">5</span>
              Reakcje skóry
            </div>
            <p>Zostałam/em poinformowana/y o możliwych reakcjach skóry po zabiegu, takich jak zaczerwienienie, obrzęk czy łuszczenie się naskórka.</p>
          </div>
          
          <div class="section">
            <div class="section-title">
              <span class="section-number">6</span>
              Ochrona przeciwsłoneczna
            </div>
            <p>Zostałam/em poinformowana/y o konieczności stosowania ochrony przeciwsłonecznej po zabiegu i unikania ekspozycji na słońce.</p>
          </div>
          
          <div class="section">
            <div class="section-title">
              <span class="section-number">7</span>
              Ograniczenia kosmetyczne
            </div>
            <p>Zostałam/em poinformowana/y o możliwych ograniczeniach w stosowaniu kosmetyków po zabiegu.</p>
          </div>
          
          <div class="section">
            <div class="section-title">
              <span class="section-number">8</span>
              Konsultacja lekarska
            </div>
            <p>Zostałam/em poinformowana/y o konieczności konsultacji w przypadku wystąpienia niepokojących objawów po zabiegu.</p>
          </div>
          
          <div class="highlight-box">
            <strong>OŚWIADCZENIE:</strong><br>
            Rozumiem wszystkie informacje przekazane przez kosmetologa, akceptuję ryzyko związane z wykonaniem zabiegu, 
            zobowiązuję się do przestrzegania zaleceń pozabiegowych oraz do informowania o wszelkich niepokojących objawach.
          </div>
          
          <div class="signature-block">
            ${signature ? 
              `<div>
                <p><strong>Podpis elektroniczny:</strong></p>
                <img src="${signature}" alt="Podpis elektroniczny" class="signature-image" />
                <p class="signature-date"><strong>Data podpisu:</strong> ${new Date().toLocaleDateString('pl-PL')} ${new Date().toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'})}</p>
              </div>` : 
              `<div class="signature">Podpis pacjenta</div>`
            }
            <div class="signature signature-doctor" style="display: none;">Podpis osoby wykonującej zabieg</div>
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
