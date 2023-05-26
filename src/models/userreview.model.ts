import {Entity, model, property} from '@loopback/repository';

@model({settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'user_reviews'}}, })
export class Userreview extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  user_id?: string;

  @property({
    type: 'object',
  })
  review?: object;

  @property({
    type: 'string',
  })
  other_comments?: string;


  constructor(data?: Partial<Userreview>) {
    super(data);
  }
}

export interface UserreviewRelations {
  // describe navigational properties here
}

export type UserreviewWithRelations = Userreview & UserreviewRelations;
