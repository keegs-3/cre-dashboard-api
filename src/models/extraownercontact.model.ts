import {Entity, model, property} from '@loopback/repository';

@model({settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'extraownercontact'}}, })
export class Extraownercontact extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'string',
  })
  org?: string;

  @property({
    type: 'string',
  })
  property_id?: string;

  @property({
    type: 'string',
  })
  contact_name?: string;

  @property({
    type: 'string',
  })
  contact_number?: string;


  constructor(data?: Partial<Extraownercontact>) {
    super(data);
  }
}

export interface ExtraownercontactRelations {
  // describe navigational properties here
}

export type ExtraownercontactWithRelations = Extraownercontact & ExtraownercontactRelations;
