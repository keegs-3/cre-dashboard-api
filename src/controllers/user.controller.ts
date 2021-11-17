import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getJsonSchemaRef, getModelSchemaRef, param, patch, post, requestBody, response} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import * as _ from 'lodash';
import nodemailer from 'nodemailer';
import {v4 as uuidv4} from 'uuid';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
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



  ) { }
  DB_SCHEMA = process.env.DB_SCHEMA
  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User)
        }
      }
    }
  })
  async signup(@requestBody() userData: User) {
    validateCredentials(_.pick(userData, ['username', 'password']));
    userData.password = await this.hasher.hashPassword(userData.password)
    const savedUser = await this.userRepository.create(userData);
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
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<any> {
    const data = {};
    // make sure user exist,password should be valid
    const user = await this.userService.verifyCredentials(credentials);
    // console.log(user);
    const userProfile = await this.userService.convertToUserProfile(user);
    // console.log(userProfile);

    const token = await this.jwtService.generateToken(userProfile);
    // const generatedToken = Promise.resolve({token: token})
    const session = await this.userRepository.execute(

      `INSERT INTO ${this.DB_SCHEMA}.user_session
      (name,  "session")
      VALUES('${credentials.username}' ,'${token}') returning *;
      `
    )
    console.log('done');
    const userdata = await this.userRepository.execute(
      `select * from ${this.DB_SCHEMA}.users u
      left join ${this.DB_SCHEMA}.roles r on u."role" = r.id
      where username = '${userProfile.name}'  `
    );
    delete userdata[0].password;

    return {token, userdata, session};

    // return Promise.resolve({token: token})
  }



  // return Promise.resolve({token: token})

  @get('/reset/link')
  @response(204, {
    description: 'Usersession PATCH success',
  })
  async updateBy(
    @param.query.string('email') email: any,

  ): Promise<any> {

    const data = await this.usersRepository.dataSource.execute(`
    select * from cre.users where "email" = '${email}'
    `);
    console.log(data);
    if (data.length < 1) {
      return 'Email did not match with any user'
    }
    else {
      let resetkey = uuidv4();
      console.log(resetkey);
      await this.userRepository.dataSource.execute(`
  UPDATE ${this.DB_SCHEMA}.users
SET   resetkey= '${resetkey}' where email = '${email}'

  `)
      console.log('reset key send sucessfull')

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'anilchapagain68@gmail.com', // generated ethereal user
          pass: 'tmhmbpzvvtrbkoaj', // generated ethereal password
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Anil Chapagain" <anilchapagain68@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: 'Verify Email', // Subject line
        text: 'Is this your account', // plain text body
        html: `<h2>Reset email ${resetkey}</h2>`, // html body
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      return 'Successfully sent mail';
    }






  }
  @patch('/reset/password')
  @response(204, {
    description: 'password PATCH success',
  })
  async updateByre(

    @requestBody({
      content: {
        'application/json': {

        },
      },
    })
    passwordata: {
      password: string,
      repassword: string,
      resetkey: string
    },
  ): Promise<any> {

    let password = await this.hasher.hashPassword(passwordata.password)
    console.log(password);
    await this.userRepository.dataSource.execute(`
   UPDATE ${this.DB_SCHEMA}.users
      SET   password = '${password}' where resetkey = '${passwordata.resetkey}'`)
    return 'reset successful';
  }

  @authenticate("jwt")
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
  @patch('/logout/{id}')
  @response(204, {
    description: 'Usersession PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usersession, {partial: true}),
        },
      },
    })
    usersession: Usersession,
  ): Promise<void> {
    await this.usersRepository.updateById(id, usersession);
  }
}


