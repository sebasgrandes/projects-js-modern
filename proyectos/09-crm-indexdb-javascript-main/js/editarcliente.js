(function () {
    // let DB;
    let idCliente; // hacemos que el scope o alcance de esta variable sea global, para podelo usarlo en todo este archivo
    const nombreInput = document.querySelector("#nombre");
    const emailInput = document.querySelector("#email");
    const telefonoInput = document.querySelector("#telefono");
    const empresaInput = document.querySelector("#empresa");
    const formulario = document.querySelector("#formulario");

    document.addEventListener("DOMContentLoaded", function () {
        conectarDB();

        // Actualiza el registro
        formulario.addEventListener("submit", actualizarCliente);

        

        // Verifica el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search); // nueva instancia (objecto) parseada de... la cadena de consulta (info del url despues del "?")
        idCliente = parametrosURL.get("id"); // metodo de la instancia para obtener el valor del id // * recuerda que es un string
        if (idCliente) {
            // retardo para que conecte mi base de datos
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    

    function actualizarCliente(e) {
        e.preventDefault();

        if (
            nombreInput.value === "" ||
            emailInput.value === "" ||
            telefonoInput.value === "" ||
            empresaInput.value === ""
        ) {
            imprimirAlerta("error", "Ningún campo puede estar vacío");
            return;
        }

        // actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente), // ! tienes que convertirlo a numero para que al hacer la transaccion de .put, LO ENCUENTRE CORRECTAMENTE
        };

        const transaction = DB.transaction(["crm"], "readwrite");
        const objectStore = transaction.objectStore("crm");
        // * dentro de la transacción se lleva a cabo la operacion de "put" usando el object store "crm"
        // funcionamiento del .put: teniendo como (identificador) keyPath mi id. IndexedDB verifica si ya existe un objeto con el mismo "id": 1. Si encuentra un registro, fila u objeto con la key o clave (id), actualizará ese registro u objecto con los nuevos datos proporcionados por clienteActualizado 2. Si no encuentra ningún objeto con ese "id", crea un nuevo objeto con los datos que le proporcionaste.
        objectStore.put(clienteActualizado); // gracias al keypath "id" este metodo hace la actualizacion automaticamente a partir del id de clienteActualizado
        transaction.onerror = function () {
            imprimirAlerta(
                "error",
                "Hubo un error en la transacción de actualizar el registro"
            );
        };
        // *si todas las operaciones dentro de la transacción (en este caso, "put"), se ejecutan sin errores, entonces ejecuta la funcion tal...
        transaction.oncomplete = function () {
            imprimirAlerta("", "Editado correctamente");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        };
    }

    function obtenerCliente(id) {
        // pasos para leer mis datos de mi db
        // * si no lee tu transacción, es porque la base de datos se está demorando en conectar
        const transaction = DB.transaction(["crm"], "readwrite");
        const objectStore = transaction.objectStore("crm");

        objectStore.openCursor().onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
                // id lo paso a numero pq es un string
                if (cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        };
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }
})();
