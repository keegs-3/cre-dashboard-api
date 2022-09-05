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
import {Useractions} from '../models';
import {UseractionsRepository} from '../repositories';

export class UsersactionsController {
  constructor(
    @repository(UseractionsRepository)
    public useractionsRepository : UseractionsRepository,
  ) {}

  @post('/useractions')
  @response(200, {
    description: 'Useractions model instance',
    content: {'application/json': {schema: getModelSchemaRef(Useractions)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Useractions, {
            title: 'NewUseractions',
            exclude: ['id'],
          }),
        },
      },
    })
    useractions: Omit<Useractions, 'id'>,
  ): Promise<Useractions> {
    return this.useractionsRepository.create(useractions);
  }

  @get('/useractions/count')
  @response(200, {
    description: 'Useractions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Useractions) where?: Where<Useractions>,
  ): Promise<Count> {
    return this.useractionsRepository.count(where);
  }

  @get('/useractions')
  @response(200, {
    description: 'Array of Useractions model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Useractions, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Useractions) filter?: Filter<Useractions>,
  ): Promise<Useractions[]> {
    return this.useractionsRepository.find(filter);
  }

  @patch('/useractions')
  @response(200, {
    description: 'Useractions PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Useractions, {partial: true}),
        },
      },
    })
    useractions: Useractions,
    @param.where(Useractions) where?: Where<Useractions>,
  ): Promise<Count> {
    return this.useractionsRepository.updateAll(useractions, where);
  }

  @get('/useractions/{id}')
  @response(200, {
    description: 'Useractions model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Useractions, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Useractions, {exclude: 'where'}) filter?: FilterExcludingWhere<Useractions>
  ): Promise<Useractions> {
    return this.useractionsRepository.findById(id, filter);
  }

  @patch('/useractions/{id}')
  @response(204, {
    description: 'Useractions PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Useractions, {partial: true}),
        },
      },
    })
    useractions: Useractions,
  ): Promise<void> {
    await this.useractionsRepository.updateById(id, useractions);
  }

  @put('/useractions/{id}')
  @response(204, {
    description: 'Useractions PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() useractions: Useractions,
  ): Promise<void> {
    await this.useractionsRepository.replaceById(id, useractions);
  }

  @del('/useractions/{id}')
  @response(204, {
    description: 'Useractions DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.useractionsRepository.deleteById(id);
  }
}
