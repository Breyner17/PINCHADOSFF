let pedidos = [];

/* INICIAR */

document.addEventListener("DOMContentLoaded", () => {

  cargar();

  setInterval(cargar, 3000);

  buscar.addEventListener("input", filtrar);
  filtroPago.addEventListener("change", filtrar);
  filtroTipo.addEventListener("change", filtrar);
  ordenPrecio.addEventListener("change", filtrar);

});


/* CARGAR */

function cargar() {

  pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  actualizarContador();

  filtrar();

}


/* CONTADOR */

function actualizarContador() {

  let total = pedidos.filter(p => p.estado == "completado").length;

  document.getElementById("totalConfirmados").textContent = total;

}


/* FILTRAR */

function filtrar() {

  let texto = buscar.value.toLowerCase();
  let pago = filtroPago.value;
  let tipo = filtroTipo.value;
  let orden = ordenPrecio.value;

  let lista = pedidos.filter(p => p.estado == "completado");

  lista = lista.filter(p => {
    return (
      p.nombre.toLowerCase().includes(texto) ||
      p.telefono.includes(texto) ||
      (p.direccion || "").toLowerCase().includes(texto)
    );
  });

  if (pago) {
    lista = lista.filter(p => p.pago == pago);
  }

  if (tipo) {
    lista = lista.filter(p => p.tipo == tipo);
  }

  if (orden == "mayor") {
    lista.sort((a, b) => b.total - a.total);
  }

  if (orden == "menor") {
    lista.sort((a, b) => a.total - b.total);
  }

  render(lista);
}


/* RENDER */

function render(lista) {

  let cont = document.getElementById("listaPedidos");

  if (lista.length == 0) {
    cont.innerHTML = "<p>No hay pedidos confirmados</p>";
    return;
  }

  let html = "";

  lista.forEach(p => {

    html += `

      <div class="pedido">

        <h3>#${p.id} - ${p.nombre}</h3>

        <div class="info">

          📱 ${p.telefono}<br>

          ${p.tipo == "mesa"
            ? "Mesa: " + p.mesa
            : "Dirección: " + p.direccion}

          <br>

          Pago: ${p.pago} | Total: $${p.total}

        </div>

        <div class="detalle">
${p.detalle}
        </div>

        <div class="acciones">
          <button class="btnEliminar" onclick="eliminarPedido(${p.id})">
            🗑 Eliminar
          </button>
        </div>

      </div>

    `;

  });

  cont.innerHTML = html;

}


/* ELIMINAR PEDIDO INDIVIDUAL */

function eliminarPedido(id) {

  if (!confirm("¿Eliminar este pedido confirmado?")) return;

  let clave = prompt("Ingrese la contraseña de administrador:");
  if (!clave) return;

  const PASSWORD = "123456";

  if (clave !== PASSWORD) {
    alert("❌ Contraseña incorrecta");
    return;
  }

  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidos = pedidos.filter(p => p.id !== id);

  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  alert("✅ Pedido eliminado");

  cargar();
}


/* LIMPIAR TODO EL HISTORIAL */

function limpiarConfirmados() {

  if (!confirm("⚠️ ¿Estás seguro de borrar TODO el historial?")) return;

  let clave = prompt("Ingrese la contraseña de administrador:");
  if (!clave) return;

  const PASSWORD = "123456";

  if (clave !== PASSWORD) {
    alert("❌ Contraseña incorrecta");
    return;
  }

  if (!confirm("⚠️ Esta acción NO se puede deshacer. ¿Continuar?")) return;

  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  pedidos = pedidos.filter(p => p.estado !== "completado");

  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  alert("✅ Historial eliminado correctamente");

  cargar();
}