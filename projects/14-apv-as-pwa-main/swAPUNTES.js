// recuerda que estas trabajando con tu workspace de la carpeta entero del curso (+40 carpetas dentro)... ten en cuenta esto para tus rutas relativas y absolutas
// aqui ya no podemos usar el window... usamos self
// self se refiere al propio Service Worker
// En el contexto de un Service Worker, self es una referencia al objeto global del propio Service Worker, similar a cómo window es la referencia al objeto global en el contexto del hilo principal de ejecución de una página web. Sin embargo, los objetos globales entre páginas web y workers (como los Service Workers) no son los mismos y tienen disponibilidad a diferentes objetos y APIs.

const nombreCache = "apvsgc-v1";

/* Caché
- arreglo con archivos que cachearemos: para que cuando no tengamos conexion a internet leerá los datos de caché y los mostrará (esto hace la PWA rapida). en caso de que hay conexion a internet y visitamos el sitio web entonces cargará los datos del sitio web
- descargamos el cache SOLO cada que accedemos a una pagina
- podriamos agregar todo el sitio web a cache será lento el caching... por lo que no es viable para que una PWA sea rápida
*/

// Cuando utilizas "./" en tu array archivos para el método addAll, estás haciendo referencia al recurso raíz de tu dominio o directorio donde se ubica el Service Worker. Esencialmente, "./" apunta al documento HTML principal o la página de inicio de tu aplicación web en el contexto del path del Service Worker.
// "./index.html": Es probablemente el mismo recurso que "./" si index.html es tu documento raíz o página de inicio, pero especificado con un nombre de archivo.
// Si estás usando "Live Server" que lanza un servidor de desarrollo con recarga en vivo... "./" hace referencia a tu dominio http://127.0.0.1:5500/. Por lo tanto, cachear "./" usualmente cachea el documento HTML inicial que se sirve cuando visitas esa URL base.
// en la mayoría de las configuraciones de servidor, solicitar el directorio raíz "./" servirá automáticamente el archivo index.html si este existe, debido a que index.html comúnmente está configurado como el documento índice predeterminado.
// Asegurarte de que "./" esté en tu lista de recursos para cachear es una buena práctica porque eso significa que la entrada principal a tu aplicación web (la página de inicio o documento HTML raíz) estará disponible offline después de que los recursos hayan sido cacheados por el Service Worker.
// ./ y ./index.html cachean lo mismo pero... se tiende a incluir ambos simplemente como una medida de "por si acaso" y para asegurarse de que la aplicación es accesible desde ambas URLs mientras se está offline
const archivos = [
    "./",
    "./index.html",
    "./error.html",
    "./css/bootstrap.css",
    "./css/styles.css",
    "./js/app.js",
    "./js/apv.js",
];

// service worker: fase de registro (manual) -> fase de instalación (automatica): el evento install es disparado y comienza a ejecutarse (hasta que se haya completado). // el install solo se ejecuta una sola vez, por lo que una vez que se instaló, no se vuelve a instalar (si recargas la pagina no aparecerá el mensaje de abajo... pero si ,modificas este archivo con cambios si pues xd)

