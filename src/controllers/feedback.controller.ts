/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
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
import {Feedback} from '../models';
import {FeedbackRepository} from '../repositories';
@authenticate("jwt")
export class FeedbackController {
  constructor(
    @repository(FeedbackRepository)
    public feedbackRepository: FeedbackRepository,
  ) { }
  // @authenticate("jwt")
  @post('/feedbacks')
  @response(200, {
    description: 'Feedback model instance',
    content: {'application/json': {schema: getModelSchemaRef(Feedback)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedback, {
            title: 'NewFeedback',
            exclude: ['id'],
          }),
        },
      },
    })
    feedback: Omit<Feedback, 'id'>,
  ): Promise<Feedback> {
    return this.feedbackRepository.create(feedback);
  }

  @get('/feedbacks/count')
  @response(200, {
    description: 'Feedback model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Feedback) where?: Where<Feedback>,
  ): Promise<Count> {
    return this.feedbackRepository.count(where);
  }
  // @authenticate("jwt")
  @get('/feedbacks')
  @response(200, {
    description: 'Array of Feedback model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Feedback, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Feedback) filter?: Filter<Feedback>,
  ): Promise<Feedback[]> {
    return this.feedbackRepository.find(filter);
  }

  @patch('/feedbacks')
  @response(200, {
    description: 'Feedback PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedback, {partial: true}),
        },
      },
    })
    feedback: Feedback,
    @param.where(Feedback) where?: Where<Feedback>,
  ): Promise<Count> {
    return this.feedbackRepository.updateAll(feedback, where);
  }

  // @authenticate("jwt")
  @get('/feedback/{property_id}')
  @response(200, {
    description: 'feedback model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Feedback, {includeRelations: true}),
      },
    },
  })
  async findBy(
    @param.path.string('property_id') property_id: string,


  ): Promise<any> {
    const sql = await this.feedbackRepository.execute(
      `select * from ${process.env.DB_SCHEMA}.tgt_lead_feedback where property_id = '${property_id}' order by updated_on DESC
      `
    )
    return sql;

  }

  // @authenticate("jwt")
  @get('/feedbacks/{id}')
  @response(200, {
    description: 'Feedback model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Feedback, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Feedback, {exclude: 'where'}) filter?: FilterExcludingWhere<Feedback>
  ): Promise<Feedback> {
    return this.feedbackRepository.findById(id, filter);
  }

  @patch('/feedbacks/{id}')
  @response(204, {
    description: 'Feedback PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedback, {partial: true}),
        },
      },
    })
    feedback: Feedback,
  ): Promise<void> {
    await this.feedbackRepository.updateById(id, feedback);
  }

  @put('/feedbacks/{id}')
  @response(204, {
    description: 'Feedback PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() feedback: Feedback,
  ): Promise<void> {
    await this.feedbackRepository.replaceById(id, feedback);
  }

  @del('/feedbacks/{id}')
  @response(204, {
    description: 'Feedback DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.feedbackRepository.deleteById(id);
  }
}
