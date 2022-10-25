import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Empleado,
  Directivo,
} from '../models';
import {EmpleadoRepository} from '../repositories';

export class EmpleadoDirectivoController {
  constructor(
    @repository(EmpleadoRepository)
    public empleadoRepository: EmpleadoRepository,
  ) { }

  @get('/empleados/{id}/directivo', {
    responses: {
      '200': {
        description: 'Directivo belonging to Empleado',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Directivo)},
          },
        },
      },
    },
  })
  async getDirectivo(
    @param.path.string('id') id: typeof Empleado.prototype.id,
  ): Promise<Directivo> {
    return this.empleadoRepository.empleadoadirectivo(id);
  }
}
