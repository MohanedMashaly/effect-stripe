import { Schema } from "effect"
import { Address } from "./Common";

export const CustomerId = Schema.String.pipe(
  Schema.pattern(/^cus_/),
  Schema.brand("CustomerId")
)

export type CustomerId = typeof CustomerId.Type


export class Customer extends Schema.Class<Customer>("Customer")({
  id: CustomerId,
  object: Schema.Literal("customer"),
  name: Schema.optional(Schema.String),
  email: Schema.optional(Schema.String),
  phone: Schema.optional(Schema.String),
  balance: Schema.Number,
  currency: Schema.optional(Schema.String),
  livemode: Schema.Boolean,
  address: Schema.optional(Address),
  created: Schema.Number,
  delinquent: Schema.Boolean,
  metadata: Schema.Record({ key: Schema.String, value: Schema.Unknown }),
}) {}