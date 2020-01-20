//codigo que quiero ejecutar para los URL
//Es un modulo

const express = require('express');
const router = express.Router(); // De express solo necesito Router

//conexion con BD. Llama fichero db.js de conexion database
//Esto debe aparecer en cada modulo que necesita
const db = require('../db');

//PRIMERA RUTA, leer url que ha llegado compara con get(),es igual hace funcion
//req --> llega la url(ruta) de la peticion cliente
//res --> responder la solicitud del cliente
router.get('/', async(req,res) => {
	//res.end('ESTOY MUERTO GRACIAS.Para tener mas informacion anade en url "/revivir".');
	res.render('index'); //render --> para fijar fichero de vista(views)
});



module.exports = router; 