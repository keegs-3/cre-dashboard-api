import {Entity, model, property} from '@loopback/repository';

@model({settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'user_session_time'}}, })
export class Usersession extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'date',
  })
  start_time?: Date;

  @property({
    type: 'date',
  })
  end_time?: Date;

  @property({
    type: 'string',
  })
  page?: string;
  @property({
    type: 'string',
  })
  session?: string;



  constructor(data?: Partial<Usersession>) {
    super(data);
  }
}

export interface UsersessionRelations {
  // describe navigational properties here
}

export type UsersessionWithRelations = Usersession & UsersessionRelations;
