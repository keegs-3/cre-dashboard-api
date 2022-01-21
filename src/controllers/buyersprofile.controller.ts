import {
  repository
} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {BuyerscontactRepository} from '../repositories';
// @authenticate("jwt")
export class BuyeersProfileController {
  constructor(
    @repository(BuyerscontactRepository)
    public buyerscontactRepository: BuyerscontactRepository,
  ) { }
  DB_SCHEMA = process.env.DB_SCHEMA
  @get('/buyersprofile')
  @response(200, {
    description: 'Array of Buyerscontact model instances'

  })
  async find(
    @param.query.string('segment') segment?: string,
    @param.query.string('state') state?: string,
  ): Promise<any> {

    if (segment !== '' && segment !== undefined
      && state !== '' && state !== undefined) {


      const seg = segment.split(',');
      const locaq = "'" + seg.join("','") + "'";
      const st = state.split(',');
      const stq = "'" + st.join("','") + "'";
      const sql = await this.buyerscontactRepository.dataSource.execute(`
      select  count(owner)as "total_owners", sum(total_property_owned) as "total_property_owned", avg(avg_monetary) as "average Dollar value"
       from ${this.DB_SCHEMA}.tgt_owner_profiles top where owner_segment in (${locaq}) and owner_state in (${stq})

      `);
      return sql;
    }
  }

  @get('/canaly')
  @response(200, {
    description: 'Array of Buyerscontact model instances'

  })
  async analy(
    @param.query.string('property_id') property_id?: string,
  ): Promise<any> {

    if (property_id !== '' && property_id !== undefined) {

      const sql = await this.buyerscontactRepository.dataSource.execute(`
      select  *
       from ${this.DB_SCHEMA}.tgt_properties_metrics_new top where property_id = '${property_id}'

      `);
      return sql;
    }
  }
  @get('/city')
  @response(200, {
    description: 'Array of Buyerscontact model instances'

  })
  async city(

  ): Promise<any> {
    const sql = await this.buyerscontactRepository.dataSource.execute(
      `select distinct owner_state from ${this.DB_SCHEMA}.tgt_owner_profiles
      `);
    return sql;

  }

  @get('/segments')
  @response(200, {
    description: 'Array of Buyerscontact model instances'

  })
  async segments(

  ): Promise<any> {
    const sql = await this.buyerscontactRepository.dataSource.execute(`
          select distinct owner_segment from ${this.DB_SCHEMA}.tgt_owner_profiles
      `);
    return sql;
  }
  @get('/profilecharts')
  @response(200, {
    description: 'Array of Buyerscontact model instances'

  })

  async charts(
    @param.query.string('property_id') property_id?: string,
    @param.query.string('year') year?: string,
  ): Promise<any> {
    if (
      year !== '' && year !== undefined
      && property_id !== '' && property_id !== undefined
    ) {

      const sql = await this.buyerscontactRepository.dataSource.execute(`
      select * from  ${this.DB_SCHEMA}.tgt_properties_metrics_new where property_id = '${property_id}' and
        year_month between
          TIMESTAMP '${year}' - INTERVAL '6 months'
          and  TIMESTAMP '${year}' - INTERVAL '1 month'
      `);
      return sql;
    }
  }
}
