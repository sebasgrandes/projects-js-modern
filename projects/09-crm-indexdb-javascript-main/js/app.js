// creamos nustro IFFE (funcion cuyas variables se almacenan localmente, es decir, en este unico archivo)

(function () {
    let DB;
    const listadoClientes = document.querySelector("#listado-clientes");

    document.addEventListener("DOMContentLoaded", () => {
        crearDB();
        // si abre bien la DB entonces...
        if (window.indexedDB.open("crm", 1)) {
            obtenerClientes();
        }
        // Elimina el registro
        listadoClientes.addEventListener("click", eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if (e.target.classList.contains("eliminar")) {
            const idEliminar = Number(e.target.dataset.cliente); // ! recuerda convertir tu string a numero
            const confirmar = confirm(
                "¿Está seguro que desea eliminar el cliente?"
            );

            if (confirmar) {
                const transaction = DB.transaction(["crm"], "readwrite");
                const objectStore = transaction.objectStore("crm");
                objectStore.delete(idEliminar); // mi atributo es data-cliente

                transaction.oncomplete = function () {
                    console.log("Eliminado...");
                    e.target.parentElement.parentElement.remove();
                };

                transaction.onerror = () => {
                    console.log("Error al eliminar el cliente");
                };
            }
        }
    }

    // * Crea la base de datos de IndexedDB
    function crearDB() {
        const crearDB = window.indexedDB.open("crm", 1);

        crearDB.onerror = function () {
            console.log("Hubo un error al crear la base de datos en app.js");
        };

        crearDB.onsuccess = function () {
            console.log("Base de datos creada correctamente en app.js");
            DB = crearDB.result;
        };
        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore("crm", {
                keyPath: "id", // ! El keyPath "id" indica que la propiedad "id" de cada objeto almacenado en mi base de datos actuará como la clave única que identifica ese objeto (ese registro o fila, es lo mismo)
                autoIncrement: true,
            });

            objectStore.createIndex("nombre", "nombre", { unique: false });
            objectStore.createIndex("email", "email", { unique: true });
            objectStore.createIndex("telefono", "telefono", { unique: false });
            objectStore.createIndex("empresa", "empresa", { unique: false });
            objectStore.createIndex("id", "id", { unique: true });

            console.log("Base de datos lista en app.js");
        };
    }

    // abrimos la conexion, y en caso haya un error...
    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open("crm", 1);
        abrirConexion.onerror = function () {
            console.log(
                "Hubo un error al conectar a la base de datos en app.js"
            );
        };
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result; // creo una referencia a mi base de datos abierta // con el obejtivo de posteriromente poder interactuar con ella (transaccion, accede a objectstore, etc)
            console.log("Base de datos conectada en app.js");

            const transaction = DB.transaction(["crm"], "readwrite"); // mi "crm" es mi tienda de objetos (object store) de mi DB
            const objectStore = transaction.objectStore("crm");

            // const objectStore = DB.transaction("crm").objectStore("crm")

            // ! el cursor lo que hace es colocarse en la posicion 0 (fila) del crm de la base de datos, lee esos resultados. y luego va al siguiente y al siguiente automaticamente, sin hacerlo con un iterador (el cursor es el iterador en este caso, con ayuda del .continue())
            // * el cursor permite interactuar con los elementos (registros) de la base de datos uno por uno
            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result; // ! creo una referencia al cursor (fila o registro actual al que apunta el cursor) que ha sido abierto

                if (cursor) {
                    const { nombre, email, telefono, empresa, id } =
                        cursor.value;

                    const listadoClientes =
                        document.querySelector("#listado-clientes");

                    // ! no te olvides del += (junto con el innerHTML añade el nuevo contenido html a mi html ya existente)
                    listadoClientes.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;
                    // en el ultimo td: a cada boton de editar le pasas el id del elemento a la url. a esto se le llama querystring

                    cursor.continue(); // mueve el cursor hacia el siguiente registro
                } else {
                    console.log("No hay más registros en app.js");
                }
            };
        };
    }
})();

// esto sera el resultado de lo que se cree en el metodo onupgradeneeded, es decir, mi base de datos

// le pasamos el id como llave principal para realizar las operaciones del CRUD
