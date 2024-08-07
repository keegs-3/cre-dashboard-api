import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CreDataSource} from '../datasources';
import {LeadsNotes, LeadsNotesRelations} from '../models';

export class LEadsNOtesRepository extends DefaultCrudRepository<
  LeadsNotes,
  typeof LeadsNotes.prototype.id,
LeadsNotesRelations> {
  constructor(
    @inject('datasources.cre') dataSource: CreDataSource,
  ) {
    super(LeadsNotes, dataSource);
  }
}
