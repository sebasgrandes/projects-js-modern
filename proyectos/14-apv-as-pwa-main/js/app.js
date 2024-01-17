// recuerda que estas trabajando con tu workspace de la carpeta entero del curso (+40 carpetas dentro)... ten en cuenta esto para tus rutas relativas y absolutas
// ! este archivo para registrar los services workers. el apv.js es para las funcionalidades de la aplicacion

// si la propiedad "serviceWorker" está disponible en el objeto navigator (o sea si el navegador lo soporta)...
if ("serviceWorker" in navigator) {
    /*
    navigator: es un objeto global en JavaScript que proporciona información sobre el navegador y también métodos para controlar ciertas características del navegador.
    serviceWorker: propiedad de navigator que proporciona acceso a la funcionalidad de los Service Workers. 
    register('./sw.js'): Este método se utiliza para registrar un nuevo Service Worker (en el navegador).
    */
    // register devuelve un Promise. este Promise se resuelve (resolved) cuando el service worker ha sido instalado con éxito.
    // * En este caso, aunque `app.js` es el que contiene el código, `./sw.js` se resuelve con respecto a `index.html` porque `script.js` se está ejecutando en el contexto (entorno) de la página web que está definido por `index.html`.
    navigator.serviceWorker
        .register(
            "./sw.js" // ESTO ESTÁ BIEN, está tomando "http://127.0.0.1:5500/47-ServiceWorkers-PWA/sw.js"... si le colocas /sw.js o ../sw.js tomará "http://127.0.0.1:5500/sw.js", es decir, el dominio de tu workspace CURSO JS MODERNO (con +40 carpetas abiertas)
        )
        .then((resultado) => {
            console.log("Servir Worker registrado...", resultado);
            // Después de ser registrado, el service worker entra en la fase de instalación (Este es un paso automático si el service worker es nuevo o si es una versión actualizada de un service worker existente). Durante esta fase, el evento install es disparado y ejecutado.
        })
        .catch((error) => {
            console.log("Error en el registro del service worker", error);
        });
} else {
    console.log("Service Workers no soportados");
}
