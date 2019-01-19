import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../classes/usuario';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
 
 public socketStatus = false;
 public usuario: Usuario

  constructor( private socket : Socket) {
   this.checkStatus();
  }

  checkStatus(){

	   this.socket.on('connect', () =>{
	    console.log('Conectado al servidor');
	    this.socketStatus = true;
	   });

	   this.socket.on('disconnect', () =>{
	    console.log('Desconectado del servidor');
	    this.socketStatus = false;
	   });

   }

  emit( evento: string, payload?: any, callback?: Function){
    console.log('Emitiendo', evento);
  	this.socket.emit( evento, payload, callback );
  }    

  listen( evento: string){
   return  this.socket.fromEvent( evento);
  } 

  loginWS( nombre: string ) {
    console.log('configurando', nombre );
    //this.socket.emit( 'configurar-usuario', { nombre }, ( resp) => {
     this.emit('configurar-usuario', { nombre }, resp => {
       console.log(resp);
     });
     
   
  }

}

