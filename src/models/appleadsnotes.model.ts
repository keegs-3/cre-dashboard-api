import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {schema: process.env.DB_SCHEMA, table: 'app_leads_notes'},
  },
})
export class Appleadsnotes extends Entity {
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
  userid?: string;

  @property({
    type: 'string',
  })
  notes?: string;

  @property({
    type: 'number',
  })
  org?: number;
  @property({
    type: 'number',
  })
  subs_id?: number;

  constructor(data?: Partial<Appleadsnotes>) {
    super(data);
  }
}

export interface AppleadsnotesRelations {
  // describe navigational properties here
}

export type AppleadsnotesWithRelations = Appleadsnotes & AppleadsnotesRelations;
