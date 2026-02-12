export interface Acm0002Input {
  electricityMWh: number;
  gridEmissionFactor: number;
  projectEmissions: number;
  leakageEmissions: number;
}

export interface Acm0002Result {
  baselineEmissions: number;
  emissionReductions: number;
}

export function computeAcm0002(input: Acm0002Input): Acm0002Result {
  const { electricityMWh, gridEmissionFactor, projectEmissions, leakageEmissions } = input;

  if (electricityMWh < 0) throw new Error("electricityMWh must be >= 0");
  if (gridEmissionFactor < 0) throw new Error("gridEmissionFactor must be >= 0");
  if (projectEmissions < 0 || leakageEmissions < 0) {
    throw new Error("projectEmissions and leakageEmissions must be >= 0");
  }

  const baselineEmissions = electricityMWh * gridEmissionFactor;
  const emissionReductions = baselineEmissions - projectEmissions - leakageEmissions;

  return { baselineEmissions, emissionReductions };
}
