let tortas = [];
let pedidos;
let carrito = [];

const ing1 = $("#ingrediente-1");
const ing2 = $("#ingrediente-2");
const ing3 = $("#ingrediente-3");
const ing4 = $("#ingrediente-4");

let cuartoIngrediente = false;

class torta {
	constructor(ingredientes, precio = null, nombre = null) {
		this.ingredientes = ingredientes;
		this.nombre = nombre;
		this.precio = precio;
	}
}

function buscaTorta(torta) {
	var elegida = torta;
	tortas.forEach((tortita) => {
		if (comparaTorta(tortita, torta)) {
			elegida = tortita;
		}
	});
	return elegida;
}

function buscaTortaPorNombre(nombre) {
	var elegida = null;
	tortas.forEach((tortita) => {
		if (tortita.nombre == nombre) {
			elegida = tortita;
		}
	});
	return elegida;
}

function comparaTorta(torta1, torta2) {
	let ingredientes = Array.from(torta1.ingredientes);
	let band = false;
	torta2.ingredientes.forEach((ingrediente) => {
		if (ingredientes.includes(ingrediente)) {
			ingredientes.splice(ingredientes.indexOf(ingrediente), 1);
		} else {
			band = true;
		}
	});
	if (band) return false;
	return ingredientes.length == 0;
}

(() => {
	tortas.push(
		new torta(
			["Chorizo", "Cebolla", "Huevo", "Quesillo"].sort(),
			59,
			"Mexicana"
		)
	);
	tortas.push(
		new torta(
			["Milanesa de pollo", "Jamón", "Quesillo"].sort(),
			89,
			"Ninel Conde"
		)
	);
	tortas.push(
		new torta(["Milanesa de res", "Quesillo", "Frijoles"].sort(), 79, "Kalimba")
	);
	tortas.push(
		new torta(["Milanesa de pollo", "Piña", "Quesillo"].sort(), 94, "Thalia")
	);
	tortas.push(
		new torta(["Sirloin", "Piña", "Huevo", "Quesillo"].sort(), 94, "Shakira")
	);
	tortas.push(
		new torta(
			["Salchicha", "Jamón", "Chorizo", "Quesillo"].sort(),
			64,
			"Tesorito"
		)
	);
	tortas.push(new torta(["Jamón", "Quesillo", "Piña"].sort(), 59, "Hawaiana"));
	tortas.push(
		new torta(
			["Milanesa de pollo", "Salchicha", "Quesillo"].sort(),
			89,
			"Chabelo"
		)
	);
	tortas.push(
		new torta(["Milanesa de res", "Pierna", "Quesillo"].sort(), 94, "Trevi")
	);
	tortas.push(
		new torta(["Sirloin", "Huevo", "Quesillo"].sort(), 89, "Patrullero 777")
	);
})();
//dudas
// Seleccionar una torta y mostrarla en el select
$("#opciones > div").click((element) => {
	let div;
	if (element.target.nodeName == "P") {
		div = element.target.parentNode;
	} else {
		div = element.target;
	}
	$("#torta-favorita").html(div.innerHTML);
	$("#opciones").removeClass("active");
	$("#torta-favorita").removeClass("focus");
	calculaPrecio();
});

// Abrir el select
$("#torta-favorita").click(() => {
	$("#opciones").toggleClass("active");
	$("#torta-favorita").toggleClass("focus");
});

//Enviar datos
$("#form-favorita").submit((event) => {
	event.preventDefault();
	let torta = $("#torta-favorita").children("p").html();
	let cantidad = $("#cantidad-torta-favorita").val();
	let precio = $("#precio-torta-favorita").val();
	let total = $("#total-torta-favorita").val();
	if (torta.includes("Seleccione")) {
		$("#torta-favorita").addClass("is-invalid");
		return;
	} else {
		$("#torta-favorita").removeClass("is-invalid");
	}
	añadirPedido(cantidad, torta, precio, total);
});

