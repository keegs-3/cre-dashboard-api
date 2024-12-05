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
import {Organization} from '../models';
import {OrganizationRepository} from '../repositories';

export class OrganizationController {
  constructor(
    @repository(OrganizationRepository)
    public organizationRepository : OrganizationRepository,
  ) {}

  @post('/organizations')
  @response(200, {
    description: 'Organization model instance',
    content: {'application/json': {schema: getModelSchemaRef(Organization)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, {
            title: 'NewOrganization',
            exclude: ['id'],
          }),
        },
      },
    })
    organization: Omit<Organization, 'id'>,
  ): Promise<Organization> {
    return this.organizationRepository.create(organization);
  }

  @get('/organizations/count')
  @response(200, {
    description: 'Organization model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Organization) where?: Where<Organization>,
  ): Promise<Count> {
    return this.organizationRepository.count(where);
  }

  @get('/organizations')
  @response(200, {
    description: 'Array of Organization model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Organization, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Organization) filter?: Filter<Organization>,
  ): Promise<Organization[]> {
    return this.organizationRepository.find(filter);
  }

  @patch('/organizations')
  @response(200, {
    description: 'Organization PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, {partial: true}),
        },
      },
    })
    organization: Organization,
    @param.where(Organization) where?: Where<Organization>,
  ): Promise<Count> {
    return this.organizationRepository.updateAll(organization, where);
  }

  @get('/organizations/{id}')
  @response(200, {
    description: 'Organization model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Organization, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Organization, {exclude: 'where'}) filter?: FilterExcludingWhere<Organization>
  ): Promise<Organization> {
    return this.organizationRepository.findById(id, filter);
  }

  @patch('/organizations/{id}')
  @response(204, {
    description: 'Organization PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, {partial: true}),
        },
      },
    })
    organization: Organization,
  ): Promise<void> {
    await this.organizationRepository.updateById(id, organization);
  }

  @put('/organizations/{id}')
  @response(204, {
    description: 'Organization PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() organization: Organization,
  ): Promise<void> {
    await this.organizationRepository.replaceById(id, organization);
  }

  @del('/organizations/{id}')
  @response(204, {
    description: 'Organization DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.organizationRepository.deleteById(id);
  }
}
