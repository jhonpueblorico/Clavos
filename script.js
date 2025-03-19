import { db, collection, addDoc, getDocs, deleteDoc, doc } from "./config.js";

// Función para guardar un cliente en Firebase
async function guardarCliente(clienteData) {
  try {
    await addDoc(collection(db, "clientes"), clienteData);
    alert("Cliente registrado en Firebase.");
    document.getElementById("clienteForm").reset();
    cargarClientes(); // Para actualizar la lista de clientes
    cambiarPantalla("lista");
  } catch (error) {
    alert("Error al guardar en Firebase: " + error.message);
  }
}

// Función para cargar clientes desde Firebase
async function cargarClientes() {
  const listaClientes = document.getElementById("listaClientes");
  listaClientes.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "clientes"));
    if (querySnapshot.empty) {
      listaClientes.innerHTML = "<p>No hay clientes registrados.</p>";
    } else {
      querySnapshot.forEach((doc) => {
        const cliente = doc.data();
        const divCliente = document.createElement("div");
        divCliente.classList.add("cliente");
        divCliente.innerHTML = `
          <span>${cliente.nombre || "Sin nombre"}</span>
          <div>
            <button class="btn-detalles" onclick="verDetalles('${doc.id}')">Detalles</button>
            <button class="btn-eliminar" onclick="confirmarEliminar('${doc.id}')">Eliminar</button>
          </div>
        `;
        listaClientes.appendChild(divCliente);
      });
    }
  } catch (error) {
    alert("Error al cargar clientes desde Firebase: " + error.message);
  }
}

// Función para eliminar un cliente en Firebase
async function confirmarEliminar(clienteId) {
  if (confirm("¿Estás seguro de eliminar este cliente?")) {
    try {
      await deleteDoc(doc(db, "clientes", clienteId));
      alert("Cliente eliminado de Firebase.");
      cargarClientes();
    } catch (error) {
      alert("Error al eliminar cliente: " + error.message);
    }
  }
}

// Función para cambiar de pantalla
function cambiarPantalla(pantalla) {
  document.querySelectorAll(".pantalla").forEach((p) => p.classList.remove("activo"));
  document.getElementById(pantalla).classList.add("activo");
  if (pantalla === "lista") {
    cargarClientes();
  }
}
