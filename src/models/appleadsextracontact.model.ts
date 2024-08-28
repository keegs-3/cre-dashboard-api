import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {
      schema: process.env.DB_SCHEMA,
      table: 'app_leads_extraownercontact',
    },
  },
})
export class Appleadsextracontact extends Entity {
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
  org?: number;

  @property({
    type: 'number',
  })
  property_id?: number;

  @property({
    type: 'string',
  })
  contact_name?: string;

  @property({
    type: 'string',
  })
  contact_number?: string;

  @property({
    type: 'string',
  })
  contact_email?: string;

  @property({
    type: 'number',
  })
  list_price?: number;
  @property({
    type: 'number',
  })
  subs_id?: number;

  constructor(data?: Partial<Appleadsextracontact>) {
    super(data);
  }
}

export interface AppleadsextracontactRelations {
  // describe navigational properties here
}

export type AppleadsextracontactWithRelations = Appleadsextracontact & AppleadsextracontactRelations;
