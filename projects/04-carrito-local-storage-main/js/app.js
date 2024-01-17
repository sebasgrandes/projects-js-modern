const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
    // agregar curso al carrito cuando presiono el boton de "agregar al carrito"
    listaCursos.addEventListener("click", agregarCurso);
    // eliminar un curso del carrito
    carrito.addEventListener("click", eliminarCurso);

    // Muestra los cursos del localStorage
    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
    });

    //variar carrito
    vaciarCarritoBtn.addEventListener("click", () => {
        // funcion anonima pq es poco codigo. en los anteriores funciones asi tal cual pq es mas largo
        articulosCarrito = []; // reseteamos el arreglo
        limpiarHTML(); // eliminamos todo el HTML con nuestra funcion ya creada
    });
}

// agregar un curso al carrito
function agregarCurso(e) {
    e.preventDefault(); // recuerda el parentesis // prevenimos la accion de que se vaya al #id, pero como solo tiene un #, entonces prevenimos que se vaya al inicio del documento
    if (e.target.classList.contains("agregar-carrito")) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

// eliminar un curso del carrito
function eliminarCurso(e) {
    // recuerda que el evento es aquello que tu mismo disparas en algun elemento EN ESPECÍFICO del html
    // console.log(e.target);
    e.preventDefault();
    if (e.target.classList.contains("borrar-curso")) {
        const cursoID = e.target.getAttribute("data-id");
        // de articulosCarrito elimino "por el data.id"
        articulosCarrito = articulosCarrito.filter(
            (curso) => curso.id !== cursoID
        );
        carritoHTML(); // iterar sobre el carrito y mostrar su HTML
    }
}

// lee contenido del HTML al que le dimos click y extrae la informacion del curso
function leerDatosCurso(curso) {
    // crea un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        id: curso.querySelector("a").getAttribute("data-id"),
        cantidad: 1,
    };
    // console.log(infoCurso);

    // revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
    // actualizamos la cantidad
    if (existe) {
        const cursos = articulosCarrito.map((curso) => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // lo retorna con la cantidad actualizada
            } else {
                return curso; // lo retorna nada más
            }
        });
        articulosCarrito = [...cursos];
    } else {
        // Agrega elementos al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    // console.log(articulosCarrito);
    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach((curso) => {
        // despues de que tu codigo funcione se recomienda mejorarlo, por ello se coloca el destructuring
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${imagen}" width=100px></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${id}">X</a></td>
    `;
        contenedorCarrito.appendChild(row);
    });

    // Agrega el carrito de compras al localStorage
    sincronizarStorage();
}

// sincronizar localStorage
function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

// limpiar el HTML
function limpiarHTML() {
    // forma lenta
    // contenedorCarrito.innerHTML = ``;

    // forma rapida
    while (contenedorCarrito.firstChild) {
        // ...si contenedorCarrito tiene un elemento ("true")...
        contenedorCarrito.removeChild(contenedorCarrito.firstChild); // remueve cada 1erElemento hijo de contenedorCarrito, sigue con el sgte, y asi sucecivamente
    }
}
