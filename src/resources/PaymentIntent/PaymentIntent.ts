import { Schema } from "effect"

export const PaymentIntentId = Schema.String.pipe(
  Schema.pattern(/^pi_/),
  Schema.brand("PaymentIntentId")
)
export type PaymentIntentId = typeof PaymentIntentId.Type

export const ClientSecret = Schema.String.pipe(
  Schema.brand("ClientSecret")
)
export type ClientSecret = typeof ClientSecret.Type

export const StripeAmount = Schema.Int.pipe(
  Schema.nonNegative(),
  Schema.brand("StripeAmount")
)
export type StripeAmount = typeof StripeAmount.Type

export const PaymentIntentStatus = Schema.Literal(
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
  "processing",
  "requires_capture",
  "canceled",
  "succeeded"
)
export type PaymentIntentStatus = typeof PaymentIntentStatus.Type

export const CaptureMethod = Schema.Literal("automatic", "automatic_async", "manual")
export const ConfirmationMethod = Schema.Literal("automatic", "manual")

export const PaymentMethodType = Schema.Literal(
  "card",
  "link",
  "us_bank_account",
  "sepa_debit",
  "ideal",
  "paypal"
)

export const CancellationReason = Schema.Literal(
  "duplicate",
  "fraudulent",
  "requested_by_customer",
  "abandoned",
  "failed_invoice",
  "void_invoice",
  "automatic"
)

export const AmountDetailsTip = Schema.Struct({
  amount: Schema.optional(StripeAmount)
})

export const AmountDetails = Schema.Struct({
  tip: AmountDetailsTip
})

export const AutomaticPaymentMethods = Schema.Struct({
  enabled: Schema.Boolean
})

export const PaymentMethodOptionsCard = Schema.Struct({
  installments: Schema.NullOr(Schema.Unknown), 
  mandate_options: Schema.NullOr(Schema.Unknown),
  network: Schema.NullOr(Schema.String),
  request_three_d_secure: Schema.Literal("automatic", "any", "challenge")
})

export const PaymentMethodOptionsLink = Schema.Struct({
  persistent_token: Schema.NullOr(Schema.String)
})

export const PaymentMethodOptions = Schema.Struct({
  card: Schema.optional(PaymentMethodOptionsCard),
  link: Schema.optional(PaymentMethodOptionsLink)
})

export const StripeMetadata = Schema.Record({ key: Schema.String, value: Schema.String })

export const PaymentIntent = Schema.Struct({
  id: PaymentIntentId,
  object: Schema.Literal("payment_intent"),
  amount: StripeAmount,
  amount_capturable: StripeAmount,
  amount_details: AmountDetails,
  amount_received: StripeAmount,
  application: Schema.NullOr(Schema.String),
  application_fee_amount: Schema.NullOr(StripeAmount),
  automatic_payment_methods: Schema.NullOr(AutomaticPaymentMethods),
  canceled_at: Schema.NullOr(Schema.Number), 
  cancellation_reason: Schema.NullOr(CancellationReason),
  capture_method: CaptureMethod,
  client_secret: Schema.NullOr(ClientSecret),
  confirmation_method: ConfirmationMethod,
  created: Schema.Number, 
  currency: Schema.String.pipe(Schema.length(3)), 
  customer: Schema.NullOr(Schema.String), 
  description: Schema.NullOr(Schema.String),
  last_payment_error: Schema.NullOr(Schema.Unknown), 
  latest_charge: Schema.NullOr(Schema.String),
  livemode: Schema.Boolean,
  metadata: StripeMetadata,
  next_action: Schema.NullOr(Schema.Unknown), 
  on_behalf_of: Schema.NullOr(Schema.String),
  payment_method: Schema.NullOr(Schema.String),
  payment_method_options: PaymentMethodOptions,
  payment_method_types: Schema.Array(PaymentMethodType),
  processing: Schema.NullOr(Schema.Unknown),
  receipt_email: Schema.NullOr(Schema.String),
  review: Schema.NullOr(Schema.String),
  setup_future_usage: Schema.NullOr(Schema.Literal("on_session", "off_session")),
  shipping: Schema.NullOr(Schema.Unknown), 
  source: Schema.NullOr(Schema.String),
  statement_descriptor: Schema.NullOr(Schema.String),
  statement_descriptor_suffix: Schema.NullOr(Schema.String),
  status: PaymentIntentStatus,
  transfer_data: Schema.NullOr(Schema.Unknown),
  transfer_group: Schema.NullOr(Schema.String)
})

export type PaymentIntent = typeof PaymentIntent.Type
export type PaymentIntentEncoded = typeof PaymentIntent.Encoded