// RUTAS Y FUNCIONES AL LLEGAR PAGINA PERSONAL


// RAIZ  --> / , SE REFIERE AL PAGINA PERSONAL DE CLIENTE O DE ADMINISTRADOR

const express = require('express');
var moment = require('moment');
const router = express.Router(); 

const db = require('../db');
const passport = require('passport');
const { isLoggedIn } = require('../lib/acceso');



//PAGINA DE EDITAR LOS DATOS PERSONALES
router.get('/datapers',isLoggedIn,async(req,res) => {

	const cl = await db.query('SELECT * FROM tclientes WHERE id = ?',[req.user.IdClientes]);
	const dirs  = await db.query('SELECT * FROM tdireccion WHERE IdClientes = ?',[cl[0].ID]);

	for(var i=0;i<dirs.length;i++) {

		if(dirs[i].Tipo == 0 || dirs[i].Tipo == 2)
			dirs[i].entrega = 'checked';
		if(dirs[i].Tipo == 1 || dirs[i].Tipo == 2)
			dirs[i].factura = 'checked';
	
	}
	console.log(cl,dirs);
	/*var id = req.user.ID;
	console.log(id);*/
	
	res.render('links/datapers',{ 'id': req.user.ID, cl:cl[0],dirs }); //una variable int/string... se hace 'variable': valor
});
//Una vez modificado los datos, guardan en database
router.post('/datapers',isLoggedIn,async(req,res) => {
	console.log(req.body);
	const { Nombre,Apellidos,Email,Telefono } = req.body;
		
	if(!req.files || Object.keys(req.files).length === 0){
		var Foto = req.body.Foto;
	}
	else{
		let sampleFile = req.files.foto;
		console.log(sampleFile.name);
		var Foto = '/image/foto-perfil/'+sampleFile.name;
  		sampleFile.mv('src/public/image/foto-perfil/'+sampleFile.name, function(err) {
  		 	if (err)
  				return res.status(500).send(err);
	
  		});
	}



	let datocliente = {
		Foto,
		Nombre,
		Apellidos,
		Email,
		Telefono
	};
	//un recorrido de dir para guardar varios direccion.
	await db.query('UPDATE tclientes SET ? WHERE ID=?',[datocliente,req.user.IdClientes]);

	res.redirect('/perfil/datapers');
});

//ANADIR UNA DIRECCION
router.get('/datapers/dir-add',isLoggedIn,async(req,res) => {
	
	res.render('partials/dir-add');
});
router.post('/datapers/dir-add',isLoggedIn,async(req,res) => {
	
	const { Direccion,Localidad,Provincia,CPostal,Pais,entrega,factura } = req.body;
	var tipo;
	if(entrega == '1'  && factura == '1') 
		tipo = 2;
	else {
		if(entrega == '1')
			tipo = 0;
		if(factura == '1')
			tipo = 1;
	}

	let newDir = {
		Direccion,
		Localidad,
		CPostal,
		Provincia,
		Pais,
		Tipo: tipo,
		IdClientes: req.user.IdClientes
	}
	console.log(newDir);

	await db.query('INSERT INTO tdireccion SET ?', [newDir]);
	res.redirect('/perfil/datapers');
});

//MODIFICAR UNA DIRECCION
router.get('/datapers/dir-edit/:id',isLoggedIn,async(req,res) => {

	const id = req.params.id;
	console.log(req.params.id); //sale id
	const dir = await db.query('SELECT * FROM tdireccion WHERE ID = ?',id);
	
	if(dir[0].Tipo == 0 || dir[0].Tipo == 2)
		dir[0].entrega = 1;
	if(dir[0].Tipo == 1 || dir[0].Tipo == 2)
		dir[0].factura = 1;
	
	console.log(dir);
	res.render('partials/dir-edit',{ dir: dir[0] });
});
router.post('/datapers/dir-edit/:id',isLoggedIn,async(req,res) => {
	
	const { Direccion,Localidad,Provincia,CPostal,Pais,entrega,factura } = req.body;
	var tipo;
	if(entrega == '1'  && factura == '1') 
		tipo = 2;
	else {
		if(entrega == '1')
			tipo = 0;
		if(factura == '1')
			tipo = 1;
	}

	let newDir = {
		Direccion,
		Localidad,
		CPostal,
		Provincia,
		Pais,
		Tipo: tipo,
		IdClientes: req.user.IdClientes
	}
	console.log(newDir);

	await db.query('UPDATE tdireccion SET ? WHERE ID=?',[newDir,req.params.id]);
	res.redirect('/perfil/datapers');
});

//ELIMINAR UNA DIRECCION
router.get('/datapers/dir-elimir/:id',isLoggedIn,async(req,res) => {

	await db.query('DELETE FROM tdireccion WHERE ID = ?', [req.params.id]);
	res.redirect('/perfil/datapers');
	
});



/*-------------------------------------------------------------------------------------------------------------------------------*/


//PAGINA PARA CAMBIAR CONTRASENA
router.get('/changepass',isLoggedIn,async(req,res) => {

	res.render('links/changepass', {'id': req.user.ID,'usuario': req.user.usuario});
});
router.post('/changepass/:id',isLoggedIn,passport.authenticate('local.change', {
  	successRedirect: '/perfil',
  	failureRedirect: '/perfil/changepass',
  	failureFlash: true
}));


/*------------------------------------------------------------------------------------------------------------------------------*/


