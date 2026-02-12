import { computeAcm0002 } from "../acm0002";

function approxEqual(a: number, b: number, eps = 1e-9) {
  return Math.abs(a - b) < eps;
}

function run() {
  const cases = [
    {
      name: "10,000 MWh, EF=0.8, no PE/LE",
      input: { electricityMWh: 10000, gridEmissionFactor: 0.8, projectEmissions: 0, leakageEmissions: 0 },
      expectedBaseline: 8000,
      expectedER: 8000
    },
    {
      name: "Baseline 8000, PE=100, LE=50",
      input: { electricityMWh: 10000, gridEmissionFactor: 0.8, projectEmissions: 100, leakageEmissions: 50 },
      expectedBaseline: 8000,
      expectedER: 7850
    }
  ];

  let failures = 0;

  for (const c of cases) {
    const r = computeAcm0002(c.input);
    if (!approxEqual(r.baselineEmissions, c.expectedBaseline) ||
        !approxEqual(r.emissionReductions, c.expectedER)) {
      console.error("FAIL:", c.name, r);
      failures++;
    } else {
      console.log("OK:", c.name);
    }
  }

  if (failures > 0) {
    process.exit(1);
  } else {
    console.log("All ACM0002 tests passed");
  }
}

run();
