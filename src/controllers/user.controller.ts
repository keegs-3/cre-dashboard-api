/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  del,
  getJsonSchemaRef,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import { UserProfile} from '@loopback/security';
import * as _ from 'lodash';
import nodemailer from 'nodemailer';
import {v4 as uuidv4} from 'uuid';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings
} from '../keys';
import {Usersession} from '../models';
import {User} from '../models/user.model';
import {UsersessionRepository} from '../repositories';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {validateCredentials} from '../services';
import {BcryptHasher} from '../services/hash.password';
import {JWTService} from '../services/jwt-service';
import {MyUserService} from '../services/user-service';

export class CReUserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UsersessionRepository)
    public usersRepository: UsersessionRepository,

    // @inject('service.hasher')
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

    // @inject('service.user.service')
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,

    // @inject('service.jwt.service')
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) {}
  DB_SCHEMA = process.env.DB_SCHEMA;

  @authenticate('jwt')
  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async signup(@requestBody() userData: User) {
    validateCredentials(_.pick(userData, ['email', 'password']));
    userData.password = await this.hasher.hashPassword(userData.password);
    const savedUser = await this.userService.createUser(userData)
    // delete savedUser.password;
    return savedUser;
  }


  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(@requestBody() credentials: Credentials): Promise<any> {

    // make sure user exist,password should be valid
    const user = await this.userService.verifyCredentials(credentials);
    // console.log(user);
    const userProfile =  this.userService.convertToUserProfile(user);
    console.log('from login',userProfile);

    const token = await this.jwtService.generateToken(userProfile);
    // const generatedToken = Promise.resolve({token: token})
    // const session = await this.userRepository.execute(
    //   `INSERT INTO ${this.DB_SCHEMA}.user_session
    //   (name,  "session")
    //   VALUES('${credentials.username}' ,'${token}') returning *;
    //   `,
    // );
    // console.log('insert into user session');
    // const userdata = await this.userRepository.execute(
    //   `select * from ${this.DB_SCHEMA}.users u
    //   left join ${this.DB_SCHEMA}.roles r on u."role" = r.id
    //   where username = '${userProfile.name}'  `,
    // );
    // const userList = await this.userRepository.execute(
    //   `select u.username from cre.users u  where u.agent_map_to  = '${userProfile.name}' `,
    // );
    // delete userdata[0].password;

    // return {token, userdata, session,userList};
    return {token};

    // return Promise.resolve({token: token})
  }
  @authenticate('jwt')
  @get('/users/me', {
    // security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User),
          },
        },
      },
    },
  })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<UserProfile> {
    return Promise.resolve(currentUser);

  }
  @get('/users/{org}', {
    // security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User),
          },
        },
      },
    },
  })
  async org(
    @param.path.string('org') org: string,
  ): Promise<UserProfile> {
    const userList = await this.userService.getUserOrgList(org);
    return userList


}
@del('/users/{id}')
@response(204, {
  description: 'User DELETE success',
})
async deleteById(@param.path.string('id') id: string): Promise<void> {
  await this.userRepository.deleteById(id);
}


}
