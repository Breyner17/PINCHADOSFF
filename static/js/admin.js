let pedidos = [];

let notificaciones = JSON.parse(
  localStorage.getItem("notificaciones")
) || [];

let ultimoTotal = 0;


/* =====================
   INICIO
===================== */

document.addEventListener("DOMContentLoaded",()=>{

  cargarDatos();

  setInterval(cargarDatos,3000);

  activarPanelNoti();

});


/* =====================
   CARGAR DATOS
===================== */

function cargarDatos(){

  pedidos = JSON.parse(
    localStorage.getItem("pedidos")
  ) || [];

  actualizarPendientes();
  actualizarFinanzas();

  revisarNuevosPedidos();

  renderNotificaciones();

}


/* =====================
   PENDIENTES
===================== */

function actualizarPendientes(){

  let box = document.getElementById("countPendientes");

  if(!box) return;

  let pendientes = pedidos.filter(
    p => p.estado === "pendiente"
  );

  box.textContent = pendientes.length;

}


/* =====================
   FINANZAS
===================== */

function actualizarFinanzas(){

  let box = document.getElementById("totalFinanzas");

  if(!box) return;

  let total = 0;

  pedidos.forEach(p=>{

    if(p.estado==="completado"){
      total += Number(p.total);
    }

  });

  box.textContent =
    "$"+total.toLocaleString();

}


/* =====================
   NOTIFICACIONES
===================== */

function revisarNuevosPedidos(){

  if(pedidos.length > ultimoTotal){

    let nuevos =
      pedidos.slice(ultimoTotal);

    nuevos.forEach(p=>{

      agregarNotificacion(
        "Nuevo pedido #"+p.id+
        " - "+p.nombre
      );

    });

  }

  ultimoTotal = pedidos.length;

}


/* Guardar */

function guardarNotificaciones(){

  localStorage.setItem(
    "notificaciones",
    JSON.stringify(notificaciones)
  );

}


/* Agregar */

function agregarNotificacion(texto){

  notificaciones.unshift({

    id: Date.now(),
    texto,
    fecha: new Date().toLocaleString()

  });

  guardarNotificaciones();

}


/* Render */

function renderNotificaciones(){

  let panel =
    document.getElementById("notiPanel");

  let count =
    document.getElementById("notiCount");

  if(!panel || !count) return;


  count.textContent =
    notificaciones.length;


  if(notificaciones.length===0){

    panel.innerHTML =
      "<p>Sin notificaciones</p>";

    return;
  }


  let html = "";


  notificaciones.forEach(n=>{

    html += `

      <div class="noti-item">

        <strong>${n.texto}</strong><br>

        <small>${n.fecha}</small>

      </div>

    `;

  });


  html += `

    <div class="noti-clear">

      <button onclick="limpiarNotificaciones()">

        Limpiar todo

      </button>

    </div>

  `;


  panel.innerHTML = html;

}


/* Mostrar / ocultar */

function activarPanelNoti(){

  let box =
    document.getElementById("notiBox");

  if(!box) return;


  box.addEventListener("click",()=>{

    document
      .getElementById("notiPanel")
      .classList
      .toggle("active");

  });

}


/* Limpiar */

function limpiarNotificaciones(){

  if(!confirm("¿Borrar todo?")) return;

  notificaciones = [];

  guardarNotificaciones();

  renderNotificaciones();

}
