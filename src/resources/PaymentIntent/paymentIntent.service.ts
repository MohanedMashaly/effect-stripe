import { Effect, Context, Layer, Data, Schema } from "effect"
import type Stripe from "stripe"
import * as PaymentIntentSchema from "../../schema/PaymentIntent"

export class StripeApiError extends Data.TaggedError("StripeApiError")<{
  readonly cause: unknown
}> {}

export class PaymentIntentDecodeError extends Data.TaggedError("PaymentIntentDecodeError")<{
  readonly cause: unknown
}> {}

type PaymentIntentServiceError = StripeApiError | PaymentIntentDecodeError

// --- Service tag ---

export class PaymentIntentService extends Context.Tag("PaymentIntentService")<
  PaymentIntentService,
  {
    create: (
      data: Stripe.PaymentIntentCreateParams
    ) => Effect.Effect<PaymentIntentSchema.PaymentIntent, PaymentIntentServiceError>

    update: (
      id: string,
      data: Stripe.PaymentIntentUpdateParams
    ) => Effect.Effect<PaymentIntentSchema.PaymentIntent, PaymentIntentServiceError>

    get: (
      id: string
    ) => Effect.Effect<PaymentIntentSchema.PaymentIntent, PaymentIntentServiceError>

    list: (
      params?: Stripe.PaymentIntentListParams
    ) => Effect.Effect<readonly PaymentIntentSchema.PaymentIntent[], PaymentIntentServiceError>

    listLineItems: (
      id: string,
      params?: Stripe.PaymentIntentListAmountDetailsLineItemsParams
    ) => Effect.Effect<readonly unknown[], StripeApiError>

    cancel: (
      id: string,
      data?: Stripe.PaymentIntentCancelParams
    ) => Effect.Effect<PaymentIntentSchema.PaymentIntent, PaymentIntentServiceError>

    capture: (
      id: string,
      data?: Stripe.PaymentIntentCaptureParams
    ) => Effect.Effect<PaymentIntentSchema.PaymentIntent, PaymentIntentServiceError>

    confirm: (
      id: string,
      data?: Stripe.PaymentIntentConfirmParams
    ) => Effect.Effect<PaymentIntentSchema.PaymentIntent, PaymentIntentServiceError>

    incrementAuthorization: (
      id: string,
      data: Stripe.PaymentIntentIncrementAuthorizationParams
    ) => Effect.Effect<PaymentIntentSchema.PaymentIntent, PaymentIntentServiceError>
  }
>() {}