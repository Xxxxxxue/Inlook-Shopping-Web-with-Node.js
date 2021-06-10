$(document).ready(function () {
	$('#workTable').DataTable({
		pagingType: "full_numbers",
		language: {
			sProcessing: "Procesando...",
			sLengthMenu: "",
			sZeroRecords: "No se encontraron resultados",
			sEmptyTable: "Ningún dato disponible en esta tabla",
			sInfo: "",
			sInfoEmpty: "",
			sInfoFiltered: "(filtrado de un total de MAX registros)",
			sInfoPostFix: "",
			sSearch: "Buscar:",
			sUrl: "",
			sInfoThousands: ",",
			sLoadingRecords: "Cargando...",
			oPaginate: {
				sFirst: "first",
				sLast: "last",
				sNext: "next",
				sPrevious: "previus"
			},
			oAria: {
				sSortAscending: ": Activar para ordenar la columna de manera ascendente",
				sSortDescending: ": Activar para ordenar la columna de manera descendente"
			},
			buttons: {
				copy: "Copiar",
				colvis: "Visibilidad"
			}
		}
	});
});