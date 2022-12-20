/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {LeadsRepository} from '../repositories';

export class MarketSummaryController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}
  DB_SCHEMA = process.env.DB_SCHEMA;

  @get('/marketIntelligence')
  @response(200, {})
  async findall(): Promise<any> {
    const alldata = await this.leadsRepository.dataSource.execute(`

select * from ${this.DB_SCHEMA}.market_intelligence
order by date

 `);
    return alldata;
  }

  @get('/marketIntelligence/liveFeeds')
  @response(200, {})
  async livefeeds(): Promise<any> {
    const feeds = await this.leadsRepository.dataSource.execute(`

    SELECT x.* FROM ${this.DB_SCHEMA}.market_intelligence_sales_feed x order by x.sale_date limit 10`);
    return feeds;
  }

  @get('/reportBuilderFilter')
  @response(200, {})
  async findfilter(): Promise<any> {
    const market = await this.leadsRepository.dataSource.execute(`

select distinct market from ${this.DB_SCHEMA}.report_builder`);
    const submarket = await this.leadsRepository.dataSource.execute(`

select distinct (submarket), market from ${this.DB_SCHEMA}.report_builder`);
    const status = await this.leadsRepository.dataSource.execute(`

    select distinct   property_special_status  from ${this.DB_SCHEMA}.report_builder order by property_special_status `);
    const impr_rating = await this.leadsRepository.dataSource.execute(`

    select distinct impr_rating from ${this.DB_SCHEMA}.report_builder `);
    const loc_rating = await this.leadsRepository.dataSource.execute(`

    select distinct loc_rating from ${this.DB_SCHEMA}.report_builder `);
    const p_name = await this.leadsRepository.dataSource.execute(`

    select distinct property_name from ${this.DB_SCHEMA}.report_builder `);
    const city = await this.leadsRepository.dataSource.execute(`

    select distinct city from ${this.DB_SCHEMA}.report_builder `);

    const data = {
      market,
      submarket,
      status,
      impr_rating,
      loc_rating,
      p_name,
      city,
    };

    return data;
  }
  @get('/segmentSummary/topmarket')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async find(@param.query.string('date') date?: string): Promise<any> {
    const data = [];
    const all = await this.leadsRepository.dataSource.execute(
      `
      select * from ${this.DB_SCHEMA}.tgt_market_segmentation_summary  where record_date between
      TIMESTAMP '${date}' - INTERVAL '5 months'
             and  TIMESTAMP '${date}'
      `,
    );
    const avgTrans = await this.leadsRepository.dataSource.execute(
      `
      select distinct market , avg(avg_transaction_rate) ,sum(no_of_transactions) from ${this.DB_SCHEMA}.tgt_market_segmentation_summary  where record_date between
      TIMESTAMP '${date}' - INTERVAL '5 months'
             and  TIMESTAMP '${date}'
     group by market
   order by avg(avg_transaction_rate) desc
      `,
    );
    const avgPropValue = await this.leadsRepository.dataSource.execute(
      `
      select distinct market , avg(avg_total_sale_price) ,sum(no_of_transactions) from ${this.DB_SCHEMA}.tgt_market_segmentation_summary  where record_date between
      TIMESTAMP '${date}' - INTERVAL '5 months'
             and  TIMESTAMP '${date}'
     group by market
   order by avg(avg_total_sale_price) desc
      `,
    );
    const avgRent = await this.leadsRepository.dataSource.execute(
      `
      select distinct market , avg(avg_rent_actual),sum(no_of_transactions)  from ${this.DB_SCHEMA}.tgt_market_segmentation_summary  where record_date between
      TIMESTAMP '${date}' - INTERVAL '5 months'
             and  TIMESTAMP '${date}'
     group by market
   order by avg(avg_rent_actual) desc
      `,
    );
    const avgOccu = await this.leadsRepository.dataSource.execute(
      `
      select  distinct market , avg(avg_occupancy_rate),sum(no_of_transactions)  from ${this.DB_SCHEMA}.tgt_market_segmentation_summary  where record_date between
      TIMESTAMP '${date}' - INTERVAL '11 months'
             and  TIMESTAMP '${date}'
             group by market
             order by avg(avg_occupancy_rate) desc
      `,
    );

    const marketFunnel = await this.leadsRepository.dataSource.execute(
      `
      select distinct "cluster" ,count ("market")  from ${this.DB_SCHEMA}.tgt_market_segmentation
      group  by "cluster"
      `,
    );
    data.push({
      avgOccu: avgOccu,
      avgTrans: avgTrans,
      avgRent: avgRent,
      avgPropValue: avgPropValue,
      all: all,
      marketFunnel: marketFunnel,
    });
    return data;
  }

  // @post('/segmentSummary')
  // @response(200, {
  //   description: 'Leads model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Leads)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Leads, {
  //           title: 'NewLeads',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   leads: Omit<Leads, 'id'>,
  // ): Promise<Leads> {
  //   return this.leadsRepository.create(leads);
  // }

  // @get('/segmentSummary/count')
  // @response(200, {
  //   description: 'Leads model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Leads) where?: Where<Leads>,
  // ): Promise<Count> {
  //   return this.leadsRepository.count(where);
  // }

  // @get('/segmentSummary')
  // @response(200, {
  //   description: 'Array of Leads model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Leads, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Leads) filter?: Filter<Leads>,
  // ): Promise<Leads[]> {
  //   return this.leadsRepository.find(filter);
  // }

  // @patch('/segmentSummary')
  // @response(200, {
  //   description: 'Leads PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Leads, {partial: true}),
  //       },
  //     },
  //   })
  //   leads: Leads,
  //   @param.where(Leads) where?: Where<Leads>,
  // ): Promise<Count> {
  //   return this.leadsRepository.updateAll(leads, where);
  // }

  // @get('/segmentSummary/{id}')
  // @response(200, {
  //   description: 'Leads model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Leads, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(Leads, {exclude: 'where'}) filter?: FilterExcludingWhere<Leads>
  // ): Promise<Leads> {
  //   return this.leadsRepository.findById(id, filter);
  // }

  // @patch('/segmentSummary/{id}')
  // @response(204, {
  //   description: 'Leads PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Leads, {partial: true}),
  //       },
  //     },
  //   })
  //   leads: Leads,
  // ): Promise<void> {
  //   await this.leadsRepository.updateById(id, leads);
  // }

  // @put('/segmentSummary/{id}')
  // @response(204, {
  //   description: 'Leads PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() leads: Leads,
  // ): Promise<void> {
  //   await this.leadsRepository.replaceById(id, leads);
  // }

  // @del('/segmentSummary/{id}')
  // @response(204, {
  //   description: 'Leads DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.leadsRepository.deleteById(id);
  // }
}