//Calcular precio
$("#cantidad-torta-favorita").change(calculaPrecio);

function calculaPrecio() {
	let torta = $("#torta-favorita").children("p").html();
	let cantidad = $("#cantidad-torta-favorita").val();
	if (!torta.includes("Seleccione")) {
		let precio = buscaTortaPorNombre(torta).precio;
		$("#precio-torta-favorita").val(precio);
		$("#total-torta-favorita").val(precio * cantidad);
	}
}

function añadirPedido(cantidad, producto, precio, total) {
	let pedido = {
		cantidad: parseInt(cantidad),
		producto: producto,
		precio: parseInt(precio),
		total: parseInt(total),
	};
	pedidos = pedido;
	limpiarCampos();
	calcularPedidos();
}

function limpiarCampos() {
	$("#cantidad-torta-favorita").val("1");
	$("#torta-favorita").html("<p class='m-0'>Seleccione...</p>");
	$("#precio-torta-favorita").val("");
	$("#total-torta-favorita").val("");
	$("#cantidad-torta-nueva").val("1");
	for (i = 1; i <= 5; i++) {
		eliminar(i);
	}
	$("#ing-extra").addClass("d-none");
	cuartoIngrediente = false;
	$("#uno-mas").removeClass("d-none");
}

function añadirIngrediente(ingrediente) {
	if (ing1.val() == "") {
		ing1.val(ingrediente);
		return 1;
	} else if (ing2.val() == "") {
		ing2.val(ingrediente);
		return 2;
	} else if (ing3.val() == "") {
		ing3.val(ingrediente);
		return 3;
	} else if (cuartoIngrediente && ing4.val() == "") {
		ing4.val(ingrediente);
		return 4;
	} else {
		return false;
	}
}

function añadir(ingrediente) {
	let ing =
		$(ingrediente)[0]["parentNode"]["childNodes"][2]["textContent"].trim();
	let añadido = añadirIngrediente(ing.replace(/\s+/g, " ").trim());
	if (!añadido) {
		return;
	} else {
		$(ingrediente)[0]["parentElement"].classList.add("d-none");
		$(ingrediente)[0]["parentElement"].classList.add("ing-" + añadido);
	}
}

function eliminar(ingrediente) {
	$("#ingrediente-" + ingrediente).val("");
	$(".ing-" + ingrediente).removeClass("d-none");
	$(".ing-" + ingrediente).removeClass("ing-" + ingrediente);
}

function extra(element) {
	$("#ing-extra").removeClass("d-none");
	cuartoIngrediente = true;
	$(element).addClass("d-none");
}

$("#form-torta-nueva").submit((event) => {
	event.preventDefault();
	let torta_nueva;
	if (ing1.val() == "") {
		ing1.addClass("is-invalid");
		return;
	} else if (ing2.val() == "") {
		ing1.removeClass("is-invalid");
		ing2.addClass("is-invalid");
		return;
	} else if (ing3.val() == "") {
		ing2.removeClass("is-invalid");
		ing3.addClass("is-invalid");
		return;
	} else if (ing4.val() == "") {
		ing3.removeClass("is-invalid");
		torta_nueva = new torta([ing1.val(), ing2.val(), ing3.val()].sort(), 40);
	} else {
		torta_nueva = new torta(
			[ing1.val(), ing2.val(), ing3.val(), ing4.val()].sort(),
			50
		);
	}
	let tortita = buscaTorta(torta_nueva);
	let cantidad = $("#cantidad-torta-nueva").val();
	if (tortita.nombre == null) {
		añadirPedido(
			cantidad,
			tortita.ingredientes.sort(),
			tortita.precio,
			tortita.precio * cantidad
		);
	} else {
		añadirPedido(
			cantidad,
			tortita.nombre,
			tortita.precio,
			tortita.precio * cantidad
		);
	}
});
// -------Aquí voy a empezar SIUUUUUUUUUUUU----Deberia de jalar, pero Naaaaa pasa nada  ------------

