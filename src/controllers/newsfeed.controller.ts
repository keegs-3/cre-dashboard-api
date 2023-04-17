/* eslint-disable no-case-declarations */
/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {repository} from '@loopback/repository';
import {get, response} from '@loopback/rest';
import {LeadsRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate("jwt")
export class NewsFeedController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}

  DB_SCHEMA = process.env.DB_SCHEMA;

  @get('/newsfeed')
  @response(200, {
    description: 'Array of News Feed model instances',
  })
  async newsfeed(): Promise<any> {
    const sql = this.leadsRepository.dataSource.execute(`

    SELECT * FROM ${this.DB_SCHEMA}.news_feed
    order by "date_of_feeds" desc
    limit 10
    `);
    console.log(sql);
    return sql;
  }
}
