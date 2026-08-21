import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import sendOrderConfirmationWorkflow from "../workflows/send-order-confirmation"
import sendOrderWhatsappWorkflow from "../workflows/send-order-whatsapp"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await Promise.all([
    sendOrderConfirmationWorkflow(container).run({
      input: {
        orderId: data.id,
      },
    }),
    sendOrderWhatsappWorkflow(container).run({
      input: {
        orderId: data.id,
      },
    }),
  ])
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
