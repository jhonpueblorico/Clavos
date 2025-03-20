document.getElementById('clienteForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const cedula = document.getElementById('cedula').value;
  const direccion = document.getElementById('direccion').value;
  const telefono = document.getElementById('telefono').value;
  const ubicacion = document.getElementById('ubicacion').value;

  db.collection("clientes").add({
    nombre,
    cedula,
    direccion,
    telefono,
    ubicacion
  })
  .then(docRef => {
    console.log("Cliente registrado con ID:", docRef.id);
    alert("Cliente registrado con éxito!");
    document.getElementById('clienteForm').reset(); // Resetea el formulario tras el registro
  })
  .catch(error => {
    console.error("Error al agregar cliente:", error);
    alert("Error al registrar el cliente.");
  });
});
