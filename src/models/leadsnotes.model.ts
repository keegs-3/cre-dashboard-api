import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {schema: process.env.DB_SCHEMA, table: 'app_leads_notes'},
  },
})
export class LEadsNOtes extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  property_id?: string;
  @property({
    type: 'date',
  })
  inserted_on?: Date;

  @property({
    type: 'string',
  })
  userName?: string;

  @property({
    type: 'string',
  })
  notes?: string;
  @property({
    type: 'string',
  })
  org?: string;

  constructor(data?: Partial<LEadsNOtes>) {
    super(data);
  }
}

export interface LEadsNOtesRelations {
  // describe navigational properties here
}

export type LEadsNOtesWithRelations = LEadsNOtes & LEadsNOtesRelations;
