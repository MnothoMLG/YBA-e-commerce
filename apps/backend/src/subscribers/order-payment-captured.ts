import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  PaymentEvents,
} from "@medusajs/framework/utils"
import { Resend } from "resend"

const recipients = [
  "mnotho.mlg@gmail.com",
  "kkrakopo@gmail.com",
]

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;")

const formatAmount = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currencyCode,
  }).format(amount)

export default async function orderPaymentCapturedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const paymentService = container.resolve(Modules.PAYMENT)
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !from) {
    logger.error(
      "Order confirmation email skipped: RESEND_API_KEY and RESEND_FROM_EMAIL must be configured"
    )
    return
  }

  const payment = await paymentService.retrievePayment(data.id)
  const { data: links } = await query.graph({
    entity: "order_payment_collection",
    fields: [
      "order.id",
      "order.display_id",
      "order.email",
      "order.currency_code",
      "order.total",
      "order.items.id",
      "order.items.title",
      "order.items.quantity",
      "order.items.unit_price",
    ],
    filters: {
      payment_collection_id: payment.payment_collection_id,
    },
  })
  const order = links[0]?.order

  if (!order) {
    logger.warn(
      `Order confirmation email skipped: no order found for payment ${data.id}`
    )
    return
  }

  const items = (order.items ?? []).filter((item) => item !== null)
  const itemRows = items.map((item) => `
    <tr>
      <td style="padding: 8px 0;">${escapeHtml(item.title ?? "Item")}</td>
      <td style="padding: 8px; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 0; text-align: right;">
        ${formatAmount(item.unit_price * item.quantity, order.currency_code)}
      </td>
    </tr>
  `).join("")

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: recipients,
    subject: `Order #${order.display_id} payment confirmed`,
    html: `
      <div style="font-family: Arial, sans-serif; margin: 0 auto; max-width: 600px;">
        <h1>Payment confirmed</h1>
        <p>Order <strong>#${order.display_id}</strong> has been paid successfully.</p>
        <p>Customer: ${escapeHtml(order.email ?? "Not provided")}</p>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="border-bottom: 1px solid #ddd;">
              <th style="padding: 8px 0; text-align: left;">Item</th>
              <th style="padding: 8px; text-align: center;">Quantity</th>
              <th style="padding: 8px 0; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p style="font-size: 18px; text-align: right;">
          <strong>Total: ${formatAmount(order.total, order.currency_code)}</strong>
        </p>
      </div>
    `,
  }, {
    idempotencyKey: `order-payment-confirmation/${order.id}/${data.id}`,
  })

  if (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Resend order confirmation failed: ${error.message}`
    )
  }

  logger.info(`Order confirmation email sent for order ${order.id}`)
}

export const config: SubscriberConfig = {
  event: PaymentEvents.CAPTURED,
}
