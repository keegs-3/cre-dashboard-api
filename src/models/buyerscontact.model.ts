/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property} from '@loopback/repository';

@model({settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'leads_buyers_contact'}}, })
export class Buyerscontact extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  property_id: string;
  @property({
    type: 'string',
  })
  userName: string;

  @property({
    type: 'string',
    required: true,
  })
  buyer_name: string;
  @property({
    type: 'string',
    required: true,
  })
  addNotes: string;

  @property({
    type: 'boolean',
    default: false,
  })
  connected?: boolean;

  @property({
    type: 'boolean',
  })
  interested?: boolean;


  constructor(data?: Partial<Buyerscontact>) {
    super(data);
  }
}

export interface BuyerscontactRelations {
  // describe navigational properties here
}

export type BuyerscontactWithRelations = Buyerscontact & BuyerscontactRelations;
