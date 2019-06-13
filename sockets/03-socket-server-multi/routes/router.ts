

import  {Router, Request, Response} from 'express';
import   Server  from '../classes/server';
import  { usuariosConectados } from '../sockets/socket';
import  { GraficaData } from '../classes/grafica';
import  { GraficaEncuestaData } from '../classes/encuesta';
// import  { Mapa } from '../classes/mapa';
// import  { Colas } from '../classes/colas';
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const assert = require('assert');

const router = Router();

// export const cola = new Colas();

// export const mapa = new Mapa();
const lugares = [
  {
    id: '1',
    nombre: 'Villa Maria',
    lat: 5.0455555555556,
    lng: -75.515277777778
  },
  {
    id: '2',
    nombre: 'Chinchina',
    lat: 4.9805555555556,
    lng: -75.6075
  },
  {
     id: '3',
    nombre: 'Neira',
    lat: 5.1663888888889,
    lng: -75.518888888889
  }
];

// mapa.marcadores.push( ...lugares );

//GET - todos los marcadores

router.get('/mapa',( req:Request, res:Response ) =>{
    
    // res.json( mapa.getMarcadores() );

})



router.get('/usuariosdb',( req:Request, res:Response ) =>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("amigosecreto");
    dbo.collection("participantes").findOne({}, function(err, result) {
      if (err) throw err;
      console.log(result.name);
      res.json( ´{"msg" : result.nombre});
      db.close();
    });
    // dbo.collection("participantes").find({}).toArray(function(err, docs) {
    //   assert.equal(err, null);
    //   console.log("Found the following records");
    //   console.log(docs);
    //   res.json( {"msg":docs} );
    // });
  });
   
  

})



const grafica = new GraficaData();

const encuesta = new GraficaEncuestaData();

router.get('/grafica',( req:Request, res:Response ) =>{
    
    res.json( grafica.getDataGrafica() );

})


router.post('/grafica',( req:Request, res:Response ) =>{
        
    const mes = req.body.mes;
    const unidades = Number( req.body.unidades);

    grafica.incrementarValor( mes, unidades );
    
    const server = Server.instance;
    server.io.emit('cambio-grafica', grafica.getDataGrafica() );
   
    res.json( grafica.getDataGrafica() );

})


router.post('/encuesta',( req:Request, res:Response ) =>{
        
    const opcion = req.body.opcion;
    const unidades = Number( req.body.unidades);

    encuesta.incrementarValor( opcion, unidades );
    
    const server = Server.instance;
    server.io.emit('cambio-encuesta', encuesta.getDataGraficaEncuesta() );
   
    res.json( encuesta.getDataGraficaEncuesta() );

})

router.get('/encuesta',( req:Request, res:Response ) =>{
    
    res.json( encuesta.getDataGraficaEncuesta() );

})


router.get('/mensajes',( req:Request, res:Response ) =>{

    res.json({
     ok: true,
     mensaje: 'Hola soy luci y emma!!'
    });

})


router.post('/mensajes',( req:Request, res:Response ) =>{

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
     de,
     cuerpo
    }
    
    const server = Server.instance;

    server.io.emit( 'mensaje-nuevo', payload );

    res.json({
     ok: true,
     cuerpo,
     de

    });

})

// obtener los ids de los usuarios
router.post('/mensajes/:id',( req:Request, res:Response ) =>{

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
     de,
     cuerpo
    }

    const server = Server.instance;

    server.io.in( id ).emit( 'mensaje-privado', payload );

    res.json({
     ok: true,
     cuerpo,
     de,
     id
     
    });

})


router.get('/usuarios',( req: Request , res:Response ) =>{

 const server = Server.instance;

    server.io.clients( (err: any, clientes: string [] ) => {


     if( err ){

        res.json({
         ok: false,
         err
        });
         
      }

       res.json({
         ok: true,
         clientes
        });

    });

})

// obtener usuarios nuevamente y sus nombres
router.get('/usuarios/detalle',( req: Request , res:Response ) =>{
     
       res.json({
         ok: true,
         clientes: usuariosConectados.getLista()
        });
})


router.get('/colas',( req:Request, res:Response ) =>{

    //const server = Server.instance;
    //server.io.emit('asignar-turno', cola.imprimir() );
   

    //res.json( cola.obtenerPrimeroCola() ); 

    
    res.json({     
    //  data: cola.obtenerPrimeroCola()       
    }); 

})

export default router;