//dato de conexion, exportando objeto database
module.exports = {
	database: {
		connectionLimit: 10,
		host: 'localhost',  //puede ser cualquier otro ordenador
		user: 'root',
		password: '1234', // clave de mysql, MI HOME
		database: 'shop_inlook'  //debe estar creada
	}
};