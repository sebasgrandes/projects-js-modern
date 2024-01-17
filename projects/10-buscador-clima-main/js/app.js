const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    // Validando formulario
    const ciudad = document.querySelector("#ciudad").value;
    const pais = document.querySelector("#pais").value;

    if (ciudad === "" || pais === "") {
        // Hubo un error
        mostrarError("Ambos campos son obligatorios");
        return;
    }

    // Consultando API
    consultarAPI(ciudad, pais);
}

function consultarAPI(ciudad, pais) {
    const apiID = "58a35b7ff63a24a889fa521de095ab9a";

    // ! mi url representa (dependiendo de mi ciudad y pais) un archivo JSON (similar a los anteriores) con la información del clima (coordenadas, clima, viendo, nubes, etc)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiID}`; // en el string de la url colocamos las variables correspondientes de: ciudad, pais y apiID
    // console.log(url);

    Spinner(); // lo colocamos aqui para que despues se ejecute la solicitud al servidor (el cual demorará)

    fetch(url)
        .then((resultado) => {
            // console.log(resultado);
            return resultado.json(); // resultado.json(): leo el cuerpo de la respuesta HTTP como JSON // lo cual devuelve una promesa que se resolverá con los datos JSON cuando se complete la lectura (los datos JSON se convertirán en el valor resultante de esa promesa) // return: paso la promesa resultante al siguiente .then
        })
        // ! este then se ejecuta una vez que la promesa que devuelve la funcion de resultado.json() se resuelve (Esta promesa representa la operación de leer el cuerpo de la respuesta HTTP como un objeto JavaScript analizado desde JSON)
        .then((datos) => {
            // En este punto, "datos" es el objeto JavaScript resultante después de analizar el JSON.
            limpiarHTML(); // limpiar el html previo
            if (datos.cod === "404") {
                mostrarError("Ciudad no encontrada o incorrecta");
                return;
            }
            // console.log(datos);
            // console.log(datos.main.temp);

            // imprime la respuesta del html
            mostrarClima(datos);
        });
}

function mostrarClima(datos) {
    // destructuring de mis objectos de: name (nombre de ciudad) y temp, temp_max, temp_min (temperaturas)
    const {
        name,
        main: { temp, temp_max, temp_min },
    } = datos;

    const centigrados = kelvinACentigrados(temp);
    const min = kelvinACentigrados(temp_min);
    const max = kelvinACentigrados(temp_max);

    const nombreCiudad = document.createElement("p");
    nombreCiudad.innerHTML = `Temperatura en la ciudad de ${name}`;
    nombreCiudad.classList.add("font-bold", "text-xl");

    const actual = document.createElement("p");
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add("font-bold", "text-6xl");

    const tempMin = document.createElement("p");
    tempMin.innerHTML = `Min: ${min} &#8451;`;
    tempMin.classList.add("text-xl");

    const tempMax = document.createElement("p");
    tempMax.innerHTML = `Max: ${max} &#8451;`;
    tempMax.classList.add("text-xl");

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white");

    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMin);
    resultadoDiv.appendChild(tempMax);
    resultado.appendChild(resultadoDiv);
    // console.log(temp);
    // console.log(temp_max);
    // console.log(temp_min);
}

// mi funcion helper
const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarError(mensaje) {
    const alertaClase = document.querySelector(".bg-red-100");

    if (!alertaClase) {
        const alerta = document.createElement("div");
        alerta.classList.add(
            "bg-red-100",
            "border-red-400",
            "text-red-700",
            "px-4",
            "py-3",
            "rounded",
            "max-w-md",
            "mx-auto",
            "mt-6",
            "text-center"
        );
        alerta.innerHTML = `
            <strong class="font-bold">¡Error!</strong>
            <span class="block">${mensaje}</span>
        `;
        container.append(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }
}

function Spinner() {
    limpiarHTML(); // limpiamos el html previo

    const divSpinner = document.createElement("div");
    divSpinner.classList.add("sk-fading-circle");
    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(divSpinner);
}
