/* eslint-disable no-case-declarations */
/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  get,
  param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {LeadsRepository} from '../repositories';
// @authenticate("jwt")
export class LeadsController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}

  DB_SCHEMA = process.env.DB_SCHEMA;

  @get('/reportyBuilder/bySales')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async forSales(
    @param.query.string('state') state?: string,
    @param.query.string('city') city?: string,
    @param.query.number('salePriceFrom') salePriceFrom?: number,
    @param.query.number('salePriceTo') salePriceTo?: number,
    @param.query.string('salePeriodFrom', {default: null}) salePeriodFrom?: string,
    @param.query.string('salePeriodTo', {default: null}) salePeriodTo?: string,
    @param.query.number('offset', {default: 0}) offset?: number,
  ): Promise<any> {
    let marq: any = '';
    let cityc: any = '';

      const mar = state?.split(',');
      marq = "'" + mar?.join("','") + "'";


      const cit = city?.split(',');
      cityc = "'" + cit?.join("','") + "'";

    if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined &&
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_recorder
      where 1 = 1
        AND (property_state IN(${marq}))
        AND (property_city IN(${cityc}))
        AND (document_amount between ${salePriceFrom} and ${salePriceTo})
        AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
        limit 100 offset ${offset}
        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`
      SELECT count(*)
      FROM ${this.DB_SCHEMA}.vw_recorder
      where 1 = 1
        AND (property_state IN(${marq}))
        AND (property_city IN(${cityc}))
        AND (document_amount between ${salePriceFrom} and ${salePriceTo})
        AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
        limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
   else if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined &&
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined
    ) {
      const sql = `SELECT *
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (property_city IN(${cityc}))
AND (document_amount between ${salePriceFrom} and ${salePriceTo})
limit 100 offset ${offset}
`;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`

      SELECT count(*)
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (property_city IN(${cityc}))
AND (document_amount between ${salePriceFrom} and ${salePriceTo})
limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
  else if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (property_city IN(${cityc}))
AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
limit 100 offset ${offset}
`;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`
      SELECT count(*)
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (property_city IN(${cityc}))
AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined
    ) {
      const sql = `SELECT *
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (property_city IN(${cityc}))
limit 100 offset ${offset}
`;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`

      SELECT count(*)
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (property_city IN(${cityc}))
limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
     else if (
      state !== '' &&
      state !== undefined &&
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
  FROM ${this.DB_SCHEMA}.vw_recorder
  where 1 = 1
  AND (property_state IN(${marq}))
  AND (document_amount between ${salePriceFrom} and ${salePriceTo})
  AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
  limit 100 offset ${offset}
  `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`
      SELECT count(*)
  FROM ${this.DB_SCHEMA}.vw_recorder
  where 1 = 1
  AND (property_state IN(${marq}))
  AND (document_amount between ${salePriceFrom} and ${salePriceTo})
  AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
  limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined &&
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined
    ) {
      const sql = `SELECT *
  FROM ${this.DB_SCHEMA}.vw_recorder
  where 1 = 1
  AND (property_state IN(${marq}))
  AND (document_amount between ${salePriceFrom} and ${salePriceTo})
  limit 100 offset ${offset}
  `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`

      SELECT count(*)
  FROM ${this.DB_SCHEMA}.vw_recorder
  where 1 = 1
  AND (property_state IN(${marq}))
  AND (document_amount between ${salePriceFrom} and ${salePriceTo})
  limit 100 offset ${offset}
      `);


      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }

   else if (
      state !== '' &&
      state !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
limit 100 offset ${offset}
`;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
         const count = await this.leadsRepository.dataSource.execute(`

         SELECT count(*)
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
limit 100 offset ${offset}

         `);


      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
     else if (
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
        FROM ${this.DB_SCHEMA}.vw_recorder
        where 1 = 1
        AND (document_amount between ${salePriceFrom} and ${salePriceTo})
        AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
        limit 100 offset ${offset}
        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`
      SELECT count(*)
        FROM ${this.DB_SCHEMA}.vw_recorder
        where 1 = 1
        AND (document_amount between ${salePriceFrom} and ${salePriceTo})
        AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
        limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else if (
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined
    ) {
      const sql = `SELECT *
        FROM ${this.DB_SCHEMA}.vw_recorder
        where 1 = 1
        AND (document_amount between ${salePriceFrom} and ${salePriceTo})
        limit 100 offset ${offset}
        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`
      SELECT count(*)
        FROM ${this.DB_SCHEMA}.vw_recorder
        where 1 = 1
        AND (document_amount between ${salePriceFrom} and ${salePriceTo})
        limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else if (
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
        FROM ${this.DB_SCHEMA}.vw_recorder
        where 1 = 1
        AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
        limit 100 offset ${offset}
        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`
      SELECT count(*)
        FROM ${this.DB_SCHEMA}.vw_recorder
        where 1 = 1
        AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )
        limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined
    ) {
      const sql = `SELECT *
  FROM ${this.DB_SCHEMA}.vw_recorder
  where 1 = 1
  AND (property_state IN(${marq}))
  limit 100 offset ${offset}
  `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`

      SELECT count(*)
  FROM ${this.DB_SCHEMA}.vw_recorder
  where 1 = 1
  AND (property_state IN(${marq}))
  limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else if (Error()) {
      throw new HttpErrors.InternalServerError();
    }
  }
  @get('/reportyBuilder/byProperty')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async forProperty(
    @param.query.string('state') state?: string,
    @param.query.string('city') city?: string,
    @param.query.string('market') market?: string,
    @param.query.string('submarket') submarket?: string,
    @param.query.string('county') county?: string,
    @param.query.number('punits') punits?: number,
    @param.query.number('punite') punite?: number,
    @param.query.number('ocs') ocs?: number,
    @param.query.number('oce') oce?: number,
    @param.query.number('rrs') rrs?: number,
    @param.query.number('rre') rre?: number,
    @param.query.string('la') la?: string,
    @param.query.string('owner') owner?: string,
    @param.query.string('segement') segment?: string,
    @param.query.number('ytms') ytms?: number,
     @param.query.number('ytme') ytme?: number,
    @param.query.number('offset', {default: 0}) offset?: number,
  ): Promise<any> {
    let marq: any = '';
    let mmarq: any = '';
    let smarq: any = '';
    let cityc: any = '';
    let addc: any = '';
    let own: any = '';
    let seg: any = '';
      const mmar = market?.split(',');
      mmarq = "'" + mmar?.join("','") + "'";
      const smar = submarket?.split(',');
      smarq = "'" + smar?.join("','") + "'";
      const mar = state?.split(',');
      marq = "'" + mar?.join("','") + "'";
      const cit = city?.split(',');
      cityc = "'" + cit?.join("','") + "'";
      const add = county?.split(',');
      addc= "'" + add?.join("','") + "'";
      const ow = owner?.split(',');
      own= "'" + ow?.join("','") + "'";
      const se = segment?.split(',');
      seg= "'" + se?.join("','") + "'";
let allState='' ;
let allCity='';
let allCounty='';
let allMArket='';
let allSMArket='';
let allPunit='';
let allOcr='';
let allRr='';
let allLa='';
let allOwner='';
let allSeg='';
let allYtms='';

    if (
      state !== '' &&
      state !== undefined

    ) {
      allState = `AND (state IN(${marq}))`;
    }
    if (
      city !== '' &&
      city !== undefined

    ) {
      allCity = `AND (city IN(${cityc}))`;
    }
    if (
      county !== '' &&
      county !== undefined

    ) {
      allCounty = `  AND (county IN(${addc}))`;
    }
    if (
      market !== '' &&
      market !== undefined

    ) {
      allMArket = `  AND (market IN(${mmarq}))`;
    }
    if (
      submarket !== '' &&
      submarket !== undefined

    ) {
      allSMArket = `  AND (sub_market IN(${smarq}))`;
    }
    if (
      punits !== null &&
      punits !== undefined &&
      punite !== null &&
      punite !== undefined

    ) {
      allPunit = ` and units_count between ${punits} and ${punite}`;
    }
    if (
      ocs !== null &&
      ocs !== undefined &&
      oce !== null &&
      oce !== undefined

    ) {
      allOcr = ` and latest_occupancy_rate between ${ocs} and ${oce}`;
    }
    if (
      rrs !== null &&
      rrs !== undefined &&
      rre !== null &&
      rre !== undefined

    ) {
      allRr = ` and latest_monthly_rent between ${rrs} and ${rre}`;
    }

    if (
      ytms !== null &&
      ytms !== undefined &&
      ytme !== null &&
      ytme !== undefined

    ) {
      allYtms = `and years_to_mature  between ${ytms} and ${ytme}`;
    }
    if (
      la !== '' &&
      la !== undefined


    ) {
if (la==='No'){

  allLa=`and loan_maturity_date is  null`;

}
else if (la==='Yes'){
allLa=`and loan_maturity_date is not null `;
}

    }
    if (
      owner !== '' &&
      owner !== undefined

    ) {
      allOwner = `  AND (owner_name IN(${own}))`;
    }
    if (
      segment !== '' &&
      segment !== undefined

    ) {
      allSeg = `  AND (owner_segment IN(${seg}))`;
    }




    const data = `
                    SELECT * FROM ${this.DB_SCHEMA}.vw_rb_property_details
                    where 1 = 1
                    ${allState}
                    ${allCity}
                    ${allCounty}
                    ${allMArket}
                    ${allSMArket}
                    ${allPunit}
                    ${allOcr}${allRr}
                    ${allLa}
                    ${allOwner}
                    ${allSeg}
                    ${allYtms}
                    order by market
                    limit 100 offset ${offset}
                  `;
                  const countdata = `
                  SELECT * FROM ${this.DB_SCHEMA}.vw_rb_property_details
                  where 1 = 1
                  ${allState}
                  ${allCity}
                  ${allCounty}
                  ${allMArket}
                  ${allSMArket}
                  ${allPunit}
                  ${allOcr}${allRr}
                  ${allLa}
                  ${allOwner}
                  ${allSeg}
                  ${allYtms}
order by market
                `;
                  const all = await this.leadsRepository.dataSource.execute(data)
                  const count = await this.leadsRepository.dataSource.execute(countdata)

                  if (all.length > 0) {
                    return {all,count};
                  } else {
                    return 'No Data Available';
                  }



  }
  @get('/reportyBuilder/byProperty/minMax')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async minMax(

  ): Promise<any> {




    const count = `
    SELECT min(units_count)as minUnit,max(units_count)as maxUnit,
    min(latest_occupancy_rate)as minOccupancy,max(latest_occupancy_rate)as maxOccupancy,
    min(latest_monthly_rent)as minRent
    ,max(latest_monthly_rent)as MaxRent
    FROM ${this.DB_SCHEMA}.vw_rb_property_details
                  `;
                  const all = await this.leadsRepository.dataSource.execute(count)
return all;


  }
  @get('/reportyBuilder/byProperty/export')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async forPExport(
    @param.query.string('state') state?: string,
    @param.query.string('city') city?: string,
    @param.query.string('market') market?: string,
    @param.query.string('submarket') submarket?: string,
    @param.query.string('county') county?: string,
    @param.query.number('punits') punits?: number,
    @param.query.number('punite') punite?: number,
    @param.query.number('ocs') ocs?: number,
    @param.query.number('oce') oce?: number,
    @param.query.number('rrs') rrs?: number,
    @param.query.number('rre') rre?: number,
    @param.query.string('la') la?: string,
    @param.query.string('owner') owner?: string,
    @param.query.string('segement') segment?: string,
    @param.query.number('ytms') ytms?: number,
     @param.query.number('ytme') ytme?: number,
    @param.query.number('offset', {default: 0}) offset?: number,
  ): Promise<any> {
    let marq: any = '';
    let mmarq: any = '';
    let smarq: any = '';
    let cityc: any = '';
    let addc: any = '';
    let own: any = '';
    let seg: any = '';
      const mmar = market?.split(',');
      mmarq = "'" + mmar?.join("','") + "'";
      const smar = submarket?.split(',');
      smarq = "'" + smar?.join("','") + "'";
      const mar = state?.split(',');
      marq = "'" + mar?.join("','") + "'";
      const cit = city?.split(',');
      cityc = "'" + cit?.join("','") + "'";
      const add = county?.split(',');
      addc= "'" + add?.join("','") + "'";
      const ow = owner?.split(',');
      own= "'" + ow?.join("','") + "'";
      const se = segment?.split(',');
      seg= "'" + se?.join("','") + "'";
let allState='' ;
let allCity='';
let allCounty='';
let allMArket='';
let allSMArket='';
let allPunit='';
let allOcr='';
let allRr='';
let allLa='';
let allOwner='';
let allSeg='';
let allYtms='';

    if (
      state !== '' &&
      state !== undefined

    ) {
      allState = `AND (state IN(${marq}))`;
    }
    if (
      city !== '' &&
      city !== undefined

    ) {
      allCity = `AND (city IN(${cityc}))`;
    }
    if (
      county !== '' &&
      county !== undefined

    ) {
      allCounty = `  AND (county IN(${addc}))`;
    }
    if (
      market !== '' &&
      market !== undefined

    ) {
      allMArket = `  AND (market IN(${mmarq}))`;
    }
    if (
      submarket !== '' &&
      submarket !== undefined

    ) {
      allSMArket = `  AND (sub_market IN(${smarq}))`;
    }
    if (
      punits !== null &&
      punits !== undefined &&
      punite !== null &&
      punite !== undefined

    ) {
      allPunit = ` and units_count between ${punits} and ${punite}`;
    }
    if (
      ocs !== null &&
      ocs !== undefined &&
      oce !== null &&
      oce !== undefined

    ) {
      allOcr = ` and latest_occupancy_rate between ${ocs} and ${oce}`;
    }
    if (
      rrs !== null &&
      rrs !== undefined &&
      rre !== null &&
      rre !== undefined

    ) {
      allRr = ` and latest_monthly_rent between ${rrs} and ${rre}`;
    }

    if (
      ytms !== null &&
      ytms !== undefined &&
      ytme !== null &&
      ytme !== undefined

    ) {
      allYtms = `and years_to_mature  between ${ytms} and ${ytme}`;
    }
    if (
      la !== '' &&
      la !== undefined


    ) {
if (la==='No'){

  allLa=`and loan_maturity_date is  null`;

}
else if (la==='Yes'){
allLa=`and loan_maturity_date is not null `;
}

    }
    if (
      owner !== '' &&
      owner !== undefined

    ) {
      allOwner = `  AND (owner_name IN(${own}))`;
    }
    if (
      segment !== '' &&
      segment !== undefined

    ) {
      allSeg = `  AND (owner_segment IN(${seg}))`;
    }




    const data = `
                    SELECT * FROM ${this.DB_SCHEMA}.vw_rb_property_details
                    where 1 = 1
                    ${allState}
                    ${allCity}
                    ${allCounty}
                    ${allMArket}
                    ${allSMArket}
                    ${allPunit}
                    ${allOcr}${allRr}
                    ${allLa}
                    ${allOwner}
                    ${allSeg}
                    ${allYtms}
                  `;

                  const all = await this.leadsRepository.dataSource.execute(data)

                  if (all.length > 0) {
                    return all;
                  } else {
                    return 'No Data Available';
                  }
  }

  @get('/reportyBuilder/byPropertyOLd')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async forPropertyold(
    @param.query.string('state') state?: string,
    @param.query.string('city') city?: string,
    @param.query.string('address') address?: string,
    @param.query.number('offset', {default: 0}) offset?: number,
  ): Promise<any> {
    let marq: any = '';
    let cityc: any = '';
    let addc: any = '';
      const mar = state?.split(',');
      marq = "'" + mar?.join("','") + "'";
      const cit = city?.split(',');
      cityc = "'" + cit?.join("','") + "'";
      const add = address?.split(',');
      addc= "'" + add?.join("','") + "'";

    if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined &&
      address !== '' &&
      address !== undefined
    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        AND (city IN(${cityc}))
        AND (address IN(${addc}))
        limit 100 offset ${offset}
        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`
      SELECT count(*)
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        AND (city IN(${cityc}))
        AND (address IN(${addc}))
        limit 100 offset ${offset}

      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else  if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined

    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        AND (city IN(${cityc}))
        limit 100 offset ${offset}
        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`

      SELECT count(*)
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        AND (city IN(${cityc}))
        limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined &&
      address !== '' &&
      address !== undefined
    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        AND (address IN(${addc}))
        limit 100 offset ${offset}
        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`

      SELECT count(*)
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        AND (address IN(${addc}))
        limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined

    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        limit 100 offset ${offset}
        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);
      const count = await this.leadsRepository.dataSource.execute(`
      SELECT count(*)
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        limit 100 offset ${offset}
      `);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return {allSales,count};
      } else {
        return 'No Data Available';
      }
    }
    else if (Error()) {
      throw new HttpErrors.InternalServerError();
    }
  }
  @get('/reportyBuilder/bySales/exportold')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async forSalesExport(
    @param.query.string('state') state?: string,
    @param.query.string('city') city?: string,
    @param.query.number('salePriceFrom') salePriceFrom?: number,
    @param.query.number('salePriceTo') salePriceTo?: number,
    @param.query.string('salePeriodFrom', {default: null}) salePeriodFrom?: string,
    @param.query.string('salePeriodTo', {default: null}) salePeriodTo?: string,

  ): Promise<any> {
    let marq: any = '';
    let cityc: any = '';

      const mar = state?.split(',');
      marq = "'" + mar?.join("','") + "'";


      const cit = city?.split(',');
      cityc = "'" + cit?.join("','") + "'";

    if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined &&
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_recorder
      where 1 = 1
        AND (property_state IN(${marq}))
        AND (property_city IN(${cityc}))
        AND (document_amount between ${salePriceFrom} and ${salePriceTo})
        AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )

        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
   else if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined &&
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined
    ) {
      const sql = `SELECT *
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (property_city IN(${cityc}))
AND (document_amount between ${salePriceFrom} and ${salePriceTo})

`;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
  else if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (property_city IN(${cityc}))
AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )

