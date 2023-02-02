import {Entity, model, property} from '@loopback/repository';

@model()
export class Userloginlocation extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'date',
  })
  logintime?: string;

  @property({
    type: 'object',
  })
  location?: object;


  constructor(data?: Partial<Userloginlocation>) {
    super(data);
  }
}

export interface UserloginlocationRelations {
  // describe navigational properties here
}

export type UserloginlocationWithRelations = Userloginlocation & UserloginlocationRelations;
