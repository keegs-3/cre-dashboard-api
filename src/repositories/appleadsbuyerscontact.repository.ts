import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Appleadsbuyerscontact, AppleadsbuyerscontactRelations} from '../models';

export class AppleadsbuyerscontactRepository extends DefaultCrudRepository<
  Appleadsbuyerscontact,
  typeof Appleadsbuyerscontact.prototype.id,
  AppleadsbuyerscontactRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Appleadsbuyerscontact, dataSource);
  }
}
