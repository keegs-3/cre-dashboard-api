import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Loginsession, LoginsessionRelations} from '../models';

export class LoginsessionRepository extends DefaultCrudRepository<
  Loginsession,
  typeof Loginsession.prototype.id,
  LoginsessionRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Loginsession, dataSource);
  }
}
