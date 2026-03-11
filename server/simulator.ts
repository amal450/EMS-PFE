const ASSET_ID = 1; 

setInterval(async () => {
  const data = {
    assetId: ASSET_ID,
    voltage: (220 + Math.random() * 5).toFixed(1),
    intensity: (15 + Math.random() * 3).toFixed(1),
    power: (3.5 + Math.random() * 1).toFixed(2),
  };

  try {
    await fetch('http://localhost:3000/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log("⚡ [Simulator] Pushed:", data.power + " kW");
  } catch (e) { console.log("Backend offline"); }
}, 2000);