//codigo que quiero ejecutar para los URL
//Es un modulo

const express = require('express');
var moment = require('moment');
const router = express.Router(); // De express solo necesito Router

//conexion con BD. Llama fichero db.js de conexion database
//Esto debe aparecer en cada modulo que necesita
const db = require('../db');

var n;
var current = 1;

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
	if(promo.length>1) {
		promo[0].s ='active';
	}

	const categoria = await db.query('SELECT * FROM tcategoria');
	const  p = await db.query('SELECT P.*, G.imagen FROM tproducto P INNER JOIN (SELECT IdProducto ,min(imagen) AS imagen \
					                FROM shop_inlook.tgaleria GROUP BY idProducto) G  ON P.ID = G.IdProducto ORDER BY P.time DESC LIMIT 0,9');

	//console.log(p[0]);
	if(current == 1 || current == null)
		var si = true;
	else
		var si = false;

	res.render('partials/slider_main',{promo,categoria,p,si,current}); //{user: req.user}   render --> para fijar fichero de vista(views)
});

//LLAMA AJAX, Para paginacion
router.get('/page', async(req,res) => {

	n = await db.query('SELECT count(*) AS num FROM tproducto'); // cantidad total de productos

	res.send({n,current});
});

router.post('/page/:page', async(req,res) => {

	const np = 9; //numero de productos en un pag
	const a = ((req.params.page-1)*np); // producto inicio 
	const b = req.params.page*np;  //producto final
	current = req.params.page;

	let productos = await db.query('SELECT P.*, G.imagen FROM tproducto P INNER JOIN (SELECT IdProducto ,min(imagen) AS imagen \
					                FROM shop_inlook.tgaleria GROUP BY idProducto) G  ON P.ID = G.IdProducto \
					                ORDER BY P.time DESC LIMIT ?,?',[a,b]);
	
	
	res.send({productos});
});

//FICHA DE COMPRA
router.get('/ficha/:id',async(req,res) => {

	const p = await db.query('SELECT * FROM tproducto WHERE ID = ?',[req.params.id]);
	const color = await db.query('SELECT ID,valor FROM tcolortalla WHERE TProducto_ID = ? AND atributo ="color" ',[req.params.id]);
	const talla = await db.query('SELECT ID,valor FROM tcolortalla WHERE TProducto_ID = ? AND atributo ="talla" ',[req.params.id]);
	const img = await db.query('SELECT * FROM tgaleria WHERE IdProducto = ? ',[req.params.id]);
	if(img.length != null)
		img[0].s = 'active';
	console.log(img);
	res.render('layouts/ficha',{p:p[0],color,talla,img});
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
});*/

/*router.get('/:tipo:page', async(req,res) => {
	const productos = await db.query('SELECT * FROM tproducto WHERE tipo = ? ORDER BY time DESC',[req.params.tipo]);
	//const tipo = await db.query('SELECT * FROM tproductocategoria WHERE 1 ');
	const galeria = await db.query('SELECT * FROM tgaleria WHERE 1');
	const categoria = await db.query('SELECT * FROM tcategoria WHERE 1');
	
	res.send({productos,galeria,categoria,'pagina': req.params.page,'tipo':req.params.tipo});
});
*/




module.exports = router; 