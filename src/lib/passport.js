//Para manejar datos de usuario
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const db = require('../db');
const helpers = require('./helpers');


passport.use('local.registro', new LocalStrategy({
	usernameField: 'username',  // recibir username desde el formulario
	passwordField: 'password',  // recibir password desde el formulario
	passReqToCallback: true   // 
}, async (req,username,password,done) => {
	const { fullname } = req.body;
	let newUser = {  //crea nuevo usuario
		fullname,
		username,
		password
	};
	console.log(req.body);
	//ciframos la contrasena mediante helpers.js
	newUser.password = await helpers.encryptPassword(password);
	//Guardamos eb database
	const result = await db.query('INSERT INTO user SET ?', newUser);
	newUser.id = result.insertId; //anadir un id al new user
	return done(null,newUser); //

}));

passport.use('local.login', new LocalStrategy({
	usernameField: 'username',  // recibir username desde el formulario
	passwordField: 'password',  // recibir password desde el formulario
	passReqToCallback: true   // 
}, async (req,username,password,done) => {
	const rows = await db.query('SELECT * FROM user WHERE username=?',username);
	if(rows.length > 0) {
		const user = rows[0];
		const valid = await helpers.matchPassword(password,user.password);
		if(valid) {
			done(null,user,req.flash('success','Welcome '+ user.username +'.'));

		}else {
			done(null,false,req.flash('message','Error en password.'));
		}
	}
	else {
		return done(null,false,req.flash('message','El usuario no existe.'));
	}

}));



passport.serializeUser((user,done) => {
	console.log(user);
	done(null,user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await db.query('SELECT * FROM user WHERE id = ?', [id]);
  done(null, rows[0]);
});