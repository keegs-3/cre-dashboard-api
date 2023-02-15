/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property} from '@loopback/repository';

@model({settings: { postgresql: { schema: process.env.DB_SCHEMA, table: 'tgt_lead_feedback'} }, })
export class Feedback extends Entity {
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
    type: 'string'
  })
  buyers_name: string;

  @property({
    type: 'string',
  })
  user?: string;

  @property({
    type: 'string',
  })
  feedback?: string;

  @property({
    type: 'date',
    required: true,
  })
  updated_on: string;


  constructor(data?: Partial<Feedback>) {
    super(data);
  }
}

export interface FeedbackRelations {
  // describe navigational properties here
}

export type FeedbackWithRelations = Feedback & FeedbackRelations;
