// simulator.js (f wast dossier server)

const devices = [11, 13]; // El IDs mta3 Equipement 1 w Equipement 2 mte3ek

setInterval(async () => {
  for (let id of devices) {
    const data = {
      assetId: id,
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
      console.log(`⚡ [Device ${id}]: Data Pushed -> ${data.power} kW`);
    } catch (e) {
      console.log("❌ Server offline");
    }
  }
  console.log("-----------------------");
}, 2000);