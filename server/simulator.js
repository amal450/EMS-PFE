// simulator.js (حطو في مجلد server)
const ASSET_ID = 1; 

setInterval(async () => {
  const data = {
    assetId: ASSET_ID,
    voltage: Number((220 + Math.random() * 5).toFixed(1)),
    intensity: Number((10 + Math.random() * 2).toFixed(1)),
    power: Number((2.2 + Math.random() * 0.8).toFixed(2)),
  };

  try {
    await fetch('http://localhost:3000/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log("⚡ [Simulator]: Data Pushed ->", data.power, "kW");
  } catch (e) {
    console.log("❌ Server is offline");
  }
}, 2000);