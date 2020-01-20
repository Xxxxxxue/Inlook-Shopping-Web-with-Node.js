//establecer modulo de base de dato
const mysql = require('mysql');

//promisify --> permite manejar mysql en modo promesa
const { promisify } = require('util');

//Guardar datos de la conexion en database
//{ database }, es un objeto tipo database con cinco variables como creado en key.
const { database } =  require('./keys');  

//permite varios conexion conectado con base de dato. Guardar los conexiones en db.
//La conexion no es asincrona
const db = mysql.createPool(database); 

//Estableciendo la conexion. Comprobar conexion
//ERROR1: SE HA PERDIDO LA CONEXION CON BASE DE DATO
//ERROR2: MUXA CONEXION 
//ERROR2: RECHAZADA LA CONEXION
db.getConnection((err,connection) => {
	if(err) {
		if(err.code === 'PROTOCOLO_CONNECTION_LOST') {
			console.error('Database connection was closed.');
		}
		if(err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has to many connections');
		}
		if(err.code === 'ECONNREFUSED') {
			console.error('Database connection was refused.');
		}
	}

	if(connection)
		connection.release(); //release(), permite mantener la conexion
	console.log('DB is Connected');

	return;
});

//Promisify Pool Querys
//hace conexion mediante modo de promisify
db.query = promisify(db.query);

module.exports = db;