import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
 
 public socketStatus = false;


  constructor( private socket : Socket) {  
   this.checkStatus();
  }

  checkStatus(){

	   this.socket.on('connect', () =>{
      console.log('Conectado el socket');	  
	    this.socketStatus = true;    
	   });

	   this.socket.on('disconnect', () =>{
      console.log('Desconectado el socket');    	   
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
}

