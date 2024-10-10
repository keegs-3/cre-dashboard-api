import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings, RestServerConfig} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import dotenv from 'dotenv';
import path from 'path';
import {JWTStrategy} from './authentication-stratgies/jwt-stratgies';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from './keys';
import {MySequence} from './sequence';
import {BcryptHasher} from './services/hash.password';
import {JWTService} from './services/jwt-service';
// import {MyUserService} from '../.env';
import {MyUserService} from './services/user-service';
// import { SecurityHeadersComponent} from './middleware/setHeader.component';
export {ApplicationConfig};

export class CreaigithubApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // dotEnvExtended.load({
    //   path: '../.env',
    //   errorOnMissing: true,
    // });
    dotenv.config({debug: true});

    console.log(process.env.TOKEN_SECRET_VALUE, 'secret');
    // Set up the custom sequence

    // setup binding
    this.setupBinding();
    const corsOptions: RestServerConfig = {
      cors: {
        origin: '*', // Allow all origins, or specify allowed domains like 'http://localhost:3000'
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
      },
    };

    // Configure the rest server with CORS options
    this.configure('rest').to(corsOptions);
    // Add security spec
    // this.addSecuritySpec();
    // this.interceptor(SecurityheaderInterceptor);
    // this.middleware(securityHeadersMiddleware);
    // this.expressMiddleware(securityHeadersMiddleware);
    // this.expressMiddleware(securityHeadersMiddleware());
    // this.middleware(SecurityHeadersProvider);
    // this.expressMiddleware(securityHeadersMiddleware);
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);

    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // this.bind('service.hasher').toClass(BcryptHasher);
    // this.bind('rounds').to(10);
    // this.bind('service.user.service').toClass(MyUserService)
    // this.bind('service.jwt.service').toClass(JWTService);
    // this.bind('authentication.jwt.secret').to('dvchgdvcjsdbhcbdjbvjb');
    // this.bind('authentication.jwt.expiresIn').to('7h');

    const token = process.env.TOKEN_SECRET_VALUE;
  }

  setupBinding(): void {
    // this.bind('service.hasher').toClass(BcryptHasher);
    // this.bind('rounds').to(10);
    // this.bind('service.user.service').toClass(MyUserService)
    // this.bind('service.jwt.service').toClass(JWTService);
    // this.bind('authentication.jwt.secret').to('dvchgdvcjsdbhcbdjbvjb');
    // this.bind('authentication.jwt.expiresIn').to('7h');

    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );
    // this.component(SecurityHeadersComponent);
  }

  // addSecuritySpec(): void {
  //   this.api({
  //     openapi: '3.0.0',
  //     info: {
  //       title: 'test application',
  //       version: '1.0.0',
  //     },
  //     paths: {},
  //     components: {securitySchemes: SECURITY_SCHEME_SPEC},
  //     security: [
  //       {
  //         // secure all endpoints with 'jwt'
  //         jwt: [],
  //       },
  //     ],
  //     servers: [{url: '/'}],
  //   });
  // }
}
