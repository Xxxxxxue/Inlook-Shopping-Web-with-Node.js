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

	var pedido = new Object();

	if(req.user.esadmin){
		pedido = await db.query('SELECT lc.ID,lc.PrecioUnitario,p.Nombre,d.imagen AS imgd,c.F_ultimo,e.estado'+
										' FROM tlineacesta lc INNER JOIN tproducto p ON lc.Idproducto = p.ID'+
										' INNER JOIN tdisenos d ON lc.IdDiseno = d.ID'+
										' INNER JOIN tcesta c ON lc.IdCesta = c.ID'+
										' INNER JOIN testados e ON c.IdEstados = e.ID'+
										' WHERE c.IdUsuario != ? AND e.estado != "pendiente" ORDER BY F_ultimo DESC ',req.user.ID);
	}

	else{
		pedido = await db.query('SELECT lc.ID,p.Nombre,d.imagen AS imgd,lc.PrecioUnitario,c.F_ultimo,e.estado'+
										' FROM tlineacesta lc INNER JOIN tproducto p ON lc.Idproducto = p.ID'+
										' INNER JOIN tdisenos d ON lc.IdDiseno = d.ID'+
										' INNER JOIN tcesta c ON lc.IdCesta = c.ID'+
										' INNER JOIN testados e ON c.IdEstados = e.ID'+
										' WHERE c.IdUsuario = ? AND e.estado = "pedido" ORDER BY F_ultimo DESC',req.user.ID);
	}

	//console.log(pedido[0].estado);
	res.render('links/mispedidos',{pedido});
});

//ver detalles y comprar otra vez si desea
router.get('/mispedidos/detalle/:id',isLoggedIn,async(req,res) => {

	const detalle = await db.query('SELECT lc.IdDiseno,lc.ID,lc.Cantidad,lc.color,lc.talla,lc.TOTAL,pro.Nombre AS npro,pro.Porcentaje,p.Nombre,g.imagen,d.imagen AS imgd,lc.PrecioUnitario,c.F_ultimo,e.estado'+
										' FROM tlineacesta lc INNER JOIN tproducto p ON lc.Idproducto = p.ID'+
										' INNER JOIN tdisenos d ON lc.IdDiseno = d.ID'+
										' INNER JOIN tcesta c ON lc.IdCesta = c.ID'+
										' INNER JOIN testados e ON c.IdEstados = e.ID'+
										' INNER JOIN tgaleria g ON lc.IdGaleria = g.ID'+
										' INNER JOIN tpromociones pro ON lc.IdPromociones = pro.ID'+
										' WHERE lc.ID = ?',req.params.id);

	detalle[0].F_ultimo = detalle[0].F_ultimo.toDateString();

	res.render('partials/detalle',{detalle: detalle[0], 'adm': req.user.esadmin});
});
//boton comprar otra vez para clientes, id == linea de cesta
router.get('/mispedidos/detalle/compra/:id',isLoggedIn,async(req,res) => {

	
	res.redirect('/links/cesta');
});

//Si soy admin, boton ver diseno elegido, id == deseno
router.get('/mispedidos/detalle/diseno/:id',isLoggedIn,async(req,res) => {
	

	res.render('partials/diseno-pedido',);
});
//Descargar diseno al local 
router.post('/mispedidos/detalle/diseno/:id',isLoggedIn,async(req,res) => {
	
	res.redirect('/perfil/mispedidos');
});


/*------------------------------------------------------------------------------------------------------------------------------*/


//PAGINA MIS DISENOS
router.get('/misdisenos',isLoggedIn,async(req,res) => {

	const disenos = await db.query('SELECT * FROM tdisenos WHERE IdUsuario = ? ORDER BY time DESC',[req.user.ID]);
	for(var i=0; i<disenos.length; i++) {
		disenos[i].time = disenos[i].time.toString();
	}
	//console.log(disenos);
	//conseguir todos los imagenes del usuario y saca al pantalla, luego anadir modificar y eliminar
	res.render('links/misdisenos',{disenos,'adm': req.user.esadmin,'id':req.user.ID});
});

//anadir disenos
router.get('/misdisenos/s-add',isLoggedIn,async(req,res) => {
	
	res.render('partials/diseno-add',{'adm': req.user.esadmin});
});
router.post('/misdisenos/s-add',isLoggedIn,async(req,res) => {
	
	const { Nombre } = req.body;
	if (req.user.esadmin) {
		var Ambito = req.body.Ambito;
		var precio = req.body.precio;
	}
	else
		var Ambito = 1;
		var precio = 5;

	

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
		precio,
		time: moment().format('YYYY-MM-D hh:mm:ss'),
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
		var precio = req.body.precio;
	}
	else{
		var Ambito = 1;
		var precio = 5;
	}
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
		Ambito,
		precio,
		IdUsuario: req.user.ID
	};

	if(imagen != null)
 		newDiseno.imagen = imagen;
	
	await db.query('UPDATE tdisenos SET ? WHERE ID= ?',[newDiseno,req.params.id]);
	res.redirect('/perfil/misdisenos');
});

//eliminar disenos
router.get('/misdisenos/s-elimir/:id',isLoggedIn,async(req,res) => {

	await db.query('DELETE FROM tdisenos WHERE ID = ?',[req.params.id]);
	res.redirect('/perfil/misdisenos');
});