// Cuando el navegador detecta una instalación de un Service Worker a través del método register, el evento de "install" es disparado, pero eso no significa que el Service Worker se haya instalado completamente. En este contexto, la "instalación" está en proceso.
self.addEventListener(
    "install",
    /* e toma el objeto del evento */
    (e) => {
        console.log("Escuché el evento install de service worker...", e);
        // e.waitUntil(): método de service worker utilizado para decirle al navegador que prolongue la fase de instalación del Service Worker hasta que la promesa pasada a waitUntil(...) se haya resuelto o rechazado. (la instalación no se considerará exitosa hasta que el código dentro de e.waitUntil(...) se haya ejecutado completamente y sin errores.)
        e.waitUntil(
            // usamos la API de caches (de service workers) para abrir (o crear, si no existe) un cache con un nombre específico proporcionado por la variable nombreCache.
            // Si el cache con ese nombre no existe, la API de caches creará un nuevo cache con ese nombre. Si el cache ya existe, simplemente lo abrirá para su uso.
            // open devuelve una promesa que resuelve con el objeto "cache" solicitado (o creado) una vez que está disponible. (basicamente mi nombreCache)
            caches.open(nombreCache).then((cache) => {
                console.log("Cacheando");
                cache.addAll(archivos); // addAll es un método (del objeto cache) que toma una lista de URL (archivos) a las que se les hacen solicitudes (HTTP GET) y las respuestas completas son almacenadas en cache (en mi cache nombreCache que estoy creando o abriendo). // * con respuestas completas se refiere a cuerpo de la respuesta, encabezados, estado, URL, etc... en el cuerpo de la respuesta están los datos (el codigo) del archivo html o css
                // Cuando estos recursos son cacheados utilizando cache.addAll(archivos), el navegador guardará localmente las respuestas de estas solicitudes. Luego, cuando el usuario esté offline o tenga una conexión a Internet poco confiable, el Service Worker puede interceptar las solicitudes a estos recursos y responder con las versiones cacheadas, asegurando así que la aplicación web pueda seguir funcionando de una manera predecible.
                // despues de agregado puedes ver lo cacheado en las chrome dev tools (cache storage)
            })
        );
    }

    // este es un buen lugar para cachear
    // el codigo se debe ejecutar hasta que terminemos de cachear o descargar los archivos (caches)
    // metodo de espera de service worker
);

self.addEventListener("activate", (e) =>
    console.log("Escuché que service worker ya se activó...")
);

