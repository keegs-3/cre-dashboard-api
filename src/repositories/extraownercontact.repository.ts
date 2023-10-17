import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Extraownercontact, ExtraownercontactRelations} from '../models';

export class ExtraownercontactRepository extends DefaultCrudRepository<
  Extraownercontact,
  typeof Extraownercontact.prototype.id,
  ExtraownercontactRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Extraownercontact, dataSource);
  }
}
