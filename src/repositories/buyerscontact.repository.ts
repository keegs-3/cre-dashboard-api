import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Buyerscontact, BuyerscontactRelations} from '../models';

export class BuyerscontactRepository extends DefaultCrudRepository<
  Buyerscontact,
  typeof Buyerscontact.prototype.id,
  BuyerscontactRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Buyerscontact, dataSource);
  }
}