// YA ESTÁ HERMANO :    OK gracias
//Aqui en refrescos veah?   ok
// PUEDES PONERLE UN CAMPO DE PRECIO Y UNO DE TOTAL?
// Y HACER QUE SE ACTUALICE
// CHI

function calcularPedidos() {
	if (carrito.length == 0) {
		carrito.push(pedidos);
	} else {
		let nuevo = true;
		carrito.forEach((pedido) => {
			if (pedidos != null) {
				if (Array.isArray(pedido.producto) && Array.isArray(pedidos.producto)) {
					if (
						comparaTorta(
							new torta(pedido.producto),
							new torta(pedidos.producto)
						)
					) {
						nuevo = false;
						pedido.cantidad += pedidos.cantidad;
						if(pedido.cantidad > 20){
							pedido.cantidad = 20;
						}
						pedido.total = pedido.cantidad*pedido.precio;
						pedidos = null;
						return;
					}
				} else if (pedido.producto == pedidos.producto) {
					pedido.cantidad += pedidos.cantidad;
					if(pedido.cantidad > 20){
						pedido.cantidad = 20;
					}
					pedido.total = pedido.cantidad*pedido.precio;
					pedidos = null;
					nuevo = false;
				}
			} else {
				return;
			}
		});
		if (nuevo) {
			carrito.push(pedidos);
		}
	}
	imprimirPedido();
}

//Como se maneja la condición doble aqui? Muy complicado Js
//Mejor me regreso a Java
// así
// Está leve

let refresco = $("#refresco");
let tamaño = $("#tamaño");
let precioRefresco = $("#precio-refresco");

refresco.change(() => {
	precioRefresco.val("");
	let opc = "<option>Seleccione...</option>";
	if (refresco.val() == "coca") {
		tamaño.prop("disabled", false);
		opc += `
		<option value="Chico">Chico</option>
		<option value="Mediano">Mediano</option>
		<option value="Grande">Grande</option>
		`;
	} else if (refresco.val() == "fanta") {
		tamaño.prop("disabled", false);
		opc += `
		<option value="Chico">Chico</option>
		<option value="Mediano">Mediano</option>
		`;
	} else if (refresco.val() == "sangria") {
		tamaño.prop("disabled", false);
		opc += `
		<option value="Chico">Chico</option>
		<option value="Grande">Grande</option>
		`;
	} else {
		tamaño.prop("disabled", true);
	}
	tamaño.html(opc);
});

tamaño.change(() => {
	if (refresco.val() == "coca") {
		if (tamaño.val() == "Chico") {
			precioRefresco.val("15");
			$("#total-refresco").val(15 * $("#cantidad-refresco").val());
		} else if (tamaño.val() == "Mediano") {
			precioRefresco.val("20");
			$("#total-refresco").val(20 * $("#cantidad-refresco").val());
		} else if (tamaño.val() == "Grande") {
			precioRefresco.val("25");
			$("#total-refresco").val(25 * $("#cantidad-refresco").val());
		}
	}

	if (refresco.val() == "fanta") {
		if (tamaño.val() == "Chico") {
			precioRefresco.val("10");
			$("#total-refresco").val(10 * $("#cantidad-refresco").val());
		} else if (tamaño.val() == "Mediano") {
			precioRefresco.val("17");
			$("#total-refresco").val(17 * $("#cantidad-refresco").val());
		}
	}

	if (refresco.val() == "sangria") {
		if (tamaño.val() == "Chico") {
			precioRefresco.val("10");
			$("#total-refresco").val(10 * $("#cantidad-refresco").val());
		} else if (tamaño.val() == "Grande") {
			precioRefresco.val("20");
			$("#total-refresco").val(20 * $("#cantidad-refresco").val());
		}
	}
});

