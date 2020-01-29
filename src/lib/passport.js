//Para manejar datos de usuario
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const db = require('../db');
const helpers = require('./helpers');


//registrar
passport.use('local.registro', new LocalStrategy({
	usernameField: 'usuario',  // recibir username desde el formulario
	passwordField: 'clave',  // recibir password desde el formulario
	passReqToCallback: true   // 
}, async (req,usuario,clave,done) => {
	const { nombre,apellidos } = req.body;

	let newClient = {
		nombre,
		apellidos,
		email: usuario
	};
	const cl = await db.query('INSERT INTO tclientes SET ?', newClient);
	//console.log(cl.insertId);
	let newUser = {  //crea nuevo usuario
		usuario,
		clave,
		IdClientes: cl.insertId
	};

	console.log(req.body);
	//ciframos la contrasena mediante helpers.js
	newUser.clave = await helpers.encryptPassword(clave);
	//Guardamos eb database
	const result = await db.query('INSERT INTO tusuario SET ?', newUser);
	newUser.id = result.insertId; //anadir un id al new user
	return done(null,newUser); //

}));



//cambiar contrasena
passport.use('local.change', new LocalStrategy({
	usernameField: 'usuario',  // recibir username desde el formulario
	passwordField: 'clave',  // recibir password desde el formulario
	passReqToCallback: true   // 
}, async (req,usuario,clave,done) => {
	
	let newUser = {  
		usuario,
		clave
	};

	console.log(req.session);
	//ciframos la contrasena mediante helpers.js
	newUser.clave = await helpers.encryptPassword(clave);
	//cambiar
	await db.query('UPDATE tusuario SET clave=? WHERE id=?', [newUser.clave,req.session.ID]);
	
	return done(null,newUser); 

}));


//login
passport.use('local.login', new LocalStrategy({
	usernameField: 'usuario',  // recibir username desde el formulario
	passwordField: 'clave',  // recibir password desde el formulario
	passReqToCallback: true   // 
}, async (req,usuario,clave,done) => {
	const rows = await db.query('SELECT * FROM tusuario WHERE usuario=?',[usuario]);
	if(rows.length > 0) {
		const user = rows[0];
		//console.log(user.Clave); myaql esta atributo en mayuscula y no funcionaba la llamada , cambie a minuscula
		//console.log(clave);
		const valid = await helpers.matchPassword(clave,user.clave);

		if(valid) {
			const cl = await db.query('SELECT * FROM tclientes WHERE id=?',[user.id]);
			done(null,user,req.flash('success','Welcome '+ cl.nombre +' '+cl.apellidos+'.'));

		}else {
			done(null,false,req.flash('message','Clave erronea.'));
		}
	}
	else {
		return done(null,false,req.flash('message','El usuario no existe.'));
	}

}));


//Un fallo en que no te deja serializarse por login
passport.serializeUser((user,done) => {
	console.log(user);
	done(null,user.ID);
});

passport.deserializeUser(async (id, done) => {
  const rows = await db.query('SELECT * FROM tusuario WHERE id = ?', [id]);
  done(null, rows[0]);
});


