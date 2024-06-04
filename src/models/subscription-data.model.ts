import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {schema: process.env.DB_SCHEMA, table: 'app_subscription_data'},
  },
})
export class SubscriptionData extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'number',
  })
  user_Sub_Id?: number;
  @property({
    type: 'number',
  })
  typeId?: number;

  @property({
    type: 'boolean',
  })
  expired?: boolean;

  @property({
    type: 'object',
  })
  sub_data?: object;

  @property({
    type: 'string',
  })
  addedBy?: string;

  constructor(data?: Partial<SubscriptionData>) {
    super(data);
  }
}

export interface SubscriptionDataRelations {
  // describe navigational properties here
}

export type SubscriptionDataWithRelations = SubscriptionData &
  SubscriptionDataRelations;
