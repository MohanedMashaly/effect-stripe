import { Schema } from "effect"

export class Address extends Schema.Class<Address>("Address")({
  city: Schema.optional(Schema.String),
  country: Schema.optional(Schema.String),
  line1: Schema.optional(Schema.String),
  line2: Schema.optional(Schema.String),
  postal_code: Schema.optional(Schema.String),
  state: Schema.optional(Schema.String),
}) {}