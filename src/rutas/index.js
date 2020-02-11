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
	if(promo.length>1) {promo[0].s ='active';}
	const  productos = await db.query('SELECT * FROM tproductos ORDER BY time DESC')
	const np = 2; //numero de productos en un pag
	const n = productos.length;
	const npages = Math.ceil(n / np);

	res.render('partials/slider_main',{promo,productos,np,npages}); //{user: req.user}   render --> para fijar fichero de vista(views)
});
/*
router.get('/inicio/:page', async(req,res) => {

	const np = 1; //numero de productos en un pag
	const n = await db.query('SELECT count(*) FROM tproducto');
	var page = Math.ceil(n.count / np);

	const a = ((req.params.page-np)*1)+1;
	const b = req.params.page*np;
	let productos = await db.query('SELECT * FROM tproducto LIMIT ?,?',[a,b]);
	console.log(productos.length);
	for (var i = 0;i < productos.length; i++) {
		img =  await db.query('SELECT imagen FROM tgaleria WHERE IdProducto = ?',[productos[i].ID]);
		productos[i].img = img[0].imagen;
	}
	
	const categoria = await db.query('SELECT * FROM tcategoria');
	
	
	res.render('layouts/listado',{productos,categoria,'page': page,'current': req.params.page});
});

*/

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
/*router.post('/page/:page', async(req,res) => {

	const np = 1;
	const a = ((req.params.page-np)*1)+1;
	const b = req.params.page*np;
	let productos = await db.query('SELECT * FROM tproducto LIMIT ?,?',[a,b]);
	console.log(productos.length);
	for (var i = 0;i < productos.length; i++) {
		img =  await db.query('SELECT imagen FROM tgaleria WHERE IdProducto = ?',[productos[i].ID]);
		productos[i].img = img[0].imagen;
	}
	
	const categoria = await db.query('SELECT * FROM tcategoria');
	
	res.send({productos,galeria,categoria,'pagina': req.params.page});
	res.render('layouts/listado',{productos});
});

router.get('/:tipo:page', async(req,res) => {
	const productos = await db.query('SELECT * FROM tproducto WHERE tipo = ? ORDER BY time DESC',[req.params.tipo]);
	//const tipo = await db.query('SELECT * FROM tproductocategoria WHERE 1 ');
	const galeria = await db.query('SELECT * FROM tgaleria WHERE 1');
	const categoria = await db.query('SELECT * FROM tcategoria WHERE 1');
	
	res.send({productos,galeria,categoria,'pagina': req.params.page,'tipo':req.params.tipo});
});
*/

//FICHA DE COMPRA
router.get('/ficha/:page/:id',async(req,res) => {

	res.render('layouts/ficha');
});


module.exports = router; 