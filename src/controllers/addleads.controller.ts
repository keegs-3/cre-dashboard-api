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
import {Leads} from '../models';
import {LeadsRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate("jwt")

export class AddleadsController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository : LeadsRepository,
  ) {}
  DB_SCHEMA = process.env.DB_SCHEMA;
  @post('/addleads')
  @response(200, {
    description: 'Leads model instance',
    content: {'application/json': {schema: getModelSchemaRef(Leads)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Leads, {
            title: 'NewLeads',

          }),
        },
      },
    })
    leads: Leads,
  ): Promise<Leads> {
    return this.leadsRepository.create(leads);
  }

  @get('/addleads/count')
  @response(200, {
    description: 'Leads model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Leads) where?: Where<Leads>,
  ): Promise<Count> {
    return this.leadsRepository.count(where);
  }

  @get('/addleads')
  @response(200, {
    description: 'Array of Leads model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Leads, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    
    @param.query.string('id') id?: string,
    @param.query.string('org') org?: string,
  ): Promise<Leads[]> {

    const marketCity = await this.leadsRepository.dataSource.execute(`
    select * from ${this.DB_SCHEMA}.leads l
    where l.tax_assessor_id = '${id}'
    and l.organization in ('all','${org}')


`);

    return marketCity;

  }

  @patch('/addleads')
  @response(200, {
    description: 'Leads PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Leads, {partial: true}),
        },
      },
    })
    leads: Leads,
    @param.where(Leads) where?: Where<Leads>,
  ): Promise<Count> {
    return this.leadsRepository.updateAll(leads, where);
  }

  @get('/addleads/{id}')
  @response(200, {
    description: 'Leads model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Leads, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Leads, {exclude: 'where'}) filter?: FilterExcludingWhere<Leads>
  ): Promise<Leads> {
    return this.leadsRepository.findById(id, filter);
  }

  @patch('/addleads/{id}')
  @response(204, {
    description: 'Leads PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Leads, {partial: true}),
        },
      },
    })
    leads: Leads,
  ): Promise<void> {
    await this.leadsRepository.updateById(id, leads);
  }

  @put('/addleads/{id}')
  @response(204, {
    description: 'Leads PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() leads: Leads,
  ): Promise<void> {
    await this.leadsRepository.replaceById(id, leads);
  }

  @del('/addleads/{id}')
  @response(204, {
    description: 'Leads DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.leadsRepository.deleteById(id);
  }
}
