import {Entity, model, property} from '@loopback/repository';

@model({settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'tgt_lead_status'}}, })
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
    type: 'string',
  })
  deal_value: string;


  constructor(data?: Partial<Status>) {
    super(data);
  }
}

export interface StatusRelations {
  // describe navigational properties here
}

export type StatusWithRelations = Status & StatusRelations;
