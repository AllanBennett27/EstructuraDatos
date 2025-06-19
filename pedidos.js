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
const productosFactura = pila.map(p => ({ ...p })); // copia profunda

// Primero generamos la factura con los productos correctos
generarFactura(cliente, productosFactura);

// Luego guardamos el pedido
pedidos.push({ cliente, productos: productosFactura });
localStorage.setItem("pedidos", JSON.stringify(pedidos));

// Limpiamos pila y refrescamos
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
// ===============================
// Estructura de Lista Enlazada
// ===============================

class NodoFactura {
  constructor(factura) {
    this.factura = factura;
    this.siguiente = null;
  }
}

class ListaFacturas {
  constructor() {
    this.cabeza = null;
  }

  agregarFactura(factura) {
    const nuevoNodo = new NodoFactura(factura);
    if (!this.cabeza) {
      this.cabeza = nuevoNodo;
    } else {
      let actual = this.cabeza;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevoNodo;
    }
  }

  recorrer(callback) {
    let actual = this.cabeza;
    while (actual) {
      callback(actual.factura);
      actual = actual.siguiente;
    }
  }

  toArray() {
    const array = [];
    let actual = this.cabeza;
    while (actual) {
      array.push(actual.factura);
      actual = actual.siguiente;
    }
    return array;
  }

  cargarDesdeArray(array) {
    array.forEach(f => this.agregarFactura(f));
  }
}

// ===============================
// Facturación conectada a pedidos
// ===============================

const listaFacturas = new ListaFacturas();
const facturasGuardadas = JSON.parse(localStorage.getItem("facturas")) || [];
listaFacturas.cargarDesdeArray(facturasGuardadas);

function generarFactura(cliente, productos) {
  const numero = facturasGuardadas.length + 1;
  const fecha = new Date().toLocaleString();
  const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const factura = {
    numero,
    cliente,
    fecha,
    productos,
    total
  };

  listaFacturas.agregarFactura(factura);
  localStorage.setItem("facturas", JSON.stringify(listaFacturas.toArray()));
}
