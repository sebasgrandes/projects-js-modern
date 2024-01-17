const monedaSelect = document.querySelector("#moneda");
const criptomonedaSelect = document.querySelector("#criptomonedas");

const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
    moneda: "",
    criptomoneda: "",
};

const obtenerCriptomonedas = (criptomonedas) =>
    // el crear esta promesa no aporta nada (a menos que en proximas clases de async haya sido util)
    new Promise((resolve) => {
        resolve(criptomonedas);
    });

document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomonedas();
    monedaSelect.addEventListener("change", leerValor);
    criptomonedaSelect.addEventListener("change", leerValor);
    formulario.addEventListener("submit", validarFormulario);
});

// ! Consultar la API con las 10 criptomonedas principales por su capitalización de mercado (ya seteado por url)

async function consultarCriptomonedas() {
    const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data); // el crear esta promesa no aporta nada (a menos que en proximas clases de async haya sido util)
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach((cripto) => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement("OPTION");
        option.value = Name;
        option.textContent = FullName;
        criptomonedaSelect.appendChild(option);
    });
}

function validarFormulario(e) {
    e.preventDefault();
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === "" || criptomoneda === "") {
        imprimirAlerta("Debes seleccionar al menos una moneda");
        return;
    }

    // ! Consultar la API con los resultados
    consultarAPI();
}

function leerValor(e) {
    // console.log(e.target.name);
    // e.target.name es bota el atributo name que lee mi evento
    objBusqueda[e.target.name] = e.target.value; //
}

function imprimirAlerta(msg) {
    const existeError = document.querySelector(".error");

    if (!existeError) {
        const alerta = document.createElement("DIV");
        alerta.classList.add("error");
        alerta.textContent = msg;
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }
}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarHTML(resultado.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }
}

function mostrarHTML(cotizacion) {
    const { CHANGEPCT24HOUR, HIGHDAY, LOWDAY, PRICE, LASTUPDATE } = cotizacion;
    const ultimaActualizacion =
        LASTUPDATE === "Just now" ? "Justo ahora" : LASTUPDATE;
    console.log(PRICE, LOWDAY);
    resultado.innerHTML = `
        <p class="precio">El precio es: <span class="font-bold">${PRICE}</span></p>
        <p>Precio más alto del día: <span class="font-bold">${HIGHDAY}</span></p>
        <p>Precio más bajo del día: <span class="font-bold">${LOWDAY}</span></p>
        <p>Variación últimas 24 horas: <span class="font-bold">${CHANGEPCT24HOUR}</span></p>
        <p>Última actualización: <span class="font-bold">${ultimaActualizacion}</span></p>
    `;
}

function mostrarSpinner() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    const spinner = document.createElement("DIV");
    spinner.classList.add("spinner");
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}
