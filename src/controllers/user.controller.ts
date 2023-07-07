/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  get,
  getJsonSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import * as _ from 'lodash';
import nodemailer from 'nodemailer';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings
} from '../keys';
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

    const pass = userData.password;
    validateCredentials(_.pick(userData, ['email', 'password']));
    userData.password = await this.hasher.hashPassword(userData.password);

    const savedUser = await this.userService.createUser(userData)
// for email
const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: 'support@nedl.us', // generated ethereal user
            pass: 'jugakgustxkdlucd', // generated ethereal password
          },
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Nedl Support" <support@nedl.us>', // sender address
          to: `${savedUser.email}`, // list of receivers
          subject: 'Nedl User Details', // Subject line
          text: 'Is this your account', // plain text body
          html: `

          <!DOCTYPE html>
<html>
<head>
  <title>Nedl OnBoarding</title>
  <style>
    /* Reset default styles */
    body,
    html,
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    ul,
    ol,
    li {
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      color: #333333;
    }

    /* Container */
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }

    /* Heading */
    h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    /* Paragraph */
    p {
      margin-bottom: 20px;
    }

    /* Button */
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      margin-top:20px;
    }

    /* Footer */
    .footer {
      display:flex;
      justify-content: center;
      gap:20px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #dddddd;
      text-align: center;

    }
    .footer p {
      line-height:40px
    }
    .logo {
width:150px;
height:30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Nedl</h1>
    <p>Dear ${savedUser.lastName},${savedUser.firstName}</p>
    <p>You have been added to the ${savedUser.agent_id} organization on the Nedl platform</p>
    <i>Click the link below and use the provided credentials to log-in.</i>
    <p>
      <a href="https://nedldev.goldfinch.ai" class="button" style="color:#fff;">Click here to Start</a>
    </p>
    <h1>User Login Details</h1>
    <p>email: ${savedUser.email} </p>
    <p>Password: ${pass} <p>
    <div class="footer">
      <p>© 2023</p> <img class="logo" src="https://nedldev.goldfinch.ai/images/lattest/newlogo.png">.<p> All rights reserved.</p>
    </div>
  </div>
</body>
</html>




          `, // html body
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...






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
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile =  this.userService.convertToUserProfile(user);
    console.log('from login',userProfile);

    const token = await this.jwtService.generateToken(userProfile);

    return {token};
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
  @authenticate('jwt')

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
@authenticate('jwt')

@del('/users/{id}')
@response(204, {
  description: 'User DELETE success',
})
async deleteById(@param.path.string('id') id: string): Promise<void> {
  await this.userRepository.deleteById(id);
}
// @patch('/user/password/{id}')
// @response(204, {
//   description: 'Usersession PATCH success',
// })
// async updateById(
//   @param.path.string('id') id: string,
//   @requestBody({
//     content: {
//       'application/json': {
//         schema: getModelSchemaRef(User, {partial: true}),
//       },
//     },
//   })
//   usersession: User,

// ): Promise<void> {
//   usersession.password = await this.hasher.hashPassword(usersession.password)
//   await this.userRepository.updateById(id, usersession);
// }
@patch('/user/password/{id}')
@response(204, {
  description: 'Usersession PATCH success',
})
async updateById(
  @param.path.string('id') id: string,
  @requestBody()
    request: {previousPassword: string,User:User}



): Promise<any> {
  const user = await this.userRepository.findById(id);

  // Compare previous password if available
  if (user && user.password) {
    const previousPasswordMatches = await this.hasher.comparePassword(
      request.previousPassword,
      user.password
    );

    if (!previousPasswordMatches){
      return 'Previous password does not match';
    }
  }

  request.User.password = await this.hasher.hashPassword(request.User.password);
  await this.userRepository.updateById(id, request.User);
  return 'Successfully Changed Password'
}


}
