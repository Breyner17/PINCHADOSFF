/****************************
 ADMIN PENDIENTES - FULL FIX
*****************************/

let pedidos = [];


/* ======================
   INICIO
====================== */

document.addEventListener("DOMContentLoaded", () => {

  cargar();

  document.getElementById("buscar").addEventListener("input", filtrar);
  document.getElementById("filtroPago").addEventListener("change", filtrar);
  document.getElementById("filtroTipo").addEventListener("change", filtrar);
  document.getElementById("ordenPrecio").addEventListener("change", filtrar);

});


/* ======================
   CARGAR
====================== */

function cargar(){

  pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  filtrar();

}


/* ======================
   FILTRAR
====================== */

function filtrar(){

  const texto = buscar.value.toLowerCase();
  const pago = filtroPago.value;
  const tipo = filtroTipo.value;
  const orden = ordenPrecio.value;


  let lista = pedidos.filter(p => p.estado === "pendiente");


  lista = lista.filter(p => {

    return (
      p.nombre.toLowerCase().includes(texto) ||
      p.telefono.includes(texto) ||
      (p.direccion || "").toLowerCase().includes(texto)
    );

  });


  if(pago){
    lista = lista.filter(p => p.pago === pago);
  }

  if(tipo){
    lista = lista.filter(p => p.tipo === tipo);
  }


  if(orden === "mayor"){
    lista.sort((a,b) => b.total - a.total);
  }

  if(orden === "menor"){
    lista.sort((a,b) => a.total - b.total);
  }


  render(lista);

}


/* ======================
   RENDER
====================== */

function render(lista){

  const cont = document.getElementById("listaPedidos");

  if(lista.length === 0){
    cont.innerHTML = "<p>No hay pedidos</p>";
    return;
  }


  let html = "";


  lista.forEach(p => {

    html += `

    <div class="pedido">

      <h3>#${p.id} - ${p.nombre}</h3>


      <div class="info">

        📱 ${p.telefono}<br>

        ${p.tipo === "mesa"
          ? "Mesa: " + p.mesa
          : "Direccion: " + (p.direccion || "")
        }

        <br>

        Pago: ${p.pago} | Total: $${p.total}

      </div>


      <div class="detalle">
        ${p.detalle}
      </div>


      <div class="editar">

        <h4>Editar Pedido</h4>


        <div class="campo">
          <label>Nombre</label>
          <input
            value="${p.nombre}"
            oninput="editar(${p.id},'nombre',this.value)">
        </div>


        <div class="campo">
          <label>Telefono</label>
          <input
            value="${p.telefono}"
            oninput="editar(${p.id},'telefono',this.value)">
        </div>


        <div class="campo">
          <label>Direccion</label>
          <input
            value="${p.direccion || ""}"
            oninput="editar(${p.id},'direccion',this.value)">
        </div>


        <div class="campo">
          <label>Total</label>
          <input
            type="number"
            value="${p.total}"
            oninput="editar(${p.id},'total',this.value)">
        </div>

      </div>


      <div class="acciones">

        <button class="btn-ok"
          onclick="confirmar(${p.id})">
          Confirmar
        </button>


        <button class="btn-del"
          onclick="eliminar(${p.id})">
          Eliminar
        </button>

      </div>

    </div>

    `;

  });


  cont.innerHTML = html;

}


/* ======================
   EDITAR (REAL)
====================== */

function editar(id, campo, valor){

  const p = pedidos.find(x => x.id === id);

  if(!p) return;


  if(campo === "total"){
    p[campo] = Number(valor);
  }else{
    p[campo] = valor;
  }


  // Guardar REAL
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

}


/* ======================
   CONFIRMAR
====================== */

function confirmar(id){

  if(!confirm("Confirmar pedido y enviar WhatsApp?")) return;


  // Recargar version real
  pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];


  const p = pedidos.find(x => x.id === id);

  if(!p) return;


  let msg = "PEDIDO CONFIRMADO\n\n";

  msg += "Hola " + p.nombre + "\n\n";

  msg += "Pedido:\n";

  msg += p.detalle + "\n\n";

  msg += "Total: $" + p.total + "\n";

  msg += "Pago: " + p.pago + "\n";


  if(p.direccion){
    msg += "Direccion: " + p.direccion + "\n";
  }


  msg += "\nGracias por tu compra\nPinchados";


  const tel = p.telefono.replace(/\D/g,"");


  const url =
    "https://wa.me/57" + tel +
    "?text=" + encodeURIComponent(msg);


  // Marcar completado
  p.estado = "completado";


  localStorage.setItem("pedidos", JSON.stringify(pedidos));


  window.open(url, "_blank");


  filtrar();

}


/* ======================
   ELIMINAR
====================== */

function eliminar(id){

  if(!confirm("Eliminar pedido?")) return;


  pedidos = pedidos.filter(p => p.id !== id);


  localStorage.setItem("pedidos", JSON.stringify(pedidos));


  filtrar();

}
