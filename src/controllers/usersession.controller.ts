import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Usersession} from '../models';
import {LeadsRepository, UsersessionRepository} from '../repositories';

// @authenticate("jwt")
export class UsersessionController {
  constructor(
    @repository(UsersessionRepository)
    public usersessionRepository: UsersessionRepository,
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository
  ) { }
  DB_SCHEMA = process.env.DB_SCHEMA

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
    @param.filter(Usersession, {exclude: 'where'}) filter?: FilterExcludingWhere<Usersession>
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
      name !== '' && name !== undefined
      && startdate !== '' && startdate !== undefined
      && enddate !== '' && enddate !== undefined
    ) {

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
     where endtime is not null and us.name  in (${locaq})
     and  us.starttime between '${startdate}' and '${enddate}'
     group by days.day ,us."name" ,us.starttime ,us.endtime
     ),

     distinctt as (
     select distinct * from total
     )
     select days.day as days ,distinctt.* from days left join distinctt on days.day = distinctt.day
    `
      );
      if (sql.length > 0) {
        return sql
      }
      else return 'no data matched'

    }
    else return 'username , startdate and end date is required'
  }








}
