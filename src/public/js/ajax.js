
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

		case 'listadeproductos': 
			console.log(rta);
			$('#productos').html('');
			//console.log(rta.productos);
			var productos = rta.productos;
			var galeria = rta.galeria;
			var categoria = rta.categoria;
			var current = rta.pagina;  // pagina que estoy
			//console.log(productos[0]);
			//console.log(productos.length);


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
              			'<label class="form-check-label mr-1" for="'+categoria[i].ID+'">'+categoria[i].categoria+'</label>';
			}

			fyp += ' </div><button class="btn btn-success" id="filtro" style="width: 100px;" type="button">Filtrar</button></div></div></div></div><div class="row">';
			
			var j;
			var busca;
			var imag;
			if(productos.length > 21)
				var fin = 21 + 21 *(current-1);
			else
				var fin = productos.length;

			for(i = 1 *(current-1); i < fin ; i++) {
				j=0;
				busca = false;
				while(j<galeria.length && !busca) {
					if(productos[i].ID == galeria[j].IdProducto){
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
				                '<h4>'+productos[i].Nombre+'</h4>'+
				                '<h2>'+productos[i].Precio+'€</h2><p class="card-text">'+productos[i].Descripcion+'</p>'+
				              '</div>'+
				              '<button class="btn btn-success" type="button" data-target="#ficha" data-toggle="modal"><a href="/ficha/'+current+'/'+productos[i].ID+'">Ver mas</a></button>'+
				            '</div>'+
				          '</div>';
			}

			$('#productos').html(fyp+'</div></div></div>');



//---------------------------------PAGINACION------------------------------------------------------


			var page = Math.ceil(productos.length / 1);

			var navpag = '<div class="mx-auto">'+
								  '<nav>'+
								    '<ul class="pagination">';

			if(current == 1) {
				navpag += '<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>';
			}
			else {
				navpag += '<li class="page-item "><a class="page-link p" href="/'+(current-1)+'">Previous</a></li>';
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
					navpag += '<li class="page-item active "><a class="page-link p" href="/'+i+'">'+i+'</a></li>';
				} 
				else {
					navpag += '<li class="page-item "><a class="page-link p" href="/'+i+'">'+i+'</a></li>';	
				}
				if(i == Number(current)+7 && i<page) {
					navpag += '<li class="page-item"><a class="page-link" href="#">...</a></li>';
				}
			}


			if(current == page) {
				navpag += '<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>';
			}
			else {
				navpag += '<li class="page-item "><a class="page-link p" href="/'+(current+1)+'">Next</a></li>';
			}

			$('#productos').append(navpag+'</ul></nav></div>');

			$(".p").click( function(){
		        //console.log($(this).children().attr('href'));   
		        mandaAjax('POST',$(this).attr('href'),'','listadeproductos');
		    });


		
		break;

		/////////////////////////////////////////////////////////////

		case 'listado_filtro': 
			console.log(rta);
			$('#productos').html('');
			
			var productos = rta.productos;
			var galeria = rta.galeria;
			var categoria = rta.categoria;
			var current = rta.pagina;
			var tipo = rta.tipo;  


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
              			'<label class="form-check-label mr-1" for="'+categoria[i].ID+'">'+categoria[i].categoria+'</label>';
			}

			fyp += ' </div><button class="btn btn-success" id="filtro" style="width: 100px;" type="button">Filtrar</button></div></div></div></div><div class="row">';
			
			var j;
			var busca;
			var imag;
			if(productos.length > 21)
				var fin = 21 + 21 *(current-1);
			else
				var fin = productos.length;

			for(i = 21 *(current-1); i < fin ; i++) {
				j=0;
				busca = false;
				while(j<galeria.length && !busca) {
					if(productos[i].ID == galeria[j].IdProducto){
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
				                '<h4>'+productos[i].Nombre+'</h4>'+
				                '<h2>'+productos[i].Precio+'</h2><p class="card-text">'+productos[i].Descripcion+'</p>'+
				              '</div>'+
				              '<button class="btn btn-success" type="button" data-target="#ficha" data-toggle="modal"><a href="/ficha/'+current+'/'+productos[i].ID+'">Ver mas</a></button>'+
				            '</div>'+
				          '</div>';
			}

			$('#productos').html(fyp+'</div></div></div>');


//---------------------------------PAGINACION------------------------------------------------------


			var page = Math.ceil(productos.length / 21);

			var navpag = '<div class="mx-auto">'+
								  '<nav>'+
								    '<ul class="pagination">';

			if(current == 1) {
				navpag += '<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>';
			}
			else {
				navpag += '<li class="page-item"><a class="page-link" href="/'+tipo+(current-1)+'">Previous</a></li>';
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
					navpag += '<li class="page-item active"><a class="page-link" href="/'+tipo+i+'">'+i+'</a></li>';
				} 
				else {
					navpag += '<li class="page-item"><a class="page-link" href="/'+tipo+i+'">'+i+'</a></li>';	
				}
				if(i == Number(current)+7 && i<page) {
					navpag += '<li class="page-item"><a class="page-link" href="#">...</a></li>';
				}
			}


			if(current == page) {
				navpag += '<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>';
			}
			else {
				navpag += '<li class="page-item"><a class="page-link" href="/'+tipo+(current+1)+'">Next</a></li>';
			}

			$('#productos').append(navpag+'</ul></nav></div>');

			$(".page-link").click( function(){
		        //console.log($(this).children().attr('href'));   
		        mandaAjax('GET',$(this).attr('href'),'','listado_filtro');
		    });
		
		break;
	

	}

	$("#hombre").click( function(){

		mandaAjax('GET','/H1','','listado_filtro');
	});
	$("#mujer").click( function(){

		mandaAjax('GET','/M1','','listado_filtro');
	});
	$("#nino").click( function(){

		mandaAjax('GET','/N1','','listado_filtro');
	});

	

}

