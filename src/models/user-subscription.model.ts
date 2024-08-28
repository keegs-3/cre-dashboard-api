import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'app_user_subscription'}},
})
export class UserSubscription extends Entity {
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
  typeId?: number;

  @property({
    type: 'number',
  })
  limit?: number;

  @property({
    type: 'date',
  })
  startDate?: string;

  @property({
    type: 'date',
  })
  endDate?: string;

  @property({
    type: 'string',
  })
  addedBy?: string;

  constructor(data?: Partial<UserSubscription>) {
    super(data);
  }
}

export interface UserSubscriptionRelations {
  // describe navigational properties here
}

export type UserSubscriptionWithRelations = UserSubscription & UserSubscriptionRelations;
