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
import {Appleadsnotes} from '../models';
import {AppleadsnotesRepository} from '../repositories';

export class AppleadsnotesController {
  constructor(
    @repository(AppleadsnotesRepository)
    public appleadsnotesRepository : AppleadsnotesRepository,
  ) {}

  @post('/appleadsnotes')
  @response(200, {
    description: 'Appleadsnotes model instance',
    content: {'application/json': {schema: getModelSchemaRef(Appleadsnotes)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsnotes, {
            title: 'NewAppleadsnotes',
            exclude: ['id'],
          }),
        },
      },
    })
    appleadsnotes: Omit<Appleadsnotes, 'id'>,
  ): Promise<Appleadsnotes> {
    return this.appleadsnotesRepository.create(appleadsnotes);
  }

  @get('/appleadsnotes/count')
  @response(200, {
    description: 'Appleadsnotes model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Appleadsnotes) where?: Where<Appleadsnotes>,
  ): Promise<Count> {
    return this.appleadsnotesRepository.count(where);
  }

  @get('/appleadsnotes')
  @response(200, {
    description: 'Array of Appleadsnotes model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Appleadsnotes, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Appleadsnotes) filter?: Filter<Appleadsnotes>,
  ): Promise<Appleadsnotes[]> {
    return this.appleadsnotesRepository.find(filter);
  }

  @patch('/appleadsnotes')
  @response(200, {
    description: 'Appleadsnotes PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsnotes, {partial: true}),
        },
      },
    })
    appleadsnotes: Appleadsnotes,
    @param.where(Appleadsnotes) where?: Where<Appleadsnotes>,
  ): Promise<Count> {
    return this.appleadsnotesRepository.updateAll(appleadsnotes, where);
  }

  @get('/appleadsnotes/{id}')
  @response(200, {
    description: 'Appleadsnotes model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Appleadsnotes, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Appleadsnotes, {exclude: 'where'}) filter?: FilterExcludingWhere<Appleadsnotes>
  ): Promise<Appleadsnotes> {
    return this.appleadsnotesRepository.findById(id, filter);
  }

  @patch('/appleadsnotes/{id}')
  @response(204, {
    description: 'Appleadsnotes PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsnotes, {partial: true}),
        },
      },
    })
    appleadsnotes: Appleadsnotes,
  ): Promise<void> {
    await this.appleadsnotesRepository.updateById(id, appleadsnotes);
  }

  @put('/appleadsnotes/{id}')
  @response(204, {
    description: 'Appleadsnotes PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() appleadsnotes: Appleadsnotes,
  ): Promise<void> {
    await this.appleadsnotesRepository.replaceById(id, appleadsnotes);
  }

  @del('/appleadsnotes/{id}')
  @response(204, {
    description: 'Appleadsnotes DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.appleadsnotesRepository.deleteById(id);
  }
}
