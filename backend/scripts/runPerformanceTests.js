const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Uruchamianie testów wydajnościowych...\n');

// Utwórz katalog na raporty
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Konfiguracja testów
const testConfig = {
  timeout: 60000,
  verbose: true,
  coverage: true,
  reports: true
};

try {
  // Uruchom testy jednostkowe
  console.log('📋 Uruchamianie testów jednostkowych...');
  execSync('npm test -- --testPathPattern="unit" --verbose', { 
    stdio: 'inherit',
    timeout: testConfig.timeout 
  });

  // Uruchom testy integracyjne
  console.log('\n🔗 Uruchamianie testów integracyjnych...');
  execSync('npm test -- --testPathPattern="integration" --verbose', { 
    stdio: 'inherit',
    timeout: testConfig.timeout 
  });

  // Uruchom testy wydajnościowe
  console.log('\n⚡ Uruchamianie testów wydajnościowych...');
  execSync('npm test -- --testPathPattern="performance" --verbose', { 
    stdio: 'inherit',
    timeout: testConfig.timeout 
  });

  // Generuj raport wydajnościowy
  console.log('\n📊 Generowanie raportu wydajnościowego...');
  generatePerformanceReport();

  console.log('\n✅ Wszystkie testy zakończone pomyślnie!');
  console.log('📁 Raporty dostępne w katalogu: backend/reports/');

} catch (error) {
  console.error('\n❌ Błąd podczas uruchamiania testów:', error.message);
  process.exit(1);
}

function generatePerformanceReport() {
  const reportPath = path.join(reportsDir, 'performance-report.json');
  const logPath = path.join(__dirname, '../logs/performance-*.log');
  
  try {
    // Analizuj logi wydajnościowe
    const performanceData = analyzePerformanceLogs();
    
    // Zapisz raport
    fs.writeFileSync(reportPath, JSON.stringify(performanceData, null, 2));
    
    console.log(`📄 Raport zapisany: ${reportPath}`);
  } catch (error) {
    console.warn('⚠️ Nie udało się wygenerować raportu:', error.message);
  }
}

function analyzePerformanceLogs() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalRequests: 0,
      slowRequests: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity
    },
    endpoints: {},
    errors: []
  };

  try {
    // Tutaj można dodać analizę plików logów
    // Na razie zwracamy podstawowy raport
    return report;
  } catch (error) {
    console.warn('⚠️ Błąd podczas analizy logów:', error.message);
    return report;
  }
} 