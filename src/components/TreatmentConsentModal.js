import React, { useState, useEffect } from 'react';
import SignatureCanvas from './SignatureCanvas';
import treatmentConsentService from '../services/treatmentConsentService';

const TreatmentConsentModal = ({ isOpen, onClose, client, onSave, onPrint }) => {
  const [signature, setSignature] = useState('');
  const [hasConsented, setHasConsented] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState('read'); // 'read', 'sign', 'preview'

  // Sprawdź czy klientka już ma zapisaną zgodę
  useEffect(() => {
    if (client) {
      // Pobierz zgodę z serwera
      treatmentConsentService.getClientConsent(client.id)
        .then(response => {
          if (response && response.data) {
            // Nie nadpisuj lokalnie złożonego podpisu
            if (!signature) {
              setSignature(response.data.signature);
            }
            setHasConsented(response.data.hasConsented);
            setHasReadTerms(response.data.hasReadTerms);
          }
        })
        .catch(error => {
          console.log('Klient nie ma jeszcze zgody lub błąd:', error.message);
        });
    }
  }, [client, signature]);

  const handleConsentChange = (e) => {
    setHasConsented(e.target.checked);
  };

  const handleReadTermsChange = (e) => {
    setHasReadTerms(e.target.checked);
  };

  const handleSignatureSave = (signatureData) => {
    console.log('Otrzymano podpis:', signatureData);
    setSignature(signatureData);
    console.log('Stan podpisu po ustawieniu:', signatureData);
  };

  const handleNextStep = () => {
    if (currentStep === 'read' && hasReadTerms) {
      setCurrentStep('sign');
    } else if (currentStep === 'sign' && signature) {
      setCurrentStep('preview');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'sign') {
      setCurrentStep('read');
    } else if (currentStep === 'preview') {
      setCurrentStep('sign');
    }
  };

  const handleSave = async () => {
    if (!hasReadTerms || !hasConsented || !signature) {
      alert('Musisz przeczytać umowę, zaznaczyć zgodę i podpisać dokument');
      return;
    }

    const consentData = {
      clientId: client.id,
      signature: signature,
      hasConsented: hasConsented,
      hasReadTerms: hasReadTerms
    };

    try {
      // Zapisz na serwerze
      const response = await treatmentConsentService.createOrUpdateConsent(consentData);
      
      if (response.success) {
        console.log('Zgoda zapisana na serwerze:', response.data);
        if (onSave) {
          onSave(response.data);
        }
      } else {
        alert('Błąd podczas zapisywania zgody: ' + response.error);
        return;
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania zgody:', error);
      alert('Błąd podczas zapisywania zgody: ' + error.message);
      return;
    }

    onClose();
  };

  const handlePrint = () => {
    if (!hasReadTerms || !hasConsented || !signature) {
      alert('Musisz przeczytać umowę, zaznaczyć zgodę i podpisać dokument przed wydrukiem');
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

             <h1>ZGODA NA ZABIEG</h1>
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Zgoda na zabieg kosmetyczny
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            &times;
          </button>
        </div>

        {/* Progress Steps */}
        <div style={{
          padding: '20px 24px 0 24px',
          display: 'flex',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <div style={{
            flex: 1,
            height: '4px',
            backgroundColor: currentStep === 'read' ? '#3b82f6' : '#e5e7eb',
            borderRadius: '2px',
            transition: 'background-color 0.3s'
          }} />
          <div style={{
            flex: 1,
            height: '4px',
            backgroundColor: currentStep === 'sign' ? '#3b82f6' : '#e5e7eb',
            borderRadius: '2px',
            transition: 'background-color 0.3s'
          }} />
          <div style={{
            flex: 1,
            height: '4px',
            backgroundColor: currentStep === 'preview' ? '#3b82f6' : '#e5e7eb',
            borderRadius: '2px',
            transition: 'background-color 0.3s'
          }} />
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 24px 24px 24px'
        }}>
          {/* Step 1: Read Terms */}
          {currentStep === 'read' && (
            <div>
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  📖 Przeczytaj uważnie treść umowy
                </h3>
                                 <p style={{
                   margin: 0,
                   color: '#374151',
                   fontSize: '14px'
                 }}>
                   Przed podpisaniem dokumentu, upewnij się, że rozumiesz wszystkie warunki i zobowiązania.
                 </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '20px',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                                 <h1 style={{
                   textAlign: 'center',
                   fontSize: '20px',
                   fontWeight: 'bold',
                   margin: '0 0 16px 0',
                   color: '#1e293b'
                 }}>
                   ZGODA NA ZABIEG
                 </h1>
                <h2 style={{
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 'normal',
                  margin: '0 0 20px 0',
                  color: '#64748b'
                }}>
                  Pacjent: {client?.firstName} {client?.lastName} | Data: {new Date().toLocaleDateString('pl-PL')}
                </h2>

                                 <div style={{ marginBottom: '20px' }}>
                   <div style={{
                     fontWeight: 'bold',
                     fontSize: '16px',
                     marginBottom: '8px',
                     color: '#1e293b',
                     borderBottom: '2px solid #3b82f6',
                     paddingBottom: '4px'
                   }}>
                     1. Oświadczenie pacjenta
                   </div>
                   <p style={{ margin: '8px 0', lineHeight: '1.6', color: '#1e293b' }}>
                     Oświadczam, że przed rozpoczęciem zabiegu udzieliłam/udzieliłem pełnych, prawdziwych i wyczerpujących odpowiedzi na pytania, które zadawano mi w trakcie wywiadu oraz w pisemnej ankiecie, dotyczące:
                   </p>
                   <ul style={{ margin: '8px 0', paddingLeft: '20px', lineHeight: '1.6', color: '#1e293b' }}>
                     <li>mojego stanu zdrowia,</li>
                     <li>istnienia lub braku ciąży,</li>
                     <li>przyjmowanych leków,</li>
                     <li>przebytych zabiegów.</li>
                   </ul>
                   <p style={{ margin: '8px 0', lineHeight: '1.6', color: '#1e293b' }}>
                     Zostałam/zostałem wyczerpująco poinformowana/y o:
                   </p>
                   <ul style={{ margin: '8px 0', paddingLeft: '20px', lineHeight: '1.6', color: '#1e293b' }}>
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
                   <p style={{ margin: '8px 0', lineHeight: '1.6', color: '#1e293b' }}>
                     Jeżeli zabieg tego wymaga, przyjmuję do wiadomości, że konieczne może być prowadzenie kuracji domowej, a szczegółowe informacje otrzymałam/em na piśmie.
                   </p>
                 </div>

                                 <div style={{ marginBottom: '20px' }}>
                   <div style={{
                     fontWeight: 'bold',
                     fontSize: '16px',
                     marginBottom: '8px',
                     color: '#1e293b',
                     borderBottom: '2px solid #3b82f6',
                     paddingBottom: '4px'
                   }}>
                     2. Świadomość ryzyka
                   </div>
                   <p style={{ margin: '8px 0', lineHeight: '1.6', color: '#1e293b' }}>
                     Rozumiem, że:
                   </p>
                   <ul style={{ margin: '8px 0', paddingLeft: '20px', lineHeight: '1.6', color: '#1e293b' }}>
                     <li>podstawą moich roszczeń odszkodowawczych nie może być wystąpienie negatywnych następstw lub powikłań zabiegu, o których zostałam/em poinformowana/y,</li>
                     <li>podstawą roszczeń nie może być rozbieżność między efektami zabiegu a moimi oczekiwaniami,</li>
                     <li>podstawą roszczeń nie mogą być powikłania wynikające z niepodania przeze mnie pełnych i prawdziwych informacji o stanie zdrowia.</li>
                   </ul>
                 </div>

                                 <div style={{ marginBottom: '20px' }}>
                   <div style={{
                     fontWeight: 'bold',
                     fontSize: '16px',
                     marginBottom: '8px',
                     color: '#1e293b',
                     borderBottom: '2px solid #3b82f6',
                     paddingBottom: '4px'
                   }}>
                     3. Zgoda na dokumentację
                   </div>
                   <p style={{ margin: '8px 0', lineHeight: '1.6', color: '#1e293b' }}>
                     Wyrażam zgodę na wykonanie dokumentacji związanej z zabiegiem, w tym fotografowanie oraz nagrywanie obrazu i dźwięku dla celów medycznych, naukowych lub edukacyjnych, z zastrzeżeniem, że moja tożsamość nie zostanie ujawniona.
                   </p>
                   <p style={{ margin: '8px 0', lineHeight: '1.6', color: '#1e293b' }}>
                     Wyrażam zgodę na obecność osób niezbędnych do przeprowadzenia zabiegu oraz osób obserwujących w celach edukacyjnych.
                   </p>
                   <p style={{ margin: '8px 0', lineHeight: '1.6', color: '#1e293b' }}>
                     Dokumentacja zabiegu będzie przechowywana zgodnie z obowiązującymi przepisami o ochronie danych osobowych.
                   </p>
                 </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginBottom: '8px',
                    color: '#1e293b',
                    borderBottom: '2px solid #3b82f6',
                    paddingBottom: '4px'
                  }}>
                    4. Potwierdzenie zgody
                  </div>
                                     <p style={{ margin: '8px 0', lineHeight: '1.6', color: '#1e293b' }}>
                     Oświadczam, że jestem osobą pełnoletnią i posiadam pełną zdolność do czynności prawnych. Zapoznałam/em się z treścią niniejszego dokumentu i wyrażam świadomą zgodę na wykonanie zabiegu.
                   </p>
                </div>
              </div>

              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '20px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#0c4a6e'
                }}>
                  <input
                    type="checkbox"
                    checked={hasReadTerms}
                    onChange={handleReadTermsChange}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#0ea5e9'
                    }}
                  />
                  <span>✓ Zapoznałem/am się z treścią umowy i rozumiem wszystkie warunki</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Signature */}
          {currentStep === 'sign' && (
            <div>
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #22c55e',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#166534'
                }}>
                  ✍️ Podpisz dokument elektronicznie
                </h3>
                <p style={{
                  margin: 0,
                  color: '#166534',
                  fontSize: '14px'
                }}>
                  Użyj myszki lub palca na urządzeniu dotykowym, aby złożyć podpis.
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <SignatureCanvas onSave={handleSignatureSave} />
              </div>

              {signature && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #22c55e',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    margin: '0 0 12px 0',
                    color: '#166534',
                    fontWeight: '500'
                  }}>
                    ✅ Podpis został zapisany
                  </p>
                  <img 
                    src={signature} 
                    alt="Podpis" 
                    style={{
                      maxWidth: '200px',
                      maxHeight: '100px',
                      border: '1px solid #22c55e',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              )}

              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '20px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#92400e'
                }}>
                  <input
                    type="checkbox"
                    checked={hasConsented}
                    onChange={handleConsentChange}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#f59e0b'
                    }}
                  />
                  <span>✅ Oświadczam, że zostałem poinformowany o charakterze zabiegu, możliwych skutkach ubocznych i zobowiązuję się do przestrzegania zaleceń pozabiegowych</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 'preview' && (
            <div>
              <div style={{
                backgroundColor: '#fef3c7',
                                 border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#92400e'
                }}>
                  👀 Podgląd dokumentu do wydruku
                </h3>
                <p style={{
                  margin: 0,
                  color: '#92400e',
                  fontSize: '14px'
                }}>
                  Sprawdź jak będzie wyglądał wydrukowany dokument. Możesz go wydrukować lub zapisać.
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '20px',
                maxHeight: '400px',
                overflow: 'auto',
                boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
              }}>
                                 <h1 style={{
                   textAlign: 'center',
                   fontSize: '18px',
                   fontWeight: 'bold',
                   margin: '0 0 16px 0',
                   color: '#1e293b'
                 }}>
                   ZGODA NA ZABIEG
                 </h1>
                <h2 style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'normal',
                  margin: '0 0 20px 0',
                  color: '#64748b'
                }}>
                  Pacjent: {client?.firstName} {client?.lastName} | Data: {new Date().toLocaleDateString('pl-PL')}
                </h2>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginBottom: '6px',
                    color: '#1e293b',
                    borderBottom: '1px solid #3b82f6',
                    paddingBottom: '2px'
                  }}>
                    1. Oświadczenie pacjenta
                  </div>
                  <p style={{ margin: '6px 0', lineHeight: '1.5', fontSize: '13px', color: '#1e293b' }}>
                    Oświadczam, że przed rozpoczęciem zabiegu udzieliłam/udzieliłem pełnych, prawdziwych i wyczerpujących odpowiedzi na pytania...
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginBottom: '6px',
                    color: '#1e293b',
                    borderBottom: '1px solid #3b82f6',
                    paddingBottom: '2px'
                  }}>
                    2. Świadomość ryzyka
                  </div>
                  <p style={{ margin: '6px 0', lineHeight: '1.5', fontSize: '13px', color: '#1e293b' }}>
                    Rozumiem, że podstawą moich roszczeń odszkodowawczych nie może być wystąpienie negatywnych następstw...
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginBottom: '6px',
                    color: '#1e293b',
                    borderBottom: '1px solid #3b82f6',
                    paddingBottom: '2px'
                  }}>
                    3. Zgoda na dokumentację
                  </div>
                  <p style={{ margin: '6px 0', lineHeight: '1.5', fontSize: '13px', color: '#1e293b' }}>
                    Wyrażam zgodę na wykonanie dokumentacji związanej z zabiegiem...
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginBottom: '6px',
                    color: '#1e293b',
                                         borderBottom: '1px solid #3b82f6',
                    paddingBottom: '2px'
                  }}>
                    4. Potwierdzenie zgody
                  </div>
                  <p style={{ margin: '6px 0', lineHeight: '1.5', fontSize: '13px', color: '#1e293b' }}>
                    Oświadczam, że jestem osobą pełnoletnią i posiadam pełną zdolność do czynności prawnych...
                  </p>
                </div>

                <div style={{
                  marginTop: '30px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '20px'
                }}>
                  {console.log('W kroku podglądu, signature:', signature, 'typ:', typeof signature, 'długość:', signature ? signature.length : 'brak')}
                  {signature && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        borderTop: '2px solid #3b82f6',
                        width: '250px',
                        margin: '0 auto',
                        paddingTop: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1e293b'
                      }}>
                        ✍️ Podpis pacjenta
                      </div>
                      <img 
                        src={signature} 
                        alt="Podpis elektroniczny" 
                        style={{
                          maxWidth: '200px',
                          maxHeight: '100px',
                          border: '2px solid #3b82f6',
                          borderRadius: '6px',
                          margin: '12px auto',
                          display: 'block',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <div style={{
                        fontSize: '11px',
                        color: '#64748b',
                        backgroundColor: '#f1f5f9',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginTop: '8px'
                      }}>
                        📅 Data podpisu: {new Date().toLocaleDateString('pl-PL')} {new Date().toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 24px 24px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          {currentStep !== 'read' && (
            <button
              onClick={handlePrevStep}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#d1d5db';
              }}
            >
              ← Wstecz
            </button>
          )}

          {currentStep === 'read' && (
            <button
              onClick={handleNextStep}
              disabled={!hasReadTerms}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: hasReadTerms ? '#3b82f6' : '#9ca3af',
                color: 'white',
                cursor: hasReadTerms ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (hasReadTerms) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (hasReadTerms) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Dalej →
            </button>
          )}

          {currentStep === 'sign' && (
            <button
              onClick={handleNextStep}
              disabled={!signature || !hasConsented}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: (signature && hasConsented) ? '#3b82f6' : '#9ca3af',
                color: 'white',
                cursor: (signature && hasConsented) ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (signature && hasConsented) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (signature && hasConsented) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              Podgląd →
            </button>
          )}

          {currentStep === 'preview' && (
            <>
              <button
                onClick={handlePrint}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
              >
                🖨️ Drukuj
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                💾 Zapisz
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatmentConsentModal;
