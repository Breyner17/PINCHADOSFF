// ===============================
// CONFIG
// ===============================
const ADMIN_PASS = "123456";


// ===============================
// LOGIN (SIEMPRE PEDIR)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // Siempre mostrar login
  document.getElementById("loginBox").style.display = "flex";
  document.getElementById("panelFinanzas").style.display = "none";

});

// Entrar
function verificarAcceso() {

  let clave = document.getElementById("claveAdmin").value;

  if (clave === ADMIN_PASS) {

    mostrarSistema();

  } else {
    alert("❌ Contraseña incorrecta");
  }
}

// Enter para login
document.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    let input = document.getElementById("claveAdmin");
    if (document.activeElement === input) {
      verificarAcceso();
    }
  }
});

// Mostrar panel
function mostrarSistema() {

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("panelFinanzas").style.display = "block";

  cargarFinanzas();
}



// ===============================
// DATOS
// ===============================
function obtenerPedidos() {
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  return pedidos.filter(p => p.estado === "completado");
}



// ===============================
// CARGAR FINANZAS
// ===============================
function cargarFinanzas() {

  let lista = obtenerPedidos();

  let buscar = document.getElementById("buscar").value.toLowerCase();
  let pago = document.getElementById("filtroPago").value;
  let orden = document.getElementById("ordenTotal").value;
  let fechaFiltro = document.getElementById("filtroFecha").value;

  // Filtro fecha
  if (fechaFiltro) {
    lista = lista.filter(p => p.fecha === fechaFiltro);
  }

  // Buscar
  if (buscar) {
    lista = lista.filter(p =>
      p.nombre.toLowerCase().includes(buscar) ||
      p.telefono.includes(buscar)
    );
  }

  // Método pago
  if (pago) {
    lista = lista.filter(p => p.pago === pago);
  }

  // Orden
  if (orden === "mayor") lista.sort((a,b)=>b.total-a.total);
  if (orden === "menor") lista.sort((a,b)=>a.total-b.total);

  renderLista(lista);
  calcularResumen(lista);
  calcularTotalDia();
}



// ===============================
// LISTA
// ===============================
function renderLista(lista) {

  let cont = document.getElementById("listaFinanzas");

  if (lista.length === 0) {
    cont.innerHTML = "<p>No hay registros</p>";
    return;
  }

  let html = "";

  lista.forEach(p => {

    let ubicacion = p.tipo === "mesa"
      ? "Mesa " + p.mesa
      : p.direccion;

    let fecha = p.fecha || new Date().toISOString().split("T")[0];

    html += `
      <div class="registro">

        <strong>#${p.id} - ${p.nombre}</strong>
        <br>
        📅 ${fecha}
        <br>
        📱 ${p.telefono}
        <br>
        📍 ${ubicacion}
        <br>
        💳 ${p.pago}
        <br>
        💰 <strong>$${p.total.toLocaleString()}</strong>

        <div class="detalle">
          ${p.detalle}
        </div>

        <button class="btnEliminar" onclick="eliminarPedido(${p.id})">
          Eliminar
        </button>

      </div>
    `;
  });

  cont.innerHTML = html;
}



// ===============================
// RESUMEN
// ===============================
function calcularResumen(lista) {

  let total = lista.reduce((sum,p)=>sum+p.total,0);
  let cantidad = lista.length;
  let promedio = cantidad ? total/cantidad : 0;

  document.getElementById("totalGeneral").textContent =
    "$" + total.toLocaleString();

  document.getElementById("totalPedidos").textContent = cantidad;

  document.getElementById("promedio").textContent =
    "$" + Math.round(promedio).toLocaleString();
}



// ===============================
// TOTAL DEL DIA
// ===============================
function calcularTotalDia(){

  let pedidos = obtenerPedidos();
  let hoy = new Date().toISOString().split("T")[0];

  let totalDia = pedidos
    .filter(p => p.fecha === hoy)
    .reduce((sum,p)=>sum+p.total,0);

  document.getElementById("totalDia").textContent =
    "$" + totalDia.toLocaleString();
}



// ===============================
// ELIMINAR PEDIDO
// ===============================
function eliminarPedido(id){

  let pass = prompt("Contraseña admin");

  if(pass !== ADMIN_PASS){
    alert("Contraseña incorrecta");
    return;
  }

  if(!confirm("¿Eliminar este pedido?")) return;

  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidos = pedidos.filter(p=>p.id !== id);

  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  cargarFinanzas();
}



// ===============================
// LIMPIAR SOLO DIA
// ===============================
function limpiarFinanzasDia(){

  let pass = prompt("Contraseña admin");

  if(pass !== ADMIN_PASS){
    alert("Contraseña incorrecta");
    return;
  }

  if(!confirm("Eliminar pedidos del día?")) return;

  let hoy = new Date().toISOString().split("T")[0];

  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidos = pedidos.filter(p => p.fecha !== hoy);

  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  cargarFinanzas();
}



// ===============================
// EXPORTAR EXCEL
// ===============================
function exportarExcel(){

  let lista = obtenerPedidos();

  if(lista.length === 0){
    alert("No hay datos");
    return;
  }

  let csv = "Fecha,ID,Nombre,Telefono,Ubicacion,Metodo,Total,Productos\n";

  lista.forEach(p=>{

    let ubicacion = p.tipo === "mesa"
      ? "Mesa " + p.mesa
      : p.direccion;

    let productos = p.detalle.replace(/<br>/g," | ");

    csv += `${p.fecha},${p.id},${p.nombre},${p.telefono},${ubicacion},${p.pago},${p.total},"${productos}"\n`;
  });

  let blob = new Blob([csv],{type:"text/csv"});
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "finanzas_pinchados.csv";
  a.click();
}



// ===============================
// EVENTOS FILTROS
// ===============================
document.addEventListener("input", function(e){
  if(e.target.id === "buscar") cargarFinanzas();
});

document.addEventListener("change", function(e){
  if(
    e.target.id === "filtroPago" ||
    e.target.id === "ordenTotal" ||
    e.target.id === "filtroFecha"
  ){
    cargarFinanzas();
  }
});