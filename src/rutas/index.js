//codigo que quiero ejecutar para los URL
//Es un modulo

const express = require('express');
var moment = require('moment');
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
router.get('/', async(req,res) => {
	//user como un parametro para hacer la condicion if
	//si esta loggeado, pasa a perfil sin slider_main,si no siempre esta en la pantalla
	//console.log(req.user)
	var localTime = moment().format('YYYY-MM-D');
	console.log(localTime);
	const promo = await db.query('SELECT * FROM tpromociones WHERE F_fin >= CAST(? AS date)',[localTime]);

	promo[0].s ='active';
	
	res.render('partials/slider_main',{promo}); //{user: req.user}   render --> para fijar fichero de vista(views)
});

//Si esta loggeado entra al perfil
router.get('/perfil',isLoggedIn, (req,res) => {
	//console.log(req.user);
	res.render('layouts/pagpers', {'admin': req.user.esadmin});
});

//	pantalla de salida
router.get('/salir', isLoggedIn, (req, res) => {
    //	Passport añade al objeto request (req) varios métodos
    //	entre ellos el 'logout' 
    console.log('saliendo');       
    req.logout();
    res.redirect('/');
});

/*--------------------------------------------------------------------------------------------------------------------*/
//LISTADO DE PRODUCTO, ejemplo con AJAX
router.post('/:page', async(req,res) => {
	const productos = await db.query('SELECT * FROM tproducto WHERE 1 ORDER BY time DESC');
	const tipo = await db.query('SELECT * FROM tproductocategoria WHERE 1 ');
	const galeria = await db.query('SELECT * FROM tgaleria WHERE 1');
	const categoria = await db.query('SELECT * FROM tcategoria WHERE 1');
	
	res.send({productos,galeria,categoria,tipo, 'pagina': req.params.page});
});



module.exports = router; 