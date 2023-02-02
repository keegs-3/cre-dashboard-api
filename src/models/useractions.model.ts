import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    postgresql: {schema: process.env.DB_SCHEMA, table: 'usersactions'},
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
  name?: string;

  @property({
    type: 'object',
  })
  actions?: object;

  @property({
    type: 'date',
  })
  updatedon?: string;

  constructor(data?: Partial<Useractions>) {
    super(data);
  }
}

export interface UseractionsRelations {
  // describe navigational properties here
}

export type UseractionsWithRelations = Useractions & UseractionsRelations;
