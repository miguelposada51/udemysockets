

import  express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/socket';

export default class Server {
	
    private static _instance: Server;

	public app: express.Application ;
	public port: number; 
	public io: SocketIO.Server;
    private httpServer: http.Server;

	private constructor(){

	  this.app = express();
	  this.port = SERVER_PORT;
	  this.httpServer = new http.Server( this.app );
	  this.io = socketIO( this.httpServer );
	  this.escucharSockets();	

	}
     
    public static get instance(){
     return this._instance || ( this._instance = new this() );	
    }

	private escucharSockets(){
	 console.log('Escuchando Conexiones - sockets');

	 this.io.on('connection', cliente =>{

	 	//mapa
	 	//agregar marcador
	 	socket.marcadorNuevo( cliente );

	 	//eliminar marcador
	 	socket.eliminarMarcador( cliente );

	 	//mover marcador
	 	socket.moverMarcador( cliente );


	 	//conectar cliente	  	
	 	socket.conectarCliente( cliente);

	 	// mensajes
	 	socket.mensaje( cliente, this.io );

	 	//desconectar
	    socket.desconectar( cliente, this.io );

	    // configurar usuario
	  	socket.configurarUsuario( cliente, this.io );

	  	// cargar lista inicial
	  	socket.listaUsuConect( cliente, this.io );

	  	// cargar todos los elementos de una cola
	  	socket.generarSiguienteTurno( cliente, this.io  );

	  	socket.cargarTurnosActuales( cliente, this.io );

	 });
	}

	start (callback: Function){

	 this.httpServer.listen(this.port, callback);
	 	
	}


}