// ! Constructores

function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// esto sigue siendo un constructor. o un objeto vacio, sin propiedades. el cual igual creamos para meterle el prototype
function UI() {}

// ! Prototypes

// * Llena las opciones de los años
// aqui normal hacemos uso del arrow function porque no usaremos el this.
// esto estará separado de la funcion Seguro
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
        min = max - 10;
    const selectYear = document.querySelector("#year");

    for (let i = max; i > min; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
};

// * Muestra mensaje de la validacion del formulario en pantalla
UI.prototype.mostrarMensaje = (tipo, mensaje) => {
    const div = document.createElement("div");
    if (tipo === "error") {
        div.classList.add("error");
    } else if (tipo === "correcto") {
        div.classList.add("correcto");
    }
    div.classList.add("mensaje", "mt-10");
    div.textContent = mensaje;

    // Insertar en el HTML
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.insertBefore(div, document.querySelector("#resultado")); // ! recuerda esta sintaxis

    setTimeout(() => {
        div.remove(); // ! recuerda esta sintaxis
    }, 2000);
};

Seguro.prototype.cotizarSeguro = function () {
    let precio;
    const base = 2000;
    // lo pongo como string por que así está creado el const
    switch (this.marca) {
        case "1":
            precio = base * 1.5;
            break;
        case "2":
            precio = base * 1.25;
            break;
        case "3":
            precio = base * 1.05;
            break;
        default:
            break;
    }

    const diferencia = new Date().getFullYear() - this.year; // todo en los prototypes, this.year hace mencion a la constante del constructor, por lo que, asegurate de que correspondan correctamente

    // por año de antiguedad el seguro se reduce en 3%
    precio *= 1 - diferencia * 0.03;

    if (this.tipo === "basico") {
        precio *= 1.3;
    } else if (this.tipo === "completo") {
        precio *= 1.5;
    }

    return precio;
    // console.log(diferencia);
    // console.log(precio);
};

UI.prototype.mostrarSeguro = function (seguro, total) {
    const spinner = document.querySelector("#cargando");
    spinner.style.display = "block";

    const { marca, year, tipo } = seguro;
    let tipoMarca;

    switch (marca) {
        case "1":
            tipoMarca = "Americano";
            break;
        case "2":
            tipoMarca = "Asiatico";
            break;
        case "3":
            tipoMarca = "Europeo";
            break;
        default:
            break;
    }

    // Crea el resultado
    const div = document.createElement("div");
    div.classList.add("mt-10");

    div.innerHTML = `
    <p class="header">Tu resumen</p>
    <p class="font-bold">Marca: <span class="font-normal">${tipoMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
    <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal">${total}</span></p>
    `;

    const resultadoDiv = document.querySelector("#resultado");

    setTimeout(() => {
        spinner.style.display = "none";
        resultadoDiv.appendChild(div);
    }, 2000);
};

// ! Instanciar
const ui = new UI();
// console.log(ui);

// ! eventListeners
document.addEventListener("DOMContentLoaded", () => {
    ui.llenarOpciones(); // llena el select con los años...
});

// no se recomienda que los prototypes vayan dentro de eventListener porque añadirias complejidad innecesaria
eventListeners();

function eventListeners() {
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault(); // ! recuerda prevenir la accion por defecto: que se recargue la página al darle a submit
    // lee la marca seleccionada
    const marca = document.querySelector("#marca").value;
    // lee el año seleccionada
    const year = document.querySelector("#year").value;
    // lee el tipo de cobertura
    const tipo = document.querySelector("input[name='tipo']:checked").value; // es un input cuyo atributo name es igual a "tipo" y que además está en checked

    if (marca === "" || year === "" || tipo === "") {
        ui.mostrarMensaje("error", "Rellene todos los campos vacíos");
        return; // evita la ejecucion del codigo siguiente
    }
    ui.mostrarMensaje("correcto", "Cotizando");

    // Ocultar las cotizaciones previas
    const resudiv = document.querySelector("#resultado div"); // selecciono el div dentro de resultado
    // si en la consola seleccionas e imprimes resudiv y este no existe, te da un null
    if (resudiv != null) { // si resudiv existe... o no es null...
        resudiv.remove();
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    ui.mostrarSeguro(seguro, total);
    // console.log(seguro);
}
