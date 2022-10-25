import {Entity, model, property, hasMany} from '@loopback/repository';
import {Empleado} from './empleado.model';

@model()
export class Directivo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  categoria: string;

  @hasMany(() => Empleado)
  directivoaempleados: Empleado[];

  constructor(data?: Partial<Directivo>) {
    super(data);
  }
}

export interface DirectivoRelations {
  // describe navigational properties here
}

export type DirectivoWithRelations = Directivo & DirectivoRelations;
