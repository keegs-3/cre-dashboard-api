import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Appleadsextracontact, AppleadsextracontactRelations} from '../models';

export class AppleadsextracontactRepository extends DefaultCrudRepository<
  Appleadsextracontact,
  typeof Appleadsextracontact.prototype.id,
  AppleadsextracontactRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Appleadsextracontact, dataSource);
  }
}
