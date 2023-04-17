import {HttpErrors} from '@loopback/rest';
import {Credentials} from '../repositories/user.repository';

export function validateCredentials(credentials: Credentials) {
  // if (credentials.email.length < 8) {
  //   throw new HttpErrors.UnprocessableEntity('Username leangth must be atleast 8 or greater ');
  // }
  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity('password length should be greater than 8')
  }
}
