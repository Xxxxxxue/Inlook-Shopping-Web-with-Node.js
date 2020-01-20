// RUTAS Y FUNCIONES AL LLEGAR PAGINA PERSONAL


// RAIZ  --> / , SE REFIERE AL PAGINA PERSONAL DE CLIENTE O DE ADMINISTRADOR
/*router.get('/:id',async(req,res) => {
	res.render('/profile'); // HTML pagPersonal
});
*/

const express = require('express');
const router = express.Router(); 

const db = require('../db');


//PAGINA DE EDITAR LOS DATOS PERSONALES
//Sacar datos de database y los colocan en html
router.get('/EditarMisDatos',async(req,res) => {

	const datos = await db.query('SELECT * FROM tclientes C INNER JOIN tdireccion D on C.ID = D.IdClientes WHERE id = ?',[req.user.id]);
	console.log(datos);
	res.render('datospersonal',{dato: datos}); //ruta donde guarda EditarMisDatos
});
//Una vez modificado los datos, guardan en database
//Hay que saber --> como pasa req.body en objeto y recorrer como array
//Hay que saber como subir al servidor imagen, asignar y guardar ruta en database
router.post('/EditarMisDatos/:id',async(req,res) => {
	const {} = req.body;

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
router.get('/CambiarPass/:id',async(req,res) => {
	render('CambiarPass');
});
router.post('/CambiarPass/:id',async(req,res) => {

});


//PAGINA MIS PEDIDOS
router.get('/misPedidos/:id',async(req,res) => {
	render('misPedidos');
});




module.exports = router; 