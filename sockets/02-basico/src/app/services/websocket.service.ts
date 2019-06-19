import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../classes/usuario';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
 
 public socketStatus = false;
 public usuario: Usuario = null;
 public usuarioAmigo: any = null;

  constructor( private socket : Socket, private Router: Router, private http: HttpClient) {
   this.cargarStorage(); 
   this.checkStatus();
  }

  checkStatus(){

	   this.socket.on('connect', () =>{
	    console.log('Conectado al servidor');
	    this.socketStatus = true;
      this.cargarStorage();
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

  LoginyAmigoSecreto(UserAmigoSec: Object): Observable<any>{
    return this.http.post('http://localhost:5000/usuariosdb', UserAmigoSec);
   }

  loginWS( nombre: string, amigoSecreto: string  ) {

    return new Promise( (resolve, reject) => { 
   
     this.emit('configurar-usuario', { nombre }, resp => {

       this.usuario = new Usuario( nombre );
       if(!amigoSecreto){amigoSecreto="debes loguearte nuevamente"}
       this.usuarioAmigo = " Que se dice: "+this.usuario.nombre + " Tienes Asignado a:  " + amigoSecreto
       this.guardarStorage();
       resolve();
     });

    });  
  }


  logoutWS(){
   this.usuario = null;
   localStorage.removeItem('usuario');

   const payload = {
    nombre : 'sin-nombre'
   };

   this.socket.emit('configurar-usuario', payload, () => {});
   this.Router.navigateByUrl('');

  }

  guardarStorage(){
   localStorage.setItem( 'usuario', JSON.stringify( this.usuario ) );
  }


  getUSuario(){
    return this.usuario;
  }



  cargarStorage(){
   if( localStorage.getItem( 'usuario' )){
     this.usuario = JSON.parse( localStorage.getItem('usuario') );
     this.loginWS( this.usuario.nombre, this.usuarioAmigo );
   } 

  }

}

