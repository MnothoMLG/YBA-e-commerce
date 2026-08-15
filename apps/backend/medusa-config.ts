import { defineConfig, loadEnv, MedusaError } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY?.trim();

console.log(
  "PAYSTACK_SECRET_KEY:",
  paystackSecretKey ? "Configured" : "Not Configured",
);

if (process.env.NODE_ENV === "production" && !paystackSecretKey) {
  throw new MedusaError(
    MedusaError.Types.INVALID_ARGUMENT,
    "PAYSTACK_SECRET_KEY is required in the production backend environment",
  );
}

// Keep local development usable before payment credentials are configured.
// Production fails above instead of silently starting without Paystack.
const paymentProviders = paystackSecretKey
  ? [
      {
        resolve: "medusa-payment-paystack",
        id: "paystack",
        options: {
          secret_key: paystackSecretKey,
        },
      },
    ]
  : [];

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: paymentProviders,
      },
    },
  ],
});
