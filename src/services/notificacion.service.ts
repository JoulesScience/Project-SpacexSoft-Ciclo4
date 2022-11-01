import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {NotificacionesRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionService {
  constructor(@repository(NotificacionesRepository)
    public notificacion:NotificacionesRepository,
  ) {

  }


  /*
   * Add service methods here
   */

  enviarSMS(mensaje: any){
    const accountSid = 'AC0b44ea0f98eb9e0d3629b7a43525b75e';
    const authToken = '598dd07e4dd09cd556271403b25fc841';
    const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: mensaje,
     from: '+18586836306',
     to: '+573132380424',
   })
  .then((message: any) => console.log(message.sid));

  }

  enviarMensajes() : string {
    return '';
  }



}
