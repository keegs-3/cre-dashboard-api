import {Entity, model, property} from '@loopback/repository';

@model()
export class Loginsession extends Entity {
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
  token: string;

  @property({
    type: 'string',
    required: true,
  })
  loginid: string;


  constructor(data?: Partial<Loginsession>) {
    super(data);
  }
}

export interface LoginsessionRelations {
  // describe navigational properties here
}

export type LoginsessionWithRelations = Loginsession & LoginsessionRelations;
