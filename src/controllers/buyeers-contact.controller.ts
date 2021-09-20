import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Buyerscontact} from '../models';
import {BuyerscontactRepository} from '../repositories';
@authenticate("jwt")
export class BuyeersContactController {
  constructor(
    @repository(BuyerscontactRepository)
    public buyerscontactRepository: BuyerscontactRepository,
  ) { }

  @post('/buyerscontacts')
  @response(200, {
    description: 'Buyerscontact model instance',
    content: {'application/json': {schema: getModelSchemaRef(Buyerscontact)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buyerscontact, {
            title: 'NewBuyerscontact',
            exclude: ['id'],
          }),
        },
      },
    })
    buyerscontact: Omit<Buyerscontact, 'id'>,
  ): Promise<Buyerscontact> {
    return this.buyerscontactRepository.create(buyerscontact);
  }

  @get('/buyerscontacts/count')
  @response(200, {
    description: 'Buyerscontact model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Buyerscontact) where?: Where<Buyerscontact>,
  ): Promise<Count> {
    return this.buyerscontactRepository.count(where);
  }

  @get('/buyerscontacts')
  @response(200, {
    description: 'Array of Buyerscontact model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Buyerscontact, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Buyerscontact) filter?: Filter<Buyerscontact>,
  ): Promise<Buyerscontact[]> {
    return this.buyerscontactRepository.find(filter);
  }

  @patch('/buyerscontacts')
  @response(200, {
    description: 'Buyerscontact PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buyerscontact, {partial: true}),
        },
      },
    })
    buyerscontact: Buyerscontact,
    @param.where(Buyerscontact) where?: Where<Buyerscontact>,
  ): Promise<Count> {
    return this.buyerscontactRepository.updateAll(buyerscontact, where);
  }

  @get('/buyerscontacts/{id}')
  @response(200, {
    description: 'Buyerscontact model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Buyerscontact, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Buyerscontact, {exclude: 'where'}) filter?: FilterExcludingWhere<Buyerscontact>
  ): Promise<Buyerscontact> {
    return this.buyerscontactRepository.findById(id, filter);
  }

  @patch('/buyerscontacts/{id}')
  @response(204, {
    description: 'Buyerscontact PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Buyerscontact, {partial: true}),
        },
      },
    })
    buyerscontact: Buyerscontact,
  ): Promise<void> {
    await this.buyerscontactRepository.updateById(id, buyerscontact);
  }

  @put('/buyerscontacts/{id}')
  @response(204, {
    description: 'Buyerscontact PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() buyerscontact: Buyerscontact,
  ): Promise<void> {
    await this.buyerscontactRepository.replaceById(id, buyerscontact);
  }

  @del('/buyerscontacts/{id}')
  @response(204, {
    description: 'Buyerscontact DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.buyerscontactRepository.deleteById(id);
  }
}
