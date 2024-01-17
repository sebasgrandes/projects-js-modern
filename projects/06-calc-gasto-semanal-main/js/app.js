// normalmente las clases se reservan para los objetos, no lo vas a usar para todo
// es decir, no vas a colocar una clase cuando el documento esta listo, si se podria pero no te compliques con cosas asi

// null es cuando se crea la variable pero no hay ningun valor

// ! Variables y Selectores

const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

// ! Eventos
eventListeners();

function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
    formulario.addEventListener("submit", agregarGasto);
}

// ! Clases
// siempre detente a pensar un momento cuantas clases necesitara tu aplicacion: en este caso 2, una para calcular el presupuesto y otra para mostrarlo en el ui

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto); // Number() convierte el numerostring a numero // recuerda que la entrada de datos (prompt de abajo o donde recoge el valor) siempre viene como string
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]; // * con this.gasto haces referencia al atributo del mismo objeto (constructor)
        this.calculaRestante();
    }

    calculaRestante() {
        // reduce itera sobre todo el arreglo, y nos entrega un gran total
        const gastado = this.gastos.reduce((total, gasto) => {
            return total + gasto.cantidad;
        }, 0);
        this.restante = this.presupuesto - gastado;
        // console.log(restanteee);
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
        this.calculaRestante(); // ! es justo que lo coloques aqui y no en la funcion eliminarGasto
    }
}

class UI {
    // la de UI no requiere constructor pq lo unico que haras con esta es construir tu html
    insertarPresupuesto(cantidad) {
        // ! Extraer los valores con destructuring
        const { presupuesto, restante } = cantidad;

        // Agregar al HTML
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }
    imprimirAlerta(tipo, mensaje) {
        const divMensaje = document.createElement("div");
        divMensaje.textContent = mensaje;
        divMensaje.classList.add("alert", "text-center");
        if (tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }
        document
            .querySelector(".primario")
            .insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }
    agregarGastoListado(gastos) {
        this.limpiarHTML(); // limpia el html previo

        gastos.forEach((gasto) => {
            const { nombre, cantidad, id } = gasto;

            // crear li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className =
                "list-group-item d-flex justify-content-between align-items-center"; // className es igualito a classList, solo cambia en la sintaxis al momento de poner agregar o seleccionar css
            // nuevoGasto.dataset.id = id; // hace lo mismo que el de abajo pero el de abajo es mas recomendable y nuevo
            nuevoGasto.dataset.id = id; // este ya le agrega automaticamente el "data-"

            // crear el html
            // evita el uso regular de innerHTML porque se dice que es un poco inseguro
            nuevoGasto.innerHTML = `
            ${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
            `;

            // boton para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.innerHTML = "Borrar &times;"; // la X del front viene gracias a la entidad &times; del html, gracias también a innerHMTML pq con text-content no se podria
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            nuevoGasto.appendChild(btnBorrar);
            btnBorrar.onclick = () => {
                // console.log(gasto);
                eliminarGasto(id);
            };
            // agregar el html
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        // mientras gasto listado tenga algo
        while (gastoListado.firstChild) {
            // remuevel el hijo (primero)
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizaRestante(restante) {
        document.querySelector("#restante").textContent = restante;
    }
    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const divRestante = document.querySelector(".restante");
        if (presupuesto / 4 > restante) {
            divRestante.classList.remove("alert-success", "alert-warning");
            divRestante.classList.add("alert-danger");
        } else if (presupuesto / 2 > restante) {
            divRestante.classList.remove("alert-success", "alert-danger");
            divRestante.classList.add("alert-warning");
        } else {
            divRestante.classList.remove("alert-danger", "alert-warning");
            divRestante.classList.add("alert-success");
        }
        if (restante <= 0) {
            ui.imprimirAlerta(
                "error",
                "El presupuesto se ha agotado en su totalidad"
            );
            formulario.querySelector("button[type='submit']").disabled = true; // ! revisa esta sintaxis
        }
    }
}

// * Instanciar
const ui = new UI();
let presupuesto; // al crear tu variable globalmente, haces que se pueda utilizar en cualquier funcion de tu codigo, lo cual esta bien y es como normalmente se hace. le asignas un valor después

// ! Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt("Bienvenido, ¿Cuál es su presupuesto?"); // recuerda que la entrada de datos (prompt) siempre viene como string
    // console.log(presupuestoUsuario);
    if (
        presupuestoUsuario === "" || // si está vacio
        presupuestoUsuario === null || // boton Cancelar da null: crea la variable pero no hay ningun valor
        presupuestoUsuario <= 0 || // si es negativo
        isNaN(presupuestoUsuario) // si no es un numero (si es una letra) (recuerda que si es una letra botará NaN)
    ) {
        window.location.reload(); // recarga la ventana
    }
    // Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario); // aqui es en donde asignas el valor a tu variable creada globalmente
    // console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault(); // ! recuerda prevenir la accion por defecto
    // Leer los datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value); // * para que la cantidad no venga como string, le ponemos Number()

    // Validar
    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta("error", "Los campos no pueden estar vacíos");
        return;
    } else if (isNaN(cantidad) || cantidad <= 0) {
        ui.imprimirAlerta("error", "El campo cantidad no es un valor válido");
        return;
    }

    // crear un objeto de tipo gasto
    const gasto = { nombre, cantidad, id: Date.now() }; // poner solo "nombre" es como poner "nombre: nombre". lo mismo para cantidad

    // añade nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // mensaje de bien!
    ui.imprimirAlerta("", "Gasto añadido");

    // imprime los gastos
    const { gastos, restante } = presupuesto; // aplico destructuring para no pasarle todo el "presupuesto", sino solo lo que requerimos "gastos"
    ui.agregarGastoListado(gastos);

    ui.actualizaRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    // resetea el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    // elimina los gastos del objeto
    presupuesto.eliminarGasto(id);
    // elimina los gastos del html
    const { gastos, restante } = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizaRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
