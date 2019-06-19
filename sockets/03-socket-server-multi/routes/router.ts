

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



router.post('/usuariosdb',( req:Request, res:Response ) =>{
  MongoClient.connect(url, function(err: any, db: any) {
    if (err) throw err;
    var dbo = db.db("admin");
    const UserAmigoSec =  req.body.UserAmigoSec;
    //se busca si existe el codigo de login
    dbo.collection("participantes").findOne({ "num": ""+ UserAmigoSec +"" }, function(err: any, result: any) {
      try 
      { //se asigna  sino tiene amigo secreto aun
        if(result.asignado === ""){
        //  var amigosignado =  AsignarAmigo(result.grupo, result.id);

        dbo.collection("participantes").findOneAndUpdate(
          {
            $and: 
            [
              { 'id' :  { $not: { $eq: ""+ result.id +"" } } },
              { 'grupo' :  { $not: {  $eq: ""+ result.grupo +""   } } },
              { "elegidopor" : { $eq: "" } }
            ]
          },{$set : { "elegidopor" : ""+ result.id +"" }},{New:true},(err: any, doc: any) => {
            if (err) {
                console.log("Algo salio mal mientras de actualiza!" + err);
            }    
            console.log("Por fin el amigo es  %% "+ doc.value.nombre + " con id : "+ doc.value.id+ " -_- elegido por "+ UserAmigoSec);
              //actualizo el campo asignado de UserAmigoSec con el amigo secreto calculado
          
              dbo.collection("participantes").updateOne(
                {
                  $and: 
                  [
                    { 'id' :   { $eq: ""+ result.id +"" } },
                    { 'grupo' :  { $eq: ""+ result.grupo +"" } }
                  ]
                },
                  { $set: { "asignado" : ""+ doc.value.id +""  } }, (err:any, resultAsig: any ) =>
                  {
                    if(!err){
                      // console.log(Object.keys(resultAsig.value) +"actualizo a "+resultAsig.value.nombre+" tiene asignado el: "+resultAsig.value.asignado );  
                      console.log(" y devolvio pa " +result.nombre +" del grupo  "+result.grupo + " tiene a " +doc.value.nombre);
                      res.json( {"msg" : result.nombre, "grupo" : result.grupo, "elAmigoEs" : doc.value.nombre});
                    }else{
                      console.log("el id para actuali el asignado "+result.id);
                      console.log("es este error al actualizar el asignado "+err);
                    }
                  }
              );
           
            // return doc.value.nombre;
          }
          );        
        }else if(result.asignado != ""){// se busca si ya lo tiene asignado para mostrarlo en pantalla
          dbo.collection("participantes").findOne({"id": ""+ result.asignado +"" }, function(err: any, resAsig: any) { 
           try{
             console.log("ud ya tiene a " + resAsig.nombre  );
             res.json( {"msg" : result.nombre, "grupo" : result.grupo, "elAmigoEs":resAsig.nombre});
           }catch{
             console.log("Error no se encontro amigo secreto asignado " + err );
            res.json( {"msg" : "Error no se encontro amigo secreto asignado" , "grupo" : "error grupo", "elAmigoEs":"ninguno"}); 
           }
          });//se busca el que este diponible en el mismo grupo(caso hipotetico)
        }else{
          dbo.collection("participantes").findOneAndUpdate(
            {
              $and: 
              [
                { 'id' :  { $not: { $eq: ""+ result.id +"" } } },                
                { "elegidopor" : { $eq: "" } }
              ]
            }
            ,
             {$set : { "elegidopor" : ""+ result.id +"" }},{New:true}
             , (err: any, doc: any) => {
              if (err) {
                  console.log("Algo salio mal mientras de actualiza en el mismo grupo!" + err);
              }
                console.log("Por fin el amigo del mismo grupo es  ## "+ doc.value.nombre + " -_- elegido por "+ UserAmigoSec);
                
                //actualizo el campo asignado de UserAmigoSec con el amigo secreto calculado
             
              dbo.collection("participantes").updateOne({ "id" : { $eq: ""+ result.id +"" } },
                  { $set: { "asignado" : ""+ doc.value.id +""  } }, function(err:any, resultAsig: any ) {
                    try{
                      // console.log(Object.keys(resultAsig.value) +"actualizo a "+resultAsig.value.nombre+" tiene asignado el: "+resultAsig.value.asignado );  
                      console.log(" y devolvio pa " +result.nombre +" del grupo  "+result.grupo + " tiene a " +doc.value.nombre);
                      res.json( {"msg" : result.nombre, "grupo" : result.grupo, "elAmigoEs" : doc.value.nombre});
                    }catch{
                      console.log("el id para act "+doc.value.id);
                      console.log("es este error al actualizar el asignado "+err);
                    }
                  }
              );
              // return doc.value.nombre;
            }
            );  
        }
        //  db.close();
      }catch {
        res.json( {"msg" : "Error no se encontro usuario"});        
      }
    });  
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