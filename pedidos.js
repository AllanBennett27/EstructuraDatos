const productos = JSON.parse(localStorage.getItem("productos")) || [];
const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

let pila = [];

const clienteSelect = document.getElementById("clienteSelect");
const productoSelect = document.getElementById("productoSelect");

function cargarDatos() {
  // Cargar cliente atendido desde clientes.js (si existe)
  const clienteAtendido = JSON.parse(localStorage.getItem("clienteActual"));

  if (clienteAtendido) {
    clienteSelect.innerHTML = `<option value="${clienteAtendido}">${clienteAtendido}</option>`;
    clienteSelect.value = clienteAtendido;
    localStorage.removeItem("clienteActual"); // Evitar duplicación
  } else {
    clienteSelect.innerHTML = clientes.map(c => `<option value="${c}">${c}</option>`).join("");
  }

  productoSelect.innerHTML = productos
    .map((p, i) => `<option value="${i}">${p.nombre} - L.${p.precio.toFixed(2)}</option>`)
    .join("");
}

function agregarProductoPedido() {
  const index = parseInt(productoSelect.value);
  const cantidad = parseInt(document.getElementById("cantidadProducto").value);
  if (!isNaN(index) && !isNaN(cantidad) && cantidad > 0) {
    const prod = productos[index];
    pila.push({ nombre: prod.nombre, precio: prod.precio, cantidad });
    mostrarPila();
  }
}

function mostrarPila() {
  const lista = document.getElementById("pilaPedido");
  lista.innerHTML = "";
  pila
    .slice()
    .reverse()
    .forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.cantidad} x ${p.nombre} (L.${(p.precio * p.cantidad).toFixed(2)})`;
      lista.appendChild(li);
    });
}

function guardarPedido() {
  if (pila.length > 0) {
    const cliente = clienteSelect.value;
    pedidos.push({ cliente, productos: [...pila] });
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    pila = [];
    mostrarPila();
    mostrarHistorial();
  }
}

function mostrarHistorial() {
  const lista = document.getElementById("historialPedidos");
  lista.innerHTML = "";
  pedidos.forEach(pedido => {
    const resumen = pedido.productos.map(p => `${p.cantidad} x ${p.nombre}`).join(", ");
    const li = document.createElement("li");
    li.textContent = `Cliente: ${pedido.cliente} | Productos: ${resumen}`;
    lista.appendChild(li);
  });
}

cargarDatos();
mostrarHistorial();
