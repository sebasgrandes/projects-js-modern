const nombreCache = "apv-v2";

const archivoz = [
    "./",
    "./index.html",
    "./error.html",
    "./css/bootstrap.css",
    "./css/styles.css",
    "./js/app.js",
    "./js/apv.js",
];

// Los métodos then() y catch() son parte de la API de Promesas en JavaScript, y están diseñados para recibir funciones de devolución de llamada (callbacks) como argumentos. Esto se debe a que las Promesas son una forma de manejar la asincronía en JavaScript, y las funciones de devolución de llamada son una manera natural de manejar acciones asincrónicas.

// el install solo se ejecuta una sola vez
self.addEventListener("install", (e) => {
    console.log("Escuché el evento de install de sw...", e);
    // * e.waitUntil toma una Promesa como argumento y mantiene al Service Worker en la fase de instalación hasta que la Promesa se haya resuelto.
    e.waitUntil(
        caches.open(nombreCache).then((cache) => {
            console.log("cacheando...");
            return cache.addAll(archivoz);
            // La promesa que se devuelve por cache.addAll(archivoz) se convierte en la promesa de control para e.waitUntil. En otras palabras, e.waitUntil esperará hasta que esta promesa se resuelva antes de que el evento del Service Worker se considere completo.
        })
    );
});

// Este evento "fase de activacion o activacion" se dispara una vez que un Service Worker ha sido registrado y ha instalado con éxito.
// cuando se limpia el cache, el SW se activará de nuevo gracias a la funcion "activate", que no se define aqui pero digamos que si se hace gracias al boton de skip waiting del navegador
self.addEventListener("activate", (e) => {
    console.log("Escuché el evento de active de sw...", e);
    // * e.waitUntil toma una Promesa como argumento y mantiene al Service Worker en la fase de activación hasta que la Promesa se haya resuelto.
    /* explicacion del codigo
    - caches.keys(): Este método devuelve una Promesa que se resuelve en un array de claves de caché disponibles (strings).
    - keys.filter((key) => key !== sebasCache): Filtra las claves de caché para incluir aquellas que cumplan la condición (creando un nuevo array)
    - .map((key) => caches.delete(key)): Para todas las claves de caché, del nuevo array retornado por keys.filter, borra las cachés correspondiente. caches.delete(key) devuelve una Promesa que se resuelve en true si la caché fue borrada con éxito. (lo cual no afecta para nada a la iteracion .map)
    */
    e.waitUntil(
        caches
            .keys()
            .then((keys) => {
                return Promise.all(
                    keys
                        .filter((key) => key !== nombreCache)
                        .map((key) => caches.delete(key))
                );
                /* 
                Sí, eso es correcto. Cuando utilizas return Promise.all([...]) dentro de la función que pasas a e.waitUntil, estás retornando una promesa que contiene un arreglo de promesas. Promise.all([...]) espera a que todas las promesas en el arreglo se resuelvan o se rechacen.
Agregar return antes de Promise.all hace que esta promesa sea explícitamente retornada por la función en la que se encuentra. En otras palabras, esta promesa se convierte en el valor de retorno de la función (la funcion anonima que se le pasa a e.waituntil). La promesa que se ha retornado mediante return cache.addAll(archivoz) se utiliza como la promesa de control en e.waitUntil. 

                Cuando Promise.all([...]) se resuelve, esto significa que todas las promesas dentro del arreglo también se han resuelto con éxito. En este contexto, la promesa resultante de Promise.all([...]) actúa como una "promesa de control" que se utiliza para controlar el flujo de ejecución del evento del Service Worker.
                El método e.waitUntil monitorea esta promesa de control. Si la promesa se resuelve con éxito, el evento del Service Worker (por ejemplo, "activate") se considera exitoso y continúa ejecutándose. Si alguna de las promesas dentro de Promise.all([...]) se rechaza, la promesa de control también se rechaza, lo que indica que alguna de las tareas asincrónicas ha fallado. En este caso, el evento del Service Worker se considera fallido y no se completa.
                Entonces, e.waitUntil se encarga de esperar a que todas las operaciones asincrónicas se completen con éxito antes de permitir que el evento del Service Worker continúe o se complete, lo que es fundamental para asegurar que las tareas críticas se realicen antes de que el Service Worker siga su curso.
                */
            })
            .catch((error) => console.log(error))
    );
});

self.addEventListener("fetch", (e) => {
    console.log("Escuché el evento de active de sw...", e);

    /* En este código ajustado:
    - Si hay una coincidencia en la caché, se devuelve esa respuesta.
    - Si no hay coincidencia en la caché, se intenta obtener el recurso de la red.
    - Si la red también falla (por ejemplo, si estamos fuera de línea), se devuelve una página de error de la caché.
    - Si hay un error al intentar acceder a la caché inicialmente, también se devuelve una página de error de la caché.
    */
    e.respondWith(
        caches
            .match(e.request)
            .then((respuestaCache) => {
                // Retorna la respuesta de la caché si está disponible
                if (respuestaCache) {
                    return respuestaCache;
                } else {
                    // Intenta obtener el recurso de la red si no está en la caché
                    return (
                        //  Intenta obtener un recurso de la red que no se encontró en la caché del Service Worker. (Retorna una promesa que se resuelve con el objeto Response que representa la respuesta a la solicitud)
                        fetch(e.request)
                            .then((respuestaRed) => {
                                // Verificar si la respuesta de la red está OK
                                if (!respuestaRed.ok) {
                                    // Mostrar una página de error personalizada para respuestas no OK
                                    return caches.match("./error.html");
                                }
                                return respuestaRed;
                            })
                            // Retorna la página de error de la caché si la red también falla (como podría ocurrir si el usuario está offline)
                            .catch(caches.match("./error.html"))
                    );
                }
            })
            .catch(() => {
                // Retorna la página de error de la caché si hay un error al intentar acceder a la caché
                return caches.match("./error.html");
            })
    );
});
