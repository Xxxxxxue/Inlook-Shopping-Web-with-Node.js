//todos paquetes hay que instalar
const express = require('express'); // instanciar el modulo express.
const morgan = require('morgan');  // morgan muestra en consola las peticiones que llegan al servidor.
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser'); 
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const MySQLStore = require('express-mysql-session')(session);
var moment = require('moment');


const { database } = require('./keys');


const passport = require('passport'); // para antidentificar usuario

/*
	Inicializaciones
	Se inicializan los modulos cargados
*/
const app = express();  //mira documentacion express
require('./lib/passport');
app.use(fileUpload());

/*
	Configuraciones
	Se defunen los parametros de los diversos modulos y de la aplicacion
*/
//Leemos puerto de escucha por defecto del sistema. Si no esta asignado -->3000
app.set('port', process.env.PORT || 3000);  //definir variable
//definir variable/guarda la ruta, __dirname(variable) te da path de la ruta raiz/refiere a la carpeta src
app.set('views',path.join(__dirname,'views')); // si views esta fuera de src ponemos ruta ../views sin path.join


app.engine('.hbs',exphbs({  //dar parametros de configuracion
	defaultLayout: 'main', // si no te especifico nada plantilla, usa main
	layoutsDir: path.join(app.get('views'),'layouts'),  //para las mascaras
	partialsDir: path.join(app.get('views'),'partials'), //para los modulitos
	extname: '.hbs', // las plantillas tipo html pero tiene extencion .hbs 
	helpers: require('./lib/handlebars')  
	//importar contenido de este modulo(lib...).Archivo donde guardo funciones que usa

})); //hbs, extencion definido nosotros. fichero tipo plantilla html
app.set('view engine','.hbs');


/*
	Middlewares
	capa intermedia entre node y sistema
*/
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//con el modulo session manejamos los datos de la sesion
//con esto configuramos los datos de sesion y los guardamos en database
app.use(session({  //iniciamos sesion para poder usar flash
	secret: 'INLOOK-contrasena',   // es una contrasena  
	resave: false,					// para que no se renueve la sesion
	saveUninitialized: false,     // para que no se guarde sin inicializar
	store: new MySQLStore(database)  // Guardamos la info en la database
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));


/*
	Variables grobales
*/
//Cada vez que haya una peticion, o una respuesta hace lo que haya aqui
app.use((req,res,next) => {
	//app.locals.succes accede al mendaje de la clase succes que definimos en links.js
	app.locals.success = req.flash('success');
	app.locals.message = req.flash('message');
	app.locals.user = req.user;
	next();
});

/*
	Rutas
*/
app.use(require('./rutas/index.js'));
app.use(require('./rutas/usuario.js'));

// cuando accedemos a la pagina de personalizar y la cesta
app.use('/links',require('./rutas/links.js'));  

//Cuando el usuario accede al web, aparece perfil personal -- /perfil
app.use('/perfil',require('./rutas/perfil.js'));


/*
	Archivos publicos
*/
//该行代码是在express添加中间件，设置静态资源路径为public，所有的HTML、CSS、JS等文件都放在public下即可
app.use(express.static(path.join(__dirname, 'public')));



/*
	Inicializacion del servidor
*/
app.listen(app.get('port'),() => {  // flecha es como una forma corta en llamar una funcion sin declarar nombre
	console.log('Servidor escuchando en el puerto: ' +app.get('port'));
});
