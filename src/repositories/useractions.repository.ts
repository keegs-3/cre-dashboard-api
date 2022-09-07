import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Useractions, UseractionsRelations} from '../models';

export class UseractionsRepository extends DefaultCrudRepository<
  Useractions,
  typeof Useractions.prototype.id,
  UseractionsRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Useractions, dataSource);
  }
}
