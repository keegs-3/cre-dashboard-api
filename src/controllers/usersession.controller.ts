/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Usersession} from '../models';
import {LeadsRepository, UsersessionRepository} from '../repositories';

// @authenticate("jwt")
export class UsersessionController {
  constructor(
    @repository(UsersessionRepository)
    public usersessionRepository: UsersessionRepository,
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}
  DB_SCHEMA = process.env.DB_SCHEMA;

  @post('/usersessions')
  @response(200, {
    description: 'Usersession model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usersession)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usersession, {
            title: 'NewUsersession',
            exclude: ['id'],
          }),
        },
      },
    })
    usersession: Omit<Usersession, 'id'>,
  ): Promise<Usersession> {
    return this.usersessionRepository.create(usersession);
  }

  @get('/usersessions/count')
  @response(200, {
    description: 'Usersession model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usersession) where?: Where<Usersession>,
  ): Promise<Count> {
    return this.usersessionRepository.count(where);
  }

  @get('/usersessions')
  @response(200, {
    description: 'Array of Usersession model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usersession, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usersession) filter?: Filter<Usersession>,
  ): Promise<Usersession[]> {
    return this.usersessionRepository.find(filter);
  }

  @patch('/usersessions')
  @response(200, {
    description: 'Usersession PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usersession, {partial: true}),
        },
      },
    })
    usersession: Usersession,
    @param.where(Usersession) where?: Where<Usersession>,
  ): Promise<Count> {
    return this.usersessionRepository.updateAll(usersession, where);
  }

  @get('/usersessions/{id}')
  @response(200, {
    description: 'Usersession model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usersession, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usersession, {exclude: 'where'})
    filter?: FilterExcludingWhere<Usersession>,
  ): Promise<Usersession> {
    return this.usersessionRepository.findById(id, filter);
  }

  @patch('/usersessions/{id}')
  @response(204, {
    description: 'Usersession PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usersession, {partial: true}),
        },
      },
    })
    usersession: Usersession,
  ): Promise<void> {
    await this.usersessionRepository.updateById(id, usersession);
  }

  @put('/usersessions/{id}')
  @response(204, {
    description: 'Usersession PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usersession: Usersession,
  ): Promise<void> {
    await this.usersessionRepository.replaceById(id, usersession);
  }

  @del('/usersessions/{id}')
  @response(204, {
    description: 'Usersession DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usersessionRepository.deleteById(id);
  }

  @get('/usersessions/userdata/{name}')
  @response(200, {
    description: 'Usersession model instance',
  })
  async name(
    @param.path.string('name') name: string,
    @param.query.string('startdate') startdate: string,
    @param.query.string('enddate') enddate: string,
  ): Promise<any> {
    const loca = name.split(',');
    const locaq = "'" + loca.join("','") + "'";
    if (
      name !== '' &&
      name !== undefined &&
      startdate !== '' &&
      startdate !== undefined &&
      enddate !== '' &&
      enddate !== undefined
    ) {
      const agentMap = await this.leadsRepository.execute(`
  select * from ${this.DB_SCHEMA}.users u where u.username = '${name}'
  `);

      // where u.agent_map_to = '${name}'
      if (agentMap[0].role === 'super admin') {
        const roledata = await this.leadsRepository.execute(
          `
          with days as (
            SELECT date_trunc('day', dd):: date as day
            FROM generate_series
            ( '${startdate}'::timestamp
            , '${enddate}'::timestamp
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
            and  us.starttime between '${startdate}' and '${enddate}'
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
  ( '${startdate}'::timestamp
  , '${enddate}'::timestamp
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
  left join ${this.DB_SCHEMA}.users u on u.username = us."name"  where u.agent_map_to = '${name}')
  and  us.starttime between '${startdate}' and '${enddate}'
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
  ( '${startdate}'::timestamp
  , '${enddate}'::timestamp
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
  where endtime is not null and us.name  in (${locaq}
  )
  and  us.starttime between '${startdate}' and '${enddate}'
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
    } else return 'username , startdate and end date is required';
  }

  @get('/usersessions/useranalytics')
  @response(200, {
    description: 'Usersession model instance',
  })
  async uname(
    @param.query.string('name') name: string,
    @param.query.string('startdate') startdate: string,
  ): Promise<any> {
    if (
      name !== '' &&
      name !== undefined &&
      startdate !== '' &&
      startdate !== undefined
    ) {
      const agentMap = await this.usersessionRepository.execute(`
  select * from ${this.DB_SCHEMA}.users u where u.username = '${name}'
  `);

      if (agentMap[0].role === 'super admin') {
        //       console.log(` select us.name ,count(us.name) from ${this.DB_SCHEMA}.user_session us
        // join ${this.DB_SCHEMA}.users u on us."name" = u.username
        // where date(us.starttime) = '${startdate}'
        // group by us.name`);
        //       console.log(`select us.name ,to_seconds(us.timespentonleeds) as leads from ${this.DB_SCHEMA}.user_session us
        // join ${this.DB_SCHEMA}.users u on us."name" = u.username
        // where date(us.starttime) = '${startdate}'
        // group by us.name , us.timespentonleeds , us.timespentonbuyers`);

        const mapdata = await this.usersessionRepository.execute(`
  select us.name ,count(us.name) from ${this.DB_SCHEMA}.user_session us
  join ${this.DB_SCHEMA}.users u on us."name" = u.username
  where date(us.starttime) = '${startdate}'
  group by us.name
  `);
        console.log('mapdata', mapdata);
        //       const activesvpu = await this.usersessionRepository.execute(`
        // select us.name ,to_seconds(us.timespentonleeds) as leads
        // from ${this.DB_SCHEMA}.user_session us
        // join ${this.DB_SCHEMA}.users u on us."name" = u.username
        // where date(us.starttime) = '${startdate}'
        // group by us.name , us.timespentonleeds , us.timespentonbuyers
        // `);
        //       console.log('active', activesvpu);

        const avgapp = await this.usersessionRepository.execute(`
select us.name,age(us.endtime,us.starttime) as totaltime
from ${this.DB_SCHEMA}.user_session us
join ${this.DB_SCHEMA}.users u on us."name" = u.username
where date(us.starttime) =  '${startdate}'
group by us.name , us.timespentonleeds, us.starttime ,us.endtime
`);
        // line 353 sum(to_seconds(us.timespentonleeds)) over ( partition  by days.day) as totaltimeleads,
        const totalavg = await this.usersessionRepository.execute(`
        with days as (
          SELECT date_trunc('day', dd):: date as day
          FROM generate_series
          ( '${startdate}'::timestamp - interval '6' day
          , '${startdate}'::timestamp
          , '1 day'::interval) as dd
          ),
          total as(
                  select
                  ROW_NUMBER() OVER( partition by  days.day ) AS row,
                      days.day,
                      date(us.starttime) ,
                     us."name" ,
                     (select count(distinct us2."name")  from ${this.DB_SCHEMA}.user_session us2 where date(us.starttime) = date(us2.starttime) ) as count,
                    sum (age(endtime,starttime) ) over ( partition  by days.day) as totaltime,
                     sum (age(endtime,starttime) ) over ( partition  by days.day)/
                     (select count(distinct us2."name")  from ${this.DB_SCHEMA}.user_session us2 where date(us.starttime) = date(us2.starttime) )
                           as averagetimetaken
                from days
                left join ${this.DB_SCHEMA}.user_session us on date_trunc('day', us.starttime) = days.day
                where endtime is not null and us.name  in ( select distinct name  from ${this.DB_SCHEMA}.user_session us
                left join ${this.DB_SCHEMA}.users u on u.username = us."name")
                and  us.starttime between '${startdate}'::timestamp - interval '7' day and '${startdate}' ::timestamp + interval '1' day
                group by days.day ,us."name" ,us.starttime,us.endtime ,us.timespentonleeds ,us.timespentonbuyers

          )


                  select
                  days.day as days ,
                  total.count,
                  total.row,
                   COALESCE((select Json_agg(row_to_json(t1))
                      from
                      (
                        select distinct us2."name", count(us2."name") from cre.user_session us2
                        where date(us2.starttime) = date(total.date)
                        group by us2."name"
                      )t1),'[]')as "usersavailable"  ,
                      total.totaltime,
                      total.averagetimetaken

                  from days left join total on days.day = total.day
                  where total.row in (1) or total.row isnull

                  `);

        return {
          mapdata,
          avgapp,
          totalavg,
          // activesvpu
        };
      } else if (agentMap[0].role === 'admin') {
        const mapdata = await this.usersessionRepository.execute(`
  select us.name, count(us.name)  from ${this.DB_SCHEMA}.user_session us
  join ${this.DB_SCHEMA}.users u on us."name" = u.username
  where date(us.starttime) = '${startdate}' and u.agent_map_to = '${name}'
  group by us.name

  `);
        return mapdata;
      } else {
        const mapdata = await this.usersessionRepository.execute(`
  select us.name, count(us.name)  from ${this.DB_SCHEMA}.user_session us
  join ${this.DB_SCHEMA}.users u on us."name" = u.username
  where date(us.starttime) =  '${startdate}'
  and u.username = '${name}'
  group by us.name
  `);
        return mapdata;
      }
    } else if (Error) {
      return Error;
    } else {
      return 'please enter username and start date';
    }
  }
}
