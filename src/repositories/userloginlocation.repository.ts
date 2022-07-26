import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {Userloginlocation, UserloginlocationRelations} from '../models';

export class UserloginlocationRepository extends DefaultCrudRepository<
  Userloginlocation,
  typeof Userloginlocation.prototype.id,
  UserloginlocationRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(Userloginlocation, dataSource);
  }
}
