let pedido;
let nombre;

let tortasPedidas = [];
let refrescosPedidos = [];
let cantidadTortas = 0;
let cantidadRefrescos = 0;
let totalTortas = 0;
let totalRefrescos = 0;
let tortasArmadas = 0;

(() => {
	if (!Cookies.get("pedido") || !Cookies.get("nombre")) {
		window.location.href = "index.html";
	}
	nombre = Cookies.get("nombre");
	pedido = JSON.parse(Cookies.get("pedido"));
	datos();
	procesarPedido();
	armarTorta();
	armarRefresco();
	totales();
	Cookies.remove("pedido");
	Cookies.remove("nombre");
})();

function procesarPedido() {
	pedido.forEach((producto) => {
		if (Array.isArray(producto.producto)) {
			tortasPedidas.push(producto);
		} else if (producto.producto.includes("(")) {
			refrescosPedidos.push(producto);
		} else {
			tortasPedidas.push(producto);
		}
	});
}

function armarTorta() {
	html = "";
	tortasPedidas.forEach((torta) => {
		cantidadTortas += torta.cantidad;
		totalTortas += torta.precio * torta.cantidad;
		if (Array.isArray(torta.producto)) {
			if (torta.producto.length == 3) {
				tortasArmadas += torta.cantidad;
			}
			html += `
            <tr>
            <td></td>
            <td>${torta.producto[0]}</td>
            <td>${torta.producto[1]}</td>
            <td>${torta.producto[2]}</td>
            `;
			if (torta.producto.length > 3) {
				html += `
                <td>${torta.producto[3]}</td>
                `;
			} else {
				html += `
                <td></td>
                `;
			}
			html += `
            <td>${torta.cantidad}</td>
            <td>$${torta.precio}</td>
            <td>$${torta.precio * torta.cantidad}</td>
            </tr>
            `;
		} else {
			let ingredientes = buscaTortaPorNombre(torta.producto).ingredientes;
			html += `
            <tr>
                <td>${torta.producto}</td>
                <td>${ingredientes[0]}</td>
                <td>${ingredientes[1]}</td>
                <td>${ingredientes[2]}</td>
            `;
			if (ingredientes.length > 3) {
				html += `
                <td>${ingredientes[3]}</td>
                `;
			} else {
				html += `
                <td></td>
                `;
			}
			html += `
                <td>${torta.cantidad}</td>
                <td>$${torta.precio}</td>
                <td>$${torta.precio * torta.cantidad}</td>
            </tr>
            `;
		}
	});
	html += `
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td class="cantidadTortas"></td>
        <td class="text-end">$</td>
        <td class="totalTortas"></td>
    </tr>
    `;
	$("#tortas").html(html);
}

function armarRefresco() {
	html = "";
	refrescosPedidos.forEach((refresco) => {
		cantidadRefrescos += refresco.cantidad;
		totalRefrescos += refresco.precio * refresco.cantidad;
		let ref = refresco.producto.split(" ");
		html += `
        <tr>
            <td>${ref[0]}</td>
        `;
		if (ref[1] == "(ch)") {
			html += `
            <td>Chico</td>
            `;
		} else if (ref[1] == "(m)") {
			html += `
            <td>Mediano</td>
            `;
		} else if (ref[1] == "(g)") {
			html += `
            <td>Grande</td>
            `;
		} else {
			html += `
            <td></td>
            `;
		}
		html += `
            <td>${refresco.cantidad}</td>
            <td>$${refresco.precio}</td>
            <td>$${refresco.precio * refresco.cantidad}</td>
        </tr>
        `;
	});
	html += `
    <tr>
        <td></td>
        <td></td>
        <td class="cantidadRefrescos"></td>
        <td class="text-end">$</td>
        <td class="totalRefrescos"></td>
    </tr>
    `;
	$("#refrescos").html(html);
}

function totales() {
	$(".cantidadTortas").text(cantidadTortas);
	$(".cantidadRefrescos").text(cantidadRefrescos);
	$(".totalTortas").text(totalTortas);
	$(".totalRefrescos").text(totalRefrescos);
	$("#subtotal").text(totalTortas + totalRefrescos);
	desc = Math.trunc(tortasArmadas / 3);
	if (desc > 0) {
		$("#descuento").text(desc * 20);
		$("#total").text(totalTortas + totalRefrescos - desc * 20);
		$("#desc").removeClass("d-none");
	} else {
		$("#total").text(totalTortas + totalRefrescos);
	}
}

function datos() {
	$(".nombre-cliente").text(nombre);
	let fecha = new Date();
	let dia = fecha.getDate();
	let mes = fecha.getMonth() + 1;
	let año = fecha.getFullYear();
	let hora = fecha.getHours();
	let minutos = fecha.getMinutes();
	let segundos = fecha.getSeconds();
	if (dia < 10) {
		dia = "0" + dia;
	}
	if (mes < 10) {
		mes = "0" + mes;
	}
	if (hora < 10) {
		hora = "0" + hora;
	}
	if (minutos < 10) {
		minutos = "0" + minutos;
	}
	if (segundos < 10) {
		segundos = "0" + segundos;
	}
	let fecha_actual =
		dia + "/" + mes + "/" + año + " " + hora + ":" + minutos + ":" + segundos;
	$(".fecha").text(fecha_actual);
}

$("#efectivo").change(() => {
	$("#men").removeClass("d-none");
	if (parseInt($("#efectivo").val()) >= parseInt($("#total").text())) {
		$("#cambio").text($("#efectivo").val() - $("#total").text());
		$("#cambio-mensaje").text("Cambio:");
	} else {
		$("#cambio").text($("#total").text() - $("#efectivo").val());
		$("#cambio-mensaje").text("Falta:");
	}
});
