import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Empleado, EmpleadoRelations, Directivo, Empresa} from '../models';
import {DirectivoRepository} from './directivo.repository';
import {EmpresaRepository} from './empresa.repository';

export class EmpleadoRepository extends DefaultCrudRepository<
  Empleado,
  typeof Empleado.prototype.id,
  EmpleadoRelations
> {

  public readonly empleadoadirectivo: BelongsToAccessor<Directivo, typeof Empleado.prototype.id>;

  public readonly empleadoaempresa: BelongsToAccessor<Empresa, typeof Empleado.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('DirectivoRepository') protected directivoRepositoryGetter: Getter<DirectivoRepository>, @repository.getter('EmpresaRepository') protected empresaRepositoryGetter: Getter<EmpresaRepository>,
  ) {
    super(Empleado, dataSource);
    this.empleadoaempresa = this.createBelongsToAccessorFor('empleadoaempresa', empresaRepositoryGetter,);
    this.registerInclusionResolver('empleadoaempresa', this.empleadoaempresa.inclusionResolver);
    this.empleadoadirectivo = this.createBelongsToAccessorFor('empleadoadirectivo', directivoRepositoryGetter,);
    this.registerInclusionResolver('empleadoadirectivo', this.empleadoadirectivo.inclusionResolver);
  }
}
