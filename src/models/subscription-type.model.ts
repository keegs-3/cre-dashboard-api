import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'app_subscription_type'}},
})
export class SubscriptionType extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  addedBy?: string;

  constructor(data?: Partial<SubscriptionType>) {
    super(data);
  }
}

export interface SubscriptionTypeRelations {
  // describe navigational properties here
}

export type SubscriptionTypeWithRelations = SubscriptionType & SubscriptionTypeRelations;
