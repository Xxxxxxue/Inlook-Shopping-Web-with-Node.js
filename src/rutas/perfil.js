// RUTAS Y FUNCIONES AL LLEGAR PAGINA PERSONAL


// RAIZ  --> / , SE REFIERE AL PAGINA PERSONAL DE CLIENTE O DE ADMINISTRADOR
/*router.get('/:id',async(req,res) => {
	res.render('/profile'); // HTML pagPersonal
});
*/

const express = require('express');
const router = express.Router(); 

const db = require('../db');
const passport = require('passport');


//PAGINA DE EDITAR LOS DATOS PERSONALES
//Sacar datos de database y los colocan en html
router.get('/editarmisdatos',async(req,res) => {

	const cl = await db.query('SELECT * FROM tclientes WHERE id = ?',[req.user.IdClientes]);
	const dirs  = await db.query('SELECT * FROM tdireccion WHERE IdClientes = ?',[cl.ID]);
	console.log(cl,dirs);
	res.render('links/datapers',{ cl,dirs }); //ruta donde guarda EditarMisDatos
});
//Una vez modificado los datos, guardan en database
//Hay que saber --> como pasa req.body en objeto y recorrer como array
//Hay que saber como subir al servidor imagen, asignar y guardar ruta en database
router.post('/EditarMisDatos',async(req,res) => {
	const datos = req.body;

	let datocliente = {
		nombre,
		apellido,
		email,
		telefono
	};
	//un recorrido de dir para guardar varios direccion.
	await db.query('SELECT INTO tclientes VALUES ?',[datocliente]);
});


//PAGINA PARA CAMBIAR CONTRASENA
router.get('/changepass',async(req,res) => {

	res.render('links/changepass');
});
router.post('/changepass', passport.authenticate('local.change', {
  	successRedirect: '/perfil',
  	failureRedirect: '/perfil/changepass',
  	failureFlash: true
}));



//PAGINA MIS PEDIDOS
router.get('/mispedidos',async(req,res) => {

	//const pedidos = await db.query('SELECT *')
	res.render('links/mispedidos');
});



//PAGINA MIS DISENOS
router.get('/misdisenos',async(req,res) => {

	//conseguir todos los imagenes del usuario y saca al pantalla, luego anadir modificar y eliminar
	res.render('links/misdisenos');
});


//PAGINA GESTION
router.get('/gestion',async(req,res) => {

	//conseguir la lista de producto y luego podra anadir, modificar,eliminar 
	res.render('links/gestion-producto');
});


//PAGINA FACTURACION
router.get('/facturacion',async(req,res) => {

	//ver facturas,posibre una lista
	res.render('links/facturacion');
});







module.exports = router; 









