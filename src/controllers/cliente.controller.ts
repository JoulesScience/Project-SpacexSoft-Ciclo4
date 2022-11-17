import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
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
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {RequestInfo, RequestInit} from 'node-fetch';
import {Llaves} from '../config/llaves';
import {Cliente, Credenciales} from '../models';
import {ClienteRepository} from '../repositories';
import {AutenticacionService} from '../services';
const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));

//@authenticate('admin')
export class ClienteController {
  constructor(
    @repository(ClienteRepository)
    public clienteRepository : ClienteRepository,
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService,
    //@service(Notificaciones)
    //public notificaciones: NotificacionService,
  ) {}

  //@authenticate.skip()
  @post("/identificarCliente", {
    responses:{
      '200': {
        description: "Identificacion de clientes"
      }
    }
  })
  async identificarCliente(
    @requestBody() credenciales : Credenciales
  ){
  let p = await this.servicioAutenticacion.IdentificarCliente(credenciales.usuario,credenciales.clave);
  if(p){
    let token = this.servicioAutenticacion.GenerarTokenJWT(p);
    return{
      datos: {
        usuario: p.email,
        clave: p.clave,
        id: p.id
      },
      tk: token
    }

  }else{
    throw new HttpErrors[401]("Datos invalidos");
  }

  }

  //@authenticate.skip()
  @post('/clientes')
  @response(200, {
    description: 'Cliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewCliente',
            exclude: ['id'],
          }),
        },
      },
    })
    cliente: Omit<Cliente, 'id'>,
  ): Promise<Cliente> {

    let clave = this.servicioAutenticacion.GenerarClave();
    let claveCifrada = this.servicioAutenticacion.CifrarClave(clave);
    cliente.clave = claveCifrada;
    //let p = await this.clienteRepository.create(cliente);
    console.log("La clave generada es: " + clave);
    console.log("La clave cifrada es: " + claveCifrada);


    //Notificación al cliente
    let destino = cliente.celular;
    let contenido = `Hola ${cliente.nombres}, su nombre de usuario es: ${cliente.email} y su contraseña es: ${clave}`;
    fetch(`${Llaves.urlServicioNotificaciones}/sms?mensaje=${contenido}&telefono=${destino}`)
      .then((data:any) => {
        console.log(data);
      })
    return this.clienteRepository.create(cliente);

  }

  //@authenticate.skip()
  @get('/clientes/count')
  @response(200, {
    description: 'Cliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.count(where);
  }

  @get('/clientes')
  @response(200, {
    description: 'Array of Cliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Cliente) filter?: Filter<Cliente>,
  ): Promise<Cliente[]> {
    return this.clienteRepository.find(filter);
  }

  @patch('/clientes')
  @response(200, {
    description: 'Cliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.updateAll(cliente, where);
  }
  //@authenticate.skip()
  @get('/clientes/{id}')
  @response(200, {
    description: 'Cliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Cliente, {exclude: 'where'}) filter?: FilterExcludingWhere<Cliente>
  ): Promise<Cliente> {
    return this.clienteRepository.findById(id, filter);
  }

  @patch('/clientes/{id}')
  @response(204, {
    description: 'Cliente PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.updateById(id, cliente);
  }

  @put('/clientes/{id}')
  @response(204, {
    description: 'Cliente PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.replaceById(id, cliente);
  }

  @del('/clientes/{id}')
  @response(204, {
    description: 'Cliente DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clienteRepository.deleteById(id);
  }
}
