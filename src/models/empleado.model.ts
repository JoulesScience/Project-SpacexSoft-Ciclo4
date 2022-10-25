import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Directivo} from './directivo.model';
import {Empresa} from './empresa.model';

@model()
export class Empleado extends Entity {
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
  nombres: string;

  @property({
    type: 'string',
    required: true,
  })
  apellidos: string;

  @property({
    type: 'string',
    required: true,
  })
  cedula: string;

  @property({
    type: 'string',
    required: true,
  })
  celular: string;

  @property({
    type: 'number',
    required: true,
  })
  salario: number;

  @property({
    type: 'string',
    required: true,
  })
  clave: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @belongsTo(() => Directivo, {name: 'empleadoadirectivo'})
  directivoId: string;

  @belongsTo(() => Empresa, {name: 'empleadoaempresa'})
  empresaId: string;

  constructor(data?: Partial<Empleado>) {
    super(data);
  }
}

export interface EmpleadoRelations {
  // describe navigational properties here
}

export type EmpleadoWithRelations = Empleado & EmpleadoRelations;
