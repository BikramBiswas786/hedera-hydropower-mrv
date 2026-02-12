export const CONFIG = {
  network: "testnet" as const,

  operatorId: process.env.HEDERA_OPERATOR_ID || "",
  operatorKey: process.env.HEDERA_OPERATOR_KEY || "",
  topicId: process.env.HEDERA_TOPIC_ID || "",

  gridEmissionFactor: Number(process.env.GRID_EF || "0.8")
};
