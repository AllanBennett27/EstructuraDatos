let colaClientes = JSON.parse(localStorage.getItem("clientes")) || [];

function guardarClientes() {
  localStorage.setItem("clientes", JSON.stringify(colaClientes));
}

function mostrarClientes() {
  const lista = document.getElementById("listaClientes");
  lista.innerHTML = "";
  colaClientes.forEach((nombre, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${nombre}`;
    lista.appendChild(li);
  });
}

function agregarCliente() {
  const nombre = document.getElementById("nombreCliente").value;
  if (nombre.trim() !== "") {
    colaClientes.push(nombre);
    guardarClientes();
    mostrarClientes();
    document.getElementById("nombreCliente").value = "";
  }
}

function atenderCliente() {
  if (colaClientes.length > 0) {
    const cliente = colaClientes.shift(); // FIFO: saca el primer cliente
    guardarClientes();
    mostrarClientes();
    // Guardar el cliente atendido para la pantalla de pedidos
    localStorage.setItem("clienteActual", JSON.stringify(cliente));
    // Redirige automáticamente a pedidos.html
    window.location.href = "pedidos.html";
  }
}

function descargarClientes() {
  const contenido = colaClientes.map((nombre, i) => `${i + 1}. ${nombre}`).join("\n");
  const blob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "clientes.txt";
  a.click();
  URL.revokeObjectURL(url);
}

mostrarClientes();
