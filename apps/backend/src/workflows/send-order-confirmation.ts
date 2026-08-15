import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import sendOrderConfirmationStep, {
  type SendOrderConfirmationInput,
} from "./steps/send-order-confirmation"

const sendOrderConfirmationWorkflow = createWorkflow(
  "send-order-confirmation",
  (input: SendOrderConfirmationInput) => {
    const result = sendOrderConfirmationStep(input)

    return new WorkflowResponse(result)
  }
)

export default sendOrderConfirmationWorkflow
