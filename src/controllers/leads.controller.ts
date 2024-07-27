/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {
  get,
  getJsonSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Leads} from '../models';
import {LeadsRepository, SubscriptionDataRepository} from '../repositories';
import {inject} from '@loopback/core';
import {securityId, UserProfile} from '@loopback/security';
import {UserServiceBindings} from '../keys';
import {MyUserService} from '@loopback/authentication-jwt';
@authenticate('jwt')
export class LeadsController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @repository(SubscriptionDataRepository)
    public subData: SubscriptionDataRepository,
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
    const subs = await this.subData.dataSource.execute(
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
console.log({user,subs})
    const date = new Date();
    if (new Date(subs[0]?.enddate) < date)
      return 'Subscription Expired please renew';
    if (subs && subs.length > 0) {
      if (status === 'LEAD') {
        console.log(status)
        let allMSA = '';
        if (subs[0].typeid !== 3) {
          console.log(subs[0].typeid, 'type');
          console.log(subs[0].sub_data.MSA, 'msa');
          const msan = subs[0].sub_data.MSA;
          console.log(msan, 'msa');
          const msac = "'" + msan?.join("','") + "'";
          allMSA = `and msa_code in (${msac})`;
        }
        console.log(allMSA)
        // const count = await this.leadsRepository.dataSource.execute(`SELECT * FROM ${this.DB_SCHEMA}.lead_user_org_vw where agent_id = '${org}'`  )
        if (mylist === 'yes') {
          console.log('if myleads',mylist)
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
            myList = `and (nedl_property_id_pk in (select ln.property_id  FROM ${this.DB_SCHEMA}.app_leads_notes ln
            where ln.subs_id = '${subs_id}'))`;
          }
          const s = `
          SELECT l.*
          FROM nedl_model.lead_gen l
          where
           (lead_type IN (${propenq}))
          ${ow}${pr}${myList}${yb}${pu}${allMSA}
          order by
           CASE
          WHEN
          (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.app_leads_notes lnotes WHERE lnotes.property_id = l.nedl_property_id_pk
          and lnotes.subs_id = ${subs_id} ) IS NULL THEN 2
          ELSE 1
          END,
          case probability
          when 'Hot' then 1
          when 'Warm' then 2
          when 'Cold' then 3
          end
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
          console.log('if not my list',mylist)
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
        SELECT l.* FROM nedl_model.lead_gen l
        WHERE
        (lead_type IN (${propenq}))
        And (l.nedl_property_id_pk not in (select distinct property_id FROM ${this.DB_SCHEMA}.app_leads_notes lnotes where lnotes.subs_id = ${subs_id}))
        ${ow}${pr}${yb}${pu}${allMSA}
        ORDER BY
        CASE
        WHEN (SELECT MAX(lnotes.inserted_on) FROM ${this.DB_SCHEMA}.app_leads_notes lnotes WHERE lnotes.property_id = l.nedl_property_id_pk and lnotes.subs_id = ${subs_id}) IS NULL THEN 2
        ELSE 1
        END,
        CASE lead_type
        WHEN 'Hot' THEN 1
        WHEN 'Warm' THEN 2
        WHEN 'Cold' THEN 3
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
        console.log('if not leads',status);
        let allMSA = '';
        if (subs[0].typeid !== 3) {
          console.log(subs[0].typeid, 'type');
          console.log(subs[0].sub_data.MSA, 'msa');
          const msan = subs[0].sub_data.MSA;
          console.log(msan, 'msa');
          const msac = "'" + msan?.join("','") + "'";
          allMSA = `and subquery.msa_code in (${msac})`;
        }
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
        let myllist = '';
        if (mylist === 'yes') {
          myllist = `and subquery.nedl_property_id_pk in (select property_id from ${this.DB_SCHEMA}.app_leads_status where subs_id = ${subs_id}
and userid = ${userid}
and insert_date = (select max(insert_date) from ${this.DB_SCHEMA}.app_leads_status where subs_id = ${subs_id}
and userid = ${userid} ))
               `;
        }
        if (mylist === 'no' || mylist === '' || mylist === undefined) {
          myllist = `and subquery.nedl_property_id_pk in (select property_id from ${this.DB_SCHEMA}.app_leads_status where subs_id = ${subs_id}
and insert_date = (select max(insert_date) from ${this.DB_SCHEMA}.app_leads_status where subs_id = ${subs_id}))
               `;
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
                 ${fns}${fs}${l}${afm}${ow}${pr}${pu}${yb}${allMSA}${myllist}
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
    select distinct l.owner_name from nedl_model.lead_gen l
    where l.owner_name ILIKE '%${search}%'
    order by l.owner_name asc
    `,
      );
      return sql;
    } else if (option === 'property') {
      const sql = await this.leadsRepository.dataSource.execute(
        `
    select distinct l.property_name from nedl_model.lead_gen l
    where l.property_name ILIKE '%${search}%'
    order by l.property_name asc
    `,
      );
      return sql;
    }
  }

  @get('/leads/buyers/bypropertyid')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async buyers(
    @param.query.number('property') property?: number,
  ): Promise<any> {
    const sql = await this.leadsRepository.dataSource.execute(
      `
        select * from nedl_model.buyers_recommendation where nedl_property_id_pk = ${property}
    `,
    );
    return sql;
  }

  @get('/leads/minmax')
  @response(200, {
    description: 'Array of buyers page chart model instances',
  })
  async minmax(
    ): Promise<any> {
      const sql = await this.leadsRepository.dataSource.execute(
        `select min(units_count)as minunit ,
         max(units_count)as maxunit , min(year_built)as minyear , max(year_built) as maxyear
          from nedl_model.lead_gen
    `,
      );
      return sql;

  }
}
