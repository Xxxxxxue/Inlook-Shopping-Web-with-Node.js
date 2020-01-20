module.exports = {
	//Primero prueba si estamos loggeado
	//SI  -->  pagina perfil
	//NO  -->  pagina login
	isLoggedIn(req,res,next) {
		if(req.isAuthenticated()) { // si esta loggeado 
			console.log('Autentificado');
			return next();  //pasar siguiente
		}
		else
			return res.redirect('/login'); // si no esta accedido con exito vuelve a login
	},

	isNotLoggedIn(req,res,next) {  //si no esta loggeado
		if(!req.isAuthenticated()) {
			return next();   // voy al siguiente
		}
		else
			return res.redirect('/perfil');  // si esta loggeado voy a perfil
	}
}