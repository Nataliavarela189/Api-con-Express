//requerimos la libreria express de la dependencia de express
const express = require('express');
//Configurar la conexión a la base de datos (Sequelize).
//Definir los modelos y sus tipos de datos (DataTypes).
//Usar operadores avanzados en las consultas (Op).
const { Sequelize, DataTypes, Op } = require('sequelize');
//requiere cors que hace que solo esta api pueda hacer peticiones al server
const cors = require('cors');

// Configura la aplicación Express
const app = express();
app.use(express.json());
app.use(cors());

// Configura la conexión Sequelize (base de datos SQLite en memoria)
const sequelize = new Sequelize('sqlite::memory:');

// Define el modelo Paquete con sus tipo de dato(uno por cada atributo)
const Paquete = sequelize.define('Paquete', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    destino: DataTypes.STRING,
    duracion: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    descripcion: DataTypes.TEXT
}, { timestamps: false });//bloquea la generacion automatica de fecha 

// Inicializa de manera asincronica la base de datos e inserta datos de muestra dados por el ejercicio
async function inicializarBaseDeDatos() {
    await sequelize.sync({ force: true });
    await Paquete.bulkCreate([
        { destino: 'Cancún, México', duracion: '7 días', precio: 1200, descripcion: 'Disfruta de playas paradisíacas y ruinas mayas.' },
        { destino: 'Machu Picchu, Perú', duracion: '5 días', precio: 850, descripcion: 'Explora la ciudad perdida de los Incas en los Andes.' },
        { destino: 'Roma, Italia', duracion: '10 días', precio: 1500, descripcion: 'Descubre la historia y cultura de la antigua Roma.' },
        { destino: 'París, Francia', duracion: '5 días', precio: 1300, descripcion: 'Romance y cultura en la ciudad de la luz.' },
        { destino: 'Tokio, Japón', duracion: '8 días', precio: 2100, descripcion: 'Experimenta la mezcla de tradición y modernidad.' },
        { destino: 'Nueva York, USA', duracion: '6 días', precio: 1700, descripcion: 'La ciudad que nunca duerme.' },
        { destino: 'Londres, Inglaterra', duracion: '7 días', precio: 1450, descripcion: 'Historia y cultura en la capital británica.' },
        { destino: 'Río de Janeiro, Brasil', duracion: '5 días', precio: 900, descripcion: 'Playas, carnaval y el Cristo Redentor.' },
        { destino: 'Buenos Aires, Argentina', duracion: '4 días', precio: 550, descripcion: 'Tango, gastronomía y cultura porteña.' },
        { destino: 'Madrid, España', duracion: '6 días', precio: 1100, descripcion: 'Arte, historia y vida nocturna.' },
    ]);
}

//operaciones a base de datos permitidas con sequelize
// Endpoint(ruta) para obtener todos los paquetes con el metodo get de manera asincronica
app.get('/paquetes', async (req, res) => {
    //intenta encontrar paquete(todos), con .map recorre y mostra cada dato en formato de array
    try {
        const paquetes = await Paquete.findAll()
        const data = paquetes.map(paquete => paquete.dataValues)
        return res.json(data)
    //si no se puede mostra un estado de error 404 con su mensaje
    } catch (error) {
        return res.status(404).json({ error: "No encontre los paquetes :(" })
        // 404 significa "NO ENCONTRE"
    }
});

// endpoint(ruta) para obtener un paquete con el metodo get por id                 
app.get("/paquetes/:id", async (req, res) => {
    //trata de encontrar por PK(valor primario) el parametro ID y devolve
    //los valores de ese paquete en formato de array
    try {
        const paquete = await Paquete.findByPk(req.params.id)
        return res.json(paquete.dataValues)
    //si no mostra el error 404
    } catch (error) {
        return res.status(404).json({ error: "No encontre los paquetes :(" })
        // 404 significa "NO ENCONTRE"
    }
})

// Endpoint(ruta) para solicitar por descripción con el metodo get de manera asincronica
app.get('/paquetes/byDescripcion', async (req, res) => {
    //se extrae el parametro que se espera que contenga la descripcion
    const { desc } = req.query
    try {
        //se crea una variable vacia donde se guardara la descripcion 
        const whereConditions = {}
        //si desc contiene la descripcion de la base
        //con op.like buscamos coincidencias de texto entre lo buscado y desc(base)
        if (desc) {
            whereConditions.descripcion = { [Op.like]: `%${desc}%` };
        }
        //en paquetesFiltrados guardamos todos(findall)
        const paquetesFiltrados = await Paquete.findAll({
        //donde coincida
            where: whereConditions
        })
        //en data guardamos cada valor de paquete recorrido por .map 
        const data = paquetesFiltrados.map(paquete => paquete.dataValues)
        //y se retorna en forma de array
        return res.json(data)
    //si no se puede mostra el error 404
    } catch (error) {
        return res.status(404).json({ error: "No encontre los paquetes :(" })
        // 404 significa "NO ENCONTRE"
    }
});