//disenos de cllientes
router.get('/misdisenos/otros/:id',isLoggedIn,async(req,res) => {

	const disenos = await db.query('SELECT * FROM tdisenos WHERE IdUsuario != ? ORDER BY time DESC',[req.params.id]);
	for(var i=0; i<disenos.length; i++) {
		disenos[i].time = disenos[i].time.toString();
	}
	//console.log(disenos);
	//conseguir todos los imagenes del usuario y saca al pantalla, luego anadir modificar y eliminar
	res.render('partials/diseno-cl',{disenos});
});



/*------------------------------------------------------------------------------------------------------------------------------*/



//PAGINA GESTION
router.get('/gestion',isLoggedIn,async(req,res) => {

	//conseguir la lista de producto y luego podra anadir, modificar,eliminar 
	res.render('links/gestion-producto');
});

//Anadir producto
router.get('/gestion/g-add',isLoggedIn,async(req,res) => {
 
	res.render('partials/gestion-add');
});
router.post('/gestion/g-add',isLoggedIn,async(req,res) => {
 
	res.redirect('/perfil/gestion');
});

//Editar producto
router.get('/gestion/g-edit/:id',isLoggedIn,async(req,res) => {

	
	res.render('partials/gestion-edit');
});
router.post('/gestion/g-edit/:id',isLoggedIn,async(req,res) => {

	 
	res.redirect('/perfil/gestion');
});

//Eliminar producto
router.get('/gestion/g-elimir/:id',isLoggedIn,async(req,res) => {

	await db.query('DELETE FROM tproductos WHERE ID = ?',[req.params.id]);
	await db.query('DELETE FROM tgalerias WHERE IdProducto = ?',[req.params.id]);
	await db.query('DELETE FROM tproductocategoria WHERE IdProducto = ?',[req.params.id]);
	res.redirect('/perfil/gestion');
});

/*------------------------------------------------------------------------------------------------------------------------------*/

//PAGINA PROMOCIONES
router.get('/promocion',isLoggedIn,async(req,res) => {

	const promo = await db.query('SELECT * FROM tpromociones ORDER BY f_inicio DESC');

	for(var i=0; i<promo.length; i++) {
		promo[i].F_inicio = promo[i].F_inicio.toDateString();
		promo[i].F_fin = promo[i].F_fin.toDateString();
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
 
 	const { Nombre,Descripcion,CodigoPromo,Porcentaje,F_inicio,F_fin,Envio } = req.body;

 	//console.log(req.files);
	if(!req.files || Object.keys(req.files).length === 0){
		var imagen = 0;
	}
	else{
		let sampleFile = req.files.imagen;
		console.log(sampleFile.name);
		var imagen = '/image/promociones/'+sampleFile.name;
  		sampleFile.mv('src/public/image/promociones/'+sampleFile.name, function(err) {
  		 	if (err)
  				return res.status(500).send(err);
	
  		});
	}

 	let newPromo = {
 		Nombre,
 		Descripcion,
 		CodigoPromo,
 		Porcentaje,
 		F_inicio,
 		F_fin,
 		Envio,
 		imagen
 	}

 	await db.query('INSERT INTO tpromociones SET ?',[newPromo]);
	res.redirect('/perfil/promocion');
});

//Editar promo
router.get('/promocion/p-edit/:id',isLoggedIn,async(req,res) => {

	const p = await db.query('SELECT * FROM tpromociones WHERE ID = ?',[req.params.id]);

	var ini = p[0].F_inicio;
	var fin = p[0].F_fin;

	p[0].F_inicio = ini.getFullYear()+'-';
	p[0].F_fin = fin.getFullYear()+'-';
	
	if(ini.getMonth() < 10 )
		p[0].F_inicio += '0';
	p[0].F_inicio += (ini.getMonth()+1)+'-';
	if(ini.getDate() < 10 )
		p[0].F_inicio += '0';
	p[0].F_inicio += ini.getDate();

	if(fin.getMonth() < 10 )
		p[0].F_fin += '0';
	p[0].F_fin += (fin.getMonth()+1)+'-';
	if(fin.getDate() < 10 )
		p[0].F_fin += '0';
	p[0].F_fin += fin.getDate();
	

	
	if(p[0].Envio == 0)
		p[0].estandar = 'checked';
	if(p[0].Envio== 1)
		p[0].gratis = 'checked';

	console.log(p[0]);

	res.render('partials/promo-edit',{ p : p[0] });
});
router.post('/promocion/p-edit/:id',isLoggedIn,async(req,res) => {

	const { Nombre,Descripcion,CodigoPromo,Porcentaje,F_inicio,F_fin,Envio } = req.body;

 	console.log(req.files);
	if(!req.files || Object.keys(req.files).length === 0){
	}
	else{
		let sampleFile = req.files.imagen;
		console.log(sampleFile.name);
		var imagen = '/image/promociones/'+sampleFile.name;
  		sampleFile.mv('src/public/image/promociones/'+sampleFile.name, function(err) {
  		 	if (err)
  				return res.status(500).send(err);
	
  		});
	}

 	let newPromo = {
 		Nombre,
 		Descripcion,
 		CodigoPromo,
 		Porcentaje,
 		F_inicio,
 		F_fin,
 		Envio
 	}

 	if(imagen != null)
 		newPromo.imagen = imagen;

 	await db.query('UPDATE tpromociones SET ? WHERE ID = ?',[newPromo,req.params.id]);
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









