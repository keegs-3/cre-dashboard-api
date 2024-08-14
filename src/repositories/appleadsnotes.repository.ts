import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Appleadsnotes, AppleadsnotesRelations} from '../models';

export class AppleadsnotesRepository extends DefaultCrudRepository<
  Appleadsnotes,
  typeof Appleadsnotes.prototype.id,
  AppleadsnotesRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Appleadsnotes, dataSource);
  }
}