//endpoint(ruta) de como obtener un paquete con el metodo get por parametro(PAIS)
app.get("/paquetes/byPais/:pais", async (req, res) => {
    try {
        //se crea una variable vacia donde se guardara el pais de destino de la base
        const whereConditions = {}
        //si la variable contiene el parametro pais de destino de la base
        //con op.like buscamos coincidencias de texto entre lo buscado y lo guardado(base)
        if (req.params.pais) {
            whereConditions.destino = { [Op.like]: `%${req.params.pais}%` };
        }
        //en paquetesFiltrados guardamos todos(findall)
        const paquetesFiltrados = await Paquete.findAll({
            //donde coincida
            where: whereConditions
        })
        //en data guardamos cada valor de paquete recorrido por .map
        const data = paquetesFiltrados.map(paquete => paquete.dataValues)
        //y se retorna en forma de array
        return res.json(data)
    //si no se puede mostra el error 404
    } catch (error) {
        return res.status(404).json({ error: "No encontre los paquetes :(" })
        // 404 significa "NO ENCONTRE"
    }
})

//endpoint(ruta) para crear un paquete con el metodo post de manera asincronica
app.post("/paquetes/crear", async (req, res) => {
    try {
        //si los atributos del cuerpo que se quieren llenar falta alguno = error 404 en forma de array
        if (!req.body.destino || !req.body.duracion || !req.body.precio || !req.body.descripcion) {
            return res.status(400).json({ error: "Error, falta algun dato" })
        }
        //se selecciona un paquete(findone)
        const paquetesLength = await Paquete.findOne({
            //se busca por id, ordenando de manera descendente limitando un solo elemento
            attributes: ['id'],
            limit: 1,
            order: [['id', 'DESC']]
        })
        //muestra los datos del paquete de determinado id
        console.log("ID DEL ULTIMO PAQUETE: ", paquetesLength.dataValues.id)
        //crear paquete(.create) con los datos requeridos del cuerpo(body) sumandole una posicion al id
        const paqueteCreado = await Paquete.create({
            id: paquetesLength.dataValues.id + 1,
            destino: req.body.destino,
            duracion: req.body.duracion,
            precio: req.body.precio,
            descripcion: req.body.descripcion,
        })

        return res.status(200).json(paqueteCreado.dataValues)//200 (todo ok)
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
})
//endpoint para borrar un paquete con el metodo delete por id de manera asincronica
app.delete("/paquetes/:idPaquete", async (req, res) => {
    try {
        //buscar en paquete por PK del id y si no existe = 404
        const paquete = await Paquete.findByPk(req.params.idPaquete);
        if (!paquete) {
            return res.status(404).json({ error: 'Paquete no encontrado' });
        }
        //espera y si no borrar paquete(.destroy)
        await paquete.destroy();
        return res.status(200).json({ message: 'Paquete eliminado exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
})

//endpoint para actualizar paquetes con el metodo put de manera asincronica
app.put("/paquetes/actualizar/:idPaquete", async (req, res) => {
    try {
        //buscar en paquete por PK del id y si no existe = 404
        const paquete = await Paquete.findByPk(req.params.idPaquete);
        if (!paquete) {
            return res.status(404).json({ error: 'Paquete no encontrado' });
        }
        //pide los datos nuevos(req), los guarda(=) en el atibuto que corresponda
        paquete.destino = req.body.destino
        paquete.duracion = req.body.duracion
        paquete.precio = req.body.precio
        paquete.descripcion = req.body.descripcion

        // espero a que guarde(.save) en base de datos
        await paquete.save()
        return res.status(200).json(paquete.dataValues)//200 (todo ok)
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
})


// Inicia el servidor
//ejecuta la funcion inicializarBaseDeDatos(), espera(.then) hasta que el proximo bloque de codigo 
//este listo (que la base de datos este cargada)
inicializarBaseDeDatos().then(() => {
    //se inicia(.listen) el servidor de la aplicación escuchando en el puerto 4001
    //para comenzar a aceptar conexiones en ese puerto, y se imprime un mensaje en la consola 
    app.listen(4001, () => console.log('Servidor corriendo en http://localhost:4001'));
});

//js agregar: "dev": "nodemon backend/app.js",
//npm init -y
//npm i sequelize sqlite3 cors express
//npm i nodemon --save-dev
//seguir con postman