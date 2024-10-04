async function cargarPaquetePorId() {
    // de la URl del navegador, obtengo el valor del query param que se genera
    const urlParams = new URLSearchParams(window.location.search);
    const paqueteId = urlParams.get('id');

    // Cargar los datos del usuario en el formulario, para ue se vean ya llenos por defecto los camos
    await loadUserData(paqueteId);
}


async function loadUserData(paqueteId) {
    try {
        // obtengo el paquete por ID
        const response = await fetch(`http://localhost:4001/paquetes/${paqueteId}`);
        console.log(response)
        const userData = await response.json();

        // Llenar el formulario con los datos del paquete
        document.getElementById('destino').value = userData.destino;
        document.getElementById('duracion').value = userData.duracion;
        document.getElementById('precio').value = userData.precio;
        document.getElementById('descripcion').value = userData.descripcion;

    } catch (error) {
        console.error(error);
        alert('Ha habido un error al cargar los datos del paquete');
    }
}

async function updatePaquete() {
    const putForm = document.getElementById('update-paquete-form'); // capturo el formulario de actualizacion

    // declaro un objeto de datos de todo lo que ingreso el usuario
    const data = {
        destino: putForm.destino.value,
        duracion: putForm.duracion.value,
        precio: putForm.precio.value,
        descripcion: putForm.descripcion.value,
    }

    // obtengo el id
    const urlParams = new URLSearchParams(window.location.search);
    const paqueteId = urlParams.get('id');

    try {
        await fetch(`http://localhost:4001/paquetes/actualizar/${paqueteId}`, { // envio los datos, parseandolos a un JSON
            method: 'PUT', // especifico que lo que quiero hacer es un post
            headers: {
                'Content-Type': 'application/json' // indicar que el body de mi peticion debe ser un objeto en formato JSON
            },
            body: JSON.stringify(data) // Convertir los datos a JSON antes de enviarlos
        });

        window.location.href = `index.html`;
    } catch (error) {
        console.log(error)
    }
}

cargarPaquetePorId()