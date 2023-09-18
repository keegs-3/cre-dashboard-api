import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Leads, LeadsRelations} from '../models';

export class LeadsRepository extends DefaultCrudRepository<
  Leads,
  typeof Leads.prototype.tax_assessor_id,
  LeadsRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Leads, dataSource);
  }
}
