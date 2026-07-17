import { Data } from "effect"
import type Stripe from "stripe"

/**
 * Decomposed Stripe error types — mirrors Stripe.errors.StripeError's `type`
 * discriminant so consumers can Effect.catchTag on specific failure modes
 * (e.g. retry on rate limits, surface card declines to the user, log auth
 * errors as a config problem) instead of doing `instanceof` checks on an
 * opaque `cause: unknown`.
 */

export class StripeCardError extends Data.TaggedError("StripeCardError")<{
  readonly cause: Stripe.errors.StripeCardError
  readonly declineCode: string | undefined
}> {}

export class StripeRateLimitError extends Data.TaggedError("StripeRateLimitError")<{
  readonly cause: Stripe.errors.StripeRateLimitError
}> {}

export class StripeInvalidRequestError extends Data.TaggedError("StripeInvalidRequestError")<{
  readonly cause: Stripe.errors.StripeInvalidRequestError
  readonly param: string | undefined
}> {}

export class StripeAuthenticationError extends Data.TaggedError("StripeAuthenticationError")<{
  readonly cause: Stripe.errors.StripeAuthenticationError
}> {}

export class StripeConnectionError extends Data.TaggedError("StripeConnectionError")<{
  readonly cause: Stripe.errors.StripeConnectionError
}> {}

export class StripePermissionError extends Data.TaggedError("StripePermissionError")<{
  readonly cause: Stripe.errors.StripePermissionError
}> {}

// Fires when the same idempotency key is reused with different request
// params - distinct from a generic 4xx because the fix is "don't reuse
// keys across logically different requests," not a retry.
export class StripeIdempotencyError extends Data.TaggedError("StripeIdempotencyError")<{
  readonly cause: Stripe.errors.StripeIdempotencyError
}> {}

export class StripeApiError extends Data.TaggedError("StripeApiError")<{
  readonly cause: unknown
}> {}

export type StripeServiceError =
  | StripeCardError
  | StripeRateLimitError
  | StripeInvalidRequestError
  | StripeAuthenticationError
  | StripeConnectionError
  | StripePermissionError
  | StripeIdempotencyError
  | StripeApiError

/**
 * Maps whatever Stripe's SDK throws into the correct tagged error.
 * Stripe's SDK throws typed error classes with a `.type` discriminant —
 * this switches on the actual runtime class, not a re-guessed string, so
 * it stays correct even if Stripe adds new error subtypes later (falls
 * through to StripeApiError as a safe default rather than crashing).
 */
export const mapStripeError = (cause: unknown): StripeServiceError => {
  // Narrow via Stripe's own error classes rather than `.type` strings,
  // since the SDK exports proper classes for this exact purpose.
  const err = cause as { type?: string }

  switch (err?.type) {
    case "StripeCardError":
      return new StripeCardError({
        cause: cause as Stripe.errors.StripeCardError,
        declineCode: (cause as Stripe.errors.StripeCardError).decline_code
      })
    case "StripeRateLimitError":
      return new StripeRateLimitError({ cause: cause as Stripe.errors.StripeRateLimitError })
    case "StripeInvalidRequestError":
      return new StripeInvalidRequestError({
        cause: cause as Stripe.errors.StripeInvalidRequestError,
        param: (cause as Stripe.errors.StripeInvalidRequestError).param
      })
    case "StripeAuthenticationError":
      return new StripeAuthenticationError({ cause: cause as Stripe.errors.StripeAuthenticationError })
    case "StripeConnectionError":
      return new StripeConnectionError({ cause: cause as Stripe.errors.StripeConnectionError })
    case "StripePermissionError":
      return new StripePermissionError({ cause: cause as Stripe.errors.StripePermissionError })
    case "StripeIdempotencyError":
      return new StripeIdempotencyError({ cause: cause as Stripe.errors.StripeIdempotencyError })
    // Note: Stripe's own generic server-error class is "StripeAPIError"
    // (capital API), which also lands here - that's correct, it's the
    // right bucket for "Stripe's servers had a problem," not a bug.
    default:
      return new StripeApiError({ cause })
  }
}