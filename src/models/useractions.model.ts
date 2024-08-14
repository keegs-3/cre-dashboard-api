import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {schema: process.env.DB_SCHEMA, table: 'app_user_actions'},
  },
})
export class Useractions extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

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
    type: 'string',
  })
  page?: string;
  @property({
    type: 'string',
  })
  widget?: string;
  @property({
    type: 'object',
  })
  actions?: object;
  @property({
    type: 'date',
  })
  inserted_on?: Date;

  constructor(data?: Partial<Useractions>) {
    super(data);
  }
}

export interface UseractionsRelations {
  // describe navigational properties here
}

export type UseractionsWithRelations = Useractions & UseractionsRelations;
