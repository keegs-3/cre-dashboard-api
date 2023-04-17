import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../keys';
import {User} from '../models/user.model';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from './hash.password';

export class MyUserService implements UserService<User, Credentials>{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    // @inject('service.hasher')
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher

  ) { }
  async verifyCredentials(credentials: Credentials): Promise<User> {
    // implement this method
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email
      }
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound('Wrong username / password');
    }
    const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password)
    if (!passwordMatched)
      throw new HttpErrors.Unauthorized('Wrong username / password');
    return foundUser;
  }
  convertToUserProfile(user: User): UserProfile {

    if (user.firstName && user.lastName){
      user.username = user.firstName + user.lastName;

    }
    else {
      user.username = user.firstName
    }


    return {
      [securityId]: user.id!.toString(),
      name: user.username,
      id: user.id,
      email: user.email
    };
    // throw new Error('Method not implemented.');
  }

}
