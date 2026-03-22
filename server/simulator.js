// simulator.js - المحاكي الصناعي المتقدم
// يوضع في مجلد server

const API_URL = 'http://localhost:3000/measurements';

// IDs المعدات من Drizzle Studio
const devices = [11, 13]; 

console.log("🚀 [EMS VOLT] Simulateur Industriel Démarré...");

function generateData(id) {
  // تيار بين 12A و 18A لكل فاز
  const i1 = Number((12 + Math.random() * 6).toFixed(2));
  const i2 = Number((12 + Math.random() * 6).toFixed(2));
  const i3 = Number((12 + Math.random() * 6).toFixed(2));

  // توتر بسيط (V-N) حول 230V
  const v1 = Number((228 + Math.random() * 6).toFixed(1));
  const v2 = Number((228 + Math.random() * 6).toFixed(1));
  const v3 = Number((228 + Math.random() * 6).toFixed(1));

  // توتر مركب (V-V) حول 400V
  const u1 = Number((398 + Math.random() * 10).toFixed(1));
  const u2 = Number((398 + Math.random() * 10).toFixed(1));
  const u3 = Number((398 + Math.random() * 10).toFixed(1));

  // تردد (Hz) وعامل قدرة (Cos Phi)
  const frequency = Number((49.98 + Math.random() * 0.04).toFixed(2));
  const cosPhi = Number((0.91 + Math.random() * 0.05).toFixed(2));

  // حساب القدرة الإجمالية تقريبياً (kW)
  const power = Number(((v1 * i1 + v2 * i2 + v3 * i3) / 1000).toFixed(2));

  return {
    assetId: id,
    i1, i2, i3,
    v1, v2, v3,
    u1, u2, u3,
    power,
    frequency,
    cosPhi
  };
}

setInterval(async () => {
  console.log(`\n--- Push Batch [${new Date().toLocaleTimeString()}] ---`);
  for (let id of devices) {
    const data = generateData(id);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      console.log(`✅ [Device ${id}]: ${data.power} kW Pushed`);
    } catch (e) {
      console.log("❌ NestJS Offline");
    }
  }
}, 2000);