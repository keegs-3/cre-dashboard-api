import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, RedirectRoute} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Request} from 'express';
import {ParamsDictionary} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {TokenServiceBindings} from '../keys';
import {JWTService} from '../services/jwt-service';
import {LoginsessionRepository} from '../repositories';
import {repository} from '@loopback/repository';

export class JWTStrategy implements AuthenticationStrategy {
  name: string = 'jwt';

  @repository(LoginsessionRepository)
  public loginSession: LoginsessionRepository;
  @inject(TokenServiceBindings.TOKEN_SERVICE)
  public jwtService: JWTService;

  async authenticate(request: Request<ParamsDictionary, any, any, ParsedQs>):
    Promise<UserProfile | RedirectRoute | undefined> {

    const token: string = this.extractCredentials(request);
    const userProfile = await this.jwtService.verifyToken(token);
    const usertoken = await this.loginSession.findOne({
      where: {token:token}
    });
    if (!usertoken){
      throw new HttpErrors.Unauthorized(`This token has expired`)
    }
    return Promise.resolve(userProfile);

  }

  extractCredentials(request: Request<ParamsDictionary, any, any, ParsedQs>): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header is missing');
    }
    const authHeaderValue = request.headers.authorization;

    // authorization : Bearer xxxx.yyyy.zzzz
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized('Authorization header is not type of Bearer');
    }
    // const tokenc: string = this.extractCredentials(request);

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(`Authorization header has too many part is must follow this patter 'Bearer xx.yy.zz`)
    }
    const token = parts[1];

    return token;
  }

}
