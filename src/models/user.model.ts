import {Entity, model, property} from '@loopback/repository';

@model({settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'users'}}, })
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  firstName: string;

  @property({
    type: 'string',
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;
  @property({
    type: 'string',
  })
  agent_id?: string;
  @property({
    type: 'string',
  })
  agent_map_to: string;
  @property({
    type: 'string',
  })
  role: String;
  @property({
    type: 'string',
  })
  resetkey?: String;
  @property({
    type: 'date',
  })
  agent_map_date: Date;



  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here


}

export type UserWithRelations = User & UserRelations;
