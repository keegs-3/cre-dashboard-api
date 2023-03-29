import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Userreview, UserreviewRelations} from '../models';

export class UserreviewRepository extends DefaultCrudRepository<
  Userreview,
  typeof Userreview.prototype.id,
  UserreviewRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Userreview, dataSource);
  }
}
