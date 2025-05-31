let productos = JSON.parse(localStorage.getItem("productos")) || [];

function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function mostrarProductos() {
  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";
  productos.forEach((p, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${p.nombre} - L.${p.precio.toFixed(2)} <button onclick="eliminar(${index})">Eliminar</button>`;
    lista.appendChild(li);
  });
}

function agregarProducto() {
  const nombre = document.getElementById("nombreProducto").value;
  const precio = parseFloat(document.getElementById("precioProducto").value);
  if (nombre && !isNaN(precio)) {
    productos.push({ nombre, precio });
    guardarProductos();
    mostrarProductos();
    document.getElementById("nombreProducto").value = "";
    document.getElementById("precioProducto").value = "";
  }
}

function eliminar(index) {
  productos.splice(index, 1);
  guardarProductos();
  mostrarProductos();
}

mostrarProductos();
