// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {UserRepository} from '../repositories';

export class DataHubController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
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
    @param.query.string('propertyName') propertyName?: string,
    @param.query.string('address') address?: string,
    @param.query.string('owner') owner?: string,
    @param.query.string('segement') segment?: string,
    @param.query.number('ytms') ytms?: number,
    @param.query.number('ytme') ytme?: number,
    @param.query.number('offset', {default: 0}) offset?: number,
  ): Promise<any> {
    let marq: any = '';
    let mmarq: any = '';
    let smarq: any = '';
    // let spname: any = '';
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
    addc = "'" + add?.join("','") + "'";
    const ow = owner?.split(',');
    own = "'" + ow?.join("','") + "'";
    const se = segment?.split(',');
    seg = "'" + se?.join("','") + "'";

    // pn = 'anil,anil2,anil3'
    const pn = propertyName?.split(',');
    // spname= "'" + pn?.join("','") + "'";
    let allState = '';
    let allCity = '';
    let allCounty = '';
    let allMArket = '';
    let allSMArket = '';
    let allPunit = '';
    let allOcr = '';
    let allRr = '';
    let allLa = '';
    let allOwner = '';
    let allSeg = '';
    let allYtms = '';
    let allPname = '';
    let allAddress = '';

    if (state !== '' && state !== undefined) {
      allState = `AND (state IN(${marq}))`;
    }
    if (address !== '' && address !== undefined) {
      allAddress = `AND (address ILIKE '%${address}%')`;
    }
    if (city !== '' && city !== undefined) {
      allCity = `AND (city IN(${cityc}))`;
    }
    if (county !== '' && county !== undefined) {
      allCounty = `  AND (county IN(${addc}))`;
    }
    if (market !== '' && market !== undefined) {
      allMArket = `  AND (market IN(${mmarq}))`;
    }
    if (submarket !== '' && submarket !== undefined) {
      allSMArket = `  AND (sub_market IN(${smarq}))`;
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
      ytms !== null &&
      ytms !== undefined &&
      ytme !== null &&
      ytme !== undefined
    ) {
      allYtms = `and years_to_mature  between ${ytms} and ${ytme}`;
    }
    if (la !== '' && la !== undefined) {
      if (la === 'No') {
        allLa = `and loan_maturity_date is  null`;
      } else if (la === 'Yes') {
        allLa = `and loan_maturity_date is not null `;
      }
    }
    if (owner !== '' && owner !== undefined) {
      allOwner = `  AND (owner_name IN(${own}))`;
    }
    if (segment !== '' && segment !== undefined) {
      allSeg = `  AND (owner_segment IN(${seg}))`;
    }

    const data = `
                    SELECT * FROM ${this.DB_SCHEMA}.data_hub
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
                    ${allPname}
                    ${allAddress}
                    limit 100 offset ${offset}
                  `;

    const countdata = `
                  SELECT count(*) FROM ${this.DB_SCHEMA}.data_hub
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
                  ${allPname}
                  ${allAddress}

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
}
