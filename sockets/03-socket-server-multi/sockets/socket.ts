
import { Socket } from 'socket.io';
import SocketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();


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





