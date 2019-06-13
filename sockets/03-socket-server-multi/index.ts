
import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';

const server = Server.instance;

// bodyPArser
server.app.use( bodyParser.urlencoded({ extended: true}) );
server.app.use( bodyParser.json() );

//CORS
server.app.use( cors({ origin: true, credentials: true }) )

server.app.use('/', router)


server.start(() => {

 console.log(`Sevidor corriendo en el puerto ${server.port}`);

}); 

// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'amigosecreto';

// const client = new MongoClient(url);
// // Use connect method to connect to the server
// client.connect(function(err) {
//   assert.equal(null, err);
//   console.log("Connected correctly to mongoDB server");

//   const db = client.db(dbName);

// //   insertDocuments(db, function() {
//     findDocuments(db, function() {
//       client.close();
//     });
// //   });
// });

// const insertDocuments = function(db, callback) {
//     // Get the documents collection
//     const collection = db.collection('participantes');
//     // Insert some documents
//     collection.insertMany([
//       {a : 1}, {a : 2}, {a : 3}
//     ], function(err, result) {
//       assert.equal(err, null);
//       assert.equal(3, result.result.n);
//       assert.equal(3, result.ops.length);
//       console.log("Inserted 3 documents into the collection");
//       callback(result);
//     });
//   }

// const findDocuments = function(db, callback) {
//     // Get the documents collection
//     const collection = db.collection('participantes');
//     // Find some documents
//     collection.find({}).toArray(function(err, docs) {
//       assert.equal(err, null);
//       console.log("Found the following records");
//       console.log(docs)
//       callback(docs);
//     });
//   }