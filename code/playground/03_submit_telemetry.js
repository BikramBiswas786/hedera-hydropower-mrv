require('dotenv').config({ path: '../../.env' });
const { EngineV1 } = require('../../engine-v1');
const fs = require('fs');
async function main() {
  const engine = new EngineV1();
  const telemetry = {
    deviceId: 'TURBINE-1',
    timestamp: new Date().toISOString(),
    readings: {
      flowRate_m3_per_s: 2.5,
      headHeight_m: 45,
      generatedKwh: 900,
      pH: 7.2,
      turbidity_ntu: 10,
      temperature_celsius: 18,
      efficiency: 0.85
    }
  };
  console.log('Submitting telemetry...');
  const result = await engine.verifyAndPublish(telemetry);
  console.log(`✓ ${result.attestation.verificationStatus}`);
  console.log(`RECs: ${result.attestation.calculations.RECs_issued} tCO2`);
  console.log(`TX: ${result.transactionId}`);
  fs.writeFileSync('../../last-result.json', JSON.stringify(result, null, 2));
  console.log('\n✓ Result saved to last-result.json');
}
main().catch(console.error);
