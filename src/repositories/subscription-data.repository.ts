import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {SubscriptionData, SubscriptionDataRelations} from '../models';

export class SubscriptionDataRepository extends DefaultCrudRepository<
  SubscriptionData,
  typeof SubscriptionData.prototype.id,
  SubscriptionDataRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(SubscriptionData, dataSource);
  }
}
