//manipulando el contenido de un elemento HTML desde JavaScript con DOM que permite 
//que los scripts accedan y manipulen elementos del html
//representa la estructura del documento en un formato jerárquico a un árbol, 
//donde cada elemento HTML es un "nodo" 
//Puedes usar el DOM para cambiar el contenido, estructura o estilo de una página web 
//mientras se está ejecutando.
// Reemplaza con la URL de tu API del back, y se guarda en apiUrl
const apiUrl = 'http://localhost:4001/paquetes'; 

//--------- Función para cargar la grilla de paquetes
async function cargarPaquetes() {
    try {
        //trata de hacer la peticion(fetch(buscar)) al endpoint(a la ruta del servidor)
        const response = await fetch('http://localhost:4001/paquetes') 
        // parseo las respuestas a un array
        const data = await response.json();
        //busca en el documento html un elemento que coincida por id(lista-paquetes) = tbody
        const tbody = document.getElementById('lista-paquetes');
        // Limpiar(inner) las filas existentes en el html antes de agregar nuevas
        tbody.innerHTML = '';
        // recorro el array creando filas 
        data.forEach(paquete => { 
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paquete.destino}</td>
                <td>${paquete.duracion}</td>
                <td>${paquete.precio}</td>
                <td>${paquete.descripcion}</td>
                <td>
                    <button onclick="eliminarPaquete(${paquete.id})">Eliminar</button>
                    <button onclick="actualizarPaquete(${paquete.id})">Actualizar</button>
                </td>
            `;
            //agregar linea
            tbody.appendChild(row);
        });
        //si no error
    } catch (error) {
        console.error(error);
    }
}

//-------------- Función para buscar paquetes por descripción de manera asincronica
async function buscarPaquetes() {
    // obtener lo que escribio el usuario en el input(buscar-input) del html
    const descripcion = document.getElementById('buscar-input').value; 
    //trata de hacer la peticion a la ruta
    try {
        const response = await fetch(`http://localhost:4001/paquetes/byDescripcion?desc=${descripcion}`)
        // parseo las respuestas a un array
        const data = await response.json();
        //busca en el documento html un elemento que coincida por id(lista-paquetes) = tbody 
        const tbody = document.getElementById('lista-paquetes'); 
        // Limpiar(inner) las filas existentes en el html antes de agregar nuevas
        tbody.innerHTML = ''; 
        // recorro el array creando filas
        data.forEach(paquete => { 
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paquete.destino}</td>
                <td>${paquete.duracion}</td>
                <td>${paquete.precio}</td>
                <td>${paquete.descripcion}</td>
                <td>
                    <button onclick="eliminarPaquete(${paquete.id})">Eliminar</button>
                    <button onclick="actualizarPaquete(${paquete.id})">Actualizar</button>
                </td>
            `;
            tbody.appendChild(row);

        });

    } catch (error) {
        console.error(error);
    }
}

//----------------- Función para agregar un nuevo paquete
async function agregarPaquete() {
    //buscar el elemnto(que es un formulario) en el html(nuevo-paquete-form)
    const form = document.getElementById('nuevo-paquete-form'); 
    // declaro un objeto de datos de todo lo que ingreso el usuario
    const data = {
        destino: form.destino.value,
        duracion: form.duracion.value,
        precio: form.precio.value,
        descripcion: form.descripcion.value,
    }
    // envio los datos, parseandolos a un JSON
    try {
        await fetch('http://localhost:4001/paquetes/crear', {
            //especifico el metodo post(agregar) 
            method: 'POST',
            // indicar que el body de mi peticion debe ser un objeto en formato JSON 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data) // Convertir los datos a JSON antes de enviarlos
        });
         // invoco a mi getAll()
        await cargarPaquetes()
    } catch (error) {
        console.log(error)
    }
}

//-----------Función para eliminarPaquete() por id
async function eliminarPaquete(id) {
    //trata de hacer la peticion al endpoint para el borrado con el metodo delete
    try {
        await fetch(`http://localhost:4001/paquetes/${id}`, { 
            method: 'DELETE'
        });

        // Si el borrado es exitoso, volver a cargar la tabla
        cargarPaquetes();
    } catch (error) {
        console.error(error);
    }
}
/////IMPORTANTE///////
//ESTA FUNCION SIGUE EN EL ARCHIVO PUTFORM.JS CON SU HTML PUTFORM.HTML
//SEGUIR CON ESA PARTE 
// actualizarPaquete(id) {
//    window.location.href = `putForm.html?id=${id}`;
//}


// Cargar la lista de paquetes al cargar la página
cargarPaquetes();

//probar en interfase