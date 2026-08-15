import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Creates the South Africa (ZAR) region when needed and enables Paystack on it.
 *
 * Prerequisite: PAYSTACK_SECRET_KEY must be set so the `pp_paystack` provider
 * is registered (see medusa-config.ts). Run after adding the key + restarting:
 *
 *   npx medusa exec ./src/scripts/enable-paystack-region.ts
 */
export default async function enablePaystackRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const regionModule = container.resolve(Modules.REGION)
  const paymentModule = container.resolve(Modules.PAYMENT)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const providers = await paymentModule.listPaymentProviders({})
  logger.info(
    `Registered payment providers: ${providers.map((p: any) => p.id).join(", ") || "(none)"}`
  )

  const paystack = providers.find((p: any) => p.id.includes("paystack"))
  if (!paystack) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Paystack provider is not registered. Confirm PAYSTACK_SECRET_KEY is set in the backend production environment, redeploy, then re-run this script."
    )
  }

  let regions = await regionModule.listRegions({ currency_code: "zar" })

  if (!regions.length) {
    logger.info("No ZAR region found. Creating the South Africa region...")

    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "South Africa",
            currency_code: "zar",
            countries: ["za"],
            payment_providers: [paystack.id],
          },
        ],
      },
    })

    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: "za",
          provider_id: "tp_system",
        },
      ],
    })

    regions = result
    logger.info("Created the South Africa region with Paystack enabled.")
  }

  for (const region of regions) {
    const { data: regionData } = await query.graph({
      entity: "region",
      fields: ["id", "payment_providers.id"],
      filters: { id: region.id },
    })
    const alreadyLinked = regionData[0]?.payment_providers?.some(
      (provider) => provider?.id === paystack.id
    )

    if (alreadyLinked) {
      logger.info(`${paystack.id} is already linked to ${region.name}.`)
      continue
    }

    await link.create({
      [Modules.REGION]: { region_id: region.id },
      [Modules.PAYMENT]: { payment_provider_id: paystack.id },
    })
    logger.info(`Linked ${paystack.id} to region ${region.name} (${region.id})`)
  }

  logger.info("Paystack setup completed for all ZAR regions.")
}
