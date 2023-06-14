/* eslint-disable no-case-declarations */
/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {LeadsRepository} from '../repositories';
@authenticate("jwt")
export class NewsFeedController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}

  DB_SCHEMA = process.env.DB_SCHEMA;


}
