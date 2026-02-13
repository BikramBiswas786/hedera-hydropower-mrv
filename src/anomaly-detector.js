const crypto = require("crypto");
class AnomalyDetector {
  constructor(historicalData = []) {
    this.historicalData = historicalData;
    this.physicsConstants = {
      waterDensity: 1000,
      gravity: 9.81,
      efficiencyMin: 0.80,
      efficiencyMax: 0.90
    };
  }
  validatePhysicalConstraints(telemetry) {
    const { flowRate, headHeight, generatedKwh } = telemetry;
    const { waterDensity, gravity, efficiencyMin, efficiencyMax } = this.physicsConstants;
    const minExpectedPower = (waterDensity * gravity * flowRate * headHeight * efficiencyMin) / 1000;
    const maxExpectedPower = (waterDensity * gravity * flowRate * headHeight * efficiencyMax) / 1000;
    const tolerance = 0.05; // 5% band for production
    const lowerBound = minExpectedPower * (1 - tolerance);
    const upperBound = maxExpectedPower * (1 + tolerance);
    const isValid = generatedKwh >= lowerBound && generatedKwh <= upperBound;
    return {
      isValid,
      expectedRange: { min: minExpectedPower, max: maxExpectedPower },
      tolerance: tolerance * 100,
      actualValue: generatedKwh,
      lowerBound,
      upperBound
    };
  }
  validateTemporalConsistency(telemetry, previousTelemetry) {
    const { timestamp } = telemetry;
    const currentTime = new Date(timestamp).getTime();
    const previousTime = previousTelemetry ? new Date(previousTelemetry.timestamp).getTime() : 0;
    const isMonotonicallyIncreasing = currentTime > previousTime;
    const isDuplicate = currentTime === previousTime;
    return {
      isValid: isMonotonicallyIncreasing && !isDuplicate,
      isMonotonicallyIncreasing,
      isDuplicate,
      timeDifference: currentTime - previousTime
    };
  }
  validateEnvironmentalBounds(telemetry) {
    const { pH, turbidity, flowRate } = telemetry;
    const bounds = {
      pH: { min: 6.5, max: 8.5 },
      turbidity: { max: 50 },
      flowRate: { min: 0.1, max: 100 }
    };
    const pHValid = pH >= bounds.pH.min && pH <= bounds.pH.max;
    const turbidityValid = turbidity <= bounds.turbidity.max;
    const flowRateValid = flowRate >= bounds.flowRate.min && flowRate <= bounds.flowRate.max;
    return {
      isValid: pHValid && turbidityValid && flowRateValid,
      pH: { valid: pHValid, value: pH, bounds: bounds.pH },
      turbidity: { valid: turbidityValid, value: turbidity, bounds: bounds.turbidity },
      flowRate: { valid: flowRateValid, value: flowRate, bounds: bounds.flowRate }
    };
  }
  detectAnomalies(telemetry, historicalReadings) {
    if (!historicalReadings || historicalReadings.length === 0) {
      return {
        isAnomaly: false,
        reason: "Insufficient historical data"
      };
    }
    const kwhValues = historicalReadings.map(r => r.generatedKwh);
    const mean = kwhValues.reduce((a, b) => a + b, 0) / kwhValues.length;
    const variance = kwhValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / kwhValues.length;
    const stdDev = Math.sqrt(variance) || 1;
    const zScore = (telemetry.generatedKwh - mean) / stdDev;
    const threshold = 3;
    const isAnomaly = Math.abs(zScore) >= threshold;
    return {
      isAnomaly,
      zScore,
      mean,
      stdDev,
      threshold,
      reason: isAnomaly ? `Z-score ${zScore.toFixed(2)} exceeds threshold` : "Normal"
    };
  }
  validateTelemetry(telemetry, previousTelemetry = null, historicalReadings = []) {
    const physicsCheck = this.validatePhysicalConstraints(telemetry);
    const temporalCheck = this.validateTemporalConsistency(telemetry, previousTelemetry);
    const environmentalCheck = this.validateEnvironmentalBounds(telemetry);
    const anomalyCheck = this.detectAnomalies(telemetry, historicalReadings);
    const allValid =
      physicsCheck.isValid &&
      temporalCheck.isValid &&
      environmentalCheck.isValid &&
      !anomalyCheck.isAnomaly;
    const rejectionReasons = [
      !physicsCheck.isValid ? "Physics constraint violation" : null,
      !temporalCheck.isValid ? "Temporal consistency violation" : null,
      !environmentalCheck.isValid ? "Environmental bounds violation" : null,
      anomalyCheck.isAnomaly ? "Statistical anomaly detected" : null
    ].filter(r => r !== null);
    return {
      isValid: allValid,
      checks: {
        physics: physicsCheck,
        temporal: temporalCheck,
        environmental: environmentalCheck,
        anomaly: anomalyCheck
      },
      rejectionReasons
    };
  }
}
module.exports = AnomalyDetector;
