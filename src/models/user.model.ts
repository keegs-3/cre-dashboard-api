import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {postgresql: {schema: process.env.DB_SCHEMA, table: 'app_users'}},
})
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
  })
  username: string;
  @property({
    type: 'number',
  })
  org?: number;
  @property({
    type: 'string',
  })
  addedBy: string;
  @property({
    type: 'number',
  })
  role: number;
  @property({
    type: 'string',
  })
  resetKey?: string;
  @property({
    type: 'date',
  })
  addedOn: Date;
  @property({
    type: 'date',
  })
  updatedOn: Date;
  @property({
    type: 'string',
  })
  state?: string;
  @property({
    type: 'Boolean',
    default: true,
  })
  forceReset?: boolean;
  @property({
    type: 'Boolean',
    default: false,
  })
  isLogedIn?: boolean;
  @property({
    type: 'Boolean',
    default: true,
  })
  enabled?: boolean;
  @property({
    type: 'number',
  })
  userOtp?: number;
  @property({
    type: 'number',
  })
  loginOtp?: number;
  @property({
    type: 'string',
  })
  paymentintentid?: string;
  @property({
    type: 'object',
  })
  payment?: object;

  constructor(data?: Partial<User>) {
    super(data);
  }
}



export type UserWithRelations = User;
