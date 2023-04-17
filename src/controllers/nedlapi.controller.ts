/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {repository} from '@loopback/repository';
import {post, requestBody, response} from '@loopback/rest';
import {LeadsRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate("jwt")
export class NedlapiController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}

  DB_SCHEMA = process.env.DB_SCHEMA;

  @post('/nleadsapi')
  @response(200, {
    description: 'all apis for leads',
  })
  async leadsapi(
    @requestBody()
    required: {
      analyticscard: boolean;
      market: boolean;
      leadsfilter: boolean;
      charts: boolean;
      propertybuyers: boolean;
      buyerslist: {property_name: string; city: string};
      filter: {
        year: string;
        month: string;
        market: [];
        sale_propensity: [];
        status: [];
      };
    },
  ): Promise<any> {
    const leadsdata = [];
    const marq = "'" + required.filter.market.join("','") + "'";
    const propenq = "'" + required.filter.sale_propensity.join("','") + "'";
    const statuq = "'" + required.filter.status.join("','") + "'";
    // if everything is required
    if (
      required.market === true &&
      required.leadsfilter === true &&
      required.analyticscard === true &&
      required.charts === true &&
      required.propertybuyers === true
    ) {
      const market = await this.leadsRepository.dataSource.execute(`
  select distinct on (t.market) t.market from ${this.DB_SCHEMA}.tgt_lead_gen t
    `);

      const ldata = await this.leadsRepository.dataSource.execute(`select *
  from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
 order by property_id , inserted_date desc )
   tls on tlg.property_id =tls.property_id
  where
  extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
  and extract (month from tlg.last_update_date) = ('${required.filter.month}')
  and tlg.market in (${marq})
  and tlg.probability in (${propenq})
  and tls.status in (${statuq})
  order by case tlg.probability
  when 'Hot' then 1
  when 'Warm' then 2
  when 'Cold' then 3
  end
  `);
      const leads = await this.leadsRepository.dataSource.execute(`
  with anacard as (
    select *
  from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
 order by property_id , inserted_date desc )
   tls on tlg.property_id =tls.property_id
  where
  extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
  and extract (month from tlg.last_update_date) = ('${required.filter.month}')
  and tlg.market in (${marq})
  and tlg.probability in (${propenq})
  and tls.status  in ('lead')
  order by  tlg.probability

 )



select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
`);
      const inprogres = await this.leadsRepository.dataSource.execute(`
      with anacard as (
        select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
      where
      extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
      and extract (month from tlg.last_update_date) = ('${required.filter.month}')
      and tlg.market in (${marq})
      and tlg.probability in (${propenq})
      and tls.status in ('opportunity','negotiation','proposal')
      order by  tlg.probability

     )



    select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
    `);
      const deals = await this.leadsRepository.dataSource.execute(`
    with anacard as (
      select *
    from ${this.DB_SCHEMA}.tgt_lead_gen tlg
    left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
   order by property_id , inserted_date desc )
     tls on tlg.property_id =tls.property_id
    where
    extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
    and extract (month from tlg.last_update_date) = ('${required.filter.month}')
    and tlg.market in (${marq})
    and tlg.probability in (${propenq})
    and tls.status in ('deal')
    order by  tlg.probability

   )



  select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
  `);

      const notinterested = await this.leadsRepository.dataSource.execute(`
  with anacard as (
    select *
  from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
 order by property_id , inserted_date desc )
   tls on tlg.property_id =tls.property_id
  where
  extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
  and extract (month from tlg.last_update_date) = ('${required.filter.month}')
  and tlg.market in (${marq})
  and tlg.probability in (${propenq})
  and tls.status in ('notinterested')
  order by  tlg.probability

 )



select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
`);

      const totalclosing = await this.leadsRepository.dataSource.execute(`
with anacard as (
  select *
from ${this.DB_SCHEMA}.tgt_lead_gen tlg
left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
order by property_id , inserted_date desc )
 tls on tlg.property_id =tls.property_id
where
extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
and extract (month from tlg.last_update_date) = ('${required.filter.month}')
and tlg.market in (${marq})
and tlg.probability in (${propenq})
and tls.status in ('deal')
order by  tlg.probability

)



SELECT
sum(case when a.total_sale_price_mm  > 5 then 1 else 0 end) as overfive,
sum(case when a.total_sale_price_mm  < 10 then 1 else 0 end) as overten,
sum(case when a.total_sale_price_mm  < 5 then 1 else 0 end) as belowfive,
sum(a.total_sale_price_mm)
from anacard a
`);
      const year = required.filter.year + '-' + required.filter.month + '-01';
      console.log('year', year);
      const charts = await this.leadsRepository.execute(
        `select * from  ${this.DB_SCHEMA}.tgt_properties_metrics where market in (${marq}) and
    year_month between
      TIMESTAMP '${year}' - INTERVAL '6 months'
      and  TIMESTAMP '${year}' - INTERVAL '1 month'
   `,
      );
      const probability = await this.leadsRepository.dataSource.execute(
        `select distinct(probability) from ${this.DB_SCHEMA}.tgt_lead_gen`,
      );
      const date = await this.leadsRepository.dataSource.execute(`
    select distinct (last_update_date) at time zone 'UTC-6' from ${this.DB_SCHEMA}.tgt_lead_gen
      `);
      // const propertybuyerslist = await this.leadsRepository.execute(
      //   `select b.* ,bc.connected,bc.interested,bc.id as contact_id
      //   from ${this.DB_SCHEMA}.tgt_lead_buyers_recommendation b
      //   left join ${this.DB_SCHEMA}.buyers_contact bc  on b.property_id = bc.property_id and b.buyers_name = bc.buyer_name
      //   where property_name in (${marq}) and city in (${cityq})
      //   `
      // )
      // const profilecharts = await this.leadsRepository.dataSource.execute(`
      // select * from  ${this.DB_SCHEMA}.tgt_properties_metrics_new where property_id = '${property_id}' and
      //   year_month between
      //     TIMESTAMP '${year}' - INTERVAL '7 months'
      //     and  TIMESTAMP '${year}' - INTERVAL '1 month'
      //     order by year_month asc
      // `);
      leadsdata.push({
        market: market,
        probability: probability,
        date: date,
        leadsdata: ldata,
        analyticscard: {
          leads: leads,
          inprogres: inprogres,
          totalclosing: totalclosing,
          notinterested: notinterested,
          deals: deals,
        },
        charts: charts,
      });
      return leadsdata;
    }
    // if only leads data required
    else if (
      required.market === false &&
      required.leadsfilter === true &&
      required.analyticscard === false &&
      required.charts === false &&
      required.propertybuyers === false
    ) {
      const ldata = await this.leadsRepository.dataSource.execute(`select *
    from ${this.DB_SCHEMA}.tgt_lead_gen tlg
    left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
   order by property_id , inserted_date desc )
     tls on tlg.property_id =tls.property_id
    where
    extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
    and extract (month from tlg.last_update_date) = ('${required.filter.month}')
    and tlg.market in (${marq})
    and tlg.probability in (${propenq})
    and tls.status in (${statuq})
    order by case tlg.probability
    when 'Hot' then 1
    when 'Warm' then 2
    when 'Cold' then 3
    end
    `);
      return {leadsdata: ldata};
    } else if (
      required.market === false &&
      required.leadsfilter === false &&
      required.analyticscard === true &&
      required.charts === true &&
      required.propertybuyers === false
    ) {
      const leads = await this.leadsRepository.dataSource.execute(`
      with anacard as (
        select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
      where
      extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
      and extract (month from tlg.last_update_date) = ('${required.filter.month}')
      and tlg.market in (${marq})
      and tlg.probability in (${propenq})
      and tls.status  in ('lead')
      order by  tlg.probability

     )



    select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
    `);
      const inprogres = await this.leadsRepository.dataSource.execute(`
          with anacard as (
            select *
          from ${this.DB_SCHEMA}.tgt_lead_gen tlg
          left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
         order by property_id , inserted_date desc )
           tls on tlg.property_id =tls.property_id
          where
          extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
          and extract (month from tlg.last_update_date) = ('${required.filter.month}')
          and tlg.market in (${marq})
          and tlg.probability in (${propenq})
          and tls.status in ('opportunity','negotiation','proposal')
          order by  tlg.probability

         )



        select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
        `);
      const deals = await this.leadsRepository.dataSource.execute(`
        with anacard as (
          select *
        from ${this.DB_SCHEMA}.tgt_lead_gen tlg
        left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
       order by property_id , inserted_date desc )
         tls on tlg.property_id =tls.property_id
        where
        extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
        and extract (month from tlg.last_update_date) = ('${required.filter.month}')
        and tlg.market in (${marq})
        and tlg.probability in (${propenq})
        and tls.status in ('deal')
        order by  tlg.probability

       )



      select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
      `);

      const notinterested = await this.leadsRepository.dataSource.execute(`
      with anacard as (
        select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
      where
      extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
      and extract (month from tlg.last_update_date) = ('${required.filter.month}')
      and tlg.market in (${marq})
      and tlg.probability in (${propenq})
      and tls.status in ('notinterested')
      order by  tlg.probability

     )



    select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
    `);

      const totalclosing = await this.leadsRepository.dataSource.execute(`
    with anacard as (
      select *
    from ${this.DB_SCHEMA}.tgt_lead_gen tlg
    left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
    order by property_id , inserted_date desc )
     tls on tlg.property_id =tls.property_id
    where
    extract (YEAR FROM tlg.last_update_date) = ('${required.filter.year}')
    and extract (month from tlg.last_update_date) = ('${required.filter.month}')
    and tlg.market in (${marq})
    and tlg.probability in (${propenq})
    and tls.status in ('deal')
    order by  tlg.probability

    )



    SELECT
    sum(case when a.total_sale_price_mm  > 5 then 1 else 0 end) as overfive,
    sum(case when a.total_sale_price_mm  < 10 then 1 else 0 end) as overten,
    sum(case when a.total_sale_price_mm  < 5 then 1 else 0 end) as belowfive,
    sum(a.total_sale_price_mm)
    from anacard a
    `);
      const year = required.filter.year + '-' + required.filter.month + '-01';
      console.log('year', year);
      const charts = await this.leadsRepository.execute(
        `select * from  ${this.DB_SCHEMA}.tgt_properties_metrics where market in (${marq}) and
  year_month between
    TIMESTAMP '${year}' - INTERVAL '6 months'
    and  TIMESTAMP '${year}' - INTERVAL '1 month'
 `,
      );

      return {
        analyticscard: {
          leads: leads,
          inprogres: inprogres,
          totalclosing: totalclosing,
          notinterested: notinterested,
          deals: deals,
        },
        charts: charts,
      };
    }
  }
  @post('/ownersprofile')
  @response(200, {
    description: 'all apis for owner profile',
  })
  async ownersprofile(
    @requestBody()
    required: {
      segment: boolean;
      state: boolean;
      buyersprofile: boolean;
      funnel: boolean;
      usmap: boolean;
      ownerstransaction: boolean;
      filter: {
        segment: [];
        state: [];
      };
    },
  ): Promise<any> {
    if (
      required.buyersprofile === true &&
      required.segment === true &&
      required.state === true &&
      required.funnel === true &&
      required.usmap === true &&
      required.ownerstransaction === true
    ) {
      const segments = "'" + required.filter.segment.join("','") + "'";
      const states = "'" + required.filter.state.join("','") + "'";
      const ownersprofile = [];
      const segment = await this.leadsRepository.dataSource.execute(`
    select distinct owner_segment from ${this.DB_SCHEMA}.tgt_owner_profiles
`);
      const city = await this.leadsRepository.dataSource.execute(
        `select distinct owner_state from ${this.DB_SCHEMA}.tgt_owner_profiles
  `,
      );
      const buyersprofile = await this.leadsRepository.dataSource.execute(`
      select  count(owner)as "total_owners", sum(total_property_owned) as "total_property_owned", avg(avg_monetary) as "average_dollar_value"
       from ${this.DB_SCHEMA}.tgt_owner_profiles top where owner_segment in (${segments}) and owner_state in (${states})

      `);

      const funnelchart = await this.leadsRepository.dataSource.execute(`
select top.owner_segment,count(top."owner") from ${this.DB_SCHEMA}.tgt_owner_profiles top
where top.owner_state in (${states})and top.owner_segment in (${segments})
group by top.owner_segment
order by count(top."owner") desc`);
      // select gll.state_abbrevation ,count(top."owner") ,top.owner_segment ,top.owner_city,gll.latitude ,gll.longitude from ${this.DB_SCHEMA}.geo_lat_long gll
      // join ${this.DB_SCHEMA}.tgt_owner_profiles top on gll.state_abbrevation  = top.owner_state
      // where top.owner_state in (${states})and top.owner_segment in (${segments})
      // group by gll.state_abbrevation ,top.owner_segment ,top.owner_city ,gll.latitude ,gll.longitude
      const usamap = await this.leadsRepository.dataSource.execute(`
        select owner_state
, sum(total_property_owned) as "sumoftotalproperty"
, sum(avg_monetary)/count(owner_name) as "avgofmonitary"
,count(owner_name) as "ownerscount"
from ${this.DB_SCHEMA}.tgt_owner_profiles top
group by owner_state
        `);

      const ownerstransaction = await this.leadsRepository.dataSource.execute(`
select  *
 from ${this.DB_SCHEMA}.tgt_owner_profiles top where owner_segment in (${segments}) and owner_state in (${states})
 order by total_property_owned desc

`);

      ownersprofile.push({
        segment: segment,
        state: city,
        buyersprofile: buyersprofile,
        funnelchart: funnelchart,
        usamap: usamap,
        ownerstransaction: ownerstransaction,
      });

      return ownersprofile;
    } else if (
      required.buyersprofile === false &&
      required.segment === false &&
      required.state === false &&
      required.funnel === false &&
      required.usmap === true &&
      required.ownerstransaction === false
    ) {
      const usamap = await this.leadsRepository.dataSource.execute(`
      select owner_state
, sum(total_property_owned) as "sumoftotalproperty"
, sum(avg_monetary)/count(owner_name) as "avgofmonitary"
,count(owner_name) as "ownerscount"
from ${this.DB_SCHEMA}.tgt_owner_profiles top
group by owner_state
      `);
      return usamap;
    }
  }

  @post('/usersession/userdata')
  @response(200, {
    description: 'all apis for owner profile',
  })
  async usersession(
    @requestBody()
    required: {
      startdate?: string;
      enddate?: string;
      loginname?: string;
      user?: [];
    },
  ): Promise<any> {
    // const users = "'" + required.user!.join("','") + "'";
    const agentMap = await this.leadsRepository.execute(`
    select * from cre.users u where u.username = '${required.loginname}'
    `);

    // where u.agent_map_to = '${name}'
    if (agentMap[0].role === 'super admin') {
      const roledata = await this.leadsRepository.execute(
        `
        with days as (
          SELECT date_trunc('day', dd):: date as day
         FROM generate_series
         ( '${required.startdate}'::timestamp
         , '${required.enddate}'::timestamp
         , '1 day'::interval) as dd
         )
         ,
         total as(
         select
            days.day,
            us."name" ,
           count(us.starttime) over (partition by days.day),
           sum (age(endtime,starttime) ) over ( partition  by days.day) as totaltime,
           sum (age(endtime,starttime) ) over ( partition  by days.day)/count (days.day)
           over ( partition  by days.day) as averagetimetaken
         from days
         left join ${this.DB_SCHEMA}.user_session us on date_trunc('day', us.starttime) = days.day
         where endtime is not null and us.name  in ( select distinct name  from ${this.DB_SCHEMA}.user_session us
         left join ${this.DB_SCHEMA}.users u on u.username = us."name")
         and  us.starttime between '${required.startdate}' and '${required.enddate}'
         group by days.day ,us."name" ,us.starttime ,us.endtime
         ),

         distinctt as (
         select distinct * from total
         )
         select days.day as days ,distinctt.* from days left join distinctt on days.day = distinctt.day
        `,
      );
      return roledata;
    } else if (agentMap[0].role === 'admin') {
      const roledata = await this.leadsRepository.execute(
        `
        with days as (
          SELECT date_trunc('day', dd):: date as day
         FROM generate_series
         ( '${required.startdate}'::timestamp
         , '${required.enddate}'::timestamp
         , '1 day'::interval) as dd
         )
         ,
         total as(
         select
            days.day,
            us."name" ,
           count(us.starttime) over (partition by days.day),
           sum (age(endtime,starttime) ) over ( partition  by days.day) as totaltime,
           sum (age(endtime,starttime) ) over ( partition  by days.day)/count (days.day)
           over ( partition  by days.day) as averagetimetaken
         from days
         left join ${this.DB_SCHEMA}.user_session us on date_trunc('day', us.starttime) = days.day
         where endtime is not null and us.name  in ( select distinct name  from ${this.DB_SCHEMA}.user_session us
         left join ${this.DB_SCHEMA}.users u on u.username = us."name"  where u.agent_map_to = '${required.loginname}')
         and  us.starttime between '${required.startdate}' and '${required.enddate}'
         group by days.day ,us."name" ,us.starttime ,us.endtime
         ),

         distinctt as (
         select distinct * from total
         )
         select days.day as days ,distinctt.* from days left join distinctt on days.day = distinctt.day
        `,
      );
      return roledata;
    } else {
      const sql = await this.leadsRepository.execute(
        `
    with days as (
      SELECT date_trunc('day', dd):: date as day
     FROM generate_series
             ( '${required.startdate}'::timestamp
             , '${required.enddate}'::timestamp
             , '1 day'::interval) as dd
     )
     ,
     total as(
     select
        days.day,
        us."name" ,
       count(us.starttime) over (partition by days.day),
       sum (age(endtime,starttime) ) over ( partition  by days.day) as totaltime,
       sum (age(endtime,starttime) ) over ( partition  by days.day)/count (days.day)over ( partition  by days.day) as averagetimetaken
     from days
     left join ${this.DB_SCHEMA}.user_session us on date_trunc('day', us.starttime) = days.day
     where endtime is not null and us.name  in (${required.loginname}}
     )
     and  us.starttime between '${required.startdate}' and '${required.enddate}'
     group by days.day ,us."name" ,us.starttime ,us.endtime
     ),

     distinctt as (
     select distinct * from total
     )
     select days.day as days ,distinctt.* from days left join distinctt on days.day = distinctt.day
    `,
      );
      return sql;
    }
  }
}
