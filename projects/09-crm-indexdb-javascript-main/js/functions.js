let DB;

function conectarDB() {
    const abrirConexion = window.indexedDB.open("crm", 1); // usas el mismo codigo para crear y para conectarte a tu DB

    abrirConexion.onerror = function () {
        console.log("Error en la conexión con la base de datos functions.js");
    };
    // ! ES ONSUCCESS PUTAMAREEEEEEEE
    abrirConexion.onsuccess = function () {
        DB = abrirConexion.result; // tenemos una instancia de nuestra base de datos
        console.log("Base de datos conectada desde functions.js");
    };
}

function imprimirAlerta(tipo, mensaje) {
    const alerta = document.querySelector(".alerta"); // selecionamos la clase alerta

    // si la clase .alerta no existe, entonces creame el mensaje de alerta
    if (!alerta) {
        const divMensaje = document.createElement("div");
        divMensaje.classList.add(
            "px-4",
            "py-3",
            "rounded",
            "max-w-lg",
            "mx-auto",
            "mt-6",
            "text-center",
            "border",
            "alerta"
        );
        divMensaje.textContent = mensaje;
        if (tipo === "error") {
            divMensaje.classList.add(
                "bg-red-100",
                "border-red-400",
                "text-red-700"
            );
        } else {
            divMensaje.classList.add(
                "bg-green-100",
                "border-green-400",
                "text-green-700"
            );
        }

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }
}
