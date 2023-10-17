import {
  Count,
  CountSchema,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Extraownercontact} from '../models';
import {ExtraownercontactRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate("jwt")
export class ExtraownercontactController {
  constructor(
    @repository(ExtraownercontactRepository)
    public extraownercontactRepository : ExtraownercontactRepository,
  ) {}
  DB_SCHEMA = process.env.DB_SCHEMA;
  @post('/extraownercontacts')
  @response(200, {
    description: 'Extraownercontact model instance',
    content: {'application/json': {schema: getModelSchemaRef(Extraownercontact)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Extraownercontact, {
            title: 'NewExtraownercontact',
            exclude: ['id'],
          }),
        },
      },
    })
    extraownercontact: Omit<Extraownercontact, 'id'>,
  ): Promise<Extraownercontact> {
    return this.extraownercontactRepository.create(extraownercontact);
  }

  @get('/extraownercontacts/count')
  @response(200, {
    description: 'Extraownercontact model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Extraownercontact) where?: Where<Extraownercontact>,
  ): Promise<Count> {
    return this.extraownercontactRepository.count(where);
  }



  @patch('/extraownercontacts')
  @response(200, {
    description: 'Extraownercontact PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Extraownercontact, {partial: true}),
        },
      },
    })
    extraownercontact: Extraownercontact,
    @param.where(Extraownercontact) where?: Where<Extraownercontact>,
  ): Promise<Count> {
    return this.extraownercontactRepository.updateAll(extraownercontact, where);
  }

  @get('/extraownercontacts')
  @response(200, {
    description: 'Extraownercontact model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Extraownercontact, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.query.string('property') property?: string,
    @param.query.string('org') org?: string,

  ): Promise<any> {
    const ownerdata = await this.extraownercontactRepository.dataSource.execute(

      `select * from ${this.DB_SCHEMA}.extraownercontact where property_id = '${property}' and org = '${org}'`
    )
    return ownerdata
  }

  @patch('/extraownercontacts/{id}')
  @response(204, {
    description: 'Extraownercontact PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Extraownercontact, {partial: true}),
        },
      },
    })
    extraownercontact: Extraownercontact,
  ): Promise<void> {
    await this.extraownercontactRepository.updateById(id, extraownercontact);
  }

  @put('/extraownercontacts/{id}')
  @response(204, {
    description: 'Extraownercontact PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() extraownercontact: Extraownercontact,
  ): Promise<void> {
    await this.extraownercontactRepository.replaceById(id, extraownercontact);
  }

  @del('/extraownercontacts/{id}')
  @response(204, {
    description: 'Extraownercontact DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.extraownercontactRepository.deleteById(id);
  }
}
