// Variables
const formulario = document.querySelector("#formulario");
const listaTweets = document.querySelector("#lista-tweets");
let tweets = [];

// Event listeners
eventListener();

function eventListener() {
    // Cuando el usuario agrega un nuevo tweet
    formulario.addEventListener("submit", agregarTweet);

    // Cuando el documento esta listo (es decir, se ha cargado)
    document.addEventListener("DOMContentLoaded", () => {
        tweets = JSON.parse(localStorage.getItem("tweets")) || []; // cuando recargas desde cero, sin tener nada de nada. si no le agrego el "||", al inicio el getItem no cogerá nada porque en el localStorage no se ha seteado nada, entonces, el console.log(tweets) dara "null". y el crearHTML dará error poque no es valido el .length y .foreach en un "null"
        // el "|| []" significa que si tweets es "null", entonces tweets será []
        crearHTML(); // creas el HTML usando la variable anterior de tweets
    });
}

// Funciones
function agregarTweet(e) {
    e.preventDefault();

    // Textarea donde el usuario escribe
    const tweet = document.querySelector("#tweet").value;

    // Validación...
    if (tweet === "") {
        mostrarError("El mensaje esta vacio");
        return; // evita que se ejecuten mas lineas de codigo
    }

    tweetObj = {
        id: Date.now(), //sirve como mi identificador
        tweet, // esto es igual a tweet: tweet (nombrellave: valor)
    };

    // Añadir arreglo de tweets
    tweets = [...tweets, tweetObj];

    // Creamos el HTML de los tweets
    crearHTML();

    // Reiniciando el formulario
    formulario.reset();
}

// Mostrar Mensaje de error
function mostrarError(error) {
    const mensajeError = document.createElement("p");
    mensajeError.classList.add("error");
    mensajeError.textContent = error;

    // Insertarlo en el Contenido
    const contenido = document.querySelector("#contenido");
    contenido.appendChild(mensajeError);

    // Elimina la alerta después de 3 segundos
    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}

// Muestra el listado de los tweets
function crearHTML() {
    limpiarHTML(); // limpia primero y luego ejecuta o crea el html
    // ejecutamos esta funcion siempre y cuando tweets tengo algo, ya que inicia como un elemento vacio
    if (tweets.length > 0) {
        tweets.forEach((tweet) => {
            // Botón de eliminar
            const btnEliminar = document.createElement("a");
            btnEliminar.innerText = "X";
            btnEliminar.classList.add("borrar-tweet");

            btnEliminar.onclick = () => {
                borrarTweet(tweet.id);
            };

            //Crear el HTML
            const li = document.createElement("li");
            // añadir texto
            // li.textContent = tweet.tweet; // hace lo mismo que lo de abajo
            li.innerText = tweet.tweet;

            li.appendChild(btnEliminar);

            listaTweets.appendChild(li);
        });
    }

    sincronizandoStorage();
}

// Agrega los tweets actuales a localStorage
function sincronizandoStorage() {
    localStorage.setItem("tweets", JSON.stringify(tweets));
}

// Borra Tweet
function borrarTweet(id) {
    console.log("borrando twet");
    tweets = tweets.filter((tweet) => tweet.id !== id); // recuerda que al no poner llaves a la derecha de la flecha, significa que es un return por defecto
    crearHTML();
}

// Limpiar el HTML
function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}
