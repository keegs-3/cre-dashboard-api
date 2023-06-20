import {Entity, model, property} from '@loopback/repository';

@model({settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'user_chats'}}, })
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
  userName?: string;



  @property({
    type: 'string',
  })
  chats?: string;


  constructor(data?: Partial<Userreview>) {
    super(data);
  }
}

export interface UserreviewRelations {
  // describe navigational properties here
}

export type UserreviewWithRelations = Userreview & UserreviewRelations;
