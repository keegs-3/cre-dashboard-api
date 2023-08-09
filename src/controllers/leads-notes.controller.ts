/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {LEadsNOtes} from '../models';
import {LEadsNOtesRepository} from '../repositories';
@authenticate("jwt")
export class LeadsNotesController {
  constructor(
    @repository(LEadsNOtesRepository)
    public lEadsNOtesRepository : LEadsNOtesRepository,
  ) {}
  DB_SCHEMA = process.env.DB_SCHEMA;
  @post('/leadsNotes')
  @response(200, {
    description: 'LEadsNOtes model instance',
    content: {'application/json': {schema: getModelSchemaRef(LEadsNOtes)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LEadsNOtes, {
            title: 'NewLEadsNOtes',
            exclude: ['id'],
          }),
        },
      },
    })
    lEadsNOtes: Omit<LEadsNOtes, 'id'>,
  ): Promise<LEadsNOtes> {
    return this.lEadsNOtesRepository.create(lEadsNOtes);
  }

  @get('/leadsNotes/count')
  @response(200, {
    description: 'LEadsNOtes model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(LEadsNOtes) where?: Where<LEadsNOtes>,
  ): Promise<Count> {
    return this.lEadsNOtesRepository.count(where);
  }

  @get('/leadsNotes')
  @response(200, {
    description: 'Array of LEadsNOtes model instances',

  })
  async find(
    @param.query.string('property_id') property_id?: string,
    @param.query.string('org') org?: string,
  ): Promise<any> {
    await this.lEadsNOtesRepository.execute(` select * from ${this.DB_SCHEMA}.leads_notes_vw
    WHERE  property_id = '${property_id}'and org ='${org}'
   `)


  }

  @patch('/leadsNotes')
  @response(200, {
    description: 'LEadsNOtes PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LEadsNOtes, {partial: true}),
        },
      },
    })
    lEadsNOtes: LEadsNOtes,
    @param.where(LEadsNOtes) where?: Where<LEadsNOtes>,
  ): Promise<Count> {
    return this.lEadsNOtesRepository.updateAll(lEadsNOtes, where);
  }

  @get('/leadsNotes/{id}')
  @response(200, {
    description: 'LEadsNOtes model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LEadsNOtes, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(LEadsNOtes, {exclude: 'where'}) filter?: FilterExcludingWhere<LEadsNOtes>
  ): Promise<LEadsNOtes> {
    return this.lEadsNOtesRepository.findById(id, filter);
  }

  @patch('/leadsNotes/{id}')
  @response(204, {
    description: 'LEadsNOtes PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LEadsNOtes, {partial: true}),
        },
      },
    })
    lEadsNOtes: LEadsNOtes,
  ): Promise<void> {
    await this.lEadsNOtesRepository.updateById(id, lEadsNOtes);
  }

  @put('/leadsNotes/{id}')
  @response(204, {
    description: 'LEadsNOtes PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() lEadsNOtes: LEadsNOtes,
  ): Promise<void> {
    await this.lEadsNOtesRepository.replaceById(id, lEadsNOtes);
  }

  @del('/leadsNotes/{id}')
  @response(204, {
    description: 'LEadsNOtes DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.lEadsNOtesRepository.deleteById(id);
  }
}
