import { Effect, Context, Layer, Data } from "effect"
import StripeSDK from 'stripe'

export interface StripeConfig {
  readonly apiKey: string
  readonly apiVersion?: StripeSDK.LatestApiVersion
}

export class StripeConfigError extends Data.TaggedError("StripeConfigError")<{
  readonly cause: unknown
}> {}

export class Stripe extends Context.Tag("Stripe")<
  Stripe,
  StripeSDK
>() {}

export const StripeLive = (config: StripeConfig) =>
  Layer.effect(
    Stripe,
    Effect.try({
      try: () =>
        new StripeSDK(config.apiKey, {
          apiVersion: "2026-06-24.dahlia",
        }),
      catch: (cause) => new StripeConfigError({ cause }),
    })
  )
  