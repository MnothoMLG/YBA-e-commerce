import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Resend } from "resend";

export type SendOrderConfirmationInput = {
  orderId: string;
};

type SendOrderConfirmationOutput = {
  sent: boolean;
  reason?: "not_configured" | "missing_email";
  emailId?: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatAmount = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);

const parseBcc = (value?: string) =>
  value
    ?.split(",")
    .map((email) => email.trim())
    .filter(Boolean);

const sendOrderConfirmationStep = createStep<
  SendOrderConfirmationInput,
  SendOrderConfirmationOutput,
  undefined
>("send-order-confirmation", async ({ orderId }, { container }) => {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    logger.warn(
      "Order confirmation email skipped: RESEND_API_KEY and RESEND_FROM_EMAIL must be configured",
    );

    return new StepResponse({ sent: false, reason: "not_configured" });
  }

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "items.id",
      "items.title",
      "items.unit_price",
      "items.detail.quantity",
    ],
    filters: {
      id: orderId,
    },
  });
  const order = orders[0];

  if (!order) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Order confirmation email failed: order ${orderId} not found`,
    );
  }

  if (!order.email) {
    logger.warn(
      `Order confirmation email skipped: order ${orderId} has no customer email`,
    );

    return new StepResponse({ sent: false, reason: "missing_email" });
  }

  const itemRows = (order.items ?? [])
    .filter((item) => item !== null)
    .map((item) => {
      const quantity = Number(item.detail?.quantity);

      return `
        <tr>
          <td style="padding: 8px 0;">${escapeHtml(item.title ?? "Item")}</td>
          <td style="padding: 8px; text-align: center;">${quantity}</td>
          <td style="padding: 8px 0; text-align: right;">
            ${formatAmount(item.unit_price * quantity, order.currency_code)}
          </td>
        </tr>
      `;
    })
    .join("");

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send(
    {
      from,
      to: order.email,
      bcc: parseBcc(process.env.RESEND_ORDER_BCC),
      subject: `Order #${order.display_id} confirmed`,
      html: `
        <div style="font-family: Arial, sans-serif; margin: 0 auto; max-width: 600px;">
          <h1>Thanks for your order</h1>
          <p>Your order <strong>#${order.display_id}</strong> has been confirmed.</p>
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
    },
    {
      idempotencyKey: `order-confirmation/${order.id}`,
    },
  );

  if (error) {
    console.log("resend error ", { error });
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Resend order confirmation failed: ${error.message}`,
    );
  }

  logger.info(`Order confirmation email sent for order ${order.id}`);

  return new StepResponse({ sent: true, emailId: data?.id });
});

export default sendOrderConfirmationStep;
