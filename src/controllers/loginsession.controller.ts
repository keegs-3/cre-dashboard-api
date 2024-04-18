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
import {Loginsession} from '../models';
import {LoginsessionRepository} from '../repositories';

export class LoginsessionController {
  constructor(
    @repository(LoginsessionRepository)
    public loginsessionRepository : LoginsessionRepository,
  ) {}

  @post('/loginsessions')
  @response(200, {
    description: 'Loginsession model instance',
    content: {'application/json': {schema: getModelSchemaRef(Loginsession)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Loginsession, {
            title: 'NewLoginsession',
            exclude: ['id'],
          }),
        },
      },
    })
    loginsession: Omit<Loginsession, 'id'>,
  ): Promise<Loginsession> {
    return this.loginsessionRepository.create(loginsession);
  }

  @get('/loginsessions/count')
  @response(200, {
    description: 'Loginsession model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Loginsession) where?: Where<Loginsession>,
  ): Promise<Count> {
    return this.loginsessionRepository.count(where);
  }

  @get('/loginsessions')
  @response(200, {
    description: 'Array of Loginsession model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Loginsession, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Loginsession) filter?: Filter<Loginsession>,
  ): Promise<Loginsession[]> {
    return this.loginsessionRepository.find(filter);
  }

  @patch('/loginsessions')
  @response(200, {
    description: 'Loginsession PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Loginsession, {partial: true}),
        },
      },
    })
    loginsession: Loginsession,
    @param.where(Loginsession) where?: Where<Loginsession>,
  ): Promise<Count> {
    return this.loginsessionRepository.updateAll(loginsession, where);
  }

  @get('/loginsessions/{id}')
  @response(200, {
    description: 'Loginsession model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Loginsession, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Loginsession, {exclude: 'where'}) filter?: FilterExcludingWhere<Loginsession>
  ): Promise<Loginsession> {
    return this.loginsessionRepository.findById(id, filter);
  }

  @patch('/loginsessions/{id}')
  @response(204, {
    description: 'Loginsession PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Loginsession, {partial: true}),
        },
      },
    })
    loginsession: Loginsession,
  ): Promise<void> {
    await this.loginsessionRepository.updateById(id, loginsession);
  }

  @put('/loginsessions/{id}')
  @response(204, {
    description: 'Loginsession PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() loginsession: Loginsession,
  ): Promise<void> {
    await this.loginsessionRepository.replaceById(id, loginsession);
  }

  @del('/loginsessions/{id}')
  @response(204, {
    description: 'Loginsession DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.loginsessionRepository.deleteById(id);
  }
}
