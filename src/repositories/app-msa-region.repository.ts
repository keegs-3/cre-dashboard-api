import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {AppMsaRegion, AppMsaRegionRelations} from '../models';

export class AppMsaRegionRepository extends DefaultCrudRepository<
  AppMsaRegion,
  typeof AppMsaRegion.prototype.id,
  AppMsaRegionRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(AppMsaRegion, dataSource);
  }
}
