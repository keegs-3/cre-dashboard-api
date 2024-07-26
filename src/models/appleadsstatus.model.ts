import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {schema: process.env.DB_SCHEMA, table: 'app_leads_status'},
  },
})
export class Appleadsstatus extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  userid?: string;

  @property({
    type: 'number',
  })
  property_id?: number;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'number',
  })
  deal_value?: number;

  @property({
    type: 'boolean',
  })
  financial_sent?: boolean;

  @property({
    type: 'boolean',
  })
  financial_notsent?: boolean;

  @property({
    type: 'boolean',
  })
  listed?: boolean;

  @property({
    type: 'boolean',
  })
  available_off_market?: boolean;

  @property({
    type: 'number',
  })
  org?: number;

  @property({
    type: 'number',
  })
  subs_id?: number;

  constructor(data?: Partial<Appleadsstatus>) {
    super(data);
  }
}

export interface AppleadsstatusRelations {
  // describe navigational properties here
}

export type AppleadsstatusWithRelations = Appleadsstatus & AppleadsstatusRelations;
