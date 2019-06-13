
import { Socket } from 'socket.io';
import SocketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';
// import { mapa } from '../routes/router';
// import { Colas } from '../classes/colas';

export const usuariosConectados = new UsuariosLista();

// export const ColasTurnos = new Colas();

export const marcadorNuevo = ( cliente: Socket ) => {  

  cliente.on( 'marcador-nuevo', ( marcador ) => {

  //  mapa.agregarMarcador( marcador );
   
   cliente.broadcast.emit('marcador-nuevo', marcador );

  });

}

export const eliminarMarcador = ( cliente: Socket ) => {  

  cliente.on( 'borrar-marcador', ( id: string ) => {

  //  mapa.borrarMarcador( id );
 
   cliente.broadcast.emit('borrar-marcador', id );

  });

}

export const moverMarcador = ( cliente: Socket ) => {  

  cliente.on( 'mover-marcador', ( marcador ) => {

  //  mapa.moverMarcador( marcador );
 
   cliente.broadcast.emit('mover-marcador', marcador );

  });

}


export const conectarCliente = ( cliente: Socket ) => {  

  const usuario = new Usuario ( cliente.id ); 
  usuariosConectados.agregar( usuario );

}

export const desconectar = ( cliente: Socket, io : SocketIO.Server ) => {

   cliente.on('disconnect', () => {

    console.log('Cliente desconectado ' + cliente.id);
 
    usuariosConectados.borrarUsuario( cliente.id);

    io.emit('usuarios-activos', usuariosConectados.getLista() );

   });
}

export const mensaje = ( cliente: Socket, io: SocketIO.Server ) =>{
  
  cliente.on('mensaje',( payload: { de: string, cuerpo: string } ) => {

  	console.log('Mensaje Recibido', payload);

  	io.emit('mensaje-nuevo', payload);

  });

}

export const  configurarUsuario = ( cliente: Socket, io: SocketIO.Server ) =>{
  
  cliente.on('configurar-usuario',( payload: { nombre: string }, callbacK : Function ) => {

    
  	console.log('Se Conecto por login', payload.nombre);

  	usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
    
      io.emit('usuarios-activos', usuariosConectados.getLista() );

  	callbacK({
     ok: true,
     mensajes: `Usuario: ${ payload.nombre }, configurado`		
  	});

  });

}


// obtener Usuarios
export const  listaUsuConect = ( cliente: Socket, io: SocketIO.Server ) =>{
  
  cliente.on('obtener-usuarios',() => {
     
      io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista() );
   
  });

}

export const generarSiguienteTurno = ( cliente: Socket, io: SocketIO.Server ) => {  

  cliente.on( 'nuevo-turno', ( turno ) => {

 console.log("estos son los que llegaron  : " + turno);
  // ColasTurnos.addcola( turno );
  // console.log("los usuarios actuales : " + turno + ' -- ' + ColasTurnos.obtenerPrimeroCola()); 
 
  //  io.emit('asignar-turno', ColasTurnos.obtenerPrimeroCola() );

  });

}

export const cargarTurnosActuales = ( cliente: Socket, io: SocketIO.Server ) => {  

  cliente.on( 'cargar-turnos', () => {

  //  io.emit('valorTurno-actual', ColasTurnos.obtenerPrimeroCola() );

  });

}





