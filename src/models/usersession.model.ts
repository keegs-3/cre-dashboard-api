import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {schema: process.env.DB_SCHEMA, table: 'app_user_session_time'},
  },
})
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
  userid?: string;
  @property({
    type: 'number',
  })
  org?: Number;
  @property({
    type: 'number',
  })
  subs_id?: Number;

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
  @property({
    type: 'date',
  })
  inserted_on?: Date;

  constructor(data?: Partial<Usersession>) {
    super(data);
  }
}

export interface UsersessionRelations {
  // describe navigational properties here
}

export type UsersessionWithRelations = Usersession & UsersessionRelations;
