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
      select  count(owner)as "total_owners", sum(total_property_owned) as "total_property_owned", avg(avg_monetary) as "average_dollar_value"
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
          TIMESTAMP '${year}' - INTERVAL '7 months'
          and  TIMESTAMP '${year}' - INTERVAL '1 month'
          order by year_month asc
      `);
      return sql;
    }
  }
  @get('/ownerstransaction')
  @response(200, {
    description: 'Array of Buyerscontact model instances'

  })
  async owners(
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
      select  *
       from ${this.DB_SCHEMA}.tgt_owner_profiles top where owner_segment in (${locaq}) and owner_state in (${stq})
       order by total_property_owned desc

      `);
      return sql;
    }
  }

  @get('/buyersmap')
  @response(200, {
    description: 'Array of Buyerscontact model instances'

  })
  async map(
    @param.query.string('segment') segment?: string,
    @param.query.string('state') state?: string,
  ): Promise<any> {
    const alldata = [];
    if (segment !== '' && segment !== undefined
      && state !== '' && state !== undefined) {


      const seg = segment.split(',');
      const locaq = "'" + seg.join("','") + "'";
      const st = state.split(',');
      const stq = "'" + st.join("','") + "'";
      const owners = await this.buyerscontactRepository.dataSource.execute(`select  top.*
      from ${this.DB_SCHEMA}.tgt_owner_profiles top where owner_segment in (${locaq}) and owner_state in (${stq})

      order by total_property_owned desc`);

      const longLatCity = await this.buyerscontactRepository.dataSource.execute(`
      WITH statelongi AS (
        select distinct state,min(latitude) ,max(longitude )from ${this.DB_SCHEMA}.src_properties_sale tlg
group by state
     )
select statelongi.* from statelongi where state in (${stq})

      `);
      alldata.push({citydetails: longLatCity});
      alldata.push({ownersdetails: owners});
      return alldata;
    }
  }

  @get('/usamap')
  @response(200, {
    description: 'Array of Buyerscontact model instances'

  })
  async usamap(
    @param.query.string('state') state?: string,
    @param.query.string('segment') segment?: string,
  ): Promise<any> {
    const data = {};
    if (
      state !== '' && state !== undefined
      && segment !== '' && segment !== undefined
    ) {


      const st = state.split(',');
      const stq = "'" + st.join("','") + "'";
      const seg = segment.split(',');
      const segq = "'" + seg.join("','") + "'";
      let owners = {};
      owners = await this.buyerscontactRepository.dataSource.execute(`select gll.state_abbrevation ,count(top."owner") ,top.owner_segment ,top.owner_city,gll.latitude ,gll.longitude from ${this.DB_SCHEMA}.geo_lat_long gll
      join ${this.DB_SCHEMA}.tgt_owner_profiles top on gll.state_abbrevation  = top.owner_state
      where top.owner_state in (${stq})and top.owner_segment in (${segq})
      group by gll.state_abbrevation ,top.owner_segment ,top.owner_city ,gll.latitude ,gll.longitude `);




      return owners;
    }
  }
  @get('/funnelchart')
  @response(200, {
    description: 'Array of Buyerscontact model instances'

  })
  async funnelchart(
    @param.query.string('state') state?: string,
    @param.query.string('segment') segment?: string,
  ): Promise<any> {
    const data = {};
    if (
      state !== '' && state !== undefined
      && segment !== '' && segment !== undefined
    ) {


      const st = state.split(',');
      const stq = "'" + st.join("','") + "'";
      const seg = segment.split(',');
      const segq = "'" + seg.join("','") + "'";
      let owners = {};
      owners = await this.buyerscontactRepository.dataSource.execute(`
      select top.owner_segment,count(top."owner") from ${this.DB_SCHEMA}.tgt_owner_profiles top
      where top.owner_state in (${stq})and top.owner_segment in (${segq})
      group by top.owner_segment
      order by count(top."owner") desc`);




      return owners;
    }
  }

}
