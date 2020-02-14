
function mandaAjax(type,script,dat,process){ // funcion para conectar con servidor
	$.ajax({
		type: type, // get, post
		url: script, // direccion de servidor, router....
		data: dat, // datos que enviamos, formulario
		success:
		function(data, status){
			
			post_process(process,data);
		},
		error: 
		function(err) {
			console.log( "error " + err.status + ' ' + err.statusText);
		}
	});
};

function post_process(process,rta) {
	switch (process) {

		case 'paginacion':
			
			console.log(rta);
			var n = rta.n;
			console.log(n[0].num);
			var page = Math.ceil(n[0].num / 9); //total pagina
			var current = rta.current;

			if(current == null)
				current = 1;

			var navpag = '<div class="mx-auto">'+
								  '<nav>'+
								    '<ul class="pagination">';

			if(current == 1) {
				navpag += '<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>';
			}
			else {
				navpag += '<li class="page-item "><a class="page-link p" href="" title="/page/'+(Number(current)-1)+'">Previous</a></li>';
			}

			if(current > 8)
				i = current -7;
			else
				i = 1;
			if(i !== 1) {
				navpag += '<li class="page-item"><a class="page-link" href="#">...</a></li>';
			}

			for(;i<=(Number(current) + 7) && i<=page;i++) { //pages es pagina total
				if(i == current) {
					navpag += '<li class="page-item active "><a class="page-link p" href="" title="/page/'+i+'">'+i+'</a></li>';
				} 
				else {
					navpag += '<li class="page-item "><a class="page-link p" href="" title="/page/'+i+'">'+i+'</a></li>';	
				}
				if(i == Number(current)+7 && i<page) {
					navpag += '<li class="page-item"><a class="page-link" href="#">...</a></li>';
				}
			}


			if(current == page) {
				navpag += '<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>';
			}
			else {
				navpag += '<li class="page-item "><a class="page-link p" href="#" title="/page/'+(Number(current)+1)+'">Next</a></li>';
			}

			$('#paginas').html(navpag+'</ul></nav></div>');
			
			$('.page-item').off('click').on('click',function(){
				var url = $(this).children().attr('title');
				console.log(url);
				mandaAjax('POST',url,'','listados');
			});

		break;

		case 'listados' :

			$('#pr').html('');
			console.log(rta);
			var productos = rta.productos;
			console.log(productos);
			var cards = '';

			for(var i = 0; i < productos.length ; i++) {
				cards += '<div class="col-lg-4 col-md-6 mb-4">'+
				            '<div class="card h-100">'+
				                '<img class="card-img-top" alt="ropa" src="'+productos[i].imagen+'">'+
				              '<div class="card-body">'+
				                '<h4>'+productos[i].Nombre+'</h4>'+
				                '<h2>'+productos[i].Precio+'€</h2>\
				                 <p class="card-text">'+productos[i].Descripcion+'</p>'+
				              '</div>'+
				              '<button class="btn btn-success" type="button" data-target="#ficha" data-toggle="modal">\
				              <a href="/ficha/'+current+'/'+productos[i].ID+'">Ver mas</a></button>'+
				            '</div>'+
				          '</div>';
			}

			$('#pr').html(cards);


		break;
	

	}

	/*$("#hombre").click( function(){

		mandaAjax('GET','/H1','','listado_filtro');
	});
	$("#mujer").click( function(){

		mandaAjax('GET','/M1','','listado_filtro');
	});
	$("#nino").click( function(){

		mandaAjax('GET','/N1','','listado_filtro');
	});*/

	
}

