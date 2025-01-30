/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {generateOTP} from '@eternaljs/otp-generator';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getJsonSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import axios from 'axios';
import https from 'https';
import * as _ from 'lodash';
import nodemailer from 'nodemailer';
import Stripe from 'REMOVED';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import {User} from '../models/user.model';
import {
  LoginsessionRepository,
  SubscriptionDataRepository,
  UsersessionRepository,
} from '../repositories';
import {UserRepository} from '../repositories/user.repository';
import {validateCredentials} from '../services';
import {BcryptHasher} from '../services/hash.password';
import {JWTService} from '../services/jwt-service';
import {MyUserService} from '../services/user-service';
import {SubscriptionData} from './../models/subscription-data.model';

const REMOVED = new Stripe(`${process.env.STRIPE_KEY_TEST}`);
const HUBSPOT_SEARCH_URL =
  'https://api.hubapi.com/crm/v3/objects/contacts/search';
const HUBSPOT_CONTACT_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
export class AppUserController {
  constructor(
    @inject('services.Stripe') private REMOVEDService: any,
    @inject('services.HubSpot') private hubSpotService: any,
    @repository(SubscriptionDataRepository)
    public subData: SubscriptionDataRepository,
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
  EMAIL = process.env.EMAIL_ID;
  EMAILPASS = process.env.EMAIL_PASSWORD;
  UI_URL = process.env.UI_URL;
  STRIPE_KEY = process.env.STRIPE_KEY;
  HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
  // @authenticate('jwt')
  string = function getString(n: number) {
    let str = '';
    let testcheck = "";
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charLen = characters.length;

    for (let i = 0; i < n; i++) {
      // Generating a random index
      const idx = Math.floor(Math.random() * charLen);

      str += characters.charAt(idx);
    }

    return str;
  };
// conflict check
  @get('/products/all')
  async getCouponByName(): Promise<object> {
    try {
      const products = await this.REMOVEDService.getProductList();
      return {products};
    } catch (error) {
      return {error: error.message};
    }
  }
  @get('/product-price-coupon')
  async getPricesWithCoupons(): Promise<object> {
    try {
      const result = await this.REMOVEDService.findProductsWithPricesAndCoupons();
      return {data: result};
    } catch (error) {
      return {error: error.message};
    }
  }

  // Initialize Stripe with your secret key
  @post('/create-subscription')
  async createSubscription(
    @requestBody()
    request: {
      email: string;
      paymentMethodId: string;
      items: Array<{priceId: string; quantity: number}>;
      name: string;
      trialPeriod: number;
      couponCode: string;
    },
  ): Promise<{}> {
    const {
      email,
      paymentMethodId,
      items,
      name,
      trialPeriod,
      couponCode,
    } = request;

    try {
      if (!Array.isArray(items) || items.length === 0) {
        return {error:'Items must be an array with at least one item'};
      }

      // // Validate and retrieve details for each priceId
      // const prices = await Promise.all(
      //   items.map(item => REMOVED.prices.retrieve(item.priceId)),
      // );

      // // Validate recurring intervals
      // const interval = prices[0]?.recurring.interval;
      // const intervalCount = prices[0]?.recurring.interval_count;

      // for (const price of prices) {
      //   if (
      //     price.recurring.interval !== interval ||
      //     price.recurring.interval_count !== intervalCount
      //   ) {
      //     return res.status(400).json({
      //       error:
      //         'All prices must have the same recurring.interval and recurring.interval_count.',
      //     });
      //   }
      // }

      const existingCustomer = await this.REMOVEDService.getCustomerByEmail(
        email,
      );
      let customer;

      // Check if customer exists
      if (existingCustomer) {
        customer = existingCustomer;
      } else {
        customer = await this.REMOVEDService.createCustomer({
          email,
          name,
          payment_method: paymentMethodId,
          invoice_settings: {default_payment_method: paymentMethodId},
        });
      }

        const subscriptionItems = items.map(item => ({
            price: item.priceId,
            quantity: item.quantity || 1, // Default to 1 if quantity is not provided
        }));
      // Define subscriptionParams with the appropriate types
      const subscriptionParams: {
        customer: string;
        items: {price: string,quantity:number}[];
        expand: string[];
        trial_period_days?: number;
        coupon?: string;
      } = {
        customer: customer.id,
        items: subscriptionItems,
        expand: ['latest_invoice.payment_intent', 'discount.coupon'],
      };

      if (trialPeriod > 0) {
        subscriptionParams.trial_period_days = trialPeriod;
      }

      if (couponCode && couponCode.trim() !== '') {
        subscriptionParams.coupon = couponCode;
      }

      // Create the subscription
      const subscription = await this.REMOVEDService.createSubscription(
        subscriptionParams,
      );

      // Create a note for the HubSpot contact
      const couponDetails = subscription.discount?.coupon
        ? `\n- Coupon Applied: ${subscription.discount.coupon.name} (${
            subscription.discount.coupon.percent_off ||
            subscription.discount.coupon.amount_off / 100
          } off)`
        : '';

      const noteContent = `
        <b>Subscription Details:</b><br>
        <b>- Status:</b> ${subscription.status}<br>
        <b>- Start Date:</b> ${new Date(
          subscription.start_date * 1000,
        ).toISOString()}<br>
        <b>- Next Payment Due Date:</b> ${new Date(
          subscription.current_period_end * 1000,
        ).toISOString()}<br>
        <b>- Next Payment Amount:</b> $${(
          subscription.items.data[0].price.unit_amount / 100
        ).toFixed(2)}<br>
        <b>- Stripe Subscription ID:</b> ${subscription.id}<br>
        ${couponDetails}
      `;

      // Add or update the HubSpot contact
      const contact = await this.hubSpotService.upsertContact(email, name);
      await this.hubSpotService.addNoteToHubSpot(contact.id, noteContent);

      return {subscriptionId: subscription.id};
    } catch (error) {
      console.error('Error:', error.message);
      throw new HttpErrors.BadRequest(error.message);
    }
  }

  @post('/hubspot/search', {
    responses: {
      '200': {
        description: 'Search or create/update a contact by email',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async search(
    @requestBody({
      description: 'Search email and update or create contact',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              firstname: {type: 'string'},
              lastname: {type: 'string'},
              company: {type: 'string'},
              phone: {type: 'string'},
              subscription: {type: 'string'},
              userFrom: {type: 'string'},
              subscription_level: {type: 'array'},
            },
            required: ['email'],
          },
        },
      },
    })
    data: {
      email: string;
      firstname: string;
      lastname: string;
      company: string;
      phone: string;
      subscription: string;
      userFrom: string;
      subscription_level: Array<JSON>;
    },
  ): Promise<object> {
    if (!HUBSPOT_TOKEN) {
      throw new HttpErrors.InternalServerError(
        'HubSpot API token is not configured in environment variables.',
      );
    }

    const searchPayload = JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: data.email,
            },
          ],
        },
      ],
    });

    console.log('Search Payload:', searchPayload);

    return new Promise<object>((resolve, reject) => {
      const url = new URL(HUBSPOT_SEARCH_URL);

      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          'Content-Length': Buffer.byteLength(searchPayload),
        },
      };

      const req = https.request(options, res => {
        let responseBody = '';

        res.on('data', chunk => {
          responseBody += chunk;
        });

        res.on('end', () => {
          console.log('Search Response:', responseBody);

          try {
            const responseJson = JSON.parse(responseBody);

            if (res.statusCode && res.statusCode >= 400) {
              return reject(
                new HttpErrors.BadRequest(
                  `HubSpot API error: ${res.statusCode} - ${
                    responseJson.message || 'Unknown error'
                  }`,
                ),
              );
            }

            if (responseJson.results && responseJson.results.length > 0) {
              // Contact exists; update it
              const contactId = responseJson.results[0].id;
              const updateUrl = `${HUBSPOT_CONTACT_URL}/${contactId}`;
              const updatePayload = JSON.stringify({
                properties: {
                  firstname: data.firstname,
                  lastname: data.lastname,
                  company: data.company,
                  phone: data.phone,
                  email: data.email,
                  subscription: data.subscription,
                  userFrom: data.userFrom,
                  subscription_level: data.subscription_level,
                },
              });

              this.makeRequest(updateUrl, 'PATCH', updatePayload, HUBSPOT_TOKEN)
                .then(updateResponse => resolve(updateResponse))
                .catch(error => reject(error));
            } else {
              // Contact does not exist; create it
              const createPayload = JSON.stringify({
                properties: {
                  firstname: data.firstname,
                  lastname: data.lastname,
                  company: data.company,
                  phone: data.phone,
                  email: data.email,
                  subscription: data.subscription,
                  userFrom: data.userFrom,
                  subscription_level: data.subscription_level,
                },
              });

              this.makeRequest(
                HUBSPOT_CONTACT_URL,
                'POST',
                createPayload,
                HUBSPOT_TOKEN,
              )
                .then(createResponse => resolve(createResponse))
                .catch(error => reject(error));
            }
          } catch (error) {
            reject(
              new HttpErrors.InternalServerError(
                'Error parsing response from HubSpot API.',
              ),
            );
          }
        });
      });

      req.on('error', error => {
        console.error('Search Request Error:', error.message);
        reject(
          new HttpErrors.InternalServerError(
            `Error calling HubSpot API: ${error.message}`,
          ),
        );
      });

      req.write(searchPayload);
      req.end();
    });
  }

  private makeRequest(
    url: string,
    method: string,
    payload: string,
    token: string,
  ): Promise<object> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);

      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname,
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, res => {
        let responseBody = '';

        res.on('data', chunk => {
          responseBody += chunk;
        });

        res.on('end', () => {
          console.log(`${method} Response:`, responseBody);

          try {
            const responseJson = JSON.parse(responseBody);

            if (res.statusCode && res.statusCode >= 400) {
              return reject(
                new HttpErrors.BadRequest(
                  `${method} request error: ${res.statusCode} - ${
                    responseJson.message || 'Unknown error'
                  }`,
                ),
              );
            }

            resolve(responseJson);
          } catch (error) {
            reject(
              new HttpErrors.InternalServerError(
                'Error parsing response from HubSpot API.',
              ),
            );
          }
        });
      });

      req.on('error', error => {
        console.error(`${method} Request Error:`, error.message);
        reject(
          new HttpErrors.InternalServerError(
            `Error calling HubSpot API: ${error.message}`,
          ),
        );
      });

      req.write(payload);
      req.end();
    });
  }

  @post('/create-payment-intent', {
    responses: {
      '200': {
        description: 'PaymentIntent Response',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async createPaymentIntent(
    @requestBody({
      description: 'Payment details including items and email',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    amount: {type: 'number'},
                    email: {type: 'string'},
                  },
                },
              },
            },
            required: ['items'],
          },
        },
      },
    })
    data: {
      items: {amount: number; email: string}[];
      email: string;
    },
  ): Promise<object> {
    // Calculate the order amount
    const calculateOrderAmount = (items: {amount: number}[]): number => {
      return items.reduce((total, item) => total + item.amount, 0);
    };
    const REMOVED = new Stripe(`${this.STRIPE_KEY}`);

    try {
      // Create a PaymentIntent
      console.log('datatatataatta', data);
      const paymentIntent = await REMOVED.paymentIntents.create({
        amount: calculateOrderAmount(data.items),
        currency: 'usd',
        receipt_email: data.email,
        metadata: {
          customer_email: data.email, // Custom metadata for tracking
        },
      });
      console.log('datatatataattaeeeeeeeeee', data);

      return {
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink: `https://dashboard.REMOVED.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      };
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      throw error;
    }
  }

  @post('/app/user/signup', {
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
      const data = await this.userRepository.findOne({
        where: {email: userData.email},
      });
      if (data) {
        throw new Error('User Already Exist');
      }

      validateCredentials(_.pick(userData, ['email', 'password']));
      userData.password = await this.hasher.hashPassword(userData.password);

      const savedUser = await this.userService.createUser(userData);
      // for email
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: this.EMAIL, // generated ethereal user
          pass: this.EMAILPASS, // generated ethereal password
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Nedl Support" <support@nedl.us>', // sender address
        to: `${savedUser.email}`, // list of receivers
        subject: 'Welcome to nëdl!', // Subject line
        text: 'Is this your account', // plain text body
        html: `

        <!DOCTYPE html>
<html>
<head>
<title>Welcome to nëdl!</title>
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
    margin-top: 20px;
  }

  /* Button */
  .nbutton {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #ffffff !important;
    text-decoration:import { Send } from '@loopback/rest';
 none;import { Stripe } from 'REMOVED';

    border-radius: 5px;
    margin-top:20px;
  }

  /* Footer */
  .footer {
    display:flex;
    justify-content: center;
    align-item:center;
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
margin:auto;
  }
ol{
margin-left:10%;
margin-top:20px;
}
.sign {
margin-top : 10px;
}
</style>
</head>
<body>
<div class="container">
Hi ${savedUser.firstName},
<p>Your account is ready for you! Take a look at the directions below to get started finding off-market deals.</p>
<ol>
<li> Log into nëdl <link to platform> with the username provided below:
${savedUser.email}</li>
<li> Once you enter your username, you will receive an OTP verification to your email.</li>
<li>Enter your OTP code, then create and confirm your password.</li>
<li>Once you create your password, you will be redirected to the nëdl login page to re-enter your username and password.</li>
</ol>
<p>If you have any questions or encounter any issues during the log in process, contact us at support@nedl.us</p>
<p>Cheers,</p>
<p class="sign">Nedl</p>
<a href="${this.UI_URL}" class="nbutton">Visit the nëdl application</a>.
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

      return savedUser;
    } catch (error: any) {
      // Handle errors here
      console.error('Error during signup:', error.message);
      throw new HttpErrors.BadRequest(error.message); // You can customize the error response as needed
    }
  }

  @post('/app/user/forgotpassword/verify', {
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
  async fverify(
    @requestBody({
      responses: {
        '200': {
          description: 'User',
          content: {
            schema: {email: 'string'},
          },
        },
      },
    })
    emaild: {
      email: string;
    },
  ): Promise<any> {
    try {
      const verify = await this.userRepository.findOne({
        where: {email: emaild.email},
      });

      if (!verify) {
        throw new Error('Invalid email / Email not available on Database');
      }
      if (verify) {
        const userotp = this.string(6);

        await this.userRepository.dataSource.execute(`
      UPDATE ${this.DB_SCHEMA}.app_users
      SET   resetkey= '${userotp}' where email = '${emaild.email}'

      `);
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: this.EMAIL, // generated ethereal user
            pass: this.EMAILPASS, // generated ethereal password
          },
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Nedl Support" <support@nedl.us>', // sender address
          to: `${emaild.email}`, // list of receivers
          subject: 'Password Reset Request for nëdl', // Subject line
          text: 'Add your password', // plain text body
          html: `

            <!DOCTYPE html>
            <html>
            <head>
              <title>Password Reset Request for nëdl</title>
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
                  margin-top: 20px;
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
                Dear ${verify.firstName}

<p>Your one-time reset code is ${userotp}</p>

<p>Please use this code to change password on the nëdl application.</p>

<p>Cheers,</p>
<p>Nedl</p>
<a href="${this.UI_URL}" class="button" style="color:#fff;">Visit the nëdl application</a>.
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

        return `'Please check your ${emaild.email}' for reset key`;
      }
    } catch (error: any) {
      // Handle errors here
      console.error('Error during verify:', error.message);
      throw new HttpErrors.BadRequest(error.message); // You can customize the error response as needed
    }
  }
  @patch('/app/user/reset/password')
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
    const data = await this.userRepository.find({
      where: {resetKey: passwordata.resetkey},
    });
    if (data.length < 1) {
      return 'Invalid reset key';
    }
    console.log('data', data);

    const password = await this.hasher.hashPassword(passwordata.password);
    console.log(password);
    await this.userRepository.dataSource.execute(`
 UPDATE ${this.DB_SCHEMA}.app_users
    SET   password = '${password}',resetkey=null where resetkey = '${passwordata.resetkey}'`);

    return 'reset successful';
  }
   @post('/app/user/email', {
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
  async checkemail(
    @requestBody({
      responses: {
        '200': {
          description: 'User',
          content: {
            schema: {email: 'string'},
          },
        },
      },
    })
    emaild: {
      email: string;
    },
  ): Promise<boolean> {
    try {
      const verify = await this.userRepository.findOne({
        where: {email: emaild.email},
      });
if(verify){
  return true
}
else {
  return false
}

    } catch (error: any) {
      // Handle errors here
      console.error('Error during verify:', error.message);
      throw new HttpErrors.BadRequest(error.message); // You can customize the error response as needed
    }
  }
  @post('/app/user/verify', {
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
  async verify(
    @requestBody({
      responses: {
        '200': {
          description: 'User',
          content: {
            schema: {email: 'string'},
          },
        },
      },
    })
    emaild: {
      email: string;
    },
  ): Promise<boolean> {
    try {
      const verify = await this.userRepository.findOne({
        where: {email: emaild.email},
      });

      if (!verify) {
        throw new Error('Invalid email / Email not available on Database');
      }
      if (verify.forceReset === true) {
        const userotp = generateOTP(6);

        await this.userRepository.dataSource.execute(`
      UPDATE ${this.DB_SCHEMA}.app_users
      SET   userotp= '${userotp}' where email = '${emaild.email}'

      `);
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: this.EMAIL, // generated ethereal user
            pass: this.EMAILPASS, // generated ethereal password
          },
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Nedl Support" <support@nedl.us>', // sender address
          to: `${emaild.email}`, // list of receivers
          subject:
            'Final Step for your nëdl access - Verify OTP and Add Password', // Subject line
          text: 'Add your password', // plain text body
          html: `

            <!DOCTYPE html>
            <html>
            <head>
              <title>Nedl Add Password</title>
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
                  margin-top: 20px;
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
              You are almost there, ${verify.firstName}

<p>Your one-time verification code is ${userotp}</p>

<p>Once you enter the OTP, you can create your password for the application.</p>
<p>If you have any questions or encounter any issues during the log in process, contact us at support@nedl.us</p>

<p>Cheers,</p>
<p>Nedl</p>
     <a href="${this.UI_URL}" class="button" style="color:#fff;">Visit the nëdl application</a>.
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

        return true;
      }

      const loginotp = generateOTP(6);

      await this.userRepository.dataSource.execute(`
  UPDATE ${this.DB_SCHEMA}.app_users
  SET   loginotp= '${loginotp}' where email = '${emaild.email}'

  `);

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: this.EMAIL, // generated ethereal user
          pass: this.EMAILPASS, // generated ethereal password
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Nedl Support" <support@nedl.us>', // sender address
        to: `${emaild.email}`, // list of receivers
        subject: 'Login OTP', // Subject line
        text: 'User OTP to login', // plain text body
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
              margin-top: 20px;
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

<p>Dear ${verify.firstName}</p>
<p>Please use ${loginotp} as the One Time Password (OTP) to log into your nëdl Account.</p>
<p>Cheers,</p>
<span>Nedl</span>

     <a href="${this.UI_URL}" class="button" style="color:#fff;">Visit the nëdl application</a>.
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
    } catch (error: any) {
      // Handle errors here
      console.error('Error during verify:', error.message);
      throw new HttpErrors.BadRequest(error.message); // You can customize the error response as needed
    }
  }

  @post('/app/user/password')
  @response(204, {
    description: 'Add PAssword',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            email: {type: 'string'},
            password: {type: 'string'},
            otp: {type: 'number'},
          },
          required: ['email', 'password', 'otp'],
        },
      },
    },
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
              email: {type: 'string'},
              password: {type: 'string'},
              otp: {type: 'number'},
            },
            required: ['email', 'password', 'otp'],
          },
        },
      },
    })
    passwordata: {
      email: string;
      password: string;
      otp: number;
    },
  ): Promise<any> {
    try {
      const data = await this.userRepository.findOne({
        where: {email: passwordata.email},
      });
      if (!data) {
        throw new Error('Invalid email');
      }

      const storedOTP = data.userOtp;
      const providedOTP = passwordata.otp * 1;
      if (storedOTP !== providedOTP * 1) {
        throw new Error('Invalid user OTP');
      }
      const password = await this.hasher.hashPassword(passwordata.password);
      console.log('after hash', password);
      const sql = `
  UPDATE ${this.DB_SCHEMA}.app_users
     SET   password = '${password}',userotp=null,forcereset = false where email = '${passwordata.email}'`;

      await this.userRepository.dataSource.execute(sql);

      return 'reset successful';
    } catch (error: any) {
      console.error('Error during add password:', error.message);
      throw new HttpErrors.BadRequest(error.message);
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
              email: {type: 'string'},
              password: {type: 'string'},
              otp: {type: 'number'},
            },
            required: ['email', 'password', 'otp'],
          },
        },
      },
    })
    passwordata: {
      email: string;
      password: string;
      otp: number;
    },
  ): Promise<any> {
    try {
      const verify = await this.userRepository.findOne({
        where: {email: passwordata.email},
      });
      console.log('verify', verify);
      if (!verify) {
        throw new Error('Invalid email');
      }
      if (verify.isLogedIn === true) {
        throw new Error('User is already Signed In to another System');
      }
      if (verify.loginOtp !== passwordata.otp) {
        throw new Error('Login OTP did not matched');
      }

      const user = await this.userService.verifyCredentials(passwordata);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      // const loginsession = {
      //   email: userProfile.email,
      //   token: token,
      //   loginid: userProfile[securityId],
      // };

      // const lsession = await this.loginSession.create(loginsession);

      await this.userRepository.dataSource.execute(`
      UPDATE ${this.DB_SCHEMA}.app_users
      SET islogedin= true , loginotp = null where email = '${passwordata.email}'

      `);
      return {token};
    } catch (error: any) {
      // Handle errors here
      console.error('Error during user login:', error.message);
      throw new HttpErrors.Unauthorized(error.message); // You can customize the error response as needed
    }
  }
  //   // @authenticate('jwt')
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
  async logout(
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    emaild: {
      email: string;
    },
  ): Promise<any> {
    try {
      const verify = await this.userRepository.findOne({
        where: {email: emaild.email},
      });
      console.log('aaaaa', verify);

      if (!verify) {
        throw new Error('Invalid email');
      }

      if (verify.isLogedIn === false) {
        throw new Error('The User is already logged out');
      }

      const logout = await this.userRepository.dataSource.execute(`
  UPDATE ${this.DB_SCHEMA}.app_users
  SET   islogedin= false where email = '${emaild.email}'

  `);
      if (!logout) {
        throw new Error('Issue login out ');
      }

      return 'Logged Out Successfully';
    } catch (error: any) {
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
  ): Promise<any> {
    try {
      const user = await Promise.resolve(currentUser);
      const subs = await this.subData.dataSource.execute(
        `
      SELECT *
FROM ${this.DB_SCHEMA}.app_subscription_data
WHERE org = ${user.organization}
  AND jsonb_typeof(users->'users') = 'array'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(users->'users') AS elem
    WHERE elem = '${user[securityId]}'
  );
      `,
      );

      const date = new Date();
      if (subs.length > 0) {
        if (new Date(subs[0].enddate) > date) return {user, subs};
        else return {user, message: 'Subscription Expired please renew'};
      }
      return {user, message: 'Please add a Subscription'};
    } catch (error: any) {
      console.error('Error during login:', error.message);
      throw new HttpErrors.Unauthorized(error.message);
    }
  }
  @authenticate('jwt')
  @get('/users/list/{org}', {
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
  async list(
    @param.path.number('org') org: number,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<any> {
    try {
      const user = await Promise.resolve(currentUser);
      if (user.role !== 1) {
        return `You don't have right to access this route`;
      }
      const list = await this.userRepository.dataSource.execute(`
select * from ${this.DB_SCHEMA}.app_users where org=${org}`);
      return list;
    } catch (error: any) {
      console.error('Error during login:', error.message);
      throw new HttpErrors.Unauthorized(error.message);
    }
  }
  @authenticate('jwt')
  @get('/users/list/nosubscription/{org}', {
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
  async notSubscribed(
    @param.path.number('org') org: number,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<any> {
    try {
      const user = await Promise.resolve(currentUser);
      if (user.role !== 1) {
        return `You don't have right to access this route`;
      }
      const list = await this.userRepository.dataSource.execute(`
SELECT *
FROM ${this.DB_SCHEMA}.app_users au
WHERE au.org = ${org}
  AND au.id::text NOT IN (
    SELECT DISTINCT jsonb_array_elements_text(users->'users')
    FROM ${this.DB_SCHEMA}.app_subscription_data asd
    WHERE asd.org = ${org}
      AND jsonb_typeof(asd.users->'users') = 'array'
  )`);
      return list;
    } catch (error: any) {
      console.error('Error during login:', error.message);
      throw new HttpErrors.Unauthorized(error.message);
    }
  }
  @authenticate('jwt')
  @get('/users/subscription/list/{org}', {
    // security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Subscription List according to organization',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(SubscriptionData),
          },
        },
      },
    },
  })
  async subscription(
    @param.path.number('org') org: number,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<any> {
    try {
      const user = await Promise.resolve(currentUser);
      if (user.role !== 1) {
        return `You don't have right to access this route`;
      }
      const list = await this.userRepository.dataSource.execute(`
select * from ${this.DB_SCHEMA}.app_subscription_data where org=${org}`);
      return list;
    } catch (error: any) {
      console.error('Error during login:', error.message);
      throw new HttpErrors.Unauthorized(error.message);
    }
  }
  //   @authenticate('jwt')
  //   @get('/users/{org}', {
  //     // security: OPERATION_SECURITY_SPEC,
  //     responses: {
  //       '200': {
  //         description: 'The current user profile',
  //         content: {
  //           'application/json': {
  //             schema: getJsonSchemaRef(User),
  //           },
  //         },
  //       },
  //     },
  //   })
  //   async org(@param.path.string('org') org: string): Promise<UserProfile> {
  //     const userList = await this.userService.getUserOrgList(org);
  //     return userList;
  //   }
  //   @authenticate('jwt')
  //   @del('/users/{id}')
  //   @response(204, {
  //     description: 'User DELETE success',
  //   })
  //   async deleteById(@param.path.string('id') id: string): Promise<void> {
  //     await this.userRepository.deleteById(id);
  //   }
  //   @patch('/user/password/{id}')
  //   @response(204, {
  //     description: 'Usersession PATCH success',
  //   })
  //   async updateById(
  //     @param.path.string('id') id: string,
  //     @requestBody()
  //     request: {previousPassword: string; User: User},
  //   ): Promise<any> {
  //     const user = await this.userRepository.findById(id);

  //     // Compare previous password if available
  //     if (user?.password) {
  //       const previousPasswordMatches = await this.hasher.comparePassword(
  //         request.previousPassword,
  //         user.password,
  //       );

  //       if (!previousPasswordMatches) {
  //         return 'Previous password does not match';
  //       }
  //     }

  //     request.User.password = await this.hasher.hashPassword(
  //       request.User.password,
  //     );
  //     await this.userRepository.updateById(id, request.User);
  //     return 'Successfully Changed Password';
  //   }

  //   @get('/reset/link')
  //   @response(204, {
  //     description: 'Usersession PATCH success',
  //   })
  //   async updateBy(@param.query.string('email') email: any): Promise<any> {
  //     const data = await this.userRepository.find({
  //       where: {email: email},
  //     });
  //     console.log(data);
  //     if (data.length < 1) {
  //       return 'Email did not match with any user';
  //     } else {
  //       const resetkey = generateOTP(6);
  //       console.log(resetkey);
  //       await this.userRepository.dataSource.execute(`
  // UPDATE ${this.DB_SCHEMA}.users
  // SET   resetkey= '${resetkey}' where email = '${email}'

  // `);
  //       console.log('reset key send successfully');

  //       const transporter = nodemailer.createTransport({
  //         host: 'smtp.gmail.com',
  //         port: 465,
  //         secure: true, // true for 465, false for other ports
  //         auth: {
  //           user: 'support@nedl.us', // generated ethereal user
  //           pass: 'yhykuyheqykfzjsz', // generated ethereal password
  //         },
  //       });

  //       // send mail with defined transport object
  //       const info = await transporter.sendMail({
  //         from: '"Nedl Support" <support@nedl.us>', // sender address
  //         to: `${email}`, // list of receivers
  //         subject: 'Verify Email', // Subject line
  //         text: 'Is this your account', // plain text body
  //         html: `

  //       <!DOCTYPE html>
  //       <html>
  //       <head>
  //         <title>Nedl OnBoarding</title>
  //         <style>
  //           /* Reset default styles */
  //           body,
  //           html,
  //           p,
  //           h1,
  //           h2,
  //           h3,
  //           h4,
  //           h5,
  //           h6,
  //           ul,
  //           ol,
  //           li {
  //             margin: 0;
  //             padding: 0;
  //           }

  //           body {
  //             font-family: Arial, sans-serif;
  //             line-height: 1.5;
  //             color: #333333;
  //           }

  //           /* Container */
  //           .container {
  //             max-width: 600px;
  //             margin: 0 auto;
  //             padding: 20px;
  //             background-color: #f5f5f5;
  //           }

  //           /* Heading */
  //           h1 {
  //             font-size: 24px;
  //             font-weight: bold;
  //             margin-bottom: 20px;
  //           }

  //           /* Paragraph */
  //           p {
  //             margin-bottom: 20px;
  //           }

  //           /* Button */
  //           .button {
  //             display: inline-block;
  //             padding: 10px 20px;
  //             background-color: #007bff;
  //             color: #ffffff;
  //             text-decoration: none;
  //             border-radius: 5px;
  //             margin-top:20px;
  //           }

  //           /* Footer */
  //           .footer {
  //             display:flex;
  //             justify-content: center;
  //             gap:20px;
  //             margin-top: 20px;
  //             padding-top: 20px;
  //             border-top: 1px solid #dddddd;
  //             text-align: center;

  //           }
  //           .footer p {
  //             line-height:40px
  //           }
  //           .logo {
  //       width:150px;
  //       height:30px;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="container">
  //           <h1>Welcome to Nedl</h1>

  //           <i>Use the provided reset key given below to reset your password.</i>

  //           <p>Reset Key: ${resetkey} <p>
  //           <div class="footer">

  //             <p>© 2023</p> <img class="logo" src="${this.UI_URL}/images/lattest/newlogo.png">.<p> All rights reserved.</p>

  //           </div>
  //         </div>
  //       </body>
  //       </html>

  //       `, // html body
  //       });

  //       console.log('Message sent: %s', info.messageId);
  //       // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //       // Preview only available when sending through an Ethereal account
  //       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  //       // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  //       return 'Successfully Emailed';
  //     }
  //   }
  //   @patch('/reset/password')
  //   @response(204, {
  //     description: 'password PATCH success',
  //   })
  //   async updateByre(
  //     @requestBody({
  //       content: {
  //         'application/json': {},
  //       },
  //     })
  //     passwordata: {
  //       password: string;
  //       resetkey: string;
  //     },
  //   ): Promise<any> {
  //     const data = await this.userRepository.find({
  //       where: {resetkey: passwordata.resetkey},
  //     });
  //     if (data.length < 1) {
  //       return 'Invalid reset key';
  //     }

  //     const password = await this.hasher.hashPassword(passwordata.password);
  //     console.log(password);
  //     await this.userRepository.dataSource.execute(`
  //  UPDATE ${this.DB_SCHEMA}.users
  //     SET   password = '${password}',resetkey=null where resetkey = '${passwordata.resetkey}'`);

  //     return 'reset successful';
  //   }
  //   @authenticate('jwt')
  //   @get('/users/org')
  //   @response(200, {
  //     description: 'Array of org ',
  //   })
  //   async market(): Promise<any> {
  //     const sql = await this.userRepository.dataSource.execute(
  //       `
  //     SELECT distinct agent_id from ${this.DB_SCHEMA}.users

  //     `,
  //     );

  //     return sql;
  //   }
}