//PAGINA MIS PEDIDOS
router.get('/mispedidos',isLoggedIn,async(req,res) => {

	
	res.render('links/mispedidos');
});
router.post('/mispedidos/id',isLoggedIn,async(req,res) => {

	
	res.redirect('/perfil/mispedidos');
});



/*------------------------------------------------------------------------------------------------------------------------------*/


//PAGINA MIS DISENOS
router.get('/misdisenos',isLoggedIn,async(req,res) => {

	const disenos = await db.query('SELECT * FROM tdisenos WHERE IdUsuario = ?',[req.user.ID]);
	//console.log(disenos);
	//conseguir todos los imagenes del usuario y saca al pantalla, luego anadir modificar y eliminar
	res.render('links/misdisenos',{disenos});
});

//anadir disenos
router.get('/misdisenos/s-add',isLoggedIn,async(req,res) => {
	
	res.render('partials/diseno-add',{'adm': req.user.esadmin});
});
router.post('/misdisenos/s-add',isLoggedIn,async(req,res) => {
	
	const { Nombre } = req.body;
	if (req.user.esadmin) {
		var Ambito = req.body.Ambito;
	}
	else
		var Ambito = 1;

	

	//console.log(req.files);
	if(!req.files || Object.keys(req.files).length === 0){
		var imagen = 0;
	}
	else{
		let sampleFile = req.files.imagen;
		console.log(sampleFile.name);
		var imagen = '/image/disenos/'+sampleFile.name;
  		sampleFile.mv('src/public/image/disenos/'+sampleFile.name, function(err) {
  		 	if (err)
  				return res.status(500).send(err);
	
  		});
	}


	let newDiseno = {
		Nombre,
		imagen,
		Ambito,
		IdUsuario: req.user.ID
	};
	
	await db.query('INSERT INTO tdisenos SET ?',[newDiseno]);
	res.redirect('/perfil/misdisenos');
});


//editar disenos
router.get('/misdisenos/s-edit/:id',isLoggedIn,async(req,res) => {

	const diseno = await db.query('SELECT * FROM tdisenos WHERE id = ?',[req.params.id]);

	if(diseno[0].Ambito == 0)
		diseno[0].public = 'checked';
	if(diseno[0].Ambito == 1)
		diseno[0].privad = 'checked';

	console.log(diseno);
	
	res.render('partials/diseno-edit',{diseno:diseno[0],'adm': req.user.esadmin});
});
router.post('/misdisenos/s-edit/:id',isLoggedIn,async(req,res) => {

	const { Nombre } = req.body;
	if (req.user.esadmin) {
		var Ambito = req.body.Ambito;
	}
	else
		var Ambito = 1;
	var imagen;
		
	if(!req.files || Object.keys(req.files).length === 0){
	}
	else{
		let sampleFile = req.files.imagen;
		console.log(sampleFile.name);
		imagen = '/image/disenos/'+sampleFile.name;
  		sampleFile.mv('src/public/image/disenos/'+sampleFile.name, function(err) {
  		 	if (err)
  				return res.status(500).send(err);
	
  		});
	}

	let newDiseno = {
		Nombre,
		imagen,
		Ambito,
		IdUsuario: req.user.ID
	};
	
	await db.query('UPDATE tdisenos SET ? WHERE ID= ?',[newDiseno,req.params.id]);
	res.redirect('/perfil/misdisenos');
});

//eliminar disenos
router.get('/misdisenos/s-elimir/:id',isLoggedIn,async(req,res) => {

	await db.query('DELETE FROM tdisenos WHERE ID = ?',[req.params.id]);
	res.redirect('/perfil/misdisenos');
});


/*------------------------------------------------------------------------------------------------------------------------------*/



//PAGINA GESTION
router.get('/gestion',isLoggedIn,async(req,res) => {

	//conseguir la lista de producto y luego podra anadir, modificar,eliminar 
	res.render('links/gestion-producto');
});


/*------------------------------------------------------------------------------------------------------------------------------*/

//PAGINA PROMOCIONES
router.get('/promocion',isLoggedIn,async(req,res) => {

	const promo = await db.query('SELECT * FROM tpromociones ORDER BY f_inicio DESC');
	console.log(promo[0].F_inicio);
	for(promocion in promo) {
		promocion.F_inicio = moment(promocion.F_inicio).format('YYYY-MM-D');
		console.log(promocion.F_inicio);
	}
	//console.log(promo);
	//conseguir la lista de producto y luego podra anadir, modificar,eliminar 
	res.render('links/promocion',{ promo });
});

//Anadir promo
router.get('/promocion/p-add',isLoggedIn,async(req,res) => {
 
	res.render('partials/promo-add');
});
router.post('/promocion/p-add',isLoggedIn,async(req,res) => {
 
	res.redirect('/perfil/promocion');
});

//Editar promo
router.get('/promocion/p-edit/:id',isLoggedIn,async(req,res) => {

	//conseguir la lista de producto y luego podra anadir, modificar,eliminar 
	res.render('links/promocion');
});
router.post('/promocion/p-edit/:id',isLoggedIn,async(req,res) => {

	 
	res.redirect('/perfil/promocion');
});

//Eliminar promo
router.get('/promocion/p-elimir/:id',isLoggedIn,async(req,res) => {

	await db.query('DELETE FROM tpromociones WHERE ID = ?',[req.params.id]);
	res.redirect('/perfil/promocion');
});


/*------------------------------------------------------------------------------------------------------------------------------*/



//PAGINA FACTURACION
router.get('/facturacion',isLoggedIn,async(req,res) => {

	//ver facturas,posibre una lista
	res.render('links/facturacion');
});







module.exports = router; 









