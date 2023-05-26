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
import {Userreview} from '../models';
import {UserreviewRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class UserreviewController {
  constructor(
    @repository(UserreviewRepository)
    public userreviewRepository : UserreviewRepository,
  ) {}

  @post('/userreviews')
  @response(200, {
    description: 'Userreview model instance',
    content: {'application/json': {schema: getModelSchemaRef(Userreview)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userreview, {
            title: 'NewUserreview',
            exclude: ['id'],
          }),
        },
      },
    })
    userreview: Omit<Userreview, 'id'>,
  ): Promise<Userreview> {
    return this.userreviewRepository.create(userreview);
  }

  @get('/userreviews/count')
  @response(200, {
    description: 'Userreview model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Userreview) where?: Where<Userreview>,
  ): Promise<Count> {
    return this.userreviewRepository.count(where);
  }

  @get('/userreviews')
  @response(200, {
    description: 'Array of Userreview model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Userreview, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Userreview) filter?: Filter<Userreview>,
  ): Promise<Userreview[]> {
    return this.userreviewRepository.find(filter);
  }

  @patch('/userreviews')
  @response(200, {
    description: 'Userreview PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userreview, {partial: true}),
        },
      },
    })
    userreview: Userreview,
    @param.where(Userreview) where?: Where<Userreview>,
  ): Promise<Count> {
    return this.userreviewRepository.updateAll(userreview, where);
  }

  @get('/userreviews/{id}')
  @response(200, {
    description: 'Userreview model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Userreview, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Userreview, {exclude: 'where'}) filter?: FilterExcludingWhere<Userreview>
  ): Promise<Userreview> {
    return this.userreviewRepository.findById(id, filter);
  }

  @patch('/userreviews/{id}')
  @response(204, {
    description: 'Userreview PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userreview, {partial: true}),
        },
      },
    })
    userreview: Userreview,
  ): Promise<void> {
    await this.userreviewRepository.updateById(id, userreview);
  }

  @put('/userreviews/{id}')
  @response(204, {
    description: 'Userreview PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userreview: Userreview,
  ): Promise<void> {
    await this.userreviewRepository.replaceById(id, userreview);
  }

  @del('/userreviews/{id}')
  @response(204, {
    description: 'Userreview DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userreviewRepository.deleteById(id);
  }
}
