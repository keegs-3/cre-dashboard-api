/* eslint-disable no-case-declarations */
/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  get,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {LeadsRepository} from '../repositories';
@authenticate("jwt")
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
  @get('/reportyBuilder/bySales/export')
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
  @get('/reportyBuilder/byProperty/export')
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
   distinct on (vr.state)
   vr.state ,
   string_agg(distinct vr.city, ',') AS city_list
   from ${this.DB_SCHEMA}.vw_tax_assessor vr
   group by 1
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
SELECT l.* FROM ${this.DB_SCHEMA}.leads_status_leads_vw l
where l.tax_assessor_id not in (
  SELECT tax_assessor_id FROM ${this.DB_SCHEMA}.lead_user_org_vw
  where agent_id = '${org}'
)
AND (probability IN (${propenq}) )
AND (state IN (${markc}) )
order by case probability
     when 'Hot' then 1
      when 'Warm' then 2
      when 'Cold' then 3
      end
limit 102 offset ${offset}
`;

console.log('ssss',s)
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
  SELECT l.* FROM ${this.DB_SCHEMA}.leads_status_leads_vw l
  where
   (probability IN (${propenq}) )
  AND (state IN (${markc}) )
  order by case probability
     when 'Hot' then 1
      when 'Warm' then 2
      when 'Cold' then 3
      end
  limit 102 offset ${offset}

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
   end
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
  ): Promise<any> {
    const funnel = await this.leadsRepository.dataSource.execute(`
   select tlbr.*,most_recent_buyer.connected,most_recent_buyer.interested  from ${this.DB_SCHEMA}.tgt_lead_buyers_recommendation tlbr left join
(
	select * from ${this.DB_SCHEMA}.buyers_contact bc
	where date in (
	select max(date) from ${this.DB_SCHEMA}.buyers_contact b group by property_id,buyer_name
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
  async aibased(@param.query.number('quater') quater?: number): Promise<any> {
    const aibased = await this.leadsRepository.dataSource.execute(`
   select * from ${this.DB_SCHEMA}.deal_analytics_recommendations dar
where "Increase %" = ${quater}
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
    @param.query.string('quater') quater?: string,
  ): Promise<any> {
    const funnel = await this.leadsRepository.dataSource.execute(`
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
