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
import {Appleadsextracontact} from '../models';
import {AppleadsextracontactRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('jwt')
export class AppleadsextracontactController {
  constructor(
    @repository(AppleadsextracontactRepository)
    public appleadsextracontactRepository: AppleadsextracontactRepository,
  ) {}

  @post('/appleadsextracontacts')
  @response(200, {
    description: 'Appleadsextracontact model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(Appleadsextracontact)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsextracontact, {
            title: 'NewAppleadsextracontact',
            exclude: ['id'],
          }),
        },
      },
    })
    appleadsextracontact: Omit<Appleadsextracontact, 'id'>,
  ): Promise<Appleadsextracontact> {
    return this.appleadsextracontactRepository.create(appleadsextracontact);
  }

  @get('/appleadsextracontacts/count')
  @response(200, {
    description: 'Appleadsextracontact model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Appleadsextracontact) where?: Where<Appleadsextracontact>,
  ): Promise<Count> {
    return this.appleadsextracontactRepository.count(where);
  }

  @get('/appleadsextracontacts')
  @response(200, {
    description: 'Array of Appleadsextracontact model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Appleadsextracontact, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @param.filter(Appleadsextracontact) filter?: Filter<Appleadsextracontact>,
  ): Promise<Appleadsextracontact[]> {
    return this.appleadsextracontactRepository.find(filter);
  }

  @patch('/appleadsextracontacts')
  @response(200, {
    description: 'Appleadsextracontact PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsextracontact, {partial: true}),
        },
      },
    })
    appleadsextracontact: Appleadsextracontact,
    @param.where(Appleadsextracontact) where?: Where<Appleadsextracontact>,
  ): Promise<Count> {
    return this.appleadsextracontactRepository.updateAll(
      appleadsextracontact,
      where,
    );
  }

  @get('/appleadsextracontacts/{id}')
  @response(200, {
    description: 'Appleadsextracontact model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Appleadsextracontact, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Appleadsextracontact, {exclude: 'where'})
    filter?: FilterExcludingWhere<Appleadsextracontact>,
  ): Promise<Appleadsextracontact> {
    return this.appleadsextracontactRepository.findById(id, filter);
  }

  @patch('/appleadsextracontacts/{id}')
  @response(204, {
    description: 'Appleadsextracontact PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Appleadsextracontact, {partial: true}),
        },
      },
    })
    appleadsextracontact: Appleadsextracontact,
  ): Promise<void> {
    await this.appleadsextracontactRepository.updateById(
      id,
      appleadsextracontact,
    );
  }

  @put('/appleadsextracontacts/{id}')
  @response(204, {
    description: 'Appleadsextracontact PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() appleadsextracontact: Appleadsextracontact,
  ): Promise<void> {
    await this.appleadsextracontactRepository.replaceById(
      id,
      appleadsextracontact,
    );
  }

  @del('/appleadsextracontacts/{id}')
  @response(204, {
    description: 'Appleadsextracontact DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.appleadsextracontactRepository.deleteById(id);
  }
}
