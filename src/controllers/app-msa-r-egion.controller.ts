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
import {AppMsaRegion} from '../models';
import {AppMsaRegionRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('jwt')
export class AppMsaREgionController {
  constructor(
    @repository(AppMsaRegionRepository)
    public appMsaRegionRepository : AppMsaRegionRepository,
  ) {}

  @post('/app-msa-regions')
  @response(200, {
    description: 'AppMsaRegion model instance',
    content: {'application/json': {schema: getModelSchemaRef(AppMsaRegion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppMsaRegion, {
            title: 'NewAppMsaRegion',
            exclude: ['id'],
          }),
        },
      },
    })
    appMsaRegion: Omit<AppMsaRegion, 'id'>,
  ): Promise<AppMsaRegion> {
    return this.appMsaRegionRepository.create(appMsaRegion);
  }

  @get('/app-msa-regions/count')
  @response(200, {
    description: 'AppMsaRegion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AppMsaRegion) where?: Where<AppMsaRegion>,
  ): Promise<Count> {
    return this.appMsaRegionRepository.count(where);
  }

  @get('/app-msa-regions')
  @response(200, {
    description: 'Array of AppMsaRegion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AppMsaRegion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AppMsaRegion) filter?: Filter<AppMsaRegion>,
  ): Promise<AppMsaRegion[]> {
    return this.appMsaRegionRepository.find(filter);
  }

  @patch('/app-msa-regions')
  @response(200, {
    description: 'AppMsaRegion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppMsaRegion, {partial: true}),
        },
      },
    })
    appMsaRegion: AppMsaRegion,
    @param.where(AppMsaRegion) where?: Where<AppMsaRegion>,
  ): Promise<Count> {
    return this.appMsaRegionRepository.updateAll(appMsaRegion, where);
  }

  @get('/app-msa-regions/{id}')
  @response(200, {
    description: 'AppMsaRegion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AppMsaRegion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AppMsaRegion, {exclude: 'where'}) filter?: FilterExcludingWhere<AppMsaRegion>
  ): Promise<AppMsaRegion> {
    return this.appMsaRegionRepository.findById(id, filter);
  }

  @patch('/app-msa-regions/{id}')
  @response(204, {
    description: 'AppMsaRegion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppMsaRegion, {partial: true}),
        },
      },
    })
    appMsaRegion: AppMsaRegion,
  ): Promise<void> {
    await this.appMsaRegionRepository.updateById(id, appMsaRegion);
  }

  @put('/app-msa-regions/{id}')
  @response(204, {
    description: 'AppMsaRegion PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() appMsaRegion: AppMsaRegion,
  ): Promise<void> {
    await this.appMsaRegionRepository.replaceById(id, appMsaRegion);
  }

  @del('/app-msa-regions/{id}')
  @response(204, {
    description: 'AppMsaRegion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.appMsaRegionRepository.deleteById(id);
  }
}
