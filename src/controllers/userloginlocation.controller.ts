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
import {Userloginlocation} from '../models';
import {UserloginlocationRepository} from '../repositories';

export class UserloginlocationController {
  constructor(
    @repository(UserloginlocationRepository)
    public userloginlocationRepository : UserloginlocationRepository,
  ) {}

  @post('/userloginlocations')
  @response(200, {
    description: 'Userloginlocation model instance',
    content: {'application/json': {schema: getModelSchemaRef(Userloginlocation)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userloginlocation, {
            title: 'NewUserloginlocation',
            exclude: ['id'],
          }),
        },
      },
    })
    userloginlocation: Omit<Userloginlocation, 'id'>,
  ): Promise<Userloginlocation> {
    return this.userloginlocationRepository.create(userloginlocation);
  }

  @get('/userloginlocations/count')
  @response(200, {
    description: 'Userloginlocation model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Userloginlocation) where?: Where<Userloginlocation>,
  ): Promise<Count> {
    return this.userloginlocationRepository.count(where);
  }

  @get('/userloginlocations')
  @response(200, {
    description: 'Array of Userloginlocation model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Userloginlocation, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Userloginlocation) filter?: Filter<Userloginlocation>,
  ): Promise<Userloginlocation[]> {
    return this.userloginlocationRepository.find(filter);
  }

  @patch('/userloginlocations')
  @response(200, {
    description: 'Userloginlocation PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userloginlocation, {partial: true}),
        },
      },
    })
    userloginlocation: Userloginlocation,
    @param.where(Userloginlocation) where?: Where<Userloginlocation>,
  ): Promise<Count> {
    return this.userloginlocationRepository.updateAll(userloginlocation, where);
  }

  @get('/userloginlocations/{id}')
  @response(200, {
    description: 'Userloginlocation model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Userloginlocation, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Userloginlocation, {exclude: 'where'}) filter?: FilterExcludingWhere<Userloginlocation>
  ): Promise<Userloginlocation> {
    return this.userloginlocationRepository.findById(id, filter);
  }

  @patch('/userloginlocations/{id}')
  @response(204, {
    description: 'Userloginlocation PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userloginlocation, {partial: true}),
        },
      },
    })
    userloginlocation: Userloginlocation,
  ): Promise<void> {
    await this.userloginlocationRepository.updateById(id, userloginlocation);
  }

  @put('/userloginlocations/{id}')
  @response(204, {
    description: 'Userloginlocation PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userloginlocation: Userloginlocation,
  ): Promise<void> {
    await this.userloginlocationRepository.replaceById(id, userloginlocation);
  }

  @del('/userloginlocations/{id}')
  @response(204, {
    description: 'Userloginlocation DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userloginlocationRepository.deleteById(id);
  }
}
