/* eslint-disable no-case-declarations */
/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {repository} from '@loopback/repository';
import {get, HttpErrors, param, response} from '@loopback/rest';
import {LeadsRepository} from '../repositories';
// @authenticate("jwt")
export class LeadsController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}

  DB_SCHEMA = process.env.DB_SCHEMA;
  @get('/leads/byStatus')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async leads(
    @param.query.string('status') status?: string,
  ): Promise<any> {
   const funnel =  await this.leadsRepository.dataSource.execute(`
   select *
from ${this.DB_SCHEMA}.tgt_lead_gen tlg
left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
order by property_id , inserted_date desc )
 tls on tlg.property_id =tls.property_id
where
 tls.status = '${status}'
order by tlg.owner_name
limit 50
`);
return funnel;

  }
  @get('/leads/buyers/byPropertyId')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async buyersid(
    @param.query.string('propertyId') propertyId?: string,
  ): Promise<any> {
   const funnel =  await this.leadsRepository.dataSource.execute(`
   select tlbr.*,most_recent_buyer.connected,most_recent_buyer.interested  from ${this.DB_SCHEMA}.tgt_lead_buyers_recommendation tlbr left join
(
	select * from ${this.DB_SCHEMA}.buyers_contact bc
	where date in (
	select max(date) from ${this.DB_SCHEMA}.buyers_contact b group by property_id
			)
) as most_recent_buyer
on tlbr.property_id = most_recent_buyer.property_id and tlbr.buyers_name = most_recent_buyer.buyer_name
where tlbr.property_id = '${propertyId}'
`);
return funnel;

  }
  @get('/buyerseller/map')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async map(
    @param.query.string('segment') segment?: string,
  ): Promise<any> {
   const funnel =  await this.leadsRepository.dataSource.execute(`
   select owner_state , count(distinct owner_name)as owner_name
from ${this.DB_SCHEMA}.sellers_buyers_details sbd
where segment = '${segment}'
group by owner_state
`);
return funnel;

  }
  @get('/buyerseller/topFive')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async topFive(

  ): Promise<any> {
   const buyersr =  await this.leadsRepository.dataSource.execute(`
   select buyers,count(buyers) ,
COALESCE((select Json_agg(row_to_json(t1))
      from ( select br.buyer_leads from ${this.DB_SCHEMA}.buyer_recommendation br
      where br.buyers = b.buyers
       )t1),
      '[]')as "cohortdetails"
from ${this.DB_SCHEMA}.buyer_recommendation b
group by b.buyers
order by count(buyers) desc
limit 5
`);
const sellerr =  await this.leadsRepository.dataSource.execute(`
select seller,count(seller) ,
COALESCE((select Json_agg(row_to_json(t1))
   from ( select br.seller_leads from ${this.DB_SCHEMA}.seller_recommendation br
   where br.seller = b.seller
    )t1),
   '[]')as "cohortdetails"
from ${this.DB_SCHEMA}.seller_recommendation b
group by b.seller
order by count(seller) desc
limit 5
`);
return {buyersr,sellerr};

  }
  @get('/buyerseller/card')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async bschart(

  ): Promise<any> {
   const funnel =  await this.leadsRepository.dataSource.execute(`
   select segment , count(distinct owner_name)as owner_name,
    sum(total_property_owned)as total_property_owned,
sum("M12_Highest_Transaction")as "M12_Highest_Transaction",
round( avg(dollar_value),2)  as avgDollarValue
from ${this.DB_SCHEMA}.sellers_buyers_details sbd
group by segment
`);
return funnel;

  }
  @get('/deals/aibased')
  @response(200, {
    description: 'Array of aibased model instances',
  })
  async aibased(
    @param.query.number('quater') quater?: number,
  ): Promise<any> {
   const aibased =  await this.leadsRepository.dataSource.execute(`
   select * from ${this.DB_SCHEMA}.deal_analytics_recommendations dar
where "Increase %" = ${quater}
`);
return aibased;

  }
  @get('/deals/leadsactual')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async leadsactual(
    @param.query.number('quater') quater?: number,
  ): Promise<any> {
   const funnel =  await this.leadsRepository.dataSource.execute(`
   select * from ${this.DB_SCHEMA}.deal_analytics_funnel daf

`);
return funnel;

  }
  @get('/deals/card')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async dealscard(
    // @param.query.string('quater') quater?: string,
  ): Promise<any> {
   const funnel =  await this.leadsRepository.dataSource.execute(`
   select * from ${this.DB_SCHEMA}.deal_analytics_cards dac
where "Month " = 'February'
`);
return funnel;

  }
  @get('/deals/funnel')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async dealsfunnel(
    @param.query.string('quater') quater?: string,
  ): Promise<any> {
   const funnel =  await this.leadsRepository.dataSource.execute(`
   select * from ${this.DB_SCHEMA}.deal_analytics_funnel daf
   where quarter = '${quater}'
`);
return funnel;

  }
  @get('/analyticscard')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async analyticscard(
    @param.query.string('year') year?: string,
    @param.query.string('month') month?: string,
    @param.query.string('market') market?: string,
    @param.query.string('propensity') propensity?: string,
  ): Promise<any> {
    const all = [];
    if (
      year !== '' &&
      year !== undefined &&
      month !== '' &&
      month !== undefined &&
      market !== '' &&
      market !== undefined &&
      propensity !== '' &&
      propensity !== undefined
    ) {
      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      const propen = propensity.split(',');
      const propenq = "'" + propen.join("','") + "'";

      console.log('beforeleads');

      const leads = await this.leadsRepository.dataSource.execute(`
      with anacard as (
        select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
      where
      extract (YEAR FROM tlg.last_update_date) = ('${year}')
      and extract (month from tlg.last_update_date) = ('${month}')
      and tlg.market in (${marq})
      and tlg.probability in (${propenq})
      and tls.status  in ('lead','interested')
      order by  tlg.probability

     )



    select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
    `);
      console.log('done with leads');

      const inprogres = await this.leadsRepository.dataSource.execute(`
      with anacard as (
        select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
      where
      extract (YEAR FROM tlg.last_update_date) = ('${year}')
      and extract (month from tlg.last_update_date) = ('${month}')
      and tlg.market in (${marq})
      and tlg.probability in (${propenq})
      and tls.status in ('offer submited','offer accepted','under agreement')
      order by  tlg.probability

     )



    select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
    `);

      console.log('done with progress');

      const deals = await this.leadsRepository.dataSource.execute(`
    with anacard as (
      select *
    from ${this.DB_SCHEMA}.tgt_lead_gen tlg
    left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
   order by property_id , inserted_date desc )
     tls on tlg.property_id =tls.property_id
    where
    extract (YEAR FROM tlg.last_update_date) = ('${year}')
    and extract (month from tlg.last_update_date) = ('${month}')
    and tlg.market in (${marq})
    and tlg.probability in (${propenq})
    and tls.status in ('deal')
    order by  tlg.probability

   )



  select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
  `);
      console.log('done with deals');

      const notinterested = await this.leadsRepository.dataSource.execute(`
  with anacard as (
    select *
  from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
 order by property_id , inserted_date desc )
   tls on tlg.property_id =tls.property_id
  where
  extract (YEAR FROM tlg.last_update_date) = ('${year}')
  and extract (month from tlg.last_update_date) = ('${month}')
  and tlg.market in (${marq})
  and tlg.probability in (${propenq})
  and tls.status in ('listed')
  order by  tlg.probability

 )



select sum(a.total_sale_price_mm), count(a.created_date) from anacard a
`);
      console.log('noint');

      const totalclosing = await this.leadsRepository.dataSource.execute(`
with anacard as (
  select *
from ${this.DB_SCHEMA}.tgt_lead_gen tlg
left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
order by property_id , inserted_date desc )
 tls on tlg.property_id =tls.property_id
where
extract (YEAR FROM tlg.last_update_date) = ('${year}')
and extract (month from tlg.last_update_date) = ('${month}')
and tlg.market in (${marq})
and tlg.probability in (${propenq})
and tls.status in ('deal')
order by  tlg.probability

)



SELECT

sum(case when a.total_sale_price_mm  < 5 then 1 else 0 end) as belowfive,
sum(case when a.total_sale_price_mm  >= 5 and a.total_sale_price_mm  < 10  then 1 else 0 end) as overfive,
sum(case when a.total_sale_price_mm  >= 10 then 1 else 0 end) as overten,
sum(a.total_sale_price_mm)
from anacard a
`);
      console.log('totalclossing');

      all.push({leads: leads});
      all.push({inprogres: inprogres});
      all.push({notinterested: notinterested});
      all.push({deals: deals});
      all.push({totalclosing: totalclosing});
      console.log('aqll', JSON.stringify(all));
      return all;
    } else {
      return ' Filter Didinot matched ';
    }
  }
  @get('/market')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async findmarket(): Promise<any> {
    const sql = this.leadsRepository.dataSource.execute(`
    select distinct(market) from ${this.DB_SCHEMA}.tgt_lead_gen order by market asc
    `);
    console.log(sql);
    return sql;
  }
  @get('/submarket')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async findsubmarket(
    @param.query.string('market') market?: string,
  ): Promise<any> {
    if (market !== '' && market !== undefined) {
      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      const sql = await this.leadsRepository.dataSource.execute(`
    select distinct(submarket) from ${this.DB_SCHEMA}.tgt_lead_gen where market in (${marq}) order by submarket asc
    `);
      // console.log(sql);
      return sql;
    } else if (market === '' || market === undefined) {
      const sql = await this.leadsRepository.dataSource.execute(
        `select distinct(submarket) from ${this.DB_SCHEMA}.tgt_lead_gen`,
      );
      return sql;
    } else if (Error()) {
      throw new HttpErrors.InternalServerError();
    }
  }
  @get('/probability')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async findprobability(
    @param.query.string('market') market?: string,
  ): Promise<any> {
    if (market !== '' && market !== undefined) {
      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      const sql = await this.leadsRepository.dataSource.execute(`
      select distinct(probability) from ${this.DB_SCHEMA}.tgt_lead_gen where market in (${marq})
      `);
      // console.log(sql);
      return sql;
    } else if (market === '' || market === undefined) {
      const sql = await this.leadsRepository.dataSource.execute(
        `select distinct(probability) from ${this.DB_SCHEMA}.tgt_lead_gen`,
      );
      return sql;
    } else if (Error()) {
      throw new HttpErrors.InternalServerError();
    }
  }

  @get('/leads/date')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async date(): Promise<any> {
    const sql = await this.leadsRepository.dataSource.execute(`
    select distinct (last_update_date) at time zone 'UTC-6' from ${this.DB_SCHEMA}.tgt_lead_gen
      `);
    return sql;
  }
  // @get('/leadsnew')
  // @response(200, {
  //   description: 'Array of Leads model instances',
  // })
  // async findnew(
  //   @param.query.string('year') year?: string,
  //   @param.query.string('month') month?: string,
  //   @param.query.string('market') market?: string,
  //   @param.query.string('sale_propensity') sale_propensity?: string,
  //   @param.query.string('status') status?: string,
  //   @param.query.number('limit') limit?: number,
  //   @param.query.number('offset') offset?: number,
  // ): Promise<any> {
  //   if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     market !== '' &&
  //     market !== undefined &&
  //     sale_propensity !== '' &&
  //     sale_propensity !== undefined &&
  //     status !== '' &&
  //     status !== undefined
  //   ) {
  //     console.log('all');

  //     // const loca = sub_market.split(',');
  //     // const locaq = "'" + loca.join("','") + "'";
  //     const mar = market.split(',');
  //     const marq = "'" + mar.join("','") + "'";
  //     const pro = sale_propensity.split(',');
  //     const proq = "'" + pro.join("','") + "'";
  //     const statu = status.split(',');
  //     const statuq = "'" + statu.join("','") + "'";

  //     const sql = await this.leadsRepository.dataSource.execute(`

  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in (${marq})
  //     and tlg.probability in (${proq})
  //     and tls.status in (${statuq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     // console.log('all', sql);
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     sale_propensity !== '' &&
  //     sale_propensity !== undefined &&
  //     status !== '' &&
  //     status !== undefined
  //   ) {
  //     const pro = sale_propensity.split(',');
  //     const proq = "'" + pro.join("','") + "'";
  //     const statu = status.split(',');
  //     const statuq = "'" + statu.join("','") + "'";

  //     const query = `select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where
  //      extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.probability in '${sale_propensity}'
  //     and tls.status in (${statuq})
  //     order by tlg.owner_name`;
  //     console.log('year month submarket sale status', query);

  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where
  //      extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.probability in (${proq})
  //     and tls.status in (${statuq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     // console.log(sql)
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     market !== '' &&
  //     market !== undefined &&
  //     sale_propensity !== '' &&
  //     sale_propensity !== undefined
  //   ) {
  //     console.log('year month  market sunmarket salepropensity');

  //     const mar = market.split(',');
  //     const marq = "'" + mar.join("','") + "'";
  //     // const statu = status.split(',');
  //     // const statuq = "'" + statu.join("','") + "'";
  //     const pro = sale_propensity.split(',');
  //     const proq = "'" + pro.join("','") + "'";
  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where
  //      extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in (${marq})
  //     and tlg.probability in (${proq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     // console.log(sql)
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     market !== '' &&
  //     market !== undefined &&
  //     status !== '' &&
  //     status !== undefined
  //   ) {
  //     console.log('year month  market submarket status');
  //     const mar = market.split(',');
  //     const marq = "'" + mar.join("','") + "'";
  //     const statu = status.split(',');
  //     const statuq = "'" + statu.join("','") + "'";
  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where
  //      extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in (${marq})
  //     and tls.status in (${statuq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     // console.log(sql)
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     market !== '' &&
  //     market !== undefined &&
  //     sale_propensity !== '' &&
  //     sale_propensity !== undefined &&
  //     status !== '' &&
  //     status !== undefined
  //   ) {
  //     console.log('year month  market salepropensity status');

  //     const loca = sale_propensity.split(',');
  //     const locaq = "'" + loca.join("','") + "'";
  //     const mar = market.split(',');
  //     const marq = "'" + mar.join("','") + "'";
  //     const statu = status.split(',');
  //     const statuq = "'" + statu.join("','") + "'";
  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in (${marq})
  //     and tlg.probability in (${locaq})
  //     and tls.status in (${statuq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     console.log('mine test', sql);
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     market !== '' &&
  //     market !== undefined &&
  //     sale_propensity !== '' &&
  //     sale_propensity !== undefined
  //   ) {
  //     console.log('year month  market sale propen');

  //     const loca = sale_propensity.split(',');
  //     const locaq = "'" + loca.join("','") + "'";
  //     const mar = market.split(',');
  //     const marq = "'" + mar.join("','") + "'";
  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in (${marq})
  //     and tlg.probability in (${locaq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     // console.log(sql)
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     market !== '' &&
  //     market !== undefined
  //   ) {
  //     console.log('year month market submarket');

  //     const mar = market.split(',');
  //     const marq = "'" + mar.join("','") + "'";
  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where

  //      extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in (${marq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     // console.log(sql)
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     market !== '' &&
  //     market !== undefined &&
  //     status !== '' &&
  //     status !== undefined
  //   ) {
  //     console.log('year month market status');

  //     const mar = market.split(',');
  //     const marq = "'" + mar.join("','") + "'";
  //     const statu = status.split(',');
  //     const statuq = "'" + statu.join("','") + "'";
  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where

  //      extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in (${marq})
  //     and tls.status in (${statuq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     // console.log(sql)
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     sale_propensity !== '' &&
  //     sale_propensity !== undefined &&
  //     status !== '' &&
  //     status !== undefined
  //   ) {
  //     console.log('year month salepropensity status');

  //     const loca = sale_propensity.split(',');
  //     const locaq = "'" + loca.join("','") + "'";
  //     const statu = status.split(',');
  //     const statuq = "'" + statu.join("','") + "'";
  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.probability in (${locaq})
  //     and tls.status in (${statuq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     // console.log(sql)
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     market !== '' &&
  //     market !== undefined
  //   ) {
  //     console.log('year month market');

  //     const loca = market.split(',');
  //     const locaq = "'" + loca.join("','") + "'";
  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //     where

  //       extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in (${locaq})
  //     order by tlg.owner_name
  //     offset ${offset} limit ${limit}

  //     `);
  //     // console.log(sql)
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     status !== '' &&
  //     status !== undefined
  //   ) {
  //     // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //     // ${this.DB_SCHEMA}.tgt_lead_status tls
  //     // where tlg.property_id = tls.property_id
  //     // and tls.status not in ('notinterested')
  //     //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     // and extract (month from tlg.last_update_date) = '${month}'
  //     // order by case tlg.probability
  //     // when 'Hot' then 1
  //     // when 'Warm' then 2
  //     // when 'Cold' then 3
  //     // end
  //     // limit 9`;
  //     console.log('year month status');

  //     const statu = status.split(',');
  //     const statuq = "'" + statu.join("','") + "'";

  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //      where
  //      extract (YEAR FROM tlg.last_update_date) = '${year}'
  //      and extract (month from tlg.last_update_date) = '${month}'
  //      and tls.status in (${statuq})
  //      order by tlg.owner_name
  //      offset ${offset} limit ${limit}

  //     `);
  //     // console.log(sql1)
  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (
  //     year !== '' &&
  //     year !== undefined &&
  //     month !== '' &&
  //     month !== undefined &&
  //     sale_propensity !== '' &&
  //     sale_propensity !== undefined
  //   ) {
  //     console.log('year month salepropensity');
  //     const loca = sale_propensity.split(',');
  //     const locaq = "'" + loca.join("','") + "'";

  //     const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //    order by property_id , inserted_date desc )
  //      tls on tlg.property_id =tls.property_id
  //      where
  //      extract (YEAR FROM tlg.last_update_date) = '${year}'
  //      and extract (month from tlg.last_update_date) = '${month}'
  //      and tlg.probability in (${locaq})
  //      order by tlg.owner_name
  //      offset ${offset} limit ${limit}
  //     `);

  //     if (sql.length > 0) {
  //       return sql;
  //     } else return 'no data matched';
  //   } else if (Error()) {
  //     throw new HttpErrors.InternalServerError();
  //   }
  // }
  @get('/leads')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async find(
    @param.query.string('year') year?: string,
    @param.query.string('month') month?: string,
    @param.query.string('market') market?: string,
    @param.query.string('sale_propensity') sale_propensity?: string,
    @param.query.string('status') status?: string,
  ): Promise<any> {
    if (
      year !== '' &&
      year !== undefined &&
      month !== '' &&
      month !== undefined &&
      market !== '' &&
      market !== undefined &&
      sale_propensity !== '' &&
      sale_propensity !== undefined &&
      status !== '' &&
      status !== undefined
    ) {
      console.log('year month market salePropen status');

      // const loca = sub_market.split(',');
      // const locaq = "'" + loca.join("','") + "'";
      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      const pro = sale_propensity.split(',');
      const proq = "'" + pro.join("','") + "'";
      const statu = status.split(',');
      const statuq = "'" + statu.join("','") + "'";
      const sqlq = `select *
from ${this.DB_SCHEMA}.tgt_lead_gen tlg
left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
order by property_id , inserted_date desc )
 tls on tlg.property_id =tls.property_id
where
extract (YEAR FROM tlg.last_update_date) = ('${year}')
and extract (month from tlg.last_update_date) = ('${month}')
and tlg.market in (${marq})
and tlg.probability in (${proq})
and tls.status in (${statuq})
order by tlg.owner_name
limit 30`;
      console.log(sqlq);
      const sql = await this.leadsRepository.dataSource.execute(`${sqlq}`);

      if (sql.length > 0) {
        return sql;
      } else return 'no data matched';
    } else if (
      year !== '' &&
      year !== undefined &&
      month !== '' &&
      month !== undefined &&
      sale_propensity !== '' &&
      sale_propensity !== undefined &&
      status !== '' &&
      status !== undefined
    ) {
      console.log('year month salepropen status');
      const pro = sale_propensity.split(',');
      const proq = "'" + pro.join("','") + "'";
      const statu = status.split(',');
      const statuq = "'" + statu.join("','") + "'";

      const query = `
      select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
      where
       extract (YEAR FROM tlg.last_update_date) = '${year}'
      and extract (month from tlg.last_update_date) = '${month}'
      and tlg.probability in (${proq})
      and tls.status in (${statuq})
      order by tlg.owner_name
      limit 30
      `;
      console.log(query);

      const sql = await this.leadsRepository.dataSource.execute(` ${query} `);

      if (sql.length > 0) {
        return sql;
      } else return 'no data matched';
    } else if (
      year !== '' &&
      year !== undefined &&
      month !== '' &&
      month !== undefined &&
      market !== '' &&
      market !== undefined &&
      sale_propensity !== '' &&
      sale_propensity !== undefined
    ) {
      console.log('year month  market  salepropensity');

      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      // const statu = status.split(',');
      // const statuq = "'" + statu.join("','") + "'";
      const pro = sale_propensity.split(',');
      const proq = "'" + pro.join("','") + "'";
      const query = `
select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
      where
       extract (YEAR FROM tlg.last_update_date) = ('${year}')
      and extract (month from tlg.last_update_date) = ('${month}')
      and tlg.market in (${marq})
      and tlg.probability in (${proq})
      order by tlg.owner_name
limit 30
`;

      const sql = await this.leadsRepository.dataSource.execute(` ${query} `);

      if (sql.length > 0) {
        return sql;
      } else return 'no data matched';
    } else if (
      year !== '' &&
      year !== undefined &&
      month !== '' &&
      month !== undefined &&
      market !== '' &&
      market !== undefined &&
      status !== '' &&
      status !== undefined
    ) {
      console.log('year month  market status');
      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      const statu = status.split(',');
      const statuq = "'" + statu.join("','") + "'";
      const query = `
      select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
      where
       extract (YEAR FROM tlg.last_update_date) = ('${year}')
      and extract (month from tlg.last_update_date) = ('${month}')
      and tlg.market in (${marq})
      and tls.status in (${statuq})
      order by tlg.owner_name
limit 30
      `;
      const sql = await this.leadsRepository.dataSource.execute(
        ` ${query}      `,
      );

      if (sql.length > 0) {
        return sql;
      } else return 'no data matched';
    }
    //      else if (
    //       year !== '' &&
    //       year !== undefined &&
    //       month !== '' &&
    //       month !== undefined &&
    //       market !== '' &&
    //       market !== undefined &&
    //       sale_propensity !== '' &&
    //       sale_propensity !== undefined &&
    //       status !== '' &&
    //       status !== undefined
    //     ) {
    //       console.log('year month  market salepropensity status');

    //       const loca = sale_propensity.split(',');
    //       const locaq = "'" + loca.join("','") + "'";
    //       const mar = market.split(',');
    //       const marq = "'" + mar.join("','") + "'";
    //       const statu = status.split(',');
    //       const statuq = "'" + statu.join("','") + "'";
    //       const sql = await this.leadsRepository.dataSource.execute(`
    //       select *
    //       from ${this.DB_SCHEMA}.tgt_lead_gen tlg
    //       left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
    //      order by property_id , inserted_date desc )
    //        tls on tlg.property_id =tls.property_id
    //       where

    //       extract (YEAR FROM tlg.last_update_date) = '${year}'
    //       and extract (month from tlg.last_update_date) = '${month}'
    //       and tlg.market in (${marq})
    //       and tlg.probability in (${locaq})
    //       and tls.status in (${statuq})
    //       order by tlg.owner_name
    // limit 30

    //       `);
    //       console.log('mine test', sql);
    //       if (sql.length > 0) {
    //         return sql;
    //       } else return 'no data matched';
    //     }
    //     else if (
    //       year !== '' &&
    //       year !== undefined &&
    //       month !== '' &&
    //       month !== undefined &&
    //       market !== '' &&
    //       market !== undefined &&
    //       sale_propensity !== '' &&
    //       sale_propensity !== undefined
    //     ) {
    //       console.log('year month  market sale propen');

    //       const loca = sale_propensity.split(',');
    //       const locaq = "'" + loca.join("','") + "'";
    //       const mar = market.split(',');
    //       const marq = "'" + mar.join("','") + "'";
    //       const sql = await this.leadsRepository.dataSource.execute(`
    //       select *
    //       from ${this.DB_SCHEMA}.tgt_lead_gen tlg
    //       left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
    //      order by property_id , inserted_date desc )
    //        tls on tlg.property_id =tls.property_id
    //       where

    //       extract (YEAR FROM tlg.last_update_date) = '${year}'
    //       and extract (month from tlg.last_update_date) = '${month}'
    //       and tlg.market in (${marq})
    //       and tlg.probability in (${locaq})
    //       order by tlg.owner_name
    // limit 30
    //       `);
    //       // console.log(sql)
    //       if (sql.length > 0) {
    //         return sql;
    //       } else return 'no data matched';
    //     }
    else if (
      year !== '' &&
      year !== undefined &&
      month !== '' &&
      month !== undefined &&
      market !== '' &&
      market !== undefined
    ) {
      console.log('year month market');

      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      const query = `
      select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
      where

       extract (YEAR FROM tlg.last_update_date) = ('${year}')
      and extract (month from tlg.last_update_date) = ('${month}')
      and tlg.market in (${marq})
      order by tlg.owner_name
limit 30
      `;
      console.log(query);
      const sql = await this.leadsRepository.dataSource.execute(
        ` ${query}      `,
      );
      // console.log(sql)
      if (sql.length > 0) {
        return sql;
      } else return 'no data matched';
    }
    //     else if (
    //       year !== '' &&
    //       year !== undefined &&
    //       month !== '' &&
    //       month !== undefined &&
    //       market !== '' &&
    //       market !== undefined &&
    //       status !== '' &&
    //       status !== undefined
    //     ) {
    //       console.log('year month market status');

    //       const mar = market.split(',');
    //       const marq = "'" + mar.join("','") + "'";
    //       const statu = status.split(',');
    //       const statuq = "'" + statu.join("','") + "'";
    //       const sql = await this.leadsRepository.dataSource.execute(`
    //       select *
    //       from ${this.DB_SCHEMA}.tgt_lead_gen tlg
    //       left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
    //      order by property_id , inserted_date desc )
    //        tls on tlg.property_id =tls.property_id
    //       where

    //        extract (YEAR FROM tlg.last_update_date) = ('${year}')
    //       and extract (month from tlg.last_update_date) = ('${month}')
    //       and tlg.market in (${marq})
    //       and tls.status in (${statuq})
    //       order by tlg.owner_name
    // limit 30
    //       `);
    //       // console.log(sql)
    //       if (sql.length > 0) {
    //         return sql;
    //       } else return 'no data matched';
    //     }
    //     else if (
    //       year !== '' &&
    //       year !== undefined &&
    //       month !== '' &&
    //       month !== undefined &&
    //       sale_propensity !== '' &&
    //       sale_propensity !== undefined &&
    //       status !== '' &&
    //       status !== undefined
    //     ) {
    //       console.log('year month salepropensity status');

    //       const loca = sale_propensity.split(',');
    //       const locaq = "'" + loca.join("','") + "'";
    //       const statu = status.split(',');
    //       const statuq = "'" + statu.join("','") + "'";
    //       const sql = await this.leadsRepository.dataSource.execute(`
    //       select *
    //       from ${this.DB_SCHEMA}.tgt_lead_gen tlg
    //       left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
    //      order by property_id , inserted_date desc )
    //        tls on tlg.property_id =tls.property_id
    //       where

    //       extract (YEAR FROM tlg.last_update_date) = '${year}'
    //       and extract (month from tlg.last_update_date) = '${month}'
    //       and tlg.probability in (${locaq})
    //       and tls.status in (${statuq})
    //       order by tlg.owner_name
    // limit 30
    //       `);
    //       // console.log(sql)
    //       if (sql.length > 0) {
    //         return sql;
    //       } else return 'no data matched';
    //     }
    //      else if (
    //       year !== '' &&
    //       year !== undefined &&
    //       month !== '' &&
    //       month !== undefined &&
    //       market !== '' &&
    //       market !== undefined
    //     ) {
    //       console.log('year month market');

    //       const loca = market.split(',');
    //       const locaq = "'" + loca.join("','") + "'";
    //       const sql = await this.leadsRepository.dataSource.execute(`
    //       select *
    //       from ${this.DB_SCHEMA}.tgt_lead_gen tlg
    //       left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
    //      order by property_id , inserted_date desc )
    //        tls on tlg.property_id =tls.property_id
    //       where

    //         extract (YEAR FROM tlg.last_update_date) = '${year}'
    //       and extract (month from tlg.last_update_date) = '${month}'
    //       and tlg.market in (${locaq})
    //       order by tlg.owner_name
    // limit 30
    //       `);
    //       // console.log(sql)
    //       if (sql.length > 0) {
    //         return sql;
    //       } else return 'no data matched';
    //     }
    else if (
      year !== '' &&
      year !== undefined &&
      month !== '' &&
      month !== undefined &&
      status !== '' &&
      status !== undefined
    ) {
      // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
      // ${this.DB_SCHEMA}.tgt_lead_status tls
      // where tlg.property_id = tls.property_id
      // and tls.status not in ('notinterested')
      //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
      // and extract (month from tlg.last_update_date) = '${month}'
      // order by case tlg.probability
      // when 'Hot' then 1
      // when 'Warm' then 2
      // when 'Cold' then 3
      // end
      // limit 9`;
      console.log('year month status');

      const statu = status.split(',');
      const statuq = "'" + statu.join("','") + "'";
      const text = `select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
       where
       extract (YEAR FROM tlg.last_update_date) = '${year}'
       and extract (month from tlg.last_update_date) = '${month}'
       and tls.status in (${statuq})
       order by tlg.owner_name
       limit 30
     `;
      console.log(text);
      const sql = await this.leadsRepository.dataSource.execute(`${text}   `);
      // console.log(sql1)
      if (sql.length > 0) {
        return sql;
      } else return 'no data matched';
    } else if (
      year !== '' &&
      year !== undefined &&
      month !== '' &&
      month !== undefined &&
      sale_propensity !== '' &&
      sale_propensity !== undefined
    ) {
      console.log('year month salepropensity');
      const loca = sale_propensity.split(',');
      const locaq = "'" + loca.join("','") + "'";
      const query = `
select *
      from ${this.DB_SCHEMA}.tgt_lead_gen tlg
      left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
     order by property_id , inserted_date desc )
       tls on tlg.property_id =tls.property_id
       where
       extract (YEAR FROM tlg.last_update_date) = '${year}'
       and extract (month from tlg.last_update_date) = '${month}'
       and tlg.probability in (${locaq})
       order by tlg.owner_name
limit 30
`;
      console.log(query);

      const sql = await this.leadsRepository.dataSource.execute(
        ` ${query}      `,
      );

      if (sql.length > 0) {
        return sql;
      } else return 'no data matched';
    } else if (Error()) {
      throw new HttpErrors.InternalServerError();
    }
  }

  @get('/charts')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async findbymarket(
    @param.query.string('market') market?: string,
    @param.query.string('year') year?: string,
  ): Promise<any> {
    if (
      year !== '' &&
      year !== undefined &&
      market !== '' &&
      market !== undefined
    ) {
      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      const sql = await this.leadsRepository.execute(
        `select * from  ${this.DB_SCHEMA}.tgt_properties_metrics where market in (${marq}) and
        year_month between
          TIMESTAMP '${year}' - INTERVAL '6 months'
          and  TIMESTAMP '${year}' - INTERVAL '1 month'
       `,
      );
      return sql;
    } else return 'please select a market with date';
  }

  @get('/buyers')
  @response(200, {
    description: 'Array of BUyers model instances',
  })
  async buyers(@param.query.string('market') market?: string): Promise<any> {
    if (market !== '' && market !== undefined) {
      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      const sql = await this.leadsRepository.execute(
        `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where market in (${marq})
        `,
      );
      return sql;
    } else return 'please select a market ';
  }
  @get('/buyersmarket')
  @response(200, {
    description: 'Array of BUyers model instances',
  })
  async buyersmarket(): // @param.query.string('market') market?: string,
  Promise<any> {
    // if (
    //   market !== '' && market !== undefined
    //   )
    // {

    // const mar = market.split(',');
    // const marq = "'" + mar.join("','") + "'";
    const sql = await this.leadsRepository.execute(
      `select distinct market from ${this.DB_SCHEMA}.tgt_buyers_metrics order by market asc
        `,
    );
    return sql;
    // }
    // else return 'please select a market '?
  }

  @get('/buyersproperty')
  @response(200, {
    description: 'Array of BUyers model instances',
  })
  async property(@param.query.string('city') city?: string): Promise<any> {
    if (city !== '' && city !== undefined) {
      const mar = city.split(',');
      const marq = "'" + mar.join("','") + "'";
      const sql = await this.leadsRepository.execute(
        `select distinct property_name from ${this.DB_SCHEMA}.tgt_lead_buyers_recommendation where city in (${marq}) order by property_name asc
        `,
      );
      return sql;
    } else return 'please select a city ';
  }
  @get('/buyerscity')
  @response(200, {
    description: 'Array of BUyers model instances',
  })
  async city(@param.query.string('market') market?: string): Promise<any> {
    if (market !== '' && market !== undefined) {
      const mar = market.split(',');
      const marq = "'" + mar.join("','") + "'";
      const sql = await this.leadsRepository.execute(
        `select distinct city from ${this.DB_SCHEMA}.tgt_lead_buyers_recommendation where market in (${marq}) order by city asc
        `,
      );
      return sql;
    } else return 'please select a market ';
  }
  @get('/propertybuyers')
  @response(200, {
    description: 'Array of BUyers model instances',
  })
  async buyersp(
    @param.query.string('property_name') property_name?: string,
    @param.query.string('property_city') property_city?: string,
  ): Promise<any> {
    // const mar = property_name.split(',');
    // const marq = "'" + mar.join("','") + "'";
    // const city = property_city.split(',');
    // const cityq = "'" + city.join("','") + "'";
    if (
      property_name !== '' &&
      property_name !== undefined &&
      property_city !== '' &&
      property_city !== undefined
    ) {
      const mar = property_name.split(',');
      const marq = "'" + mar.join("','") + "'";
      const city = property_city.split(',');
      const cityq = "'" + city.join("','") + "'";
      const sql = await this.leadsRepository.execute(
        `select b.* ,bc.connected,bc.interested,bc.id as contact_id
        from ${this.DB_SCHEMA}.tgt_lead_buyers_recommendation b
        left join ${this.DB_SCHEMA}.buyers_contact bc  on b.property_id = bc.property_id and b.buyers_name = bc.buyer_name
        where property_name in (${marq}) and city in (${cityq})
        `,
      );
      return sql;
    } else if (property_name !== '' && property_name !== undefined) {
      const mar = property_name.split(',');
      const marq = "'" + mar.join("','") + "'";
      // const city = property_city.split(',');
      // const cityq = "'" + city.join("','") + "'";
      const sql = await this.leadsRepository.execute(
        `
        select b.* ,bc.connected,bc.interested,bc.id as contact_id
        from ${this.DB_SCHEMA}.tgt_lead_buyers_recommendation b
        left join ${this.DB_SCHEMA}.buyers_contact bc  on b.property_id = bc.property_id and b.buyers_name = bc.buyer_name
         where property_name in (${marq})
        `,
      );
      return sql;
    } else if (property_city !== '' && property_city !== undefined) {
      //   const mar = property_name.split(',');
      // const marq = "'" + mar.join("','") + "'";
      const city = property_city.split(',');
      const cityq = "'" + city.join("','") + "'";
      const sql = await this.leadsRepository.execute(
        `select b.* ,bc.connected,bc.interested,bc.id as contact_id
        from ${this.DB_SCHEMA}.tgt_lead_buyers_recommendation b
        left join ${this.DB_SCHEMA}.buyers_contact bc  on b.property_id = bc.property_id and b.buyers_name = bc.buyer_name
        where city in (${cityq})
          `,
      );
      return sql;
    } else if (
      property_name === '' ||
      (property_name === undefined && property_city === '') ||
      property_city === undefined
    ) {
      return 'please select Property Name or Property City';
    } else return 'please select some data ';
  }

  //   @get('/leads/{user}')
  //   @response(200, {
  //     description: 'Array of Leads model instances',
  //   })
  //   async finduserlead(
  //     @param.path.string('user') user: string,
  //     @param.query.string('year') year?: string,
  //     @param.query.string('month') month?: string,
  //     @param.query.string('market') market?: string,
  //     @param.query.string('sub_market') sub_market?: string,
  //     @param.query.string('sale_propensity') sale_propensity?: string,
  //     @param.query.string('status') status?: string,
  //   ): Promise<any> {
  //     const u = user;
  //     switch (u) {
  //       case 'stashgeleszinski':
  //         if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('all');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const mar = market.split(',');
  //           const marq = "'" + mar.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`

  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where
  //   extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //   and extract (month from tlg.last_update_date) = ('${month}')
  //   and tlg.market in (${marq})
  //   and tlg.submarket in (${locaq})
  //   and tlg.probability in (${proq})
  //   and tls.status in (${statuq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month submarket sale status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where
  //    extract (YEAR FROM tlg.last_update_date) = '${year}'
  //   and extract (month from tlg.last_update_date) = '${month}'
  //   and tlg.submarket in (${locaq})
  //   and tlg.probability = '${proq}'
  //   and tls.status in (${statuq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sunmarket salepropensity');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const mar = market.split(',');
  //           const marq = "'" + mar.join("','") + "'";
  //           // const statu = status.split(',');
  //           // const statuq = "'" + statu.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where
  //    extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //   and extract (month from tlg.last_update_date) = ('${month}')
  //   and tlg.market in (${marq})
  //   and tlg.submarket in (${locaq})
  //   and tlg.probability in (${proq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market submarket status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const mar = market.split(',');
  //           const marq = "'" + mar.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where
  //    extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //   and extract (month from tlg.last_update_date) = ('${month}')
  //   and tlg.market in (${marq})
  //   and tlg.submarket in (${locaq})
  //   and tls.status in (${statuq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const mar = market.split(',');
  //           const marq = "'" + mar.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where

  //   extract (YEAR FROM tlg.last_update_date) = '${year}'
  //   and extract (month from tlg.last_update_date) = '${month}'
  //   and tlg.market in (${marq})
  //   and tlg.probability in (${locaq})
  //   and tls.status in (${statuq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sale propen');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const mar = market.split(',');
  //           const marq = "'" + mar.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where

  //   extract (YEAR FROM tlg.last_update_date) = '${year}'
  //   and extract (month from tlg.last_update_date) = '${month}'
  //   and tlg.market in (${marq})
  //   and tlg.probability in (${locaq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined
  //         ) {
  //           console.log('year month market submarket');

  //           const mar = market.split(',');
  //           const marq = "'" + mar.join("','") + "'";
  //           const statu = sub_market.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where

  //    extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //   and extract (month from tlg.last_update_date) = ('${month}')
  //   and tlg.market in (${marq})
  //   and tlg.submarket in (${statuq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month market status');

  //           const mar = market.split(',');
  //           const marq = "'" + mar.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where

  //    extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //   and extract (month from tlg.last_update_date) = ('${month}')
  //   and tlg.market in (${marq})
  //   and tls.status in (${statuq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where

  //   extract (YEAR FROM tlg.last_update_date) = '${year}'
  //   and extract (month from tlg.last_update_date) = '${month}'
  //   and tlg.probability in (${locaq})
  //   and tls.status in (${statuq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined
  //         ) {
  //           console.log('year month market');

  //           const loca = market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //   where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //   and extract (month from tlg.last_update_date) = '${month}'
  //   and tlg.market in (${locaq})
  //   order by case tlg.probability
  //   when 'Hot' then 1
  //   when 'Warm' then 2
  //   when 'Cold' then 3
  //   end

  //   `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //           // ${this.DB_SCHEMA}.tgt_lead_status tls
  //           // where tlg.property_id = tls.property_id
  //           // and tls.status not in ('notinterested')
  //           //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //           // and extract (month from tlg.last_update_date) = '${month}'
  //           // order by case tlg.probability
  //           // when 'Hot' then 1
  //           // when 'Warm' then 2
  //           // when 'Cold' then 3
  //           // end
  //           // limit 9`;
  //           console.log('year month status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //    where
  //    extract (YEAR FROM tlg.last_update_date) = '${year}'
  //    and extract (month from tlg.last_update_date) = '${month}'
  //    and tls.status in (${statuq})
  //    order by case tlg.probability
  //    when 'Hot' then 1
  //    when 'Warm' then 2
  //    when 'Cold' then 3
  //    end

  //   `);
  //           // console.log(sql1)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month salepropensity');
  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  //   select *
  //   from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //   left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //  order by property_id , inserted_date desc )
  //    tls on tlg.property_id =tls.property_id
  //    where
  //    extract (YEAR FROM tlg.last_update_date) = '${year}'
  //    and extract (month from tlg.last_update_date) = '${month}'
  //    and tlg.probability in (${locaq})
  //    order by case tlg.probability
  //    when 'Hot' then 1
  //    when 'Warm' then 2
  //    when 'Cold' then 3
  //    end
  //   `);

  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (Error()) {
  //           throw new HttpErrors.InternalServerError();
  //         }
  //         break;
  //       case 'scottkoethe':
  //         console.log('scott');

  //         if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('all');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`

  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Omaha')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month submarket sale status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Omaha')
  // and tlg.submarket in (${locaq})
  // and tlg.probability = '${proq}'
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sunmarket salepropensity');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           // const statu = status.split(',');
  //           // const statuq = "'" + statu.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Omaha')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market submarket status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Omaha')
  // and tlg.submarket in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Omaha')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sale propen');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Omaha')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined
  //         ) {
  //           console.log('year month market submarket');

  //           const statu = sub_market.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Omaha')
  // and tlg.submarket in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month market status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Omaha')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Omaha')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined
  //         ) {
  //           console.log('year month market');

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Omaha')
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //           // ${this.DB_SCHEMA}.tgt_lead_status tls
  //           // where tlg.property_id = tls.property_id
  //           // and tls.status not in ('notinterested')
  //           //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //           // and extract (month from tlg.last_update_date) = '${month}'
  //           // order by case tlg.probability
  //           // when 'Hot' then 1
  //           // when 'Warm' then 2
  //           // when 'Cold' then 3
  //           // end
  //           // limit 9`;
  //           console.log('year month status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Omaha')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql1)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month salepropensity');
  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Omaha')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end
  // `);

  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (Error()) {
  //           throw new HttpErrors.InternalServerError();
  //         }

  //         break;
  //       case 'carybelovicz':
  //         console.log('cary');
  //         if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('all');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`

  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month submarket sale status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tlg.submarket in (${locaq})
  // and tlg.probability = '${proq}'
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sunmarket salepropensity');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           // const statu = status.split(',');
  //           // const statuq = "'" + statu.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market submarket status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tlg.submarket in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sale propen');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined
  //         ) {
  //           console.log('year month market submarket');

  //           const statu = sub_market.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tlg.submarket in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month market status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined
  //         ) {
  //           console.log('year month market');

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //           // ${this.DB_SCHEMA}.tgt_lead_status tls
  //           // where tlg.property_id = tls.property_id
  //           // and tls.status not in ('notinterested')
  //           //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //           // and extract (month from tlg.last_update_date) = '${month}'
  //           // order by case tlg.probability
  //           // when 'Hot' then 1
  //           // when 'Warm' then 2
  //           // when 'Cold' then 3
  //           // end
  //           // limit 9`;
  //           console.log('year month status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql1)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month salepropensity');
  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end
  // `);

  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (Error()) {
  //           throw new HttpErrors.InternalServerError();
  //         }
  //         break;

  //       case 'weskohler':
  //         if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('all');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`

  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Cincinnati','Dayton')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month submarket sale status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Cincinnati','Dayton')
  // and tlg.submarket in (${locaq})
  // and tlg.probability = '${proq}'
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sunmarket salepropensity');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           // const statu = status.split(',');
  //           // const statuq = "'" + statu.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Cincinnati','Dayton')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market submarket status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Cincinnati','Dayton')
  // and tlg.submarket in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Cincinnati','Dayton')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sale propen');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Cincinnati','Dayton')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined
  //         ) {
  //           console.log('year month market submarket');

  //           const statu = sub_market.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Cincinnati','Dayton')
  // and tlg.submarket in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month market status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Cincinnati','Dayton')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Cincinnati','Dayton')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined
  //         ) {
  //           console.log('year month market');

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Cincinnati','Dayton')
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //           // ${this.DB_SCHEMA}.tgt_lead_status tls
  //           // where tlg.property_id = tls.property_id
  //           // and tls.status not in ('notinterested')
  //           //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //           // and extract (month from tlg.last_update_date) = '${month}'
  //           // order by case tlg.probability
  //           // when 'Hot' then 1
  //           // when 'Warm' then 2
  //           // when 'Cold' then 3
  //           // end
  //           // limit 9`;
  //           console.log('year month status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Cincinnati','Dayton')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql1)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month salepropensity');
  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Cincinnati','Dayton')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end
  // `);

  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (Error()) {
  //           throw new HttpErrors.InternalServerError();
  //         }
  //         break;

  //       case 'daviddirkschneider':
  //         if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('all');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`

  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tlg.submarket in (${locaq})
  //     and tlg.probability in (${proq})
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month submarket sale status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tlg.submarket in (${locaq})
  //     and tlg.probability = '${proq}'
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sunmarket salepropensity');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           // const statu = status.split(',');
  //           // const statuq = "'" + statu.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tlg.submarket in (${locaq})
  //     and tlg.probability in (${proq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market submarket status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tlg.submarket in (${locaq})
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tlg.probability in (${locaq})
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sale propen');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tlg.probability in (${locaq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined
  //         ) {
  //           console.log('year month market submarket');

  //           const statu = sub_market.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tlg.submarket in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month market status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tlg.probability in (${locaq})
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined
  //         ) {
  //           console.log('year month market');

  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //           // ${this.DB_SCHEMA}.tgt_lead_status tls
  //           // where tlg.property_id = tls.property_id
  //           // and tls.status not in ('notinterested')
  //           //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //           // and extract (month from tlg.last_update_date) = '${month}'
  //           // order by case tlg.probability
  //           // when 'Hot' then 1
  //           // when 'Warm' then 2
  //           // when 'Cold' then 3
  //           // end
  //           // limit 9`;
  //           console.log('year month status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql1)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month salepropensity');
  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Tulsa','Oklahoma City')
  //     and tlg.probability in (${locaq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end
  //     `);

  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (Error()) {
  //           throw new HttpErrors.InternalServerError();
  //         }

  //         break;

  //       case 'reidbennett':
  //         if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('all');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`

  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Chicago Suburban')
  //     and tlg.submarket in (${locaq})
  //     and tlg.probability in (${proq})
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month submarket sale status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Chicago Suburban')
  //     and tlg.submarket in (${locaq})
  //     and tlg.probability = '${proq}'
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sunmarket salepropensity');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           // const statu = status.split(',');
  //           // const statuq = "'" + statu.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Chicago Suburban')
  //     and tlg.submarket in (${locaq})
  //     and tlg.probability in (${proq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market submarket status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Chicago Suburban')
  //     and tlg.submarket in (${locaq})
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Chicago Suburban')
  //     and tlg.probability in (${locaq})
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sale propen');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Chicago Suburban')
  //     and tlg.probability in (${locaq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined
  //         ) {
  //           console.log('year month market submarket');

  //           const statu = sub_market.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Chicago Suburban')
  //     and tlg.submarket in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month market status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = ('${year}')
  //     and extract (month from tlg.last_update_date) = ('${month}')
  //     and tlg.market in ('Chicago Suburban')
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Chicago Suburban')
  //     and tlg.probability in (${locaq})
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined
  //         ) {
  //           console.log('year month market');

  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where

  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Chicago Suburban')
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //           // ${this.DB_SCHEMA}.tgt_lead_status tls
  //           // where tlg.property_id = tls.property_id
  //           // and tls.status not in ('notinterested')
  //           //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //           // and extract (month from tlg.last_update_date) = '${month}'
  //           // order by case tlg.probability
  //           // when 'Hot' then 1
  //           // when 'Warm' then 2
  //           // when 'Cold' then 3
  //           // end
  //           // limit 9`;
  //           console.log('year month status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Chicago Suburban')
  //     and tls.status in (${statuq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end

  //     `);
  //           // console.log(sql1)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month salepropensity');
  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  //     select *
  //     from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  //     left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  //     order by property_id , inserted_date desc )
  //     tls on tlg.property_id =tls.property_id
  //     where
  //     extract (YEAR FROM tlg.last_update_date) = '${year}'
  //     and extract (month from tlg.last_update_date) = '${month}'
  //     and tlg.market in ('Chicago Suburban')
  //     and tlg.probability in (${locaq})
  //     order by case tlg.probability
  //     when 'Hot' then 1
  //     when 'Warm' then 2
  //     when 'Cold' then 3
  //     end
  //     `);

  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (Error()) {
  //           throw new HttpErrors.InternalServerError();
  //         }

  //         break;

  //       case 'seanhenry':
  //         if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('all');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`

  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month submarket sale status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tlg.submarket in (${locaq})
  // and tlg.probability = '${proq}'
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sunmarket salepropensity');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           // const statu = status.split(',');
  //           // const statuq = "'" + statu.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market submarket status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tlg.submarket in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sale propen');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined
  //         ) {
  //           console.log('year month market submarket');

  //           const statu = sub_market.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tlg.submarket in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month market status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined
  //         ) {
  //           console.log('year month market');

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //           // ${this.DB_SCHEMA}.tgt_lead_status tls
  //           // where tlg.property_id = tls.property_id
  //           // and tls.status not in ('notinterested')
  //           //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //           // and extract (month from tlg.last_update_date) = '${month}'
  //           // order by case tlg.probability
  //           // when 'Hot' then 1
  //           // when 'Warm' then 2
  //           // when 'Cold' then 3
  //           // end
  //           // limit 9`;
  //           console.log('year month status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql1)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month salepropensity');
  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Atlanta - Urban','Atlanta - Suburban')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end
  // `);

  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (Error()) {
  //           throw new HttpErrors.InternalServerError();
  //         }
  //         break;

  //       case 'tomhuffsmith':
  //         if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('all');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`

  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month submarket sale status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tlg.submarket in (${locaq})
  // and tlg.probability = '${proq}'
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sunmarket salepropensity');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           // const statu = status.split(',');
  //           // const statuq = "'" + statu.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market submarket status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tlg.submarket in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sale propen');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined
  //         ) {
  //           console.log('year month market submarket');

  //           const statu = sub_market.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tlg.submarket in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month market status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined
  //         ) {
  //           console.log('year month market');

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //           // ${this.DB_SCHEMA}.tgt_lead_status tls
  //           // where tlg.property_id = tls.property_id
  //           // and tls.status not in ('notinterested')
  //           //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //           // and extract (month from tlg.last_update_date) = '${month}'
  //           // order by case tlg.probability
  //           // when 'Hot' then 1
  //           // when 'Warm' then 2
  //           // when 'Cold' then 3
  //           // end
  //           // limit 9`;
  //           console.log('year month status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql1)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month salepropensity');
  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Orlando','Jacksonville','Tallahassee')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end
  // `);

  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (Error()) {
  //           throw new HttpErrors.InternalServerError();
  //         }

  //         break;

  //       case 'keontruth':
  //         if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('all');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`

  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month submarket sale status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tlg.submarket in (${locaq})
  // and tlg.probability = '${proq}'
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sunmarket salepropensity');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           // const statu = status.split(',');
  //           // const statuq = "'" + statu.join("','") + "'";
  //           const pro = sale_propensity.split(',');
  //           const proq = "'" + pro.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tlg.submarket in (${locaq})
  // and tlg.probability in (${proq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market submarket status');

  //           const loca = sub_market.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tlg.submarket in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month  market salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           market !== '' &&
  //           market !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month  market sale propen');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sub_market !== '' &&
  //           sub_market !== undefined
  //         ) {
  //           console.log('year month market submarket');

  //           const statu = sub_market.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tlg.submarket in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month market status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = ('${year}')
  // and extract (month from tlg.last_update_date) = ('${month}')
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           console.log('year month salepropensity status');

  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";
  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";
  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tlg.probability in (${locaq})
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined
  //         ) {
  //           console.log('year month market');

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where

  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           status !== '' &&
  //           status !== undefined
  //         ) {
  //           // const sql1 = `select * from ${this.DB_SCHEMA}.tgt_lead_gen tlg,
  //           // ${this.DB_SCHEMA}.tgt_lead_status tls
  //           // where tlg.property_id = tls.property_id
  //           // and tls.status not in ('notinterested')
  //           //   and extract (YEAR FROM tlg.last_update_date) = '${year}'
  //           // and extract (month from tlg.last_update_date) = '${month}'
  //           // order by case tlg.probability
  //           // when 'Hot' then 1
  //           // when 'Warm' then 2
  //           // when 'Cold' then 3
  //           // end
  //           // limit 9`;
  //           console.log('year month status');

  //           const statu = status.split(',');
  //           const statuq = "'" + statu.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tls.status in (${statuq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end

  // `);
  //           // console.log(sql1)
  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (
  //           year !== '' &&
  //           year !== undefined &&
  //           month !== '' &&
  //           month !== undefined &&
  //           sale_propensity !== '' &&
  //           sale_propensity !== undefined
  //         ) {
  //           console.log('year month salepropensity');
  //           const loca = sale_propensity.split(',');
  //           const locaq = "'" + loca.join("','") + "'";

  //           const sql = await this.leadsRepository.dataSource.execute(`
  // select *
  // from ${this.DB_SCHEMA}.tgt_lead_gen tlg
  // left outer join (select distinct on(property_id)property_id ,status ,inserted_date from ${this.DB_SCHEMA}.tgt_lead_status
  // order by property_id , inserted_date desc )
  // tls on tlg.property_id =tls.property_id
  // where
  // extract (YEAR FROM tlg.last_update_date) = '${year}'
  // and extract (month from tlg.last_update_date) = '${month}'
  // and tlg.market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
  // and tlg.probability in (${locaq})
  // order by case tlg.probability
  // when 'Hot' then 1
  // when 'Warm' then 2
  // when 'Cold' then 3
  // end
  // `);

  //           if (sql.length > 0) {
  //             return sql;
  //           } else return 'no data matched';
  //         } else if (Error()) {
  //           throw new HttpErrors.InternalServerError();
  //         }
  //         break;
  //       default:
  //         return 'Send the user details ';
  //     }
  //   }
  @get('/buyers/{user}')
  @response(200, {
    description: 'Array of BUyers model instances',
  })
  async buyersuser(
    @param.path.string('user') user: string,
    @param.query.string('market') market?: string,
  ): Promise<any> {
    const u = user;

    switch (u) {
      case 'stashgeleszinski':
        if (market !== '' && market !== undefined) {
          const mar = market.split(',');
          const marq = "'" + mar.join("','") + "'";
          const sql = await this.leadsRepository.execute(
            `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where market in (${marq})
            `,
          );
          return sql;
        }
        break;
      case 'scottkoethe':
        const scottkoethe = await this.leadsRepository.execute(
          `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where market in ('Omaha')
            `,
        );
        return scottkoethe;
        break;

      case 'carybelovicz':
        const sql = await this.leadsRepository.execute(
          `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where market in ('Lansing - Ann Arbor','South Bend','Grand Rapids')
              `,
        );
        return sql;
        break;
      case 'weskohler':
        const weskohler = await this.leadsRepository.execute(
          `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where
            market in ('Cincinnati','Dayton')
                `,
        );
        return weskohler;
        break;
      case 'daviddirkschneider':
        const daviddirkschneider = await this.leadsRepository.execute(
          `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where
              market in ('Tulsa','Oklahoma City')
                  `,
        );
        return daviddirkschneider;
        break;
      case 'reidbennett':
        const reidbennett = await this.leadsRepository.execute(
          `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where
                market in ('Chicago Suburban')
                    `,
        );
        return reidbennett;
        break;
      case 'seanhenry':
        const seanhenry = await this.leadsRepository.execute(
          `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where
                  market in ('Atlanta - Urban','Atlanta - Suburban')
                      `,
        );
        return seanhenry;
        break;
      case 'tomhuffsmith':
        const tomhuffsmith = await this.leadsRepository.execute(
          `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where
                    market in ('Orlando','Jacksonville','Tallahassee')
                        `,
        );
        return tomhuffsmith;
        break;
      case 'keontruth':
        const keontruth = await this.leadsRepository.execute(
          `select * from ${this.DB_SCHEMA}.tgt_buyers_metrics where
                      market in ('Los Angeles - Metro','Los Angeles - Eastern County','Orange County','San Fernando Valley - Ventura County')
                          `,
        );
        return keontruth;
        break;
      default:
        return 'NO market for users ';
    }
  }
}
