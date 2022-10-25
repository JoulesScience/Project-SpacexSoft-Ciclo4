import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Cliente, ClienteRelations, Empresa} from '../models';
import {EmpresaRepository} from './empresa.repository';

export class ClienteRepository extends DefaultCrudRepository<
  Cliente,
  typeof Cliente.prototype.id,
  ClienteRelations
> {

  public readonly clienteaempresa: BelongsToAccessor<Empresa, typeof Cliente.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('EmpresaRepository') protected empresaRepositoryGetter: Getter<EmpresaRepository>,
  ) {
    super(Cliente, dataSource);
    this.clienteaempresa = this.createBelongsToAccessorFor('clienteaempresa', empresaRepositoryGetter,);
    this.registerInclusionResolver('clienteaempresa', this.clienteaempresa.inclusionResolver);
  }
}