// 3 condiciones para que una PWA pueda ser instalada: 1. contar con un manifest valido 2. dominio con https o localhost // * 3. tener registrado el event listener de fetch
// ! recuerda que tu service worker debe esta activado para escuchar el fetch... lo activas desde el chrome dev tools > application > service workers > skip waiting
// evento fetch para descargar archivos estáticos
// Los Service Workers actúan básicamente como un proxy entre el navegador y la red, permitiendo que se puedan interceptar y manejar las solicitudes HTTP (fetch events) que realiza el navegador.
/* escucha cada vez que se hace una solicitud HTTP (como cargar la pag web, una imagen, un archivo css o js) dentro del alcance del Service Worker */
self.addEventListener("fetch", (e) => {
    // e es el objeto del evento que contiene la información sobre la solicitud fetch que ha sido realizada
    console.log("Escuché por fetch...", e);
    // dale esta respuesta una vez que escuches por fetch

    /*
    * funcionamiento de e.responseWith:
    - e.respondWith: Este método es usado para satisfacer la solicitud fetch. respondWith permite al Service Worker responder a la solicitud ya sea desde el caché o realizando una nueva solicitud a la red, o de cualquier otra forma que decida. La respuesta es proporcionada por lo que se pasa como argumento al método respondWith.
    - caches.match(e.request): Este código intenta encontrar una coincidencia para la solicitud (e.request) en las caches disponibles. e.request contiene la información de la solicitud original que ha sido realizada (como la URL solicitada).
    - .then((respuestaCache) => respuestaCache): Cuando caches.match ha terminado de buscar una coincidencia, la promesa es resuelta y el resultado (que se almacena en respuestaCache) es pasado al siguiente bloque .then. Si una coincidencia es encontrada en la caché, respuestaCache contendrá esa respuesta cacheada, de lo contrario, será undefined.

    En resumen, este código hace lo siguiente: Cuando una solicitud fetch es realizada, el Service Worker intentará encontrar una respuesta cacheada que coincida con la solicitud. Si una coincidencia es encontrada en el caché, esa respuesta cacheada será usada para satisfacer la solicitud. Si no se encuentra ninguna coincidencia, la solicitud no será respondida por el Service Worker y se procederá a buscar la respuesta en la red.

    Es importante mencionar que si la respuesta no está en el caché y quieres asegurarte de que la solicitud sea atendida, tendrías que implementar una estrategia para gestionar esas situaciones, como por ejemplo, retornar la solicitud original a la red si la caché no contiene la respuesta, o proporcionar una respuesta de reserva. Este fragmento de código no maneja ese caso y simplemente devolverá undefined si la respuesta no está en la caché, lo cual no es una práctica recomendada en la mayoría de las situaciones.

    - .catch se ejecuta cuando la promesa es rechazada (lo que podría ser causado por un error o cuando no se encuentra una coincidencia en la caché.)
    - la funcion anonima de adentro se ejecutará cuando se invoque .catch
    - caches.match("./error.html"): Esto intenta buscar una coincidencia para la solicitud de la URL ./error.html en las caches disponibles. Si se encuentra una coincidencia, se devolverá la respuesta cacheada correspondiente a esa solicitud.
    */

    /* 
    * Lo que falta:
    Manejar el caso cuando el recurso no está en caché y la red está disponible: En tu código actual, si el recurso no está en el caché, tu servicio trabajador no intentará buscarlo en la red, lo cual podría ser un problema si el usuario está buscando un recurso que no fue previamente cacheado pero está disponible en línea.

    Si hay un error al intentar acceder a la caché inicialmente, también se debería devolver una página de error de la caché.

    Una estrategia para almacenar en caché recursos adicionales: Puedes almacenar en caché recursos a medida que son solicitados y no se encuentran en el caché, para optimizar futuras solicitudes de los mismos.
    */
    /* caches.match encuentra coincidencias en la cache */
    e.respondWith(
        // Si caches.match(e.request) no encuentra una coincidencia en la cache para e.request, la promesa se resolverá exitosamente, pero con un valor undefined, porque no se encontró ninguna respuesta coincidente en la caché. respuestaCache será undefined y eso es lo que se retornará. Esto significaría que el e.respondWith() finalmente recibirá un valor undefined, lo que // * hará que el navegador maneje la solicitud de la red como si el service worker no hubiera intervenido, resultando en una solicitud de red normal.
        caches
            .match(
                e.request
            ) /* Una vez que la Promise de caches.match(e.request) se resuelve, el método .then() es ejecutado. */
            /* Si la Promise se resolvió exitosamente (es decir, se encontró una coincidencia en la caché), respuestaCache contendrá esa respuesta y será retornada directamente.  */
            /* los .then se ejecutan cuando la promesa está resuelta (o sea cuando la promesa ha sido completada exitosamente y ha pasado a un estado de "resuelta" (fulfilled), proporcionando un valor de resolución.) */
            .then((respuestaCache) => {
                //  Cuando return respuestaCache; es ejecutado, la respuestaCache (que es un objeto Response de la caché, o undefined si no se encontró nada) es retornado a e.respondWith(). En otras palabras, la solicitud de red original es respondida con respuestaCache.
                return respuestaCache;
            })
            /* Este bloque .catch() será ejecutado si la Promise de caches.match(e.request) es rechazada (por ejemplo, si hay un error al intentar acceder a la cache, buscar en la caché o la cache no esta disponible.. casos raros... también puede ser por error de memoria, problemas con SW o problemas con permiso).  */
            .catch(() => caches.match("./error.html"))
        // Cuando utilizas return caches.match("./error.html"); en tu bloque .catch(), estás de nuevo retornando una Promise a e.respondWith(). caches.match("./error.html") devuelve una Promise que se resolverá con la respuesta cachéada para "./error.html", o undefined si no hay tal respuesta en la caché. e.respondWith() utiliza este valor (ya sea un objeto Response o undefined) para responder a la solicitud de red original.
        // Cualquier cosa que pases a e.respondWith() (ya sea directamente o mediante una Promise que se resuelve con un valor) se utiliza como esa respuesta. // * Si pasas una Promise, e.respondWith() espera que la Promise se resuelva y luego utiliza el valor con el que se resolvió para responder a la solicitud de red.
        /* Aquí se está retornando una nueva Promise que se resuelve con la respuesta que coincida con la solicitud a ./error.html desde la caché. Si ./error.html no está en la caché, esta Promise se resolverá con undefined. */

        // En contextos de promesas, return pasa el valor a la siguiente función .then() en la cadena. Pero aquí, después del return, no hay más bloques .then() o .catch(). Por lo tanto, el valor retornado (sea una respuesta cacheada o undefined) se convierte en la respuesta a la solicitud original gracias a e.respondWith().
    );
    // revisa el tipo de request que se esta haciendo... y en caso sea igual a lo que tenemos en cache, entonces cargamos el cache

    // para corroborar puedes ver en tus sources que los archivos vienen del service worker. también puedes poner en application > service workers > offline y veras que funciona sin internet
});
