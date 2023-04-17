import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {User, UserRelations} from '../models/user.model';

export type Credentials = {
  email: string;
  password: string;
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(User, dataSource);
  }
}
