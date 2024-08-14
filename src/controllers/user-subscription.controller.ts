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
import {UserSubscription} from '../models';
import {UserSubscriptionRepository} from '../repositories';

export class UserSubscriptionController {
  constructor(
    @repository(UserSubscriptionRepository)
    public userSubscriptionRepository : UserSubscriptionRepository,
  ) {}

  @post('/user-subscriptions')
  @response(200, {
    description: 'UserSubscription model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserSubscription)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserSubscription, {
            title: 'NewUserSubscription',
            exclude: ['id'],
          }),
        },
      },
    })
    userSubscription: Omit<UserSubscription, 'id'>,
  ): Promise<UserSubscription> {
    return this.userSubscriptionRepository.create(userSubscription);
  }

  @get('/user-subscriptions/count')
  @response(200, {
    description: 'UserSubscription model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserSubscription) where?: Where<UserSubscription>,
  ): Promise<Count> {
    return this.userSubscriptionRepository.count(where);
  }

  @get('/user-subscriptions')
  @response(200, {
    description: 'Array of UserSubscription model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserSubscription, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserSubscription) filter?: Filter<UserSubscription>,
  ): Promise<UserSubscription[]> {
    return this.userSubscriptionRepository.find(filter);
  }

  @patch('/user-subscriptions')
  @response(200, {
    description: 'UserSubscription PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserSubscription, {partial: true}),
        },
      },
    })
    userSubscription: UserSubscription,
    @param.where(UserSubscription) where?: Where<UserSubscription>,
  ): Promise<Count> {
    return this.userSubscriptionRepository.updateAll(userSubscription, where);
  }

  @get('/user-subscriptions/{id}')
  @response(200, {
    description: 'UserSubscription model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserSubscription, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserSubscription, {exclude: 'where'}) filter?: FilterExcludingWhere<UserSubscription>
  ): Promise<UserSubscription> {
    return this.userSubscriptionRepository.findById(id, filter);
  }

  @patch('/user-subscriptions/{id}')
  @response(204, {
    description: 'UserSubscription PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserSubscription, {partial: true}),
        },
      },
    })
    userSubscription: UserSubscription,
  ): Promise<void> {
    await this.userSubscriptionRepository.updateById(id, userSubscription);
  }

  @put('/user-subscriptions/{id}')
  @response(204, {
    description: 'UserSubscription PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userSubscription: UserSubscription,
  ): Promise<void> {
    await this.userSubscriptionRepository.replaceById(id, userSubscription);
  }

  @del('/user-subscriptions/{id}')
  @response(204, {
    description: 'UserSubscription DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userSubscriptionRepository.deleteById(id);
  }
}
