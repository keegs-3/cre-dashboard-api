/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {LeadsRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('jwt')
export class MarketSummaryController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}
  DB_SCHEMA = process.env.DB_SCHEMA;

  @get('/marketIntelligence/byState')
  @response(200, {})
  async findBySate(
    @param.query.string('state') state?: string,
  ): Promise<any> {
    const allData = await this.leadsRepository.dataSource.execute(`
    select "date", avg(avg_transaction_rate)as atr, avg(avg_transaction_size) as ats, avg(avg_rental_rate) as arr, avg(avg_occupancy_rate) as aor,sale_amount as sa,deals_closed as dc,leads_generated as lg from ${this.DB_SCHEMA}.vw_mi_allmetrics
    WHERE "date" BETWEEN NOW() - INTERVAL '5 MONTH' AND NOW() and property_state = '${state}'
 group by "date",leads_generated,deals_closed,sale_amount
    order by "date" desc
 `);
//  const monthlyRevenue = await this.leadsRepository.dataSource.execute(`
//  select "date", sum (sale_amount) from ${this.DB_SCHEMA}.vw_mi_allmetrics
//     WHERE "date" BETWEEN NOW() - INTERVAL '5 MONTH' AND NOW() and property_state = '${state}'
//     group by "date"
//     order by "date"
// `);
// const avgTS = await this.leadsRepository.dataSource.execute(`
// select "date", sum (avg_transaction_size) from ${this.DB_SCHEMA}.vw_mi_allmetrics
//    WHERE "date" BETWEEN NOW() - INTERVAL '5 MONTH' AND NOW() and property_state = '${state}'
//    group by "date"
//    order by "date"
// `);
// const avgTR = await this.leadsRepository.dataSource.execute(`
// select "date", sum (avg_transaction_rate) from ${this.DB_SCHEMA}.vw_mi_allmetrics
//    WHERE "date" BETWEEN NOW() - INTERVAL '5 MONTH' AND NOW() and property_state = '${state}'
//    group by "date"
//    order by "date"
// `);
// const avgRR = await this.leadsRepository.dataSource.execute(`
// select "date", sum (avg_rental_rate) from ${this.DB_SCHEMA}.vw_mi_allmetrics
//    WHERE "date" BETWEEN NOW() - INTERVAL '5 MONTH' AND NOW() and property_state = '${state}'
//    group by "date"
//    order by "date"
// `);
// const avgOR = await this.leadsRepository.dataSource.execute(`
// select "date", sum (avg_occupancy_rate) from ${this.DB_SCHEMA}.vw_mi_allmetrics
//    WHERE "date" BETWEEN NOW() - INTERVAL '5 MONTH' AND NOW() and property_state = '${state}'
//    group by "date"
//    order by "date"
// `);
// const slead = await this.leadsRepository.dataSource.execute(`
// select "date", sum (leads_generated) from ${this.DB_SCHEMA}.vw_mi_allmetrics
//    WHERE "date" BETWEEN NOW() - INTERVAL '5 MONTH' AND NOW() and property_state = '${state}'
//    group by "date"
//    order by "date"
// `);

    return {
    allData

    };
  }
  @get('/marketIntelligence')
  @response(200, {})
  async findall(): Promise<any> {
    const alldata = await this.leadsRepository.dataSource.execute(`

    select "date", avg(avg_transaction_rate)as atr, avg(avg_transaction_size) as ats, avg(avg_rental_rate) as arr, avg(avg_occupancy_rate) as aor,sum(leads_generated) as lg,
 sum(deals_closed) as dc,sum(sale_amount) as sa
 from ${this.DB_SCHEMA}.vw_mi_allmetrics
    WHERE "date" BETWEEN NOW() - INTERVAL '5 MONTH' AND NOW()
    group by "date"
    order by "date" desc
 `);

    return alldata;
  }
  @get('/marketIntelligence/realTime')
  @response(200, {})
  async findTime(
    @param.query.string('org') org?: string,
  ): Promise<any> {
    const alldata = await this.leadsRepository.dataSource.execute(`

    SELECT
    luov.state,
    SUM(luov.deal_value) AS dealClosed,
    DATE_TRUNC('month', luov.insert_date) AS month,
    COUNT(CASE WHEN luov.status = 'CLOSED' THEN 1 END) AS closedCount,
    COUNT(CASE WHEN luov.status = 'UNDER AGREEMENT' OR luov.status = 'LISTED' THEN 1 END) AS underContracts,
    COUNT(CASE WHEN (CURRENT_DATE - luov.insert_date) > INTERVAL '90 days' THEN 1 END) AS expiredContracts
  FROM
    ${this.DB_SCHEMA}.lead_user_org_vw luov
  WHERE
    (luov.tax_assessor_id, luov.insert_date) IN (
      SELECT
        tax_assessor_id,
        MAX(insert_date)
      FROM
        ${this.DB_SCHEMA}.lead_user_org_vw
      WHERE
        agent_id = '${org}'
      GROUP BY
        tax_assessor_id
    )
  GROUP BY
    luov.state,
    month;
 `);
    return alldata;
  }

  @get('/marketIntelligence/liveFeeds')
  @response(200, {})
  async livefeeds(): Promise<any> {
    // property_name,document_amount,document_recorded_date
    const feeds = await this.leadsRepository.dataSource.execute(`

    select
	document_recorded_date,
	document_amount,
	property_address,
	property_city,
	property_state,
	property_zip,
	market,
	property_asset_class,
	property_name,
	unit_count,
	buyer,
	seller,
	sale_type,
	loan_amount_mm,
	latitude,
	longitude
from
	${this.DB_SCHEMA}.vw_recorder
	where sale_type not in ('Unpublished','Portfolio')
order by
	document_recorded_date desc
  limit 15
    `);
    return feeds;
  }
  @get('/marketIntelligence/newsFeeds')
  @response(200, {})
  async newsfeeds(): Promise<any> {
    const feeds = await this.leadsRepository.dataSource.execute(`

    select * from ${this.DB_SCHEMA}.mi_news_feed
order by date_of_feeds desc
limit 15
    `);
    return feeds;
  }

  @get('/userEngagement')
  @response(200, {})
  async usersdetails(

    @param.query.string('organization') organization?: string ,
    @param.query.string('users') users?: string ,
    @param.query.string('page') page?: string ,
    @param.query.number('sdate') sdate?: number ,



  ): Promise<any> {
    const u = users?.split(',');
       const uc = "'" + u?.join("','") + "'";
       const p = page?.split(',');
       const pc = "'" + p?.join("','") + "'";


    let userd='';
    let usera='';
    let paged='';
    let pagea='';
    let tdate='';
    let ndate='';


    if (
    users !== '' &&
    users !== undefined

    ) {
    userd = `AND (ust.username in (${uc}))`;
    usera = `AND (u.username in (${uc}))`;
    }
    if (
      page !== '' &&
      page !== undefined

      ) {
      paged = `AND (ust.page in (${pc}))`;
      pagea =  `AND (u.actions ->> 'page' in(${pc}) )`
      }


      if (
        sdate === 1

        ) {
        tdate = `day`;
        ndate=`6 day`;
        }
        if (
          sdate === 6

          ) {
          tdate = `month`;
          ndate=`5 month`;
          }
          if (
            sdate === 12

            ) {
            tdate = `month`;
            ndate=`11 month`;
            }

const a = `
select DISTINCT ON (DATE_TRUNC('${tdate}', u.inserted_on))DATE_TRUNC('${tdate}', u.inserted_on) AS truncated_date,
COUNT(*) OVER (PARTITION BY DATE_TRUNC('${tdate}', u.inserted_on)) AS total_action_eachday
from ${this.DB_SCHEMA}.user_action_by_org u
where organization='${organization}'
and u.inserted_on >= current_date - interval  '${ndate}'
${pagea}${usera}
order by DATE_TRUNC('${tdate}', u.inserted_on) desc
`;
        const t = `select
        DATE_TRUNC('${tdate}',
        ust.inserted_on) as truncated_date,
        SUM(extract(EPOCH from ust.total_time) / 60) as total_time_inminute_eachmonth,
        count (distinct ust.session)as totalsession,
	count (distinct ust.username) totaluser
      from
        ${this.DB_SCHEMA}.user_data_group_by_org ust
      where
        ust.organization = '${organization}'
        and ust.inserted_on >= CURRENT_DATE - interval '${ndate}'
        ${userd}
        ${paged}
      group by
        truncated_date
      order by
        truncated_date desc;


        `;
        console.log('months data',t);
      const trend  = await this.leadsRepository.dataSource.execute(`${t}`);
      const action  = await this.leadsRepository.dataSource.execute(`${a}`);


    const mapData = await this.leadsRepository.dataSource.execute(
      `
      select state , count(distinct "username")  from ${this.DB_SCHEMA}.user_data_group_by_org
      where organization = '${organization}'
group by state
    `
    );
    const daysUsersData = await this.leadsRepository.dataSource.execute(
      `
      SELECT DISTINCT ON (DATE_TRUNC('day', ust.inserted_on))
      DATE_TRUNC('day', ust.inserted_on) AS truncated_date,
      SUM(EXTRACT(EPOCH FROM ust.total_time) / 60) OVER (PARTITION BY DATE_TRUNC('day', ust.inserted_on)) AS total_time_eachday,
      (select COUNT(distinct us.session) AS total_session
      from ${this.DB_SCHEMA}.user_data_group_by_org us
      where DATE_TRUNC('day', ust.inserted_on) = DATE_TRUNC('day', us.inserted_on)
      and us.organization = '${organization}'
      ),
      (select COUNT(distinct us.username)
      from ${this.DB_SCHEMA}.user_data_group_by_org us
      where DATE_TRUNC('day', ust.inserted_on) = DATE_TRUNC('day', us.inserted_on)
      and us.organization = '${organization}'
      )
  FROM ${this.DB_SCHEMA}.user_data_group_by_org ust
  WHERE ust.organization = '${organization}'
  GROUP BY ust.session,
  DATE_TRUNC('day', ust.inserted_on), ust.total_time,ust.inserted_on
  order by DATE_TRUNC('day', ust.inserted_on) desc
  limit 7
    `
    );



    const actionEachDay  = await this.leadsRepository.dataSource.execute(
      `
      select DISTINCT ON (DATE_TRUNC('day', u.inserted_on))DATE_TRUNC('day', u.inserted_on) AS truncated_date,
COUNT(*) OVER (PARTITION BY DATE_TRUNC('day', u.inserted_on)) AS total_action_eachday
from ${this.DB_SCHEMA}.user_action_by_org u
where organization='${organization}'
order by DATE_TRUNC('day', u.inserted_on) desc
limit 7
    `
    );
    const sessionUserTime = await this.leadsRepository.dataSource.execute(
      `
      SELECT
      DISTINCT ust.username,
      ust.firstname,
      ust.lastname,
      DATE_TRUNC('day', ust.inserted_on) AS truncated_date,
      SUM(EXTRACT(EPOCH FROM ust.total_time) / 60) OVER (PARTITION BY ust.username, DATE_TRUNC('day', ust.inserted_on)) AS total_time_eachday,
      (
        SELECT COUNT(DISTINCT us.session) AS total_session
        FROM ${this.DB_SCHEMA}.user_data_group_by_org us
        WHERE DATE_TRUNC('day', ust.inserted_on) = DATE_TRUNC('day', us.inserted_on)
          AND ust.username = us.username
      ) AS total_session
    FROM ${this.DB_SCHEMA}.user_data_group_by_org ust
    WHERE ust.organization = '${organization}'
    AND ust.inserted_on >= CURRENT_DATE - INTERVAL '6 days'
    GROUP BY ust.username, ust.inserted_on, ust.total_time, ust.state, ust.firstname, ust.lastname
    ORDER BY truncated_date DESC;
    `
    );
    const data = {
      actionEachDay,
      daysUsersData,
      mapData,
      sessionUserTime,
      trend,
      action
    };

    return data;
  }
  @get('/userEngagement/old')
  @response(200, {})
  async usersdetailsold(): Promise<any> {
    const mapData = await this.leadsRepository.dataSource.execute(
      `
      select state , count(distinct "userName")  from ${this.DB_SCHEMA}.user_engagement ue
group by state
    `,
    );
    const daysUsersData = await this.leadsRepository.dataSource.execute(
      `
      select
"userName" ,
"Date" ,
((avg("sessionTime"))/60):: numeric (1000,2) as avgsessiontimeinhrs,
count("sessionTime")
from ${this.DB_SCHEMA}.user_engagement ue
where "Date" > now() - interval '8 days' and "Date" < now() - interval '1 day'
group by "userName" ,"Date"
order by "Date"  desc
    `,
    );

    const devicesDetails = await this.leadsRepository.dataSource.execute(
      `
      select device,count(ue.device)  from ${this.DB_SCHEMA}.user_engagement ue
      where "Date" > now() - interval '6 month' and "Date" < now() - interval '1 month'
      group by device
    `,
    );

    const monthlyAction = await this.leadsRepository.dataSource.execute(
      `
      select
DATE_TRUNC('day',ue."Date") as monthYear ,
count(distinct ue."userName") as totalUsers,
count(ue."sessionTime") as totalSessions,
sum(ue."sessionTime")::numeric (1000,2)as sumtotalSessions,
((sum(ue."sessionTime")::numeric (1000,2)/count(distinct ue."userName"))/60):: numeric (1000,2) as avgSessionTimeInHours,
sum(ue.actions) as sumActions,
sum(ue.actions)::numeric (1000,2)/count(distinct ue."userName")  as averageActions
from ${this.DB_SCHEMA}.user_engagement ue
where "Date" > now() - interval '6 days' and "Date" < now() - interval '1 day'
group by  monthYear
    `,
    );
    const dayTimeOnApp = await this.leadsRepository.dataSource.execute(
      `
      select DATE_TRUNC('day',ue."Date") as monthday,
      count(ue."sessionTime") as totalsession ,
      sum(ue."sessionTime") as sumtotalsessioninminute,
      sum(ue."sessionTime")/count(distinct ue."userName") as averagesession,
      count(distinct ue."userName") as totalusersperday
      from ${this.DB_SCHEMA}.user_engagement ue
      where "Date" > now() - interval '8 days' and "Date" < now() - interval '1 day'
      group by monthday
      order by monthday desc
    `,
    );
    const data = {
      devicesDetails,
      monthlyAction,
      dayTimeOnApp,
      daysUsersData,
      mapData,
    };

    return data;
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
