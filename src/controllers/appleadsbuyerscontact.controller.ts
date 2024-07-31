import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
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
import {Appleadsbuyerscontact} from '../models';
import {AppleadsbuyerscontactRepository} from '../repositories';

export class AppleadsbuyerscontactController {
  constructor(
    @repository(AppleadsbuyerscontactRepository)
    public appleadsbuyerscontactRepository : AppleadsbuyerscontactRepository,
  ) {}

  @post('/appleadsbuyerscontacts')
  @response(200, {
    description: 'Appleadsbuyerscontact model instance',
    content: {'application/json': {schema: getModelSchemaRef(Appleadsbuyerscontact)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsbuyerscontact, {
            title: 'NewAppleadsbuyerscontact',
            exclude: ['id'],
          }),
        },
      },
    })
    appleadsbuyerscontact: Omit<Appleadsbuyerscontact, 'id'>,
  ): Promise<Appleadsbuyerscontact> {
    return this.appleadsbuyerscontactRepository.create(appleadsbuyerscontact);
  }

  @get('/appleadsbuyerscontacts/count')
  @response(200, {
    description: 'Appleadsbuyerscontact model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Appleadsbuyerscontact) where?: Where<Appleadsbuyerscontact>,
  ): Promise<Count> {
    return this.appleadsbuyerscontactRepository.count(where);
  }

  @get('/appleadsbuyerscontacts')
  @response(200, {
    description: 'Array of Appleadsbuyerscontact model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Appleadsbuyerscontact, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Appleadsbuyerscontact) filter?: Filter<Appleadsbuyerscontact>,
  ): Promise<Appleadsbuyerscontact[]> {
    return this.appleadsbuyerscontactRepository.find(filter);
  }

  @patch('/appleadsbuyerscontacts')
  @response(200, {
    description: 'Appleadsbuyerscontact PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsbuyerscontact, {partial: true}),
        },
      },
    })
    appleadsbuyerscontact: Appleadsbuyerscontact,
    @param.where(Appleadsbuyerscontact) where?: Where<Appleadsbuyerscontact>,
  ): Promise<Count> {
    return this.appleadsbuyerscontactRepository.updateAll(appleadsbuyerscontact, where);
  }

  @get('/appleadsbuyerscontacts/{id}')
  @response(200, {
    description: 'Appleadsbuyerscontact model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Appleadsbuyerscontact, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Appleadsbuyerscontact, {exclude: 'where'}) filter?: FilterExcludingWhere<Appleadsbuyerscontact>
  ): Promise<Appleadsbuyerscontact> {
    return this.appleadsbuyerscontactRepository.findById(id, filter);
  }

  @patch('/appleadsbuyerscontacts/{id}')
  @response(204, {
    description: 'Appleadsbuyerscontact PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsbuyerscontact, {partial: true}),
        },
      },
    })
    appleadsbuyerscontact: Appleadsbuyerscontact,
  ): Promise<void> {
    await this.appleadsbuyerscontactRepository.updateById(id, appleadsbuyerscontact);
  }

  @put('/appleadsbuyerscontacts/{id}')
  @response(204, {
    description: 'Appleadsbuyerscontact PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() appleadsbuyerscontact: Appleadsbuyerscontact,
  ): Promise<void> {
    await this.appleadsbuyerscontactRepository.replaceById(id, appleadsbuyerscontact);
  }

  @del('/appleadsbuyerscontacts/{id}')
  @response(204, {
    description: 'Appleadsbuyerscontact DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.appleadsbuyerscontactRepository.deleteById(id);
  }
}
