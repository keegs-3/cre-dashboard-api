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
import {SubscriptionData} from '../models';
import {SubscriptionDataRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('jwt')
export class SubscriptionDataController {
  constructor(
    @repository(SubscriptionDataRepository)
    public subscriptionDataRepository: SubscriptionDataRepository,
  ) {}

  @post('/subscription-data')
  @response(200, {
    description: 'SubscriptionData model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(SubscriptionData)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubscriptionData, {
            title: 'NewSubscriptionData',
            exclude: ['id'],
          }),
        },
      },
    })
    subscriptionData: Omit<SubscriptionData, 'id'>,
  ): Promise<SubscriptionData> {
    return this.subscriptionDataRepository.create(subscriptionData);
  }

  @get('/subscription-data/count')
  @response(200, {
    description: 'SubscriptionData model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SubscriptionData) where?: Where<SubscriptionData>,
  ): Promise<Count> {
    return this.subscriptionDataRepository.count(where);
  }

  @get('/subscription-data')
  @response(200, {
    description: 'Array of SubscriptionData model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SubscriptionData, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SubscriptionData) filter?: Filter<SubscriptionData>,
  ): Promise<SubscriptionData[]> {
    return this.subscriptionDataRepository.find(filter);
  }

  @patch('/subscription-data')
  @response(200, {
    description: 'SubscriptionData PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubscriptionData, {partial: true}),
        },
      },
    })
    subscriptionData: SubscriptionData,
    @param.where(SubscriptionData) where?: Where<SubscriptionData>,
  ): Promise<Count> {
    return this.subscriptionDataRepository.updateAll(subscriptionData, where);
  }

  @get('/subscription-data/{id}')
  @response(200, {
    description: 'SubscriptionData model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SubscriptionData, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SubscriptionData, {exclude: 'where'})
    filter?: FilterExcludingWhere<SubscriptionData>,
  ): Promise<SubscriptionData> {
    return this.subscriptionDataRepository.findById(id, filter);
  }

  @patch('/subscription-data/{id}')
  @response(204, {
    description: 'SubscriptionData PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubscriptionData, {partial: true}),
        },
      },
    })
    subscriptionData: SubscriptionData,
  ): Promise<void> {
    await this.subscriptionDataRepository.updateById(id, subscriptionData);
  }

  @put('/subscription-data/{id}')
  @response(204, {
    description: 'SubscriptionData PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() subscriptionData: SubscriptionData,
  ): Promise<void> {
    await this.subscriptionDataRepository.replaceById(id, subscriptionData);
  }

  @del('/subscription-data/{id}')
  @response(204, {
    description: 'SubscriptionData DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.subscriptionDataRepository.deleteById(id);
  }
}
