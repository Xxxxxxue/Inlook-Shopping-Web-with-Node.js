
$(document).ready( function() {
	/*$(document).on('change', '.btn-file :file', function() {
		var input = $(this),
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [label]);
	});

	$('.btn-file :file').on('fileselect', function(event, label) {
	    
	    var input = $(this).parents('.input-group').find(':text'),
	        log = label;
	    
	    if( input.length ) {
	        input.val(log);
	    } else {
	        if( log ) alert(log);
	    }
    
	});*/
	//LAS DOS FUNCIONES SON PARA PASAR URL LEIDO DE ORDENADOR EN SOLO NOMBRE DE IMAGEN Y APARECER ---EN INPUT TYPE TEXT
	
	function readURL(input) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        
	        reader.onload = function (e) {
	            $('#img-upload').attr('src', e.target.result);
	        }
	        
	        reader.readAsDataURL(input.files[0]);
	    }
	}

	$("#imgInp").change(function(){
	    readURL(this);
	}); 
	$("#imgdiseno").change(function(){
	    readURL(this);
	}); 

	/*function elim(id,tipo) {
		if(tipo == 'diseno') {
			var op = confirm('¿Desea eliminar este diseño?');
	      	if(op == true) 
	       	location.href = '/perfil/misdisenos/s-elimir/'+ id; 
		}
	    if(tipo == 'dir') {
	    	var op = confirm('¿Desea eliminar esta dirección?');
      		if(op == true) 
       		location.href = '/perfil/datapers/dir-elimir/'+ id;
	      
	    }
	}*/

});

//guardas imagenes en el array
var cambia_imagen = new Array();
cambia_imagen[0] = "/image/1.png";
cambia_imagen[1] = "/image/2.png";
cambia_imagen[2] = "/image/3.png";
cambia_imagen[3] = "/image/4.png";

//la función para que al clickear establezca el source del tag imagem que tiene id "ia" (Imagen aleatoria)
//como no son tantas, puede que alguna vez se repita 2 veces la misma
//incluso, si usamos numeros para las imágenes, la script puede ser más sencilla

function cambiar(){
   document.getElementById("ia").src = cambia_imagen[Math.floor(Math.random() * 4)];
setTimeout("cambiar()",500)
}	