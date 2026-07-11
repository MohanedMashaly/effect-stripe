import { Effect, Context, Layer, Data } from "effect"
import * as Schema from "../../schema/Customer"
import { Stripe } from "../../stripe"
import type StripeSDK from "stripe"

// --- Errors ---

export class StripeApiError extends Data.TaggedError("StripeApiError")<{
  readonly cause: unknown
}> {}

export class CustomerDecodeError extends Data.TaggedError("CustomerDecodeError")<{
  readonly cause: unknown
}> {}

type CustomerServiceError = StripeApiError | CustomerDecodeError

// --- Service tag ---

export class CustomerService extends Context.Tag("CustomerService")<
  CustomerService,
  {
    create: (
      data: StripeSDK.CustomerCreateParams
    ) => Effect.Effect<Schema.Customer, CustomerServiceError>
    retrieve: (
      id: string
    ) => Effect.Effect<Schema.Customer, CustomerServiceError>
    update: (
      id: string,
      data: StripeSDK.CustomerUpdateParams
    ) => Effect.Effect<Schema.Customer, CustomerServiceError>
  }
>() {}