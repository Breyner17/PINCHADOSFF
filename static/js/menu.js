/* VARIABLES */

let carrito = [];
let prodActual = "";
let precioActual = 0;

/* SCROLL */

function irA(id){
document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

/* PRODUCTO */

function abrirProducto(nombre,precio){

prodActual = nombre;
precioActual = precio;

prodCantidad.value = 1;
prodNota.value = "";
telefonoCliente.value = "";

prodNombre.innerText = nombre;
modalProducto.style.display = "flex";
}

function cerrarProducto(){
modalProducto.style.display = "none";
}

/* AGREGAR */

function agregarCarrito(){

let nota = prodNota.value;
let telefono = telefonoCliente.value;
let cant = parseInt(prodCantidad.value);


if(cant < 1){
alert("Cantidad inválida");
return;
}

/* BUSCAR SI EXISTE */

let existe = carrito.find(p =>
p.nombre === prodActual &&
p.nota === nota
);

/* SI EXISTE SUMA */

if(existe){

existe.cantidad += cant;

}else{

carrito.push({
telefono,
nombre: prodActual,
precio: precioActual,
nota,
cantidad: cant
});

}

actualizarContador();

cerrarProducto();

}

/* CONTADOR */

function actualizarContador(){

let total = 0;

carrito.forEach(p=>{
total += p.cantidad;
});

contador.innerText = total;
}

/* CARRITO */

function abrirCarrito(){

if(carrito.length==0){
alert("Vacío");
return;
}

renderCarrito();
modalCarrito.style.display="flex";
}

function cerrarCarrito(){
modalCarrito.style.display="none";
}

/* RENDER */

function renderCarrito(){

let html="";
let totalCuenta=0;

carrito.forEach((p,i)=>{

let subtotal = p.precio * p.cantidad;

html+=`
<div style="border-bottom:1px solid #444;padding:10px">

<b>${p.nombre} x${p.cantidad}</b><br>

$${p.precio} c/u — Subtotal: <b>$${subtotal}</b><br>

${p.nota ? "📝 "+p.nota+"<br>" : ""}

<div style="margin:8px 0;display:flex;gap:5px;align-items:center">

<button onclick="disminuir(${i})">➖</button>

<input 
type="number" 
min="1" 
value="${p.cantidad}" 
style="width:60px;text-align:center"
onchange="cambiarCantidad(${i},this.value)"
>

<button onclick="aumentar(${i})">➕</button>

</div>

<button onclick="borrar(${i})" class="eliminar">
Eliminar
</button>

</div>
`;

totalCuenta += subtotal;

});

listaCarrito.innerHTML = html;
document.getElementById("total").innerText = "Total a pagar: $" + totalCuenta.toLocaleString();
}

/* AUMENTAR */

function aumentar(i){

carrito[i].cantidad++;

actualizarContador();
renderCarrito();

}

/* DISMINUIR */

function disminuir(i){

if(carrito[i].cantidad > 1){

carrito[i].cantidad--;

}else{

if(confirm("¿Eliminar producto?")){
carrito.splice(i,1);
}

}

actualizarContador();
renderCarrito();

}

/* CAMBIAR MANUAL */

function cambiarCantidad(i,valor){

let num = parseInt(valor);

if(num < 1 || isNaN(num)){
num = 1;
}

carrito[i].cantidad = num;

actualizarContador();
renderCarrito();

}

/* BORRAR */

function borrar(i){

if(confirm("Eliminar?")){
carrito.splice(i,1);
actualizarContador();
renderCarrito();
}

}

/* TIPO */

function cambiarTipo(){

let tipo=tipoPedido.value;

mesaBox.style.display=tipo=="mesa"?"block":"none";
domicilioBox.style.display=tipo=="domicilio"?"block":"none";

}

/* ENVIAR */

function enviarPedido(){


let tipo=tipoPedido.value;
let pago=metodoPago.value;

let mensaje="📋 PEDIDO PINCHADOS\n\n";

let total=0;

carrito.forEach((p,i)=>{

let subtotal = p.precio * p.cantidad;

mensaje+=`${i+1}. ${p.nombre} x${p.cantidad} - $${subtotal}\n`;

if(p.nota) mensaje+=`Nota: ${p.nota}\n`;

mensaje+="\n";

total+=subtotal;

});

mensaje+="----------------\n";

if(tipo=="mesa"){

mensaje+="📍 "+mesaNum.value+"\n";

}else{

if(!direccion.value){
alert("Ingresa dirección");
return;
}

mensaje+="🏠 DOMICILIO DIRECCIÓN: "+direccion.value+"\n";

if(detallesDom.value)
mensaje+="Detalles: "+detallesDom.value+"\n";
}

mensaje+="\n💳 Método de Pago: "+pago;
mensaje+="\n💰 TOTAL: $"+total+"\n";

if(!nombreCliente.value){
alert("Ingresa un nombre");
return;
}


if(!telefonoCliente.value){
alert("Ingresa tú número");
return;
}

mensaje+="\nNúmero de telefono: "+telefonoCliente.value+"\n";
mensaje+="\nNOMBRE: "+nombreCliente.value+"\n";

let url="https://wa.me/573158810226?text="+encodeURIComponent(mensaje);

guardarPedidoAdmin(mensaje,total,pago,tipo);

window.open(url,"_blank");

}

/* GUARDAR ADMIN */

function guardarPedidoAdmin(detalle,total,pago,tipo){

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

/* DATOS EXTRA */

let nombre = nombreCliente.value;
let telefono = telefonoCliente.value;
let mesa = "";
let direccionCliente = "";

/* SEGUN TIPO */

if(tipo=="mesa"){
mesa = mesaNum.value;
}else{
direccionCliente = direccion.value;
}

let nuevo = {

id: Date.now(),

fecha: new Date().toLocaleString(),

nombre: nombre,          // 👤 NOMBRE
telefono: telefono,      // 📱 TEL
mesa: mesa,              // 🍽 MESA
direccion: direccionCliente, // 🏠 DIRECCION

detalle: detalle,
total: total,
pago: pago,
tipo: tipo,

estado: "pendiente"

};

pedidos.push(nuevo);

localStorage.setItem("pedidos",JSON.stringify(pedidos));

}

  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (categoria) {
    const seccion = document.getElementById(categoria);
    if (seccion) {
      seccion.scrollIntoView({ behavior: "smooth" });
    }
  }

window.addEventListener('load', () => { document.body.classList.add('cargado'); });