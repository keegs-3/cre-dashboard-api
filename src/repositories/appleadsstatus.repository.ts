import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Appleadsstatus, AppleadsstatusRelations} from '../models';

export class AppleadsstatusRepository extends DefaultCrudRepository<
  Appleadsstatus,
  typeof Appleadsstatus.prototype.id,
  AppleadsstatusRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Appleadsstatus, dataSource);
  }
}
