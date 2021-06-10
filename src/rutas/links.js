const express = require('express');
const router = express.Router(); 

const db = require('../db');

////////////////////////////////////////////////////////////////////////7
//DISENAR
router.get('/personalizar',async(req,res) => {
	
	res.render('links/personalizar');
});

router.post('/personalizar',async(req,res) => {
	
	res.redirect('/');
});


//CARRITO DE COMPRA
router.get('/cesta',async(req,res) => {

	res.render('links/cesta');
});
router.post('/cesta',async(req,res) => {

	res.end('Comprado!!');
});

module.exports = router; 