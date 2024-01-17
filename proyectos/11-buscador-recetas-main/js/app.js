// El operador ?? se llama "operador de fusión nula" o "nullish coalescing operator" // * se utiliza para proporcionar un valor de respaldo en caso de que una expresión sea null o undefined.

function iniciarApp() {
    const selectCategorias = document.querySelector("#categorias");
    // si existe el select... esto lo uso para evitar el error en favoritos.html
    if (selectCategorias) {
        selectCategorias.addEventListener("change", seleccionarCategorias);
        obtenerCategorias();
    }

    const resultado = document.querySelector("#resultado");

    const favoritosDiv = document.querySelector(".favoritos");
    // si existe... ese .favoritos -> es decir, solo en favoritos.html
    if (favoritosDiv) {
        mostrarFavoritos();
    }

    // en este caso funciona el addeventlistener porque tenemos (existe) ya el <select> desde que renderiza el html (gracias al DOMContent loaded) // aunque las categorias se agreguen despues, el html con el select ya existe, por lo que puedo usar el html // si el elemento no existe, no se vuelve a ejecutar el js
    // creo una nueva instancia del modal de Bootstrap: objeto en js que se asocia con el modal #modal // esta instancia es util para controlar y manipular el comportamiento del modal (como abrirlo en respuesta a eventos, o realizar acciones adicionales antes o después de su apertura o cierre)
    const modal = new bootstrap.Modal("#modal", {}); // deseo controlar el modal con id de #modal // colocamos las opciones de configuracion (vacio)

    function obtenerCategorias() {
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";

        fetch(url)
            .then((respuesta) => respuesta.json())
            .then((resultado) => mostrarCategorias(resultado.categories));
    }

    // el valor predeterminado para el parámetro "categorias" es un array vacío
    function mostrarCategorias(categorias = []) {
        categorias.forEach((categoria) => {
            const { strCategory } = categoria;

            const option = document.createElement("OPTION");
            option.value = strCategory;
            option.textContent = strCategory;

            selectCategorias.appendChild(option);
        });
    }

    function seleccionarCategorias(e) {
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
        fetch(url)
            .then((respuesta) => respuesta.json())
            .then((resultado) => mostrarRecetas(resultado.meals));
    }

    function mostrarRecetas(recetas = []) {
        limpiarHTML(resultado);

        const heading = document.createElement("H2");
        heading.classList.add("text-center", "text-black", "my-5");
        heading.textContent = recetas.length
            ? `Se encontraron ${recetas.length} resultados`
            : "No se encontraron resultados";
        resultado.appendChild(heading);

        recetas.forEach((receta) => {
            const { strMeal, strMealThumb, idMeal } = receta;

            const recetaContenedor = document.createElement("DIV");
            recetaContenedor.classList.add("col-md-4");

            const recetaCard = document.createElement("DIV");
            recetaCard.classList.add("card", "mb-4");

            const recetaImagen = document.createElement("IMG");
            recetaImagen.classList.add("card-img-top");
            recetaImagen.alt = `Imagen de la receta ${
                strMeal ?? receta.titulo
            }`;
            // ! las recetas leidas de la API si contienen estas propiedades (strMeal, strMealThumb, idMeal), pero las leidas del LS no (son distintas), por lo que usamos el "??"
            recetaImagen.src = strMealThumb ?? receta.img;

            const recetaCardBody = document.createElement("DIV");
            recetaCardBody.classList.add("card-body");

            const recetaHeading = document.createElement("H3");
            recetaHeading.classList.add("card-title", "mb-3");
            recetaHeading.textContent = strMeal ?? receta.titulo;

            const recetaButton = document.createElement("BUTTON");
            recetaButton.classList.add("btn", "btn-danger", "w-100");
            recetaButton.textContent = "Ver Receta";

            // ? ok Uso data sets para activar mi modal (también puedes hacerlo creando una instancia del modal y darle .show(). ES LO MISMO)
            // * uso el objeto datasets para establecer valores personalizados (atributos de datos) al botón: para LLAMAR EL MODAL DE BOOTSTRAP
            recetaButton.dataset.bsTarget = "#modal"; // "#modal" se refiere al ID del modal que se debe manipular. Cuando se hace clic en recetaButton, Bootstrap buscará un elemento con el ID "modal" y realizará las acciones correspondientes para mostrar u ocultar ese modal.
            recetaButton.dataset.bsToggle = "modal"; // este toggle manda a llamar las funciones del archivo de js de bootstrap, del cual solo le decimos que usaremos el modal (alternar -toggle- un modal) // Cuando haces clic en un elemento con este atributo de datos, Bootstrap entiende que debe mostrar u ocultar el modal al que hace referencia mediante el atributo data-bs-target.
            // usamos onclick porque este elemento no existe en el codigo html cuando el codigo de js se ejecute. sino que se genera hasta que el usuario seleccione algunas opciones // por ello un eventListener no serviría
            recetaButton.onclick = function () {
                seleccionarReceta(idMeal ?? receta.id); // lo colocamos dentro del function porque sino se mandará a llamar como funcion
            };

            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);

            resultado.appendChild(recetaContenedor);
        });
    }

    function seleccionarReceta(id) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        fetch(url)
            .then((respuesta) => respuesta.json())
            .then((resultado) => mostrarRecetaModal(resultado.meals[0]));
    }

    function mostrarRecetaModal(receta) {
        const { strMeal, idMeal, strInstructions, strMealThumb } = receta;

        const modalTitle = document.querySelector(".modal .modal-title");
        const modalBody = document.querySelector(".modal .modal-body");

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}" />
            <h3 class="my-3">Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredientes - Cantidades</h3>
        `;

        const listGroup = document.createElement("UL");
        listGroup.classList.add("list-group");

        // mostrar ingredientes
        for (let i = 1; i <= 20; i++) {
            if (receta[`strIngredient${i}`]) {
                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                const ingredienteLi = document.createElement("LI");
                ingredienteLi.classList.add("list-group-item");
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

                listGroup.appendChild(ingredienteLi);
            }
        }

        modalBody.appendChild(listGroup);

        const modalFooter = document.querySelector(".modal-footer");
        limpiarHTML(modalFooter);

        const btnFavorito = document.createElement("BUTTON");
        btnFavorito.classList.add("btn", "btn-danger", "col");
        // Esto es importante para cuando se habra el modal
        btnFavorito.textContent = existeStorage(idMeal)
            ? "Eliminar Favorito"
            : "Guardar Favorito";

        const btnCerrarModal = document.createElement("BUTTON");
        btnCerrarModal.classList.add("btn", "btn-secondary", "col");
        btnCerrarModal.textContent = "Cerrar";

        // Un callback es una función que se pasa como argumento a otra función (La segunda función puede llamar a la primera función en un momento específico o en respuesta a un evento - en el caso de setTimeOut -) (en este caso mi otra o segunda funcion es el manejador de eventos que maneja el evento de clic del botón "btnCerrarModal") y se ejecuta después de que se haya completado cierta operación o evento
        // ? ok Se dice que esta función anónima (function() {}) actúa como un "callback" porque se ejecuta en respuesta a un evento específico (el clic del botón) y realiza una acción particular (ocultar el modal).
        // lo colocamos como callback
        btnCerrarModal.onclick = function () {
            modal.hide(); // si no colocamos el callback (function (){}) entonces estaríamos ejecutando directamente modal.hide() y asignando su resultado (lo que sea que retorne) a onclick
        };

        btnFavorito.onclick = function () {
            // recuerda que todo esto funcona cuando le doy click al botón
            // * comprobar si el elemento ya existe en el ls
            if (existeStorage(idMeal)) {
                eliminarFavorito(idMeal);
                // al llegar a este punto ya le habré dado click a "Eliminar" favorito, por lo que mi boton ahora debe decir "Guardar"
                btnFavorito.textContent = "Guardar Favorito";
                mostrarToast("Eliminado correctamente");
                return;
            }

            // le pasamos un objeto como argumento
            agregarFavorito({
                id: idMeal,
                titulo: strMeal,
                img: strMealThumb,
            });
            // al llegar a este punto ya le habré dado click a "Guardar" favorito, por lo que mi boton ahora debe decir "Eliminar"
            btnFavorito.textContent = "Eliminar Favorito";
            mostrarToast("Guardado correctamente");
        };

        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrarModal);

        modal.show(); // mostramos el modal
    }

    function agregarFavorito(receta) {
        // console.log(receta);
        // ??: es nolish colesing -> en caso que la evaluación de la izquierda de null, entonces se aplicará el de la derecha
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
        // console.log(favoritos);
        localStorage.setItem(
            "favoritos",
            JSON.stringify([...favoritos, receta]) // ...favoritos toma una copia DE EL CONTENIDO de const favorito
        );
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];

        const nuevosFavoritos = favoritos.filter((fav) => fav.id !== id);

        localStorage.setItem("favoritos", JSON.stringify([...nuevosFavoritos]));
    }

    function existeStorage(id) {
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
        return favoritos.some((fav) => fav.id === id);
    }

    function mostrarToast(mensaje) {
        // le digo donde están mis elementos
        const toastDiv = document.querySelector("#toast");
        const toastBody = document.querySelector(".toast-body");
        // creo una instancia de mi toast
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.textContent = mensaje;
        toast.show();
    }

    function mostrarFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
        console.log(favoritos);

        // si no hay nada en favoritos... si favoritos está vacío, !favoritos.length será true, y si favoritos contiene elementos, !favoritos.length será false.
        if (!favoritos.length) {
            const mensajeCero = document.createElement("P");
            mensajeCero.textContent = "No has agregado ningún favorito";
            mensajeCero.classList.add(
                "text-center",
                "fs-4",
                "font-bold",
                "mt-5"
            ); // TODO AGREGAR MAS CLASES
            favoritosDiv.appendChild(mensajeCero);
            return;
        }

        mostrarRecetas(favoritos); // ! las recetas leidas de la API si contienen estas propiedades, pero las leidas del LS no, por lo que usamos el "??"
    }

    function limpiarHTML(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }
}

document.addEventListener("DOMContentLoaded", iniciarApp);
