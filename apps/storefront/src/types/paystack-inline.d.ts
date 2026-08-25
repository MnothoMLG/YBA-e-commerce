declare module "@paystack/inline-js" {
  type PaystackError = {
    message: string
  }

  type PaystackCallbacks = {
    onSuccess: () => void | Promise<void>
    onCancel?: () => void
    onError?: (error: PaystackError) => void
  }

  export default class PaystackPop {
    resumeTransaction(
      accessCode: string,
      callbacks: PaystackCallbacks
    ): unknown
  }
}