`;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined
    ) {
      const sql = `SELECT *
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (property_city IN(${cityc}))

`;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
     else if (
      state !== '' &&
      state !== undefined &&
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
  FROM ${this.DB_SCHEMA}.vw_recorder
  where 1 = 1
  AND (property_state IN(${marq}))
  AND (document_amount between ${salePriceFrom} and ${salePriceTo})
  AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )

  `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined &&
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined
    ) {
      const sql = `SELECT *
  FROM ${this.DB_SCHEMA}.vw_recorder
  where 1 = 1
  AND (property_state IN(${marq}))
  AND (document_amount between ${salePriceFrom} and ${salePriceTo})

  `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }

   else if (
      state !== '' &&
      state !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
FROM ${this.DB_SCHEMA}.vw_recorder
where 1 = 1
AND (property_state IN(${marq}))
AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )

`;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
     else if (
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined &&
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
        FROM ${this.DB_SCHEMA}.vw_recorder
        where 1 = 1
        AND (document_amount between ${salePriceFrom} and ${salePriceTo})
        AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )

        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else if (
      salePriceFrom !== null &&
      salePriceFrom !== undefined &&
      salePriceTo !== null &&
      salePriceTo !== undefined
    ) {
      const sql = `SELECT *
        FROM ${this.DB_SCHEMA}.vw_recorder
        where 1 = 1
        AND (document_amount between ${salePriceFrom} and ${salePriceTo})

        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else if (
      salePeriodFrom !== null &&
      salePeriodFrom !== undefined &&
      salePeriodTo !== null &&
      salePeriodTo !== undefined
    ) {
      const sql = `SELECT *
        FROM ${this.DB_SCHEMA}.vw_recorder
        where 1 = 1
        AND (document_recorded_date between '${salePeriodFrom}' and '${salePeriodTo}' )

        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined
    ) {
      const sql = `SELECT *
  FROM ${this.DB_SCHEMA}.vw_recorder
  where 1 = 1
  AND (property_state IN(${marq}))

  `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else if (Error()) {
      throw new HttpErrors.InternalServerError();
    }
  }
  @get('/reportyBuilder/byProperty/exportold')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async forPropertyExport(
    @param.query.string('state') state?: string,
    @param.query.string('city') city?: string,
    @param.query.string('address') address?: string,
  ): Promise<any> {
    let marq: any = '';
    let cityc: any = '';
    let addc: any = '';
      const mar = state?.split(',');
      marq = "'" + mar?.join("','") + "'";
      const cit = city?.split(',');
      cityc = "'" + cit?.join("','") + "'";
      const add = address?.split(',');
      addc= "'" + add?.join("','") + "'";

    if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined &&
      address !== '' &&
      address !== undefined
    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        AND (city IN(${cityc}))
        AND (address IN(${addc}))

        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else  if (
      state !== '' &&
      state !== undefined &&
      city !== '' &&
      city !== undefined

    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        AND (city IN(${cityc}))

        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined &&
      address !== '' &&
      address !== undefined
    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))
        AND (address IN(${addc}))

        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else if (
      state !== '' &&
      state !== undefined

    ) {
      const sql = `SELECT *
      FROM ${this.DB_SCHEMA}.vw_tax_assessor
      where 1 = 1
        AND (state IN(${marq}))

        `;

      console.log('sql ', sql);
      const allSales = await this.leadsRepository.dataSource.execute(sql);

      console.table('data', allSales);
      if (allSales.length > 0) {
        return allSales;
      } else {
        return 'No Data Available';
      }
    }
    else if (Error()) {
      throw new HttpErrors.InternalServerError();
    }
  }



  @get('/reportyBuilder/byOccupancy')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async allOccupancy(
    @param.query.string('market') market?: string,
    @param.query.string('submarket') submarket?: string,
    @param.query.string('city') city?: string,
    @param.query.string('propertyClass', {default: null})
    propertyClass?: string,
    @param.query.number('offset', {default: 0}) offset?: number,
  ): Promise<any> {
    if (
      market === undefined &&
      city === undefined &&
      submarket === undefined &&
      propertyClass === undefined
    ) {
      return 'All Filter data are NUll ';
    }

    let marq: any = '';
    let smc: any = '';
    let cityc: any = '';
    let acc: any = '';
    if (market === undefined) {
      marq = null;
    } else {
      const mar = market?.split(',');
      marq = "'" + mar?.join("','") + "'";
    }
    if (city === undefined) {
      cityc = null;
    } else {
      const cit = city?.split(',');
      cityc = "'" + cit?.join("','") + "'";
    }
    if (propertyClass === undefined) {
      acc = null;
    } else {
      const ac = propertyClass?.split(',');
      acc = "'" + ac?.join("','") + "'";
    }
    if (submarket === undefined) {
      smc = null;
    } else {
      const sm = submarket?.split(',');
      smc = "'" + sm?.join("','") + "'";
    }
    const sql = `SELECT *
 FROM ${this.DB_SCHEMA}.report_builder_occupancy
 where 1 = 1
   AND (market IN(${marq}) OR market IS NULL)
   AND (submarket IN(${smc}) OR submarket IS NULL)
   AND (city IN(${cityc}) OR city IS NULL)
     AND (property_asset_class IN (${acc}) or property_asset_class IS NUll )
   limit 100 offset ${offset}
   `;

    console.log('sql ', sql);
    const allRent = await this.leadsRepository.dataSource.execute(sql);
    if (allRent.length > 0) {
      return allRent;
    } else {
      return 'No Data Available';
    }
  }
  @get('/reportyBuilder/byRent')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async allRent(
    @param.query.string('market') market?: string,
    @param.query.string('submarket') submarket?: string,
    @param.query.string('city') city?: string,
    @param.query.string('propertyClass', {default: null})
    propertyClass?: string,
    @param.query.number('offset', {default: 0}) offset?: number,
  ): Promise<any> {
    if (
      market === undefined &&
      city === undefined &&
      submarket === undefined &&
      propertyClass === undefined
    ) {
      return 'All Filter data are NUll ';
    }

    let marq: any = '';
    let smc: any = '';
    let cityc: any = '';
    let acc: any = '';
    if (market === undefined) {
      marq = null;
    } else {
      const mar = market?.split(',');
      marq = "'" + mar?.join("','") + "'";
    }
    if (city === undefined) {
      cityc = null;
    } else {
      const cit = city?.split(',');
      cityc = "'" + cit?.join("','") + "'";
    }
    if (propertyClass === undefined) {
      acc = null;
    } else {
      const ac = propertyClass?.split(',');
      acc = "'" + ac?.join("','") + "'";
    }
    if (submarket === undefined) {
      smc = null;
    } else {
      const sm = submarket?.split(',');
      smc = "'" + sm?.join("','") + "'";
    }
    const sql = `SELECT *
 FROM ${this.DB_SCHEMA}.report_builder_rent
 where 1 = 1
   AND (market IN(${marq}) OR market IS NULL)
   AND (submarket IN(${smc}) OR submarket IS NULL)
   AND (city IN(${cityc}) OR city IS NULL)
     AND (property_asset_class IN (${acc}) or property_asset_class IS NUll )
   limit 100 offset ${offset}
   `;

    console.log('sql ', sql);
    const allRent = await this.leadsRepository.dataSource.execute(sql);
    if (allRent.length > 0) {
      return allRent;
    } else {
      return 'No Data Available';
    }
  }

  @get('/reportyBuilder/byRent/marketCity')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async byRent(): Promise<any> {
    const marketCity = await this.leadsRepository.dataSource.execute(`
   select
distinct on (rbs.market )
rbs.market ,
string_agg(distinct rbs.city , ', ') AS city_list,
string_agg(distinct rbs.submarket , ', ') AS submarket_list,
string_agg(distinct rbs.property_asset_class , ', ') AS property_asset_class
from ${this.DB_SCHEMA}.report_builder_rent rbs
group by 1
`);

    return marketCity;
  }
  @get('/reportyBuilder/byOccupancy/marketCity')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async byOccupancy(): Promise<any> {
    const marketCity = await this.leadsRepository.dataSource.execute(`
   select
distinct on (rbs.market )
rbs.market ,
string_agg(distinct rbs.city , ', ') AS city_list,
string_agg(distinct rbs.submarket , ', ') AS submarket_list,
string_agg(distinct rbs.property_asset_class , ', ') AS property_asset_class
from ${this.DB_SCHEMA}.report_builder_occupancy rbs
group by 1
`);

    return marketCity;
  }

  @get('/reportyBuilder/bySales/marketCity')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async bysales(): Promise<any> {
    const marketCity = await this.leadsRepository.dataSource.execute(`
   select
   distinct on (vr.property_state)
   vr.property_state ,
   string_agg(distinct vr.property_city, ',') AS city_list
   from ${this.DB_SCHEMA}.vw_recorder vr
   group by 1
`);

    return marketCity;
  }

  @get('/reportyBuilder/byProperty/marketCity')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async byproperty(): Promise<any> {
    const marketCity = await this.leadsRepository.dataSource.execute(`
    select
    distinct on (vr.market)
    vr.market,
    string_agg(distinct vr.sub_market, ',') AS sub_market_list,
    string_agg(distinct vr.state, ',') AS state_list,
    string_agg(distinct vr.county, ',') AS county_list,
    string_agg(distinct vr.city, ',') AS city_list
    from ${this.DB_SCHEMA}.vw_rb_property_details vr
    group by 1

`);

    return marketCity;
  }
  @get('/reportyBuilder/byProperty/ownerSegment')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async byowner(): Promise<any> {
    const marketCity = await this.leadsRepository.dataSource.execute(`
    select  string_agg(distinct vr.owner_name , ',') AS owner_list, string_agg(distinct vr.owner_segment , ',') AS segment_list
    FROM ${this.DB_SCHEMA}.vw_rb_property_details vr;

`);

    return marketCity;
  }

  @get('/leads/byStatus')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async leads(
    @param.query.string('status') status?: string,
    @param.query.string('probability') probability?: string,
    @param.query.string('market') market?: string,
    @param.query.string('org') org?: string,
    @param.query.number('offset') offset?: number,
  ): Promise<any> {




      const propen = probability?.split(',');
      const  propenq = "'" + propen?.join("','") + "'";



      const mark = market?.split(',');
       const markc = "'" + mark?.join("','") + "'";


if (status === 'LEAD'){
  const count = await this.leadsRepository.dataSource.execute(
`
SELECT * FROM ${this.DB_SCHEMA}.lead_user_org_vw
where agent_id = '${org}'
`  )
if (count.length >= 1){
const s =  `
SELECT l.*,
(SELECT COUNT(*) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') AS notes_count,
       (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') AS latest_inserted_on
FROM ${this.DB_SCHEMA}.leads_status_leads_vw l
where l.tax_assessor_id not in (
  SELECT tax_assessor_id FROM ${this.DB_SCHEMA}.lead_user_org_vw
  where agent_id = '${org}'
)
AND (probability IN (${propenq}) )
AND (state IN (${markc}) )
order by
case probability
     when 'Hot' then 1
      when 'Warm' then 2
      when 'Cold' then 3
      end,
      CASE
      WHEN (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') IS NULL THEN 2
      ELSE 1
    END,
    (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') DESC,
      property_name asc
limit 102 offset ${offset}
`;

console.log('ssssaaaa',s)
  const sql = await this.leadsRepository.dataSource.execute(s)
  if (sql.length >= 1){
    return sql
  }
  else {
    return 'No data Matched'
  }

}
else {
  const s =  `
  SELECT l.*,
  (SELECT COUNT(*) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') AS notes_count,
  (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') AS latest_inserted_on
FROM ${this.DB_SCHEMA}.leads_status_leads_vw l
WHERE
  (probability IN (${propenq}) )
  AND (state IN (${markc}) )
ORDER BY
  CASE probability
    WHEN 'Hot' THEN 1
    WHEN 'Warm' THEN 2
    WHEN 'Cold' THEN 3
  END,
  CASE
    WHEN (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') IS NULL THEN 2
    ELSE 1
  END,
  (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') DESC,
  property_name ASC
LIMIT 102 OFFSET ${offset};

  `;
  console.log('sssss',s)
  const sql = await this.leadsRepository.dataSource.execute(s)
if (sql.length >= 1){
  return sql
}
else {
  return 'No data Matched'
}

}

}
else{
  const s =  `
  SELECT *
FROM (
  SELECT DISTINCT ON (l.tax_assessor_id) l.*
  FROM ${this.DB_SCHEMA}.lead_user_org_vw l
  WHERE l.agent_id = '${org}'
  ORDER BY l.tax_assessor_id, l.insert_date DESC
) subquery
WHERE subquery.status = '${status}'
  AND subquery.probability IN (${propenq})
  AND subquery.state IN (${markc})
  order by case probability
  when 'Hot' then 1
   when 'Warm' then 2
   when 'Cold' then 3
   end,
   insert_date DESC
limit 102 offset ${offset}

;

  `;
  console.log('sql ',s)
  const sql = await this.leadsRepository.dataSource.execute(s)
if(sql.length >= 1){
  return sql}
else{
  return 'No data Found'
}




}





  }
  @get('/leads/market')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async market(

  ): Promise<any> {

    const sql = await this.leadsRepository.dataSource.execute(
      `
      SELECT distinct state from ${this.DB_SCHEMA}.leads_status_leads_vw

      `  )








return sql;





  }



  @get('/leads/buyers/byPropertyId')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async buyersid(
    @param.query.string('propertyId') propertyId?: string,
    @param.query.string('org') org?: string,
  ): Promise<any> {
    const funnel = await this.leadsRepository.dataSource.execute(`
    SELECT DISTINCT tlbr.*, most_recent_buyer.contacted, most_recent_buyer.interested, most_recent_buyer.addnotes, most_recent_buyer.agent_id, most_recent_buyer.rn
    FROM ${this.DB_SCHEMA}.vw_leads_potential_buyers tlbr
    LEFT JOIN (
      SELECT bc.*, u.*, ROW_NUMBER() OVER (PARTITION BY bc.property_id, bc.buyers_name ORDER BY bc.inserted_on DESC) AS rn
      FROM ${this.DB_SCHEMA}.leads_buyers_contact bc
      LEFT JOIN ${this.DB_SCHEMA}.users u ON bc.username = u.username
      WHERE u.agent_id = '${org}'
    ) AS most_recent_buyer
    ON tlbr.tax_assessor_id = most_recent_buyer.property_id AND tlbr.buyer_name = most_recent_buyer.buyers_name

    WHERE tlbr.tax_assessor_id = '${propertyId}' AND (most_recent_buyer.rn = 1 OR most_recent_buyer.rn IS NULL);


`);
    return funnel;
  }
  @get('/leads/buyers/notes')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async buyersnaotes(
    @param.query.string('propertyId') propertyId?: string,
    @param.query.string('org') org?: string,
    @param.query.string('buyerName') buyerName?: string,
  ): Promise<any> {
    const notes = await this.leadsRepository.dataSource.execute(`
    SELECT bc.*,u.firstname,u.lastname
  FROM ${this.DB_SCHEMA}.leads_buyers_contact bc
  LEFT JOIN ${this.DB_SCHEMA}.users u ON bc.username = u.username
  WHERE u.agent_id = '${org}'
  and property_id = '${propertyId}'
  and buyers_name = '${buyerName}'
`);
    return notes;
  }
  @get('/buyerseller/map')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async map(@param.query.string('segment') segment?: string): Promise<any> {
    const funnel = await this.leadsRepository.dataSource.execute(`
   select owner_state , count(distinct owner_name)as owner_name
from ${this.DB_SCHEMA}.vw_owner_profiles sbd
where owner_segment = '${segment}'
group by owner_state
`);
    return funnel;
  }
  @get('/buyerseller/topFive')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async topFive(): Promise<any> {
    const buyersr = await this.leadsRepository.dataSource.execute(`
   select *
from ${this.DB_SCHEMA}.vw_top_5_buyers
`);
    const sellerr = await this.leadsRepository.dataSource.execute(`
select *
from ${this.DB_SCHEMA}.vw_top_5_sellers

`);
    return {buyersr, sellerr};
  }
  @get('/buyerseller/card')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async bschart(): Promise<any> {
    const funnel = await this.leadsRepository.dataSource.execute(`
    select owner_segment , count(distinct owner_name)as owner_name,
    sum(total_property_owned)as total_property_owned,
 round(cast (sum(avg_monetary)/count(distinct owner_name)AS numeric),2)  as avgDollarValue
from ${this.DB_SCHEMA}.vw_owner_profiles sbd
group by owner_segment
`);
    return funnel;
  }
  @post('/deals/user/recommendation')
  @response(200, {
    description: 'users percent for deals recommendation',
  })
  async percent(
    @requestBody()
    required: {
      users: string;
      percent: number;
    },
  ): Promise<any> {
    await this.leadsRepository.dataSource.execute(`



    INSERT INTO ${this.DB_SCHEMA}.deal_user_recomendation
    (users, "percent") VALUES('${required.users}',${required.percent});
    `);
  }
  @get('/deals/user/recommendation')
  @response(200, {
    description: 'Array of aibased model instances',
  })
  async users(@param.query.string('users') users?: string): Promise<any> {
    const aibased = await this.leadsRepository.dataSource.execute(`
   SELECT * FROM ${this.DB_SCHEMA}.deal_user_recomendation WHERE  updated_on =
   (select max(updated_on) from ${this.DB_SCHEMA}.deal_user_recomendation where users = '${users}')
`);
    return aibased;
  }

  @get('/deals/aibased')
  @response(200, {
    description: 'Array of aibased model instances',
  })
  async aibased(@param.query.string('org') org?: string): Promise<any> {
    const aibased = await this.leadsRepository.dataSource.execute(`
    select
    MAX(coalesce(deal_value, '0'))as highestClosingCurrentMonth,

    (select AVG(deal_value::numeric) from ${this.DB_SCHEMA}.lead_user_org_vw l where agent_id = '${org}' and status = 'CLOSED'
    and insert_date >= date_trunc('month',now()- INTERVAL '3 months')) as averageQuaterSum,

    (select COUNT(tax_assessor_id) from ${this.DB_SCHEMA}.lead_user_org_vw l where agent_id = '${org}' and status = 'CLOSED'
    and insert_date >= date_trunc('month',now()- INTERVAL '3 months'))as averageQuaterCount,

    (select AVG(deal_value::numeric) from ${this.DB_SCHEMA}.lead_user_org_vw l where agent_id = '${org}' and status = 'CLOSED'
    and insert_date >= date_trunc('month',now()- INTERVAL '12 months')) as averageAnnualSum,

    (select COUNT(tax_assessor_id) from ${this.DB_SCHEMA}.lead_user_org_vw l where agent_id = '${org}' and status = 'CLOSED'
    and insert_date >= date_trunc('month',now()- INTERVAL '12 months'))as averageAnnualCount,

    (SELECT count(max_dates.property_id) FROM ( SELECT DISTINCT ON (property_id) property_id,contacted, inserted_on AS max_inserted_on
  FROM ${this.DB_SCHEMA}.buyers_contact_org_vw WHERE agent_id = '${org}'GROUP BY property_id, contacted,inserted_on ORDER by property_id, contacted,
  inserted_on DESC) max_dates WHERE max_inserted_on >= date_trunc('month', now()) AND contacted IS true)as totalPeopleContacted,

  (SELECT count(max_dates.property_id) FROM ( Select DISTINCT ON (property_id)  property_id,interested, inserted_on AS max_inserted_on
  FROM ${this.DB_SCHEMA}.buyers_contact_org_vw WHERE agent_id = '${org}'GROUP BY property_id, interested,inserted_on ORDER by property_id,inserted_on desc,
  interested ) max_dates WHERE max_inserted_on >= date_trunc('month', now()) AND interested IS true)as totalInterestedBuyers,


    COUNT(*) as closedCountCurrentMonth,

    (select COUNT(tax_assessor_id)	from ${this.DB_SCHEMA}.leads_status_leads_vw where	created_date = date_trunc('month',now())) as allLeadsCurrentMonth


  --		,
  --	(
  --	cast
  --	(
  --		(
  --			select
  --				COUNT(*)
  --			from
  --				${this.DB_SCHEMA}.lead_user_org_vw
  --			where
  --				agent_id = '${org}'
  --				and status = 'CLOSED'
  --		) as float
  --	)
  --    /
  --	    (
  --
  --
  --			select
  --				COUNT(tax_assessor_id)
  --			from
  --				${this.DB_SCHEMA}.leads_status_leads_vw
  --				where
  --		created_date = date_trunc('month',now() )
  --		)
  --	) * 100 as CurrentConversionRate
  from
    ${this.DB_SCHEMA}.lead_user_org_vw l
  where
    agent_id = '${org}'
    and status = 'CLOSED'
    and insert_date >= date_trunc('month',
    now());
`);
    return aibased;
  }
  @get('/deals/leadsactual')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async leadsactual(): Promise<any> {
    const forecast = await this.leadsRepository.dataSource.execute(`
   select "Date",Actual_Leads,Forecasted_Leads from ${this.DB_SCHEMA}.deal_analytics_funnel
where "Date" > (select max(daf."Date") from ${this.DB_SCHEMA}.deal_analytics_funnel daf)  - interval '6 month'
order by "Date"

`);
    return forecast;
  }
  @get('/deals/card')
  @response(200, {
    description: 'Array of Leads model instances',
  })
  async dealscard(): // @param.query.string('quater') quater?: string,
  Promise<any> {
    const funnel = await this.leadsRepository.dataSource.execute(`
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
    @param.query.string('month') month?: string,
    @param.query.string('org') org?: string,
  ): Promise<any> {
    const funnel = await this.leadsRepository.dataSource.execute(`
    SELECT
      count(l.tax_assessor_id) as INTERESTED,
      (select COUNT(tax_assessor_id) from ${this.DB_SCHEMA}.lead_user_org_vw l where agent_id = '${org}' and status = 'OFFER SUBMITTED'
	and insert_date >= date_trunc('month',now()- INTERVAL '${month} months')) as OFFER_SUBMITTED,
      (select COUNT(tax_assessor_id) from ${this.DB_SCHEMA}.lead_user_org_vw l where agent_id = '${org}' and status = 'OFFER ACCEPTED'
	and insert_date >= date_trunc('month',now()- INTERVAL '${month} months')) as OFFER_ACCEPTED,
      (select COUNT(tax_assessor_id) from ${this.DB_SCHEMA}.lead_user_org_vw l where agent_id = '${org}' and status = 'UNDER AGREEMENT'
	and insert_date >= date_trunc('month',now()- INTERVAL '${month} months')) as UNDER_AGREEMENT,
      (select COUNT(tax_assessor_id) from ${this.DB_SCHEMA}.lead_user_org_vw l where agent_id = '${org}' and status = 'CLOSED'
	and insert_date >= date_trunc('month',now()- INTERVAL '${month} months')) as CLOSED,
      (select COUNT(tax_assessor_id)	from ${this.DB_SCHEMA}.leads_status_leads_vw where	created_date = date_trunc('month',now()- INTERVAL '${month} months')) as LEADS
    FROM ${this.DB_SCHEMA}.lead_user_org_vw l
    where agent_id = '${org}' and status = 'INTERESTED'
	and insert_date >= date_trunc('month',now()- INTERVAL '${month} months');
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
