const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

// Contenedor para las citas
const contenedorCitas = document.querySelector("#citas");

// Formulario nuevas citas
const formulario = document.querySelector("#nueva-cita");
formulario.addEventListener("submit", nuevaCita);

// Heading
const heading = document.querySelector("#administra");

let editando = false;

let DB;

window.onload = () => {
    eventListeners();
    crearDB();
};

// Eventos
function eventListeners() {
    mascotaInput.addEventListener("change", datosCita);
    propietarioInput.addEventListener("change", datosCita);
    telefonoInput.addEventListener("change", datosCita);
    fechaInput.addEventListener("change", datosCita);
    horaInput.addEventListener("change", datosCita);
    sintomasInput.addEventListener("change", datosCita);
}

const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: "",
};

function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
    citaObj[e.target.name] = e.target.value;
}

// CLasses
class Citas {
    constructor() {
        this.citas = [];
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map((cita) =>
            cita.id === citaActualizada.id ? citaActualizada : cita
        );
    }

    eliminarCita(id) {
        this.citas = this.citas.filter((cita) => cita.id !== id);
    }
}

class UI {
    constructor({ citas }) {
        this.textoHeading(citas);
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

        // Si es de tipo error agrega una clase
        if (tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document
            .querySelector("#contenido")
            .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

        // Quitar el alert despues de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas() {
        // Se puede aplicar destructuring desde la función...

        this.limpiarHTML();

        this.textoHeading(citas);

        // ! Leer contenido de la base de datos
        const objectStore = DB.transaction("citas").objectStore("citas");

        // para que me deje usar this.textoheading en mi funcion de abajo
        const fnTextoHeading = this.textoHeading;

        const total = objectStore.count();

        // para que me deje entrar a mi total.result
        total.onsuccess = function () {
            fnTextoHeading(total.result);
        };

        // ! traemos el contenido de la base de datos con openCursor (como que itera sobre los elementos de la base de datos)
        objectStore.openCursor().onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                const {
                    mascota,
                    propietario,
                    telefono,
                    fecha,
                    hora,
                    sintomas,
                    id,
                } = cursor.value; // el valor u objecto actual de la base de datos

                const divCita = document.createElement("div");
                divCita.classList.add("cita", "p-3");
                divCita.dataset.id = id;

                // scRIPTING DE LOS ELEMENTOS...
                const mascotaParrafo = document.createElement("h2");
                mascotaParrafo.classList.add(
                    "card-title",
                    "font-weight-bolder"
                );
                mascotaParrafo.innerHTML = `${mascota}`;

                const propietarioParrafo = document.createElement("p");
                propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

                const telefonoParrafo = document.createElement("p");
                telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

                const fechaParrafo = document.createElement("p");
                fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

                const horaParrafo = document.createElement("p");
                horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

                const sintomasParrafo = document.createElement("p");
                sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

                //  Agregar un botón de eliminar...
                const btnEliminar = document.createElement("button");
                btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
                btnEliminar.classList.add("btn", "btn-danger", "mr-2");
                btnEliminar.innerHTML =
                    'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

                //  Añade un botón de editar...
                const btnEditar = document.createElement("button");

                // ! como mi cursor.value es dinamico (por la iteracion), lo asignamos a un const
                const cita = cursor.value;
                btnEditar.onclick = () => cargarEdicion(cita);

                btnEditar.classList.add("btn", "btn-info");
                btnEditar.innerHTML =
                    'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';

                //  Agregar al HTML
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);

                contenedorCitas.appendChild(divCita);

                // ! Ve al siguiente elemento
                cursor.continue();
            }
        };
    }

    textoHeading(resultado) {
        if (resultado > 0) {
            heading.textContent = "Administra tus Citas ";
        } else {
            heading.textContent = "No hay Citas, comienza creando una";
        }
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const administrarCitas = new Citas();
// console.log(administrarCitas);
const ui = new UI(administrarCitas);

function nuevaCita(e) {
    e.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if (
        mascota === "" ||
        propietario === "" ||
        telefono === "" ||
        fecha === "" ||
        hora === "" ||
        sintomas === ""
    ) {
        ui.imprimirAlerta("Todos los mensajes son Obligatorios", "error");

        return;
    }

    if (editando) {
        // Estamos editando
        administrarCitas.editarCita({ ...citaObj });

        const transaction = DB.transaction(["citas"], "readwrite");
        const objectStore = transaction.objectStore("citas");

        objectStore.put(citaObj); // ! actualiza el registro // Esto lo logra gracias a keypath (id). busca el keypath de este objeto en mi DB, y si lo encuentra, entonces lo actualiza

        transaction.oncomplete = function () {
            ui.imprimirAlerta("Guardado Correctamente");

            formulario.querySelector('button[type="submit"]').textContent =
                "Crear Cita";

            editando = false;
        };

        transaction.onerror = function () {
            console.log("Hubo un error");
        };
    } else {
        // Nuevo Registrando

        // Generar un ID único
        citaObj.id = Date.now();

        // Añade la nueva cita
        administrarCitas.agregarCita({ ...citaObj });

        // insertar registro en indexedDB
        const transaction = DB.transaction(["citas"], "readwrite");

        // ! habilitar objectStore
        const objectStore = transaction.objectStore("citas");

        // ! insertar en la DB
        objectStore.add(citaObj);

        transaction.oncomplete = function () {
            console.log("Cita agregada correctamente");

            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta("Se agregó correctamente");
        };
    }

    // Imprimir el HTML de citas
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();
}

function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

function eliminarCita(id) {
    const transaction = DB.transaction(["citas"], "readwrite");
    const objectStore = transaction.objectStore("citas");

    objectStore.delete(id);

    transaction.oncomplete = () => {
        console.log(`Cita ${id} eliminada correctamente`);
        ui.imprimirCitas();
    };

    transaction.onerror = () => {
        console.log("Hubo un error al eliminar la cita");
    };
}

function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Reiniciar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Llenar los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    formulario.querySelector('button[type="submit"]').textContent =
        "Guardar Cambios";

    editando = true;
}

function crearDB() {
    // crear base de datos version 1.0
    const crearDB = window.indexedDB.open("citas", 1);

    // si hay un error
    crearDB.onerror = () => {
        console.log("Error al acceder a la base de datos");
    };

    // si todo está bien
    crearDB.onsuccess = () => {
        console.log("Base de datos creada");
        DB = crearDB.result;

        // Mostrar citas al cargar (pero indexedDB ya esta listo)
        ui.imprimirCitas();
    };

    // Definir el schema
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;
        const objectStore = db.createObjectStore("citas", {
            keyPath: "id", // mi indice
            autoIncrement: true,
        });

        // Definimos las columnas
        objectStore.createIndex("mascota", "mascota", { unique: false });
        objectStore.createIndex("propietario", "propietario", {
            unique: false,
        });
        objectStore.createIndex("telefono", "telefono", { unique: false });
        objectStore.createIndex("fecha", "fecha", { unique: false });
        objectStore.createIndex("hora", "hora", { unique: false });
        objectStore.createIndex("sintomas", "sintomas", { unique: false });
        objectStore.createIndex("id", "id", { unique: true });

        console.log("base de datos creada y lista");
    };
}
