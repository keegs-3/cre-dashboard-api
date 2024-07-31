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
import {Appleadsstatus} from '../models';
import {AppleadsstatusRepository} from '../repositories';

export class AppleadstatusController {
  constructor(
    @repository(AppleadsstatusRepository)
    public appleadsstatusRepository : AppleadsstatusRepository,
  ) {}

  @post('/appleadsstatuses')
  @response(200, {
    description: 'Appleadsstatus model instance',
    content: {'application/json': {schema: getModelSchemaRef(Appleadsstatus)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsstatus, {
            title: 'NewAppleadsstatus',
            exclude: ['id'],
          }),
        },
      },
    })
    appleadsstatus: Omit<Appleadsstatus, 'id'>,
  ): Promise<Appleadsstatus> {
    return this.appleadsstatusRepository.create(appleadsstatus);
  }

  @get('/appleadsstatuses/count')
  @response(200, {
    description: 'Appleadsstatus model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Appleadsstatus) where?: Where<Appleadsstatus>,
  ): Promise<Count> {
    return this.appleadsstatusRepository.count(where);
  }

  @get('/appleadsstatuses')
  @response(200, {
    description: 'Array of Appleadsstatus model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Appleadsstatus, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Appleadsstatus) filter?: Filter<Appleadsstatus>,
  ): Promise<Appleadsstatus[]> {
    return this.appleadsstatusRepository.find(filter);
  }

  @patch('/appleadsstatuses')
  @response(200, {
    description: 'Appleadsstatus PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsstatus, {partial: true}),
        },
      },
    })
    appleadsstatus: Appleadsstatus,
    @param.where(Appleadsstatus) where?: Where<Appleadsstatus>,
  ): Promise<Count> {
    return this.appleadsstatusRepository.updateAll(appleadsstatus, where);
  }

  @get('/appleadsstatuses/{id}')
  @response(200, {
    description: 'Appleadsstatus model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Appleadsstatus, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Appleadsstatus, {exclude: 'where'}) filter?: FilterExcludingWhere<Appleadsstatus>
  ): Promise<Appleadsstatus> {
    return this.appleadsstatusRepository.findById(id, filter);
  }

  @patch('/appleadsstatuses/{id}')
  @response(204, {
    description: 'Appleadsstatus PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsstatus, {partial: true}),
        },
      },
    })
    appleadsstatus: Appleadsstatus,
  ): Promise<void> {
    await this.appleadsstatusRepository.updateById(id, appleadsstatus);
  }

  @put('/appleadsstatuses/{id}')
  @response(204, {
    description: 'Appleadsstatus PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() appleadsstatus: Appleadsstatus,
  ): Promise<void> {
    await this.appleadsstatusRepository.replaceById(id, appleadsstatus);
  }

  @del('/appleadsstatuses/{id}')
  @response(204, {
    description: 'Appleadsstatus DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.appleadsstatusRepository.deleteById(id);
  }
}
