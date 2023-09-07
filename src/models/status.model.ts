/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property} from '@loopback/repository';

@model({settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'leads_status'}}, })
export class Status extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;
  @property({
    type: 'string'
  })
  property_id: string;

  @property({
    type: 'string',
  })
  userName?: string;

  @property({
    type: 'string',
  })
  status?: string;


  @property({
    type: 'number',
  })
  deal_value: Number;
  @property({
    type: 'boolean',
  })
  financial_sent: Boolean;
  @property({
    type: 'boolean',
  })
  financial_notsent: Boolean;
  @property({
    type: 'boolean',
  })
  listed: Boolean;
  @property({
    type: 'boolean',
  })
  available_off_market: Boolean;


  constructor(data?: Partial<Status>) {
    super(data);
  }
}

export interface StatusRelations {
  // describe navigational properties here
}

export type StatusWithRelations = Status & StatusRelations;
