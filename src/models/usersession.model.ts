import {Entity, model, property} from '@loopback/repository';

@model({settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'user_session'}}, })
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
  name?: string;

  @property({
    type: 'date',
  })
  starttime?: string;

  @property({
    type: 'date',
  })
  endtime?: string;

  @property({
    type: 'string',
  })
  session?: string;
  @property({
    type: 'string',
  })
  timespentonleeds?: string;
  @property({
    type: 'string',
  })
  timespentonbuyers?: string;


  constructor(data?: Partial<Usersession>) {
    super(data);
  }
}

export interface UsersessionRelations {
  // describe navigational properties here
}

export type UsersessionWithRelations = Usersession & UsersessionRelations;
