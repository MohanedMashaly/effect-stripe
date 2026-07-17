import { Effect, Context, Layer, Data, Schema } from "effect"
import type Stripe from "stripe"
import * as PaymentIntentSchema from "../../schema/PaymentIntent"
import { mapStripeError, StripeServiceError } from "../../schema"

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

const callStripe = <A>(
  thunk: () => Promise<A>
): Effect.Effect<A, StripeApiError> =>
  Effect.tryPromise({
    try: thunk,
    catch: (cause) => new StripeApiError({ cause }),
  }).pipe(
  )

 
const decodePaymentIntent = (
  raw: unknown
): Effect.Effect<PaymentIntentSchema.PaymentIntent, PaymentIntentDecodeError> =>
  Schema.decodeUnknown(PaymentIntentSchema.PaymentIntent)(raw).pipe(
    Effect.mapError((cause) => new PaymentIntentDecodeError({ cause }))
  )
 
export const PaymentIntentServiceLive = (stripe: Stripe) =>
  Layer.succeed(
    PaymentIntentService,
    PaymentIntentService.of({
      create: (data) =>
        callStripe(() => stripe.paymentIntents.create(data)).pipe(
          Effect.flatMap(decodePaymentIntent)
        ),
 
      update: (id:string, data) =>
        callStripe(() => stripe.paymentIntents.update(id, data)).pipe(
          Effect.flatMap(decodePaymentIntent)
        ),
 
      get: (id) =>
        callStripe(() => stripe.paymentIntents.retrieve(id)).pipe(
          Effect.flatMap(decodePaymentIntent)
        ),
 
      list: (params) =>
        callStripe(() => stripe.paymentIntents.list(params)).pipe(
          Effect.flatMap((response) =>
            Effect.forEach(response.data, decodePaymentIntent)
          )
        ),
 
      cancel: (id:string, data) =>
        callStripe(() => stripe.paymentIntents.cancel(id, data)).pipe(
          Effect.flatMap(decodePaymentIntent)
        ),
 
      capture: (id:string, data) =>
        callStripe(() => stripe.paymentIntents.capture(id, data)).pipe(
          Effect.flatMap(decodePaymentIntent)
        ),
 
      confirm: (id:string, data) =>
        callStripe(() => stripe.paymentIntents.confirm(id, data)).pipe(
          Effect.flatMap(decodePaymentIntent)
        ),
 
        incrementAuthorization: (
          id: string,
          data: Stripe.PaymentIntentIncrementAuthorizationParams
        ) =>
        callStripe(() =>
          stripe.paymentIntents.incrementAuthorization(id, data)
        ).pipe(Effect.flatMap(decodePaymentIntent))
    })
  )