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
import {SubscriptionType} from '../models';
import {SubscriptionTypeRepository} from '../repositories';

export class SubscriptionTypeController {
  constructor(
    @repository(SubscriptionTypeRepository)
    public subscriptionTypeRepository : SubscriptionTypeRepository,
  ) {}

  @post('/subscription-types')
  @response(200, {
    description: 'SubscriptionType model instance',
    content: {'application/json': {schema: getModelSchemaRef(SubscriptionType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubscriptionType, {
            title: 'NewSubscriptionType',
            exclude: ['id'],
          }),
        },
      },
    })
    subscriptionType: Omit<SubscriptionType, 'id'>,
  ): Promise<SubscriptionType> {
    return this.subscriptionTypeRepository.create(subscriptionType);
  }

  @get('/subscription-types/count')
  @response(200, {
    description: 'SubscriptionType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SubscriptionType) where?: Where<SubscriptionType>,
  ): Promise<Count> {
    return this.subscriptionTypeRepository.count(where);
  }

  @get('/subscription-types')
  @response(200, {
    description: 'Array of SubscriptionType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SubscriptionType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SubscriptionType) filter?: Filter<SubscriptionType>,
  ): Promise<SubscriptionType[]> {
    return this.subscriptionTypeRepository.find(filter);
  }

  @patch('/subscription-types')
  @response(200, {
    description: 'SubscriptionType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubscriptionType, {partial: true}),
        },
      },
    })
    subscriptionType: SubscriptionType,
    @param.where(SubscriptionType) where?: Where<SubscriptionType>,
  ): Promise<Count> {
    return this.subscriptionTypeRepository.updateAll(subscriptionType, where);
  }

  @get('/subscription-types/{id}')
  @response(200, {
    description: 'SubscriptionType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SubscriptionType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SubscriptionType, {exclude: 'where'}) filter?: FilterExcludingWhere<SubscriptionType>
  ): Promise<SubscriptionType> {
    return this.subscriptionTypeRepository.findById(id, filter);
  }

  @patch('/subscription-types/{id}')
  @response(204, {
    description: 'SubscriptionType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubscriptionType, {partial: true}),
        },
      },
    })
    subscriptionType: SubscriptionType,
  ): Promise<void> {
    await this.subscriptionTypeRepository.updateById(id, subscriptionType);
  }

  @put('/subscription-types/{id}')
  @response(204, {
    description: 'SubscriptionType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() subscriptionType: SubscriptionType,
  ): Promise<void> {
    await this.subscriptionTypeRepository.replaceById(id, subscriptionType);
  }

  @del('/subscription-types/{id}')
  @response(204, {
    description: 'SubscriptionType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.subscriptionTypeRepository.deleteById(id);
  }
}
