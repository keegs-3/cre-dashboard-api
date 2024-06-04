import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {UserSubscription, UserSubscriptionRelations} from '../models';

export class UserSubscriptionRepository extends DefaultCrudRepository<
  UserSubscription,
  typeof UserSubscription.prototype.id,
  UserSubscriptionRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(UserSubscription, dataSource);
  }
}
