import {HttpErrors} from '@loopback/rest';
import {Credentials} from '../repositories/user.repository';
export function validateCredentials(credentials: Credentials) {


  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity('password length should be greater than 8')
  }
}
