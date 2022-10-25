import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Empresa, EmpresaRelations, Cliente, Empleado} from '../models';
import {ClienteRepository} from './cliente.repository';
import {EmpleadoRepository} from './empleado.repository';

export class EmpresaRepository extends DefaultCrudRepository<
  Empresa,
  typeof Empresa.prototype.id,
  EmpresaRelations
> {

  public readonly empresaaclientes: HasManyRepositoryFactory<Cliente, typeof Empresa.prototype.id>;

  public readonly empresaempleados: HasManyRepositoryFactory<Empleado, typeof Empresa.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>, @repository.getter('EmpleadoRepository') protected empleadoRepositoryGetter: Getter<EmpleadoRepository>,
  ) {
    super(Empresa, dataSource);
    this.empresaempleados = this.createHasManyRepositoryFactoryFor('empresaempleados', empleadoRepositoryGetter,);
    this.registerInclusionResolver('empresaempleados', this.empresaempleados.inclusionResolver);
    this.empresaaclientes = this.createHasManyRepositoryFactoryFor('empresaaclientes', clienteRepositoryGetter,);
    this.registerInclusionResolver('empresaaclientes', this.empresaaclientes.inclusionResolver);
  }
}
