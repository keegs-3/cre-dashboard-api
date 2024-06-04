import {Entity, model, property} from '@loopback/repository';

@model()
export class AppMsaRegion extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  msa_code?: number;

  @property({
    type: 'string',
  })
  msa_name?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  region?: string;


  constructor(data?: Partial<AppMsaRegion>) {
    super(data);
  }
}

export interface AppMsaRegionRelations {
  // describe navigational properties here
}

export type AppMsaRegionWithRelations = AppMsaRegion & AppMsaRegionRelations;
