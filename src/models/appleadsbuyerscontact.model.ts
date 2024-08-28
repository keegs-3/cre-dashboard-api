import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {
      schema: process.env.DB_SCHEMA,
      table: 'app_leads_buyers_contact',
    },
  },
})
export class Appleadsbuyerscontact extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  property_id?: number;

  @property({
    type: 'string',
  })
  buyers_name?: string;

  @property({
    type: 'boolean',
  })
  contacted?: boolean;

  @property({
    type: 'boolean',
  })
  interested?: boolean;

  @property({
    type: 'string',
  })
  addnotes?: string;

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
  subs_id?: number;

  constructor(data?: Partial<Appleadsbuyerscontact>) {
    super(data);
  }
}

export interface AppleadsbuyerscontactRelations {
  // describe navigational properties here
}

export type AppleadsbuyerscontactWithRelations = Appleadsbuyerscontact & AppleadsbuyerscontactRelations;
