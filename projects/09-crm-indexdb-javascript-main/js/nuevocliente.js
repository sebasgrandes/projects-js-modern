(function () {
    // let DB;
    const formulario = document.querySelector("#formulario");

    document.addEventListener("DOMContentLoaded", () => {
        conectarDB();
        formulario.addEventListener("submit", validarCliente);
    });

    

    function validarCliente(e) {
        e.preventDefault();

        // Leer todos los campos
        const nombre = document.querySelector("#nombre").value;
        const email = document.querySelector("#email").value;
        const telefono = document.querySelector("#telefono").value;
        const empresa = document.querySelector("#empresa").value;

        if (
            nombre === "" ||
            email === "" ||
            telefono === "" ||
            empresa === ""
        ) {
            imprimirAlerta("error", "Es necesario rellenar todos los campos");
            return; // ! no te olvides del return
        }

        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
        };

        cliente.id = Date.now();

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(["crm"], "readwrite");
        const objectStore = transaction.objectStore("crm");

        objectStore.add(cliente);
        transaction.onerror = function () {
            imprimirAlerta("error", "Hubo un error al crear el cliente");
        };
        transaction.oncomplete = function () {
            imprimirAlerta("", "Cliente agregado correctamente");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        };
        // console.log(cliente);
    }

    
})();
