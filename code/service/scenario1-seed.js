const http = require("http");
const deviceId = "TURBINE-1";
// Simple synthetic 30-day profile in MWh
const dailyMWh = [
  180, 195, 200, 210, 205, 190, 150,  // week 1
  185, 195, 205, 210, 200, 190, 160,  // week 2
  180, 200, 210, 215, 205, 195, 155,  // week 3
  170, 190, 200, 210, 205, 190, 160,  // week 4
  180, 0, 160                         // days 29–31 (31 used, you can trim to 30)
].slice(0, 30); // ensure 30 days
function postDay(dayIndex) {
  return new Promise((resolve, reject) => {
    const day = dayIndex + 1;
    const mwh = dailyMWh[dayIndex];
    const dateStr = `2026-01-${String(day).padStart(2, "0")}T00:00:00Z`;
    const body = JSON.stringify({
      deviceId,
      mwh,
      timestamp: dateStr,
      nonce: day
    });
    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/telemetry",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    };
    const req = http.request(options, res => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        console.log(`Day ${day} sent:`, data);
        resolve();
      });
    });
    req.on("error", err => {
      console.error(`Error on day ${day}:`, err.message);
      reject(err);
    });
    req.write(body);
    req.end();
  });
}
async function run() {
  for (let i = 0; i < dailyMWh.length; i++) {
    await postDay(i);
  }
  console.log("Scenario 1 seed complete");
}
run().catch(err => {
  console.error("Scenario 1 seed failed:", err);
});
