const express = require('express');
const router = express.Router(); 

const db = require('../db');

////////////////////////////////////////////////////////////////////////7

router.get('/personalizar',async(req,res) => {
	
	res.render('links/personalizar');
});

router.get('/cesta',async(req,res) => {

	res.render('links/cesta');
});

module.exports = router; 