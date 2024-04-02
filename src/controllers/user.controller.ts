/* eslint-disable @typescript-eslint/no-explicit-any */
import {generateOTP} from "@eternaljs/otp-generator";
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  get,
  getJsonSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import * as _ from 'lodash';
import nodemailer from 'nodemailer';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings
} from '../keys';
import {User} from '../models/user.model';
import {LoginsessionRepository, UsersessionRepository} from '../repositories';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {validateCredentials} from '../services';
import {BcryptHasher} from '../services/hash.password';
import {JWTService} from '../services/jwt-service';
import {MyUserService} from '../services/user-service';
import { Loginsession } from '../models/loginsession.model';

export class CReUserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(LoginsessionRepository)
    public loginSession: LoginsessionRepository,
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
  UI_URL = process.env.UI_URL;
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

try {
  const data  = await this.userRepository.findOne({
    where: {email:userData.email}
  });
  if (data){
    throw new Error('User Already Exist');
  }





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
          pass: 'yhykuyheqykfzjsz', // generated ethereal password
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
  <p>Dear <b>${savedUser.lastName},${savedUser.firstName}</b></p>
  <p>You have been added to the <b>${savedUser.agent_id}</b> organization on the Nedl platform</p>
  <i>Click the button below and use the provided credentials to log-in.</i>
  <p>

    <a href="${this.UI_URL}" class="button" style="color:#fff;">Click here to Start</a>

  </p>

  <p>email: ${savedUser.email} </p>
  <div class="footer">

    <p>© 2023</p> <img class="logo" src="${this.UI_URL}/images/lattest/newlogo.png">.<p> All rights reserved.</p>

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
catch (error) {
  // Handle errors here
  console.error('Error during signup:', error.message);
  throw new HttpErrors.BadRequest(error.message); // You can customize the error response as needed
}

  }

  @post('/verify', {
    responses: {
      '200': {
        description: 'verifyuser',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async verify( @requestBody({
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: {email:"string"},
        },
      },
    },
  })
  emaild: {
    email:string;
  },): Promise<boolean> {
    try {
      const verify = await this.userRepository.findOne({
        where: {email:emaild.email}
      });

      if (!verify) {
        throw new Error('Invalid email');
      }
      if (verify.force_reset_password === true) {


          const userotp =generateOTP(6);
          console.log(userotp);
          await this.userRepository.dataSource.execute(`
      UPDATE ${this.DB_SCHEMA}.users
      SET   userotp= '${userotp}' where email = '${emaild.email}'

      `);
          console.log('reset key send successfully');

          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'support@nedl.us', // generated ethereal user
              pass: 'yhykuyheqykfzjsz', // generated ethereal password
            },
          });

          // send mail with defined transport object
          const info = await transporter.sendMail({
            from: '"Nedl Support" <support@nedl.us>', // sender address
            to: `${emaild.email}`, // list of receivers
            subject: 'Verify Email', // Subject line
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


                <i>Use the provided OTP given below to add your password.</i>



                <p>OTP: ${userotp} <p>
                <div class="footer">

                  <p>© 2023</p> <img class="logo" src="${this.UI_URL}/images/lattest/newlogo.png">.<p> All rights reserved.</p>

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




        return true
      }


      const loginotp =generateOTP(6);
      console.log(loginotp);
      await this.userRepository.dataSource.execute(`
  UPDATE ${this.DB_SCHEMA}.users
  SET   loginotp= '${loginotp}' where email = '${emaild.email}'

  `);
      console.log('reset key send successfully');

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'support@nedl.us', // generated ethereal user
          pass: 'yhykuyheqykfzjsz', // generated ethereal password
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Nedl Support" <support@nedl.us>', // sender address
        to: `${emaild.email}`, // list of receivers
        subject: 'Login OTP', // Subject line
        text: 'Is this your account', // plain text body
        html: `

        <!DOCTYPE html>
        <html>
        <head>
          <title>Nedl Login</title>
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


            <i>Use the provided OTP given below to Login.</i>



            <p>OTP: ${loginotp} <p>
            <div class="footer">

              <p>© 2023</p> <img class="logo" src="${this.UI_URL}/images/lattest/newlogo.png">.<p> All rights reserved.</p>

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




      return false;
    } catch (error) {
      // Handle errors here
      console.error('Error during verify:', error.message);
      throw new HttpErrors.BadRequest(error.message); // You can customize the error response as needed
    }
  }
  @get('/passwordEmail')
@response(204, {
  description: 'Usersession PATCH success',
})
async passwordEmail(@param.query.string('email') email: any): Promise<any> {
  const data  = await this.userRepository.findOne({
    where: {email:email}
  });

  if (!data) {
    return 'Email did not match with any user';
  }
  if (data.force_reset_password === true)
  {
    const otp =generateOTP(6);

    await this.userRepository.dataSource.execute(`
UPDATE ${this.DB_SCHEMA}.users
SET   userotp= '${otp}' where email = '${email}'

`);
    console.log('reset key send successfully');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'support@nedl.us', // generated ethereal user
        pass: 'yhykuyheqykfzjsz', // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Nedl Support" <support@nedl.us>', // sender address
      to: `${email}`, // list of receivers
      subject: 'Verify Email', // Subject line
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


          <i>Use the provided OTP given below to add your password.</i>



          <p>OTP: ${otp} <p>
          <div class="footer">

            <p>© 2023</p> <img class="logo" src="${this.UI_URL}/images/lattest/newlogo.png">.<p> All rights reserved.</p>

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
    return 'Successfully Emailed';
  }
}
@post('/add/password')


@response(204, {
  description: 'Add PAssword',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          otp: { type: 'number' }
        },
        required: ['email', 'password', 'otp']
      }
    }
  }

})

async addPassword(
  @requestBody({
    description: 'Password data',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            otp: { type: 'number' }
          },
          required: ['email', 'password', 'otp']
        }
      }
    }
  })
  passwordata: {
    email:string;
    password: string;
    otp: number;
  },
): Promise<any> {


try{
  const data  = await this.userRepository.findOne({
    where: {email:passwordata.email}
  });

  // console.log("data from add password",data)
if(!data){
  throw new Error('Invalid email');
}

const storedOTP = data.userOtp;
const providedOTP = passwordata.otp*1;
console.log("Stored OTP:", storedOTP);
  console.log("Provided OTP:", providedOTP);
  if (storedOTP !== providedOTP*1) {
    throw new Error('Invalid user OTP');
  }

  console.log('before hash',passwordata.password);
  const password = await this.hasher.hashPassword(passwordata.password);
  console.log('after hash',password);
  const sql = `
  UPDATE ${this.DB_SCHEMA}.users
     SET   password = '${password}',userotp=null,force_reset_password = false where email = '${passwordata.email}'`;
     console.log('sql',sql)
  await this.userRepository.dataSource.execute(sql);

  return 'reset successful';
}
catch (error) {
  // Handle errors here
  console.error('Error during add password:', error.message);
  throw new HttpErrors.BadRequest(error.message); // You can customize the error response as needed
}

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
  async login(
    @requestBody({
      description: 'Login',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              password: { type: 'string' },
              otp: { type: 'number' }
            },
            required: ['email', 'password', 'otp']
          }
        }
      }
    })
    passwordata: {
      email:string;
      password: string;
      otp: number;
    },
    ): Promise<any> {
    try {
      const verify = await this.userRepository.findOne({
        where: {email:passwordata.email}
      });

      if (!verify) {
        throw new Error('Invalid email');
      }
      if (verify.isLogedIn === true) {
        throw new Error('User is already Signed In to another System');
      }
if(verify.loginOtp !== passwordata.otp){
  throw new Error('Login OTP did not matched');

}

      const user = await this.userService.verifyCredentials(passwordata);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const userProfile = this.userService.convertToUserProfile(user);
      console.log('from login', userProfile);

      const token = await this.jwtService.generateToken(userProfile);


        const loginsession = {
          "email":userProfile.email,
          "token": token,
          "loginid":userProfile[securityId]
        }

       const lsession =  await this.loginSession.create(loginsession);

       const updatelogin =  await this.userRepository.dataSource.execute(`
      UPDATE ${this.DB_SCHEMA}.users
      SET islogedin= true , loginotp = null where email = '${passwordata.email}'

      `);
      console.log({"loginsession":lsession,"updatelogin":updatelogin});


      return { token };
    } catch (error) {
      // Handle errors here
      console.error('Error during user login:', error.message);
      throw new HttpErrors.Unauthorized(error.message); // You can customize the error response as needed
    }
  }
  // @authenticate('jwt')
  @post('/logout', {
    responses: {
      '200': {
        description: 'Logout',
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
  async logout(@requestBody({
    content: {
      'application/json': {},
    },
  })
  emaild: {
    email:string;
  },): Promise<any> {
    try {
      const verify = await this.userRepository.findOne({
        where: {email:emaild.email}
      });

      if (!verify) {
        throw new Error('Invalid email');
      }



if(verify.isLogedIn === false){
  throw new Error('The User is already logged out');
}
const login = await this.userRepository.dataSource.execute(`
      select * from ${this.DB_SCHEMA}.loginsession
      where email = '${emaild.email}'

      `);
      console.log('login',login[0].id);

if(login){
  await this.loginSession.deleteById(login[0].id);
  const logout = await this.userRepository.dataSource.execute(`
  UPDATE ${this.DB_SCHEMA}.users
  SET   islogedin= false where email = '${emaild.email}'

  `);
  if(!logout){
    throw new Error('Issue login out ');
  }
}




      return 'Logged Out Successfully'

    } catch (error) {
      // Handle errors here
      console.error('Error during login:', error.message);
      throw new HttpErrors.Unauthorized(error.message); // You can customize the error response as needed
    }
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
  if ( user?.password) {
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


@get('/reset/link')
@response(204, {
  description: 'Usersession PATCH success',
})
async updateBy(@param.query.string('email') email: any): Promise<any> {
  const data  = await this.userRepository.find({
    where: {email:email}
  });
  console.log(data);
  if (data.length < 1) {
    return 'Email did not match with any user';
  } else {
    const resetkey =generateOTP(6);
    console.log(resetkey);
    await this.userRepository.dataSource.execute(`
UPDATE ${this.DB_SCHEMA}.users
SET   resetkey= '${resetkey}' where email = '${email}'

`);
    console.log('reset key send successfully');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'support@nedl.us', // generated ethereal user
        pass: 'yhykuyheqykfzjsz', // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Nedl Support" <support@nedl.us>', // sender address
      to: `${email}`, // list of receivers
      subject: 'Verify Email', // Subject line
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


          <i>Use the provided reset key given below to reset your password.</i>



          <p>Reset Key: ${resetkey} <p>
          <div class="footer">

            <p>© 2023</p> <img class="logo" src="${this.UI_URL}/images/lattest/newlogo.png">.<p> All rights reserved.</p>

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
    return 'Successfully Emailed';
  }
}
@patch('/reset/password')
@response(204, {
  description: 'password PATCH success',
})
async updateByre(
  @requestBody({
    content: {
      'application/json': {},
    },
  })
  passwordata: {
    password: string;
    resetkey: string;
  },
): Promise<any> {


  const data  = await this.userRepository.find({
    where: {resetkey:passwordata.resetkey}
  });
if(data.length < 1){
  return 'Invalid reset key'
}




  const password = await this.hasher.hashPassword(passwordata.password);
  console.log(password);
  await this.userRepository.dataSource.execute(`
 UPDATE ${this.DB_SCHEMA}.users
    SET   password = '${password}',resetkey=null where resetkey = '${passwordata.resetkey}'`);

  return 'reset successful';
}
@authenticate('jwt')
@get('/users/org')
@response(200, {
  description: 'Array of org ',
})
async market(

): Promise<any> {

  const sql = await this.userRepository.dataSource.execute(
    `
    SELECT distinct agent_id from ${this.DB_SCHEMA}.users

    `  )








return sql;





}



}
