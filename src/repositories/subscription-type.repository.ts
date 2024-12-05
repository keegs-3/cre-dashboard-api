import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {SubscriptionType, SubscriptionTypeRelations} from '../models';

export class SubscriptionTypeRepository extends DefaultCrudRepository<
  SubscriptionType,
  typeof SubscriptionType.prototype.id,
  SubscriptionTypeRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(SubscriptionType, dataSource);
  }
}
