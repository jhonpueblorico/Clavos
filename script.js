// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Configuración de Firebase (Reemplázala con tu propia configuración)
const firebaseConfig = {
  apiKey: "AIzaSyC0Ht7gEyRf3e8D5oV0J9R1cYz153YMPHw",
  authDomain: "clavosstc.firebaseapp.com",
  projectId: "clavosstc",
  storageBucket: "clavosstc.appspot.com",
  messagingSenderId: "838018204385",
  appId: "1:838018204385:web:9524583b80f8b978dd6da0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variable global para saber si estamos editando un cliente
let editingIndex = null;

// Función para obtener la ubicación
function obtenerUbicacion() {
  if (!navigator.geolocation) {
    alert('La geolocalización no es soportada por tu navegador');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = position.coords;
      document.getElementById('ubicacion').value =
        `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
      alert('Ubicación obtenida correctamente');
    },
    (error) => {
      alert(`Error al obtener ubicación: ${error.message}`);
    }
  );
}

// Vista previa de imágenes
document.getElementById('fotos').addEventListener('change', function (e) {
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  Array.from(e.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'imagen-preview';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// Evento submit del formulario (para registrar o actualizar un cliente)
document.getElementById('clienteForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const cedula = document.getElementById('cedula').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const fotosInput = document.getElementById('fotos');

  if (!nombre || !cedula || !direccion || !ubicacion || !telefono) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Si se han seleccionado nuevas fotos, se leen. Si no, se conservan las existentes (en modo edición).
  const totalFotos = fotosInput.files.length;
  if (totalFotos > 0) {
    const fotos = [];
    let fotosCargadas = 0;
    for (let i = 0; i < totalFotos; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(fotosInput.files[i]);
      reader.onload = function (e) {
        fotos.push(e.target.result);
        fotosCargadas++;
        if (fotosCargadas === totalFotos) {
          guardarCliente({ nombre, cedula, direccion, ubicacion, telefono, fotos });
        }
      };
    }
  } else {
    let fotos = [];
    if (editingIndex !== null) {
      const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
      fotos = clientes[editingIndex].fotos || [];
    }
    guardarCliente({ nombre, cedula, direccion, ubicacion, telefono, fotos });
  }
});

// Función para guardar o actualizar un cliente en Firestore
async function guardarCliente(clienteData) {
  try {
    if (editingIndex !== null) {
      // Modo edición
      const clienteId = clientes[editingIndex].id;
      await updateDoc(doc(db, "clientes", clienteId), clienteData);
      alert('Cliente actualizado.');
      editingIndex = null;
      document.querySelector('#clienteForm button[type="submit"]').textContent = 'Guardar Cliente';
    } else {
      // Modo registro nuevo
      await addDoc(collection(db, "clientes"), clienteData);
      alert('Cliente registrado con éxito.');
    }
    document.getElementById('clienteForm').reset();
    document.getElementById('preview').innerHTML = '';
    cargarClientes();
    cambiarPantalla('lista');
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    alert('Error al guardar cliente.');
  }
}

// Cargar y mostrar la lista de clientes desde Firestore
async function cargarClientes() {
  const listaClientes = document.getElementById('listaClientes');
  listaClientes.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, "clientes"));
    if (querySnapshot.empty) {
      listaClientes.innerHTML = '<p>No hay clientes registrados.</p>';
    } else {
      querySnapshot.forEach((doc) => {
        const cliente = doc.data();
        const divCliente = document.createElement('div');
        divCliente.classList.add('cliente');
        divCliente.innerHTML = `
          <span>${cliente.nombre || 'Sin nombre'}</span>
          <div>
            <button class="btn-detalles" onclick="verDetalles('${doc.id}')">Detalles</button>
            <button class="btn-editar" onclick="editarCliente('${doc.id}')">Editar</button>
            <button class="btn-eliminar" onclick="confirmarEliminar('${doc.id}')">Eliminar</button>
          </div>
        `;
        listaClientes.appendChild(divCliente);
      });
    }
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    listaClientes.innerHTML = '<p>Error al cargar clientes.</p>';
  }
}

// Función para cambiar de pantalla
function cambiarPantalla(pantalla) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activo'));
  document.getElementById(pantalla).classList.add('activo');
  if (pantalla === 'lista') {
    cargarClientes();
  }
}

// Inicializar la aplicación
cargarClientes();
