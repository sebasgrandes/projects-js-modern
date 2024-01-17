// Variables
const marca = document.querySelector("#marca");
const year = document.querySelector("#year");
const minimo = document.querySelector("#minimo");
const maximo = document.querySelector("#maximo");
const puertas = document.querySelector("#puertas");
const transmision = document.querySelector("#transmision");
const color = document.querySelector("#color");

// Contenedor para los resultados
const resultado = document.querySelector("#resultado");

const max = new Date().getFullYear();
const min = max - 10;

// Generar un objeto con la busqueda
const datosBusqueda = {
    marca: "",
    year: "",
    minimo: "",
    maximo: "",
    puertas: "",
    transmision: "",
    color: "",
};

// Eventos
document.addEventListener("DOMContentLoaded", () => {
    mostrarAutos(autos); // muestra los autos al cargar

    llenarSelect(); // llena las opciones de años (con años el boton de seleccion de año)
});

// Event listener para los select de busqueda
marca.addEventListener("change", (e) => {
    datosBusqueda.marca = e.target.value;

    filtrarAuto();
});

year.addEventListener("change", (e) => {
    datosBusqueda.year = parseInt(e.target.value);

    filtrarAuto();
});

minimo.addEventListener("change", (e) => {
    datosBusqueda.minimo = e.target.value;
    filtrarAuto();
});
maximo.addEventListener("change", (e) => {
    datosBusqueda.maximo = e.target.value;
    filtrarAuto();
});
puertas.addEventListener("change", (e) => {
    datosBusqueda.puertas = parseInt(e.target.value);
    filtrarAuto();
});
transmision.addEventListener("change", (e) => {
    datosBusqueda.transmision = e.target.value;
    filtrarAuto();
});
color.addEventListener("change", (e) => {
    datosBusqueda.color = e.target.value;
    filtrarAuto();
});

// Funciones
function mostrarAutos(autos) {
    limpiarHTML(); // elimina el HTML previo

    autos.forEach((auto) => {
        const { marca, modelo, year, precio, puertas, color, transmision } =
            auto;
        const autoHTML = document.createElement("P");

        autoHTML.textContent = `${marca} ${modelo} - ${year} - ${puertas} Puertas - Transmisión: ${transmision} - Precio: ${precio} - Color: ${color}`;

        // Insertar el HTML
        resultado.appendChild(autoHTML);
    });
}

// Genera los años del select
function llenarSelect() {
    for (let i = max; i >= min; i--) {
        const opcion = document.createElement("option");
        opcion.value = i;
        opcion.textContent = i;
        year.appendChild(opcion); // Agrega las opciones de año al select
    }
}

// Funcion que filtra en base a la búsqueda
function filtrarAuto() {
    // a esta funcion (filter) que toma otra funcion se le llama funcion de alto nivel // funciones en cadena o chaining
    const resultado = autos
        .filter(filtrarMarca)
        .filter(filtrarYear)
        .filter(filtrarMinimo)
        .filter(filtrarMaximo)
        .filter(filtrarPuertas)
        .filter(filtrarTransmision)
        .filter(filtrarColor);

    // si existe o tiene longitud o no esta vacio "digamos"
    if (resultado.length) {
        mostrarAutos(resultado);
    } else {
        noResultado();
    }
}

function noResultado() {
    limpiarHTML(); // limpia, pq sino se quedan ahi mismo

    const noResultado = document.createElement("DIV");
    noResultado.classList.add("alerta", "error");
    noResultado.textContent =
        "No se encontraron resultados, intenta con otros términos...";
    resultado.appendChild(noResultado);
}

// Limpiar HTML (el resultado previo)
function limpiarHTML() {
    // mientras resultado tenga un hijo
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild); // remueve el hijo... y que sea el primero
    }
}

// como esta funcion esta dentro de un filter, el auto se pasa automaticamente
function filtrarMarca(auto) {
    const { marca } = datosBusqueda;
    // si marca no esta vacio (creo)
    if (marca) {
        return auto.marca === marca;
    }
    return auto;
}
function filtrarYear(auto) {
    const { year } = datosBusqueda;
    if (year) {
        return auto.year === year; // con el === revisa también el tipo, por ello se coloca el parseInt arriba
    }
    return auto;
}
function filtrarMinimo(auto) {
    const { minimo } = datosBusqueda;
    if (minimo) {
        return auto.precio >= minimo; // aqui se está comparando un "number" con un "string" pq el operador >= no es estricto asi como el ===
    }
    return auto;
}
function filtrarMaximo(auto) {
    const { maximo } = datosBusqueda;
    if (maximo) {
        return auto.precio <= maximo;
    }
    return auto;
}
function filtrarPuertas(auto) {
    const { puertas } = datosBusqueda;
    if (puertas) {
        return auto.puertas === puertas;
    }
    return auto;
}
function filtrarTransmision(auto) {
    const { transmision } = datosBusqueda;
    if (transmision) {
        return auto.transmision === transmision;
    }
    return auto;
}
function filtrarColor(auto) {
    const { color } = datosBusqueda;
    if (color) {
        return auto.color === color;
    }
    return auto;
}
