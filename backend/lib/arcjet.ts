import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import envConfig from "../config/env.js";

export const aj = arcjet({
  key: envConfig.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 15,
      interval: 15,
      capacity: 25,
    }),
  ],
});
