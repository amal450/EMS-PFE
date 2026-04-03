// simulator.js - Version corrigée pour correspondre au schéma
const API_URL = 'http://localhost:3000/measurements';

// IDs des équipements
const devices = [11, 13, 1, 2, 9, 10, 18, 19, 20]; // Ajoutez tous vos IDs

console.log("🚀 [EMS VOLT] Simulateur Industriel Démarré...");

function generateData(id) {
  // Tensions simples (V-N) autour de 230V
  const V1N = Number((228 + Math.random() * 6).toFixed(1));
  const V2N = Number((228 + Math.random() * 6).toFixed(1));
  const V3N = Number((228 + Math.random() * 6).toFixed(1));

  // Tensions composées (V-V) autour de 400V
  const V12 = Number((398 + Math.random() * 10).toFixed(1));
  const V23 = Number((398 + Math.random() * 10).toFixed(1));
  const V31 = Number((398 + Math.random() * 10).toFixed(1));

  // Courants entre 12A et 18A
  const I1 = Number((12 + Math.random() * 6).toFixed(2));
  const I2 = Number((12 + Math.random() * 6).toFixed(2));
  const I3 = Number((12 + Math.random() * 6).toFixed(2));

  // Fréquence et facteur puissance
  const HZ = Number((49.98 + Math.random() * 0.04).toFixed(2));
  const PF = Number((0.91 + Math.random() * 0.05).toFixed(2));

  // Puissance totale (kW)
  const TKW = Number(((V1N * I1 + V2N * I2 + V3N * I3) / 1000).toFixed(2));
  
  // Énergie apparente (kVAh)
  const KVAH = Number((TKW / PF).toFixed(2));
  
  // Énergie active (kWh) - valeur aléatoire
  const IKWH = Number((Math.random() * 100).toFixed(2));

  // Retourner les données avec les MAJUSCULES comme dans le schéma
  return {
    assetId: id,
    V1N, V2N, V3N,
    V12, V23, V31,
    I1, I2, I3,
    TKW,
    IKWH,
    HZ,
    PF,
    KVAH
  };
}

setInterval(async () => {
  console.log(`\n--- Push Batch [${new Date().toLocaleTimeString()}] ---`);
  for (let id of devices) {
    const data = generateData(id);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ [Device ${id}]: ${data.TKW} kW | ${data.PF} PF | ${data.HZ} Hz`);
      } else {
        const error = await response.text();
        console.log(`⚠️ [Device ${id}]: HTTP ${response.status} - ${error}`);
      }
    } catch (e) {
      console.log("❌ Erreur connexion:", e.message);
    }
  }
}, 2000);