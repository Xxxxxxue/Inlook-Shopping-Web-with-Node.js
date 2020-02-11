
function mandaAjax(type,script,dat,process,filtro){ // funcion para conectar con servidor
	$.ajax({
		type: type, // get, post
		url: script, // direccion de servidor, router....
		data: dat, // datos que enviamos, formulario
		success:
		function(data, status){
			
			post_process(process,data,filtro);
		},
		error: 
		function(err) {
			console.log( "error " + err.status + ' ' + err.statusText);
		}
	});
};

function post_process(process,rta,filtro) {
	switch (process) {

		case 'listadeproductos': 
			console.log(rta);
			$('#productos').html('');
			//console.log(rta.productos);
			var productos = rta.productos;
			var galeria = rta.galeria;
			var categoria = rta.categoria;
			var tipo = rta.tipo;
			var current = rta.pagina;  // pagina que estoy
			//console.log(productos[0]);
			//console.log(productos.length);

			if(filtro == 'H') {
				
			}
			if(filtro == 'M') {

			}
			if(filtro == 'N') {
				
			}


//---------------------------------FIRTRO Y PRODUCTOS-------------------------------------------------------

			var fyp =  '<div class="row justify-content-md-center">'+
					      '<div class="accordion" id="accordionExample">'+
					      '<div class="card">'+
					      '<div class="card-header" id="headingTwo">'+
					        '<h2 class="mb-0">'+
					        '<button class="btn btn-success collapsed " aria-expanded="false" aria-controls="collapseTwo" style="font-size: 0.8em;" type="button" data-target="#collapsefiltro" data-toggle="collapse">'+
					          'Mas filtros'+
					        '</button>'+
					        '</h2>'+
					      '</div>'+
					       '<div class="collapse" id="collapsefiltro" aria-labelledby="headingTwo" data-parent="#accordionExample">'+
					        '<div class="card-body">'+
					            '<div class="form-check form-check-inline">'+
					            '<div class="form-check form-check-inline">';

			for(var i = 0; i<categoria.length; i++) {
				fyp += '<input class="form-check-input" id="'+categoria[i].ID+'" type="checkbox" value="1">'+
              			'<label class="form-check-label" for="'+categoria[i].ID+'"><br><p> '+categoria[i].categoria+' </p></label>';
			}

			fyp += ' </div><button class="btn btn-success" id="filtro" style="width: 100px;" type="button">Filtrar</button></div></div></div></div><div class="row">';
			
			var j;
			var busca;
			var imag;
			localStorage.setItem('productos', JSON.stringify(productos));
			var dato = JSON.parse(localStorage.getItem('productos'));
			console.log(dato);
			for(i = 30 *(current-1); i < current*30; i++) {
				a = JSON.parse(dato[i]);
				console.log(a);
				j=0;
				busca = false;
				while(j<galeria.length && !busca) {
					if(a.ID == galeria[j].IdProducto){
						busca = true;
						imag = galeria[j].imagen;
					}
					j++;
				}
				fyp += '<div class="col-lg-4 col-md-6 mb-4">'+
				            '<div class="card h-100">'+
				              '<a href="#">'+
				                '<img class="card-img-top" alt="" src="'+imag+'">'+
				              '</a>'+
				              '<div class="card-body">'+
				                '<h4 class="card-title">'+
				                  '<a href="#">'+a.Nombre+'</a>'+
				                '</h4>'+
				                '<h2>'+a.Precio+'</h2>'+
				                '<p class="card-text">'+a.Descripcion+'</p>'+
				              '</div>'+
				              '<button class="btn btn-success" type="button" data-target="#modalQuickView" data-toggle="modal">Ver mas</button>'+
				            '</div>'+
				          '</div>';
			}

			$('#productos').html(fyp+'</div></div></div>');



//---------------------------------PAGINACION------------------------------------------------------


			var page = Math.ceil(productos.length / 30);

			var navpag = '<div class="mx-auto">'+
								  '<nav>'+
								    '<ul class="pagination">';

			if(current == 1) {
				navpag += '<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>';
			}
			else {
				navpag += '<li class="page-item"><a class="page-link" href="/'+(current-1)+'">Previous</a></li>';
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
					navpag += '<li class="page-item active"><a class="page-link" href="/'+i+'">'+i+'</a></li>';
				} 
				else {
					navpag += '<li class="page-item"><a class="page-link" href="/'+i+'">'+i+'</a></li>';	
				}
				if(i == Number(current)+7 && i<pages) {
					navpag += '<li class="page-item"><a class="page-link" href="#">...</a></li>';
				}
			}


			if(current == page) {
				navpag += '<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>';
			}
			else {
				navpag += '<li class="page-item"><a class="page-link" href="/'+(current+1)+'">Next</a></li>';
			}

			$('#productos').append(navpag+'</ul></nav></div>');


		
		break;

		case 'listado_filtro': 
		
		
		break;
	

	}

	$("#hombre").click( function(){

		mandaAjax('POST','/1','','listadeproductos','H');
	});
	$("#mujer").click( function(){

		mandaAjax('POST','/1','','listadeproductos','M');
	});
	$("#nino").click( function(){

		mandaAjax('POST','/1','','listadeproductos','n');
	});

}