$("#cantidad-refresco").change(() => {
	if (tamaño.val() != "Seleccione...") {
		$("#total-refresco").val(
			precioRefresco.val() * $("#cantidad-refresco").val()
		);
	}
});

//En un rato lo reviso
function calculaPrecioRefresco() {
	let precioRefresco = $("#precio-refresco");
	let cantidad = $("cantidad-refresco");
	let total = $("#total-refresco");
	total.val(precioRefresco.val() * cantidad.val());
}

$("#form-refrescos").submit((event) => {
	event.preventDefault();
	if (refresco.val() == "Seleccione...") {
		refresco.addClass("is-invalid");
		return;
	} else if (tamaño.val() == "Seleccione...") {
		tamaño.addClass("is-invalid");
		return;
	}
	let prod;
	if (refresco.val() == "coca") {
		prod = "Coca-Cola";
	} else if (refresco.val() == "fanta") {
		prod = "Fanta";
	} else if (refresco.val() == "sangria") {
		prod = "Sangria";
	}
	if (tamaño.val() == "Chico") {
		prod += " (ch)";
	} else if (tamaño.val() == "Mediano") {
		prod += " (m)";
	} else if (tamaño.val() == "Grande") {
		prod += " (g)";
	}
	let cant = $("#cantidad-refresco").val();
	let total = $("#total-refresco").val();
	let precio = $("#precio-refresco").val();

	añadirPedido(cant, prod, precio, total);

	$("#form-refrescos")[0].reset();
	tamaño.prop("disabled", true);
});

function imprimirPedido() {
	let pedidos = "";
	for (let i = 0; i < carrito.length; i++) {
		pedidos += `
		<tr>
			<td><i class="fa-solid fa-circle-minus me-1" onclick="disminuir(${i})" style="cursor: pointer;"></i> ${carrito[i].cantidad} <i class="fa-solid fa-circle-plus ms-1" onclick="aumentar(${i})" style="cursor: pointer;"></i></td>
			<td>${carrito[i].producto}</td>
			<td>${carrito[i].precio}</td>
			<td>${carrito[i].total}</td>
			<td><i class="fa-solid fa-xmark text-danger" onclick="quitar(${i})" style="cursor: pointer;"></i></td>
		</tr>
		`;
	}
	$("#pedidos-realizados").html(pedidos);
	if(carrito.length > 0){
		$("#confirmar-pedido").prop("disabled", false);
	}else{
		$("#confirmar-pedido").prop("disabled", true);
	}
}

function aumentar(val){
	if(carrito[val].cantidad < 20){
		carrito[val].cantidad++;
		carrito[val].total = carrito[val].precio * carrito[val].cantidad;
		imprimirPedido();
	}
}

function disminuir(val){
	if(carrito[val].cantidad > 1){
		carrito[val].cantidad--;
		carrito[val].total = carrito[val].precio * carrito[val].cantidad;
		imprimirPedido();
	}
}

function quitar(val){
	carrito.splice(val, 1);
	imprimirPedido();
}

$("#confirmar-pedido").click(() => {
	html = `<p>¿Está seguro de que desea confirmar el pedido?</p>`;
	$(".modal-body").html(html);
});

$("#modal-continuar").click(() => {
	Cookies.set("pedido", JSON.stringify(carrito));
	html = `
	<form action="" id="form-modal">
		<div class="form-group">
			<label for="nombre" class="form-label">Ingresa tu nombre</label>
			<input type="text" name="nombre" id="nombre" class="form-control" required>
		</div>
	</form>`;
	$(".modal-body").html(html);
	$("#modal-continuar").addClass("d-none");
	$("#modal-confirmar").removeClass("d-none");
});

$("#modal-confirmar").click(() => {
	if($("#nombre").val() == ""){
		$("#nombre").addClass("is-invalid");
		return;
	}
	let nombre = $("#nombre").val();
	Cookies.set("nombre", nombre);
	window.location.href = "confirmacion.html";
});