import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import sendOrderWhatsappStep, {
  type SendOrderWhatsappInput,
} from "./steps/send-order-whatsapp"

const sendOrderWhatsappWorkflow = createWorkflow(
  "send-order-whatsapp",
  (input: SendOrderWhatsappInput) => {
    const result = sendOrderWhatsappStep(input)

    return new WorkflowResponse(result)
  }
)

export default sendOrderWhatsappWorkflow
