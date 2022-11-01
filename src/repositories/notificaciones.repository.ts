import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Notificaciones, NotificacionesRelations} from '../models';

export class NotificacionesRepository extends DefaultCrudRepository<
  Notificaciones,
  typeof Notificaciones.prototype.id,
  NotificacionesRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Notificaciones, dataSource);
  }
}
