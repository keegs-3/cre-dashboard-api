import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {LEadsNOtes, LEadsNOtesRelations} from '../models';

export class LEadsNOtesRepository extends DefaultCrudRepository<
  LEadsNOtes,
  typeof LEadsNOtes.prototype.id,
  LEadsNOtesRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(LEadsNOtes, dataSource);
  }
}
