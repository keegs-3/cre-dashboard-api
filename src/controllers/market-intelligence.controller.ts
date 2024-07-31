// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
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
    SELECT * from ${this.DB_SCHEMA}.app_livefeeds_vw order by document_recorded_date desc limit 20

    `,
    );

    return sql;
  }
  @get('/marketIntelligence/newsFeeds')
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
  async newsFeeds(): Promise<JSON> {
    const sql = await this.userRepository.dataSource.execute(
      `    SELECT * from ${this.DB_SCHEMA}.mi_news_feed order by date desc limit 20
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

  @get('/marketIntelligence/leadsAgeing')
  @response(200, {
    description: 'Array of Leads Ageing',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async ageing(
    @param.query.string('date') date?: string,
    @param.query.string('state') state?: string,
  ): Promise<any> {
    let statesd = '';
    if (state !== '' && state !== undefined) {
      statesd = `AND situs_state = '${state}'`;
    }

    // Query to get count
    const countQuery = `
    SELECT COUNT(*)
    FROM ${this.DB_SCHEMA}.leads_aging la
    WHERE la.year_of_analysis = $1
    ${statesd}
  `;
    const count = await this.userRepository.dataSource.execute(countQuery, [
      date,
    ]);

    // Query to get ageing data grouped by month
    const ageingQuery = `
    SELECT DATE_TRUNC('month', la2.deals_closed) AS month, COUNT(*)
    FROM ${this.DB_SCHEMA}.leads_aging la2
    WHERE la2.deals_closed BETWEEN
          (timestamp $1 - INTERVAL '6 months') AND
          (timestamp $1 - INTERVAL '1 month')
          ${statesd}
    GROUP BY DATE_TRUNC('month', la2.deals_closed)
    ORDER BY month;
  `;
    const ageing = await this.userRepository.dataSource.execute(ageingQuery, [
      date,
    ]);

    return {count, ageing};
  }
}
