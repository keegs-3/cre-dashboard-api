/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  get,
  getJsonSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Leads} from '../models';
import {LeadsRepository} from '../repositories';
import {inject} from '@loopback/core';
import {UserProfile} from '@loopback/security';
@authenticate('jwt')
export class LeadsController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}

  DB_SCHEMA = process.env.DB_SCHEMA;
  @post('/leads/byUser', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(Leads),
        },
      },
    },
  })
  async signup(@requestBody() userData: Leads) {
    return this.leadsRepository.create(userData);
  }

  @get('/leads/byStatus/search')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async search(
    @param.query.string('search') search?: string,
    @param.query.string('status') status?: string,
    @param.query.string('org') org?: string,
    @param.query.number('offset') offset?: string,
  ): Promise<any> {
    if (status === 'LEAD') {
      const count = await this.leadsRepository.dataSource.execute(
        `SELECT * FROM ${this.DB_SCHEMA}.lead_user_org_vw where agent_id = '${org}'`,
      );
      if (count.length >= 1) {
        const s = `
          SELECT l.*,
          (SELECT COUNT(*) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') AS notes_count,
          (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') AS latest_inserted_on
          FROM ${this.DB_SCHEMA}.leads_status_leads_vw l
          where l.tax_assessor_id not in (
          SELECT tax_assessor_id FROM ${this.DB_SCHEMA}.lead_user_org_vw
          where agent_id = '${org}'
          )
          AND (organization IN ('all','${org}'))
and property_name ILIKE '%${search}%'
          limit 102 offset ${offset}
          `;

        console.log('ssssaaaa', s);
        const sql = await this.leadsRepository.dataSource.execute(s);
        if (sql.length >= 1) {
          return sql;
        } else {
          return 'No data Matched';
        }
      } else {
        const s = `
        SELECT l.*,
        (SELECT COUNT(*) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') AS notes_count,
        (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.leads_notes lnotes WHERE lnotes.property_id = l.tax_assessor_id and lnotes.org = '${org}') AS latest_inserted_on
        FROM ${this.DB_SCHEMA}.leads_status_leads_vw l
        WHERE
        property_name ILIKE '%${search}%'
        AND (organization IN ('all','${org}'))
        LIMIT 102 OFFSET ${offset};

        `;
        console.log('sssss', s);
        const sql = await this.leadsRepository.dataSource.execute(s);
        if (sql.length >= 1) {
          return sql;
        } else {
          return 'No data Matched';
        }
      }
    }

    // when data is not for leads status
    else {
      const s = `
                SELECT *
                FROM (
                SELECT DISTINCT ON (l.tax_assessor_id) l.*
                FROM ${this.DB_SCHEMA}.lead_user_org_vw l
                WHERE l.agent_id = '${org}'
                ORDER BY l.tax_assessor_id, l.insert_date DESC
                ) subquery
               where subquery.property_name ILIKE '%${search}%'
               AND (subquery.organization IN ('all','${org}'))
                limit 102 offset ${offset}

                ;

                `;
      console.log('sql ', s);
      const sql = await this.leadsRepository.dataSource.execute(s);
      if (sql.length >= 1) {
        return sql;
      } else {
        return 'No data Found';
      }
    }
  }

  @get('/leads/byStatus')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async leads(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.string('status') status?: string,
    @param.query.string('probability') probability?: string,
    @param.query.string('owner') owner?: string,
    @param.query.string('property') property?: string,
    @param.query.number('org') org?: number,
    @param.query.string('financial_sent') financial_sent?: string,
    @param.query.string('financial_notsent') financial_notsent?: string,
    @param.query.string('listed') listed?: string,
    @param.query.string('mylist') mylist?: string,
    @param.query.string('userid') userid?: string,
    @param.query.number('subs_id') subs_id?: number,
    @param.query.string('available_off_market') available_off_market?: string,
    @param.query.number('offset') offset?: number,
    @param.query.number('punits') punits?: number,
    @param.query.number('punite') punite?: number,
    @param.query.number('yearbuilds') yearbuilds?: number,
    @param.query.number('yearbuilde') yearbuilde?: number,
  ): Promise<any> {
    const propen = probability?.split(',');
    const propenq = "'" + propen?.join("','") + "'";
    const ownern = owner?.split(',');
    const ownerc = "'" + ownern?.join("','") + "'";
    const propertyn = property?.split(',');
    const propertyc = "'" + propertyn?.join("','") + "'";


      const user = await Promise.resolve(currentUser);
      const subs = await this.leadsRepository.dataSource.execute(
        `
      SELECT *
FROM ${this.DB_SCHEMA}.app_subscription_data
WHERE org = ${user.organization}
  AND jsonb_typeof(users->'users') = 'array'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(users->'users') AS elem
    WHERE elem = '${user[securityId]}'
  );
      `,
      );
if (subs && subs.length > 0) {
  if (status === 'LEAD') {
    // const count = await this.leadsRepository.dataSource.execute(`SELECT * FROM ${this.DB_SCHEMA}.lead_user_org_vw where agent_id = '${org}'`  )
    if (mylist === 'yes') {
      let pu = '';
      if (
        punits !== null &&
        punits !== undefined &&
        punite !== null &&
        punite !== undefined
      ) {
        pu = `AND (units_count between ${punits} and ${punite}  )`;
      }
      let yb = '';
      if (
        yearbuilds !== null &&
        yearbuilds !== undefined &&
        yearbuilde !== null &&
        yearbuilde !== undefined
      ) {
        yb = `AND (year_built between ${yearbuilds} and ${yearbuilde}  )`;
      }
      let ow = '';
      if (owner !== '' && owner !== undefined) {
        ow = `AND (owner_name in( ${ownerc}))`;
      }
      let pr = '';
      if (property !== '' && property !== undefined) {
        pr = `AND (property_name in( ${propertyc}))`;
      }
      let myList = '';
      if (subs_id !== null && subs_id !== undefined) {
        myList = `and (nedl_property_id_pk in (select ln.property_id  FROM ${this.DB_SCHEMA}.app_leads_notes ln where ln.subs_id = '${subs_id}'))`;
      }
      const s = `
          SELECT l.*
          FROM nedl_model.leads_status_leads_vw l
          where
           (lead_type IN (${propenq}))
          ${ow}${pr}${myList}${yb}${pu}
          order by
          case probability
          when 'Hot' then 1
          when 'Warm' then 2
          when 'Cold' then 3
          end,
          CASE
          WHEN
          (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.app_leads_notes lnotes WHERE lnotes.property_id = l.nedl_property_id_pk
          and lnotes.subs_id = ${subs_id} ) IS NULL THEN 2
          ELSE 1
          END,
          limit 102 offset ${offset}
          `;
      console.log('from if ', s);
      const sql = await this.leadsRepository.dataSource.execute(s);
      if (sql.length >= 1) {
        return sql;
      } else {
        return 'No data Matched';
      }
    } else {
      let ow = '';
      if (owner !== '' && owner !== undefined) {
        ow = `AND (owner_name in( ${ownerc}))`;
      }
      let pu = '';
      if (
        punits !== null &&
        punits !== undefined &&
        punite !== null &&
        punite !== undefined
      ) {
        pu = `AND (units_count between ${punits} and ${punite}  )`;
      }
      let yb = '';
      if (
        yearbuilds !== null &&
        yearbuilds !== undefined &&
        yearbuilde !== null &&
        yearbuilde !== undefined
      ) {
        yb = `AND (year_built between ${yearbuilds} and ${yearbuilde}  )`;
      }

      let pr = '';
      if (property !== '' && property !== undefined) {
        pr = `AND (property_name in( ${propertyc}))`;
      }

      const s = `
        SELECT l.* FROM ${this.DB_SCHEMA}.leads_status_leads_vw l
        WHERE
        (lead_type IN (${propenq}))
        And (l.tax_assessor_id not in (select distinct property_id FROM ${this.DB_SCHEMA}.app_leads_notes lnotes where lnotes.subs_id = ${subs_id}))
        ${ow}${pr}${yb}${pu}
        ORDER BY
        CASE probability
        WHEN 'Hot' THEN 1
        WHEN 'Warm' THEN 2
        WHEN 'Cold' THEN 3
        END,
        CASE
        WHEN (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.app_leads_notes lnotes WHERE lnotes.property_id = l.nedl_property_id_pk and lnotes.subs_id = ${subs_id}) IS NULL THEN 2
        ELSE 1
        END
        LIMIT 102 OFFSET ${offset};

        `;
      console.log('from else', s);
      const sql = await this.leadsRepository.dataSource.execute(s);
      if (sql.length >= 1) {
        return sql;
      } else {
        return 'No data Matched';
      }
    }
  }

  // when data is not for leads status
  else {
    let afm = '';
    let l = '';
    let fns = '';
    let fs = '';
    if (available_off_market !== '' && available_off_market !== undefined) {
      afm = `AND (subquery.available_off_market = ${available_off_market})`;
    }
    if (listed !== '' && listed !== undefined) {
      l = `AND (subquery.listed = ${listed})`;
    }
    if (financial_notsent !== '' && financial_notsent !== undefined) {
      fns = `AND (subquery.financial_notsent = ${financial_notsent})`;
    }
    if (financial_sent !== '' && financial_sent !== undefined) {
      fs = `AND (subquery.financial_sent = ${financial_sent})`;
    }
    let ow = '';
    if (owner !== '' && owner !== undefined) {
      ow = `AND (subquery.owner_name in( ${ownerc}))`;
    }
    let pr = '';
    if (property !== '' && property !== undefined) {
      pr = `AND (property_name in( ${propertyc}))`;
    }
    let pu = '';
    if (
      punits !== null &&
      punits !== undefined &&
      punite !== null &&
      punite !== undefined
    ) {
      pu = `AND (subquery.units_count between ${punits} and ${punite}  )`;
    }
    let yb = '';
    if (
      yearbuilds !== null &&
      yearbuilds !== undefined &&
      yearbuilde !== null &&
      yearbuilde !== undefined
    ) {
      yb = `AND (subquery.year_built between ${yearbuilds} and ${yearbuilde}  )`;
    }

    const s = `
                SELECT *
                from nedl_model.lead_gen subquery
                join ${this.DB_SCHEMA}.app_leads_notes ln
                on subquery.nedl_property_id_pk = ln.property_id
                join ${this.DB_SCHEMA}.app_leads_status ls
                on subquery.nedl_property_id_pk = ls.property_id
                WHERE ls.status = '${status}'
                AND subquery.lead_type IN (${propenq})
                and ls.subs_id = ${subs_id}
                ${fns}${fs}${l}${afm}${ow}${pr}${pu}${yb}
                order by
                ln.inserted_on desc,
                ls.insert_date desc,
                subquery.insert_date DESC,
                 case subquery.lead_type
                when 'Hot' then 1
                when 'Warm' then 2
                when 'Cold' then 3
                end
                limit 102 offset ${offset}
                `;
    console.log('sql ', s);
    const sql = await this.leadsRepository.dataSource.execute(s);
    if (sql.length >= 1) {
      return sql;
    } else {
      return 'No data Found';
    }
  }
} else return 'Please ADD Subscription to access Data';

  }

  @get('/leads/ownernameOrProperty')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async ownerorproperty(
    @param.query.string('option') option?: string,
    @param.query.string('search') search?: string,
  ): Promise<any> {
    if (option === 'owner') {
      const sql = await this.leadsRepository.dataSource.execute(
        `
    select distinct l.owner_name from ${this.DB_SCHEMA}.leads l
    where l.owner_name ILIKE '%${search}%'
    order by l.owner_name asc

    `,
      );
      return sql;
    } else if (option === 'property') {
      const sql = await this.leadsRepository.dataSource.execute(
        `
    select distinct l.property_name from ${this.DB_SCHEMA}.leads l
    where l.property_name ILIKE '%${search}%'
    order by l.property_name asc

    `,
      );
      return sql;
    }
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
}
