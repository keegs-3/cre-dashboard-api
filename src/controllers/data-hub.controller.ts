/* eslint-disable @typescript-eslint/no-explicit-any */
// Uncomment these imports to begin using these cool features!

import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, response, RestBindings} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {UserServiceBindings} from '../keys';
import {SubscriptionDataRepository, UserRepository} from '../repositories';
import {MyUserService} from '../services/user-service';

@authenticate('jwt')
export class DataHubController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @repository(SubscriptionDataRepository)
    public subData: SubscriptionDataRepository,
  ) {}

  DB_SCHEMA = process.env.DB_SCHEMA;

  @get('/dataHub/search')
  @response(200, {
    description: 'Array dataHUb',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async forProperty(
    // @inject(RestBindings.Http.RESPONSE) res: Response,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.string('region') region?: string,
    @param.query.string('msa') msa?: string,
    @param.query.string('state') state?: string,
    @param.query.string('city') city?: string,
    @param.query.string('zip') zip?: string,
    @param.query.number('punits') punits?: number,
    @param.query.number('punite') punite?: number,
    @param.query.number('ocs') ocs?: number,
    @param.query.number('oce') oce?: number,
    @param.query.number('rrs') rrs?: number,
    @param.query.number('rre') rre?: number,
    @param.query.number('bas') bas?: number,
    @param.query.number('bae') bae?: number,
    @param.query.number('ybs') ybs?: number,
    @param.query.number('ybe') ybe?: number,
    @param.query.number('lsas') lsas?: number,
    @param.query.number('lsae') lsae?: number,
    @param.query.string('la') la?: string,
    @param.query.number('ytms') ytms?: number,
    @param.query.number('ytme') ytme?: number,
    @param.query.string('latv') latv?: string,
    @param.query.number('las') las?: number,
    @param.query.number('lae') lae?: number,
    @param.query.number('ts') ts?: number,
    @param.query.number('te') te?: number,
    @param.query.number('ir') ir?: number,
    @param.query.string('propertyName') propertyName?: string,
    @param.query.string('address') address?: string,
    @param.query.string('owner') owner?: string,
    @param.query.number('hcs') hcs?: number,
    @param.query.number('hce') hce?: number,
    @param.query.number('hyfs') hyfs?: number,
    @param.query.number('hyfe') hyfe?: number,
    @param.query.number('ahis') ahis?: number,
    @param.query.number('ahie') ahie?: number,
    @param.query.number('mhis') mhis?: number,
    @param.query.number('mhie') mhie?: number,

    @param.query.number('offset', {default: 0}) offset?: number,
  ): Promise<any> {
    //  res.headers.set('Access-Control-Allow-Origin','*');
    let marq: any = '';

    let regionc: any = '';
    let cityc: any = '';
    let zipc: any = '';
    let msacc: any = '';
    let own: any = '';

    let msac: any = '';

    const ms = msa?.split(',');
    msacc = "'" + ms?.join("','") + "'";

    const mar = state?.split(',');
    marq = "'" + mar?.join("','") + "'";

    const cit = city?.split(',');

    cityc = "'" + cit?.join("','") + "'";
const z = zip?.split(',');

zipc = "'" + z?.join("','") + "'";
    const ow = owner?.split(',');
    own = "'" + ow?.join("','") + "'";

    const re = region?.split(',');
    regionc = "'" + re?.join("','") + "'";

    let allMsaData = '';
    let allState = '';
    let allCity = '';
    let allZip = '';
    let allRegion = '';
    let allPunit = '';
    let allOcr = '';
    let allRr = '';
    let allLa = '';
    let allOwner = '';
    let allYtms = '';
    let allPname = '';
    let allAddress = '';
    let allMSA = '';
    let allBuildingArea = '';
    let allYearBuilt = '';
    let allLastSale = '';
    let allLoanAmountToValue = '';
    let allLoanAmount = '';
    let allTerm = '';
    let allInterestRate = '';
    let allHouseHoldCount = '';
    let allHouseHoldYearForecast = '';
    let allAverageHousehold = '';
    let allMedianHousehold = '';

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
    console.log('ddddd', subs);
    const date = new Date();

    if (new Date(subs[0].enddate) < date)
      return 'Subscription Expired please renew';

    if (subs && subs.length > 0) {
      console.log('zsdfsdfsdf', subs[0].typeid);
      if (subs[0].typeid !== 3) {
        console.log(subs[0].typeid, 'type');
        console.log(subs[0].sub_data.MSA, 'msa');
        const msan = subs[0].sub_data.MSA;
        console.log(msan, 'msa');
        msac = "'" + msan?.join("','") + "'";
        allMSA = `and msa_code in (${msac})`;
      }

      if (msa !== '' && msa !== undefined) {
        allMsaData = `AND (msa_code IN(${msacc}))`;
      }
      if (state !== '' && state !== undefined) {
        allState = `AND (state IN(${marq}))`;
      }
      if (address !== '' && address !== undefined) {
        allAddress = `AND (address ILIKE '%${address}%')`;
      }
      if (city !== '' && city !== undefined) {
        allCity = `AND (city IN(${cityc}))`;
      }
      if (zip !== '' && zip !== undefined) {
        allZip = `AND (zip IN(${zipc}))`;
      }
      if (region !== '' && region !== undefined) {
        allRegion = `AND (region IN(${regionc}))`;
      }

      if (propertyName !== '' && propertyName !== undefined) {
        allPname = `  AND (property_name ILIKE '%${propertyName}%')`;
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
        bas !== null &&
        bas !== undefined &&
        bae !== null &&
        bae !== undefined
      ) {
        allBuildingArea = ` and building_sq_ft between ${bas} and ${bae}`;
      }
      if (
        ybs !== null &&
        ybs !== undefined &&
        ybe !== null &&
        ybe !== undefined
      ) {
        allYearBuilt = ` and year_built between ${ybs} and ${ybe}`;
      }
      if (
        lsas !== null &&
        lsas !== undefined &&
        lsae !== null &&
        lsae !== undefined
      ) {
        allLastSale = ` and last_sale_amount between ${lsas} and ${lsae}`;
      }

      if (
        ytms !== null &&
        ytms !== undefined &&
        ytme !== null &&
        ytme !== undefined
      ) {
        allYtms = `and loan_maturity_date  between ${ytms} and ${ytme}`;
      }
      if (la !== '' && la !== undefined) {
        if (la === 'No') {
          allLa = `and mortgage_due_date is  null`;
        } else if (la === 'Yes') {
          allLa = `and mortgage_due_date is not null `;
        }
      }
      if (latv !== '' && latv !== undefined) {
        if (latv === 'No') {
          allLoanAmountToValue = `and transfer_purchase_loan_to_value is  null`;
        } else if (latv === 'Yes') {
          allLoanAmountToValue = `and transfer_purchase_loan_to_value is not null `;
        }
      }

      if (
        las !== null &&
        las !== undefined &&
        lae !== null &&
        lae !== undefined
      ) {
        allLoanAmount = `and loan_amount  between ${las} and ${lae}`;
      }
      if (ts !== null && ts !== undefined && te !== null && te !== undefined) {
        allTerm = `and term  between ${ts} and ${te}`;
      }
      if (ir !== null && ir !== undefined) {
        allInterestRate = `and interest_rate >= ${ir}`;
      }
      if (owner !== '' && owner !== undefined) {
        allOwner = `  AND (owner_name IN(${own}))`;
      }
      if (
        hcs !== null &&
        hcs !== undefined &&
        hce !== null &&
        hce !== undefined
      ) {
        allHouseHoldCount = `and household_count  between ${hcs} and ${hce}`;
      }
      if (
        hyfs !== null &&
        hyfs !== undefined &&
        hyfe !== null &&
        hyfe !== undefined
      ) {
        allHouseHoldYearForecast = `and household_5_year_forecast_count  between ${hyfs} and ${hyfe}`;
      }
      if (
        ahis !== null &&
        ahis !== undefined &&
        ahie !== null &&
        ahie !== undefined
      ) {
        allAverageHousehold = `and average_household_income  between ${ahis} and ${ahie}`;
      }
      if (
        mhis !== null &&
        mhis !== undefined &&
        mhie !== null &&
        mhie !== undefined
      ) {
        allMedianHousehold = `and median_household_income  between ${mhis} and ${mhie}`;
      }

      const data = `
                    SELECT * FROM ${this.DB_SCHEMA}.data_hub
                    where 1 = 1
                    ${allMsaData}
                    ${allState}
                    ${allCity}
                    ${allZip}
                    ${allPunit}
                    ${allOcr}
                    ${allRr}
                    ${allBuildingArea}
                    ${allYearBuilt}
                    ${allLastSale}
                    ${allLa}
                    ${allLoanAmountToValue}
                    ${allLoanAmount}
                    ${allTerm}
                    ${allInterestRate}
                    ${allOwner}
                    ${allHouseHoldCount}
                    ${allHouseHoldYearForecast}
                    ${allAverageHousehold}
                    ${allMedianHousehold}
                    ${allYtms}
                    ${allPname}
                    ${allAddress}
                    ${allMSA}
                    ${allRegion}
                    limit 100 offset ${offset}
                  `;

      const countdata = `
                  SELECT count(*) FROM ${this.DB_SCHEMA}.data_hub
                  where 1 = 1
                    ${allMsaData}
                    ${allState}
                    ${allCity}
                    ${allZip}
                    ${allPunit}
                    ${allOcr}
                    ${allRr}
                    ${allBuildingArea}
                    ${allYearBuilt}
                    ${allLastSale}
                    ${allLa}
                    ${allLoanAmountToValue}
                    ${allLoanAmount}
                    ${allTerm}
                    ${allInterestRate}
                    ${allOwner}
                    ${allHouseHoldCount}
                    ${allHouseHoldYearForecast}
                    ${allAverageHousehold}
                    ${allMedianHousehold}
                    ${allYtms}
                    ${allPname}
                    ${allAddress}
                    ${allMSA}
                    ${allRegion}
                `;
      console.log('for search ', data);
      console.log('for count ', countdata);
      const all = await this.userRepository.dataSource.execute(data);
      const count = await this.userRepository.dataSource.execute(countdata);

      if (all.length > 0) {
        return {all, count};
      } else {
        return 'No Data Available';
      }
    } else return 'Please ADD Subscription to access Data';
  }

  @get('/dataHub/average')
  @response(200, {
    description: 'Array dataHUb',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async avg(@param.query.string('property') property?: string): Promise<any> {
    const data = `
                    SELECT * FROM ${this.DB_SCHEMA}.rent_comparables
                    where 1 = 1
                    and nedl_property_id = '${property}'
                    order by year_quarter asc
                  `;

    const all = await this.userRepository.dataSource.execute(data);

    if (all.length > 0) {
      return {all};
    } else {
      return 'No Data Available';
    }
  }

  @get('/dataHub/minMax')
  @response(200, {
    description: 'Array dataHUb',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async filter(): Promise<any> {
    const data = `
                   SELECT min(units_count)as min_unit , max(units_count) as max_unit ,
min(latest_occupancy_rate)as min_occupancy,max(latest_occupancy_rate)as max_occupancy,
min(latest_monthly_rent)as min_rent , max(latest_monthly_rent)as max_rent ,
min(building_sq_ft)as min_building , max(building_sq_ft)as max_building,
min(year_built) as min_built , max(year_built) as max_built ,
min(last_sale_amount) as min_sale_amount , max(last_sale_amount) as max_sale_amount ,
min(loan_amount)as min_amount , max(loan_amount) as max_amount ,
min(household_count)as min_householdcount , max(household_count) as max_householdcount,
min(median_household_income)as min_household_income , max(median_household_income)as max_household_income,
min(transfer_purchase_loan_to_value)as min_loan_to_value , max(transfer_purchase_loan_to_value) as max_loan_to_value,
min(term) as min_term , max(term) as max_term,
min(household_5_year_forecast_count) as min_house_forcast , max(household_5_year_forecast_count)as max_house_forcast,
min(average_household_income) as min_average , max(average_household_income) as max_average
FROM ${this.DB_SCHEMA}.data_hub
                  `;

    const all = await this.userRepository.dataSource.execute(data);

    if (all.length > 0) {
      return {all};
    } else {
      return 'No Data Available';
    }
  }

  @get('/dataHub/owner')
  @response(200, {
    description: 'Array dataHUb',
    content: {
      'application/json': {
        schema: {
          type: 'array',
        },
      },
    },
  })
  async owner(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    @param.query.string('owner_name') owner_name?: string,
  ): Promise<any> {
    const data = `
                   select distinct owner_name from ${this.DB_SCHEMA}.data_hub where owner_name ILIKE '%${owner_name}%'
                  `;

    const all = await this.userRepository.dataSource.execute(data);

    if (all.length > 0) {
      return {all};
    } else {
      return 'No Data Available';
    }
  }
}
