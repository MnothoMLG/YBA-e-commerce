import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Enables the Paystack payment provider on the South Africa (ZAR) region.
 *
 * Prerequisite: PAYSTACK_SECRET_KEY must be set so the `pp_paystack` provider
 * is registered (see medusa-config.ts). Run after adding the key + restarting:
 *
 *   npx medusa exec ./src/scripts/enable-paystack-region.ts
 */
export default async function enablePaystackRegion({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const regionModule = container.resolve(Modules.REGION)
  const paymentModule = container.resolve(Modules.PAYMENT)
  const link = container.resolve("link")

  const providers = await paymentModule.listPaymentProviders({})
  logger.info(
    `Registered payment providers: ${providers.map((p: any) => p.id).join(", ") || "(none)"}`
  )

  const paystack = providers.find((p: any) => p.id.includes("paystack"))
  if (!paystack) {
    logger.error(
      "Paystack provider is not registered. Set PAYSTACK_SECRET_KEY and restart the backend, then re-run this script."
    )
    return
  }

  const regions = await regionModule.listRegions({ currency_code: "zar" })
  if (!regions.length) {
    logger.error("No ZAR region found.")
    return
  }

  for (const region of regions) {
    await link.create({
      [Modules.REGION]: { region_id: region.id },
      [Modules.PAYMENT]: { payment_provider_id: paystack.id },
    })
    logger.info(`Linked ${paystack.id} to region ${region.name} (${region.id})`)
  }

  logger.info("Paystack enabled for ZAR region(s).")
}
