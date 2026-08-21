import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import twilio from "twilio";

export type SendOrderWhatsappInput = {
  orderId: string;
};

type SendOrderWhatsappOutput = {
  sent: boolean;
  reason?: "not_configured" | "order_not_found" | "send_failed";
  messageIds?: string[];
};

const formatAmount = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);

const parseRecipients = (value?: string) =>
  value
    ?.split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean) ?? [];

const sendOrderWhatsappStep = createStep<
  SendOrderWhatsappInput,
  SendOrderWhatsappOutput,
  undefined
>("send-order-whatsapp", async ({ orderId }, { container }) => {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_WHATSAPP_FROM?.trim();
  const recipients = parseRecipients(process.env.TWILIO_WHATSAPP_TO);
  const contentSid = process.env.TWILIO_WHATSAPP_CONTENT_SID?.trim();

  console.log("TWILIO_ACCOUNT_SID", accountSid);
  console.log("TWILIO_AUTH_TOKEN", authToken);
  console.log("TWILIO_WHATSAPP_FROM", from);
  console.log("TWILIO_WHATSAPP_TO", recipients);
  console.log("TWILIO_WHATSAPP_CONTENT_SID", contentSid);

  if (!accountSid || !authToken || !from || !recipients.length || !contentSid) {
    logger.warn(
      "Order WhatsApp skipped: Twilio WhatsApp environment variables must be configured",
    );

    return new StepResponse({ sent: false, reason: "not_configured" });
  }

  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["id", "display_id", "currency_code", "total"],
      filters: {
        id: orderId,
      },
    });
    const order = orders[0];

    if (!order) {
      logger.warn(`Order WhatsApp skipped: order ${orderId} not found`);

      return new StepResponse({ sent: false, reason: "order_not_found" });
    }

    const client = twilio(accountSid, authToken);
    const messages = await Promise.all(
      recipients.map((to) =>
        client.messages.create({
          from,
          contentSid,
          contentVariables: JSON.stringify({
            1: String(order.display_id),
            2: formatAmount(order.total, order.currency_code),
          }),
          to,
        }),
      ),
    );
    const messageIds = messages.map((message) => message.sid);

    logger.info(
      `Order WhatsApp sent for order ${order.id} to ${recipients.length} recipient(s)`,
    );

    return new StepResponse({ sent: true, messageIds });
  } catch (error) {
    console.log("sending whatsapp error", error);
    const message = error instanceof Error ? error.message : String(error);

    logger.error(`Order WhatsApp failed for order ${orderId}: ${message}`);

    return new StepResponse({ sent: false, reason: "send_failed" });
  }
});

export default sendOrderWhatsappStep;
