import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Only register the Paystack provider when a secret key is present, so the
// backend still boots during setup before keys are added.
const paymentProviders = process.env.PAYSTACK_SECRET_KEY
  ? [
      {
        resolve: "medusa-payment-paystack",
        id: "paystack",
        options: {
          secret_key: process.env.PAYSTACK_SECRET_KEY,
        },
      },
    ]
  : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: paymentProviders,
      },
    },
  ],
})
