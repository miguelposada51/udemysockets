
import Server from './classes/server';


const server = new Server();

server.start(() => {

 console.log(`Sevidor corriendo en el puerto ${server.port}}`);

}); 