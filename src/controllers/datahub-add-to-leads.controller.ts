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

export class DatahubAddToLeadsController {
  constructor(
    @repository(LeadsRepository)
    public leadsRepository: LeadsRepository,
  ) {}
  DB_SCHEMA = process.env.DB_SCHEMA;

  @post('/ExtraLeads')
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
            exclude: ['id'],
          }),
        },
      },
    })
    leads: Omit<Leads, 'id'>,
  ): Promise<any> {
    const checkLeads = await this.leadsRepository.dataSource.execute(`
select * from nedl_model.lead_gen where  nedl_property_id_pk = ${leads.nedl_property_id_pk}
  `);
    const checkAdd = await this.leadsRepository.dataSource.execute(
      `
    select * from ${this.DB_SCHEMA}.app_add_to_leads where  nedl_property_id_pk = ${leads.nedl_property_id_pk} and subs_id = ${leads.subs_id}
    `,
    );
    if (checkLeads.length > 0) {
      return 'Property already present on your Intelligent Leads Page';
    }
    if (checkAdd.length > 0) {
      return 'Someone From your team has already Added it';
    }

    const add = await this.leadsRepository.create(leads);
    return add;
  }

  @get('/ExtraLeads/count')
  @response(200, {
    description: 'Leads model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Leads) where?: Where<Leads>): Promise<Count> {
    return this.leadsRepository.count(where);
  }

  @get('/ExtraLeads')
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
  async find(@param.filter(Leads) filter?: Filter<Leads>): Promise<Leads[]> {
    return this.leadsRepository.find(filter);
  }

  @patch('/ExtraLeads')
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

  @get('/ExtraLeads/{id}')
  @response(200, {
    description: 'Leads model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Leads, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Leads, {exclude: 'where'})
    filter?: FilterExcludingWhere<Leads>,
  ): Promise<Leads> {
    return this.leadsRepository.findById(id, filter);
  }

  @patch('/ExtraLeads/{id}')
  @response(204, {
    description: 'Leads PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
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

  @put('/ExtraLeads/{id}')
  @response(204, {
    description: 'Leads PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() leads: Leads,
  ): Promise<void> {
    await this.leadsRepository.replaceById(id, leads);
  }

  @del('/ExtraLeads/{id}')
  @response(204, {
    description: 'Leads DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.leadsRepository.deleteById(id);
  }
}
