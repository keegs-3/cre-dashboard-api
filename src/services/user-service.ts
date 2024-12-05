/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../keys';
import {User} from '../models/user.model';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from './hash.password';
import {SubscriptionDataRepository} from '../repositories';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(SubscriptionDataRepository)
    public subData: SubscriptionDataRepository,

    // @inject('service.hasher')
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}
  async verifyLogin(email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {email: email},
    });
    if (user) {
      if (user.isLogedIn === true) {
        return 'User Already Logged In';
      }
    } else {
      return 'Email Not Present';
    }
  }
  async verifyCredentials(credentials: Credentials): Promise<User> {
    // implement this method
    const {email, password} = credentials;
    if (!email) {
      throw new HttpErrors.NotFound('Wrong username / password');
    }
    const foundUser = await this.userRepository.findOne({
      where: {email: email},
    });
    console.log('from user service', foundUser);
    if (!foundUser) {
      throw new HttpErrors.NotFound('Wrong username / password');
    }
    const passwordMatched = await this.hasher.comparePassword(
      password,
      foundUser.password,
    );
    if (!passwordMatched)
      throw new HttpErrors.Unauthorized('Wrong username / password');
    return foundUser;
  }
  async getUserOrgList(org: number): Promise<any> {
    // implement this method

    const foundUsers = await this.userRepository.find({
      where: {org: org},
    });

    if (!foundUsers) {
      throw new HttpErrors.NotFound('No users in the organization');
    }

    return foundUsers;
  }
  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id!.toString(),
      name: user.username,
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      userName: user.username,
      organization: user.org,
      reset: user.forceReset,
    };
  }
  async createUser(userWithPassword: Credentials): Promise<User> {
    const user = await this.userRepository.create(userWithPassword);

    return user;
  }
  // async getSubscription(userId: string): Promise<any> {
  //   const subs = await this.subData.findOne({
  //     where: {userId: userId},
  //   });
  //   if(subs) return subs;

  // }
}
