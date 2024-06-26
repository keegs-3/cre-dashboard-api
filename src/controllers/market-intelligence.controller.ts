// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {get, response} from '@loopback/rest';
import {UserRepository} from '../repositories';

// import {inject} from '@loopback/core';


export class MarketIntelligenceController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}
  DB_SCHEMA = process.env.DB_SCHEMA;
  @get('/marketIntelligence/liveFeedsTicker')
  @response(200, {
    description: 'Array of Live Feeds Tickers',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async liveFeeds(): Promise<JSON> {
    const sql = await this.userRepository.dataSource.execute(
      `
    SELECT * from ${this.DB_SCHEMA}.vw_recorder limit 20

    `,
    );

    return sql;
  }
  @get('/marketIntelligence/all')
  @response(200, {
    description: 'Array of Market data',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async all(): Promise<JSON> {
    const sql = await this.userRepository.dataSource.execute(
      `
   SELECT *
FROM ${this.DB_SCHEMA}.market_kpis
WHERE to_date(recording_month, 'YYYY-MM-DD') BETWEEN (current_date - INTERVAL '6 months') AND (current_date - INTERVAL '1 month')
ORDER BY to_date(recording_month, 'YYYY-MM-DD') DESC;

    `,
    );

    return sql;
  }
}
