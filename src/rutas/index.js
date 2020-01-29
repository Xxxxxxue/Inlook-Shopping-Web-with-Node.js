//codigo que quiero ejecutar para los URL
//Es un modulo

const express = require('express');
const router = express.Router(); // De express solo necesito Router

//conexion con BD. Llama fichero db.js de conexion database
//Esto debe aparecer en cada modulo que necesita
const db = require('../db');

/*
	Protección de rutas
 */
const { isLoggedIn, isNotLoggedIn } = require('../lib/acceso')

/*
	RUTAS
*/


//req --> llega la url(ruta) de la peticion cliente
//res --> responder la solicitud del cliente
router.get('/', (req,res) => {
	//res.end('ESTOY MUERTO GRACIAS.Para tener mas informacion anade en url "/revivir".');
	res.render('partials/slider_main'); //render --> para fijar fichero de vista(views)
});

router.get('/perfil', (req,res) => {
	res.render('layouts/pagpers');
});

//	pantalla de salida
router.get('/salir', isLoggedIn, (req, res) => {
    //	Passport añade al objeto request (req) varios métodos
    //	entre ellos el 'logout' 
    console.log('saliendo');       
    req.logout();
    res.redirect('/');
});


module.exports = router; 