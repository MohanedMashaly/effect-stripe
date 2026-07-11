import { Schema } from "effect"
class Address extends Schema.Class<Address>("Address")({
    city: Schema.NullOr(Schema.String),
    country: Schema.NullOr(Schema.String),
    line1: Schema.NullOr(Schema.String),
    line2: Schema.NullOr(Schema.String),
    postal_code: Schema.NullOr(Schema.String),
    state: Schema.NullOr(Schema.String),
  }) {}
  
  export const CustomerId = Schema.String.pipe(
    Schema.pattern(/^cus_/),
    Schema.brand("CustomerId")
  )
  
  export type CustomerId = typeof CustomerId.Type

  export const StripeAmount = Schema.Int.pipe(
    Schema.brand("StripeAmount"))

  export type StripeAmount = typeof StripeAmount.Type;

  export const StripeMetadata = Schema.Record({ key: Schema.String, value: Schema.String })


  export class Customer extends Schema.Class<Customer>("Customer")({
    id: CustomerId,
    object: Schema.Literal("customer"),
    balance: StripeAmount,
    name: Schema.NullOr(Schema.String),
    email: Schema.NullOr(Schema.String),
    phone: Schema.NullOr(Schema.String),
    currency: Schema.NullOr(Schema.String),
    livemode: Schema.Boolean,
    address: Schema.NullOr(Address),
    created: Schema.Number,
    delinquent: Schema.NullOr(Schema.Boolean),
    metadata: StripeMetadata,
  }) {}