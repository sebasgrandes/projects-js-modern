document.addEventListener("DOMContentLoaded", function () {
    const email = {
        email: "",
        cc: "",
        asunto: "",
        mensaje: "",
    };

    // Seleccionar los elementos de la interfaz
    const inputEmail = document.querySelector("#email");
    const inputCC = document.querySelector("#cc");
    const inputAsunto = document.querySelector("#asunto");
    const inputMensaje = document.querySelector("#mensaje");
    const formulario = document.querySelector("#formulario");
    const btnSubmit = document.querySelector(
        '#formulario button[type="submit"]'
    );
    const btnReset = document.querySelector('#formulario button[type="reset"]');
    const spinner = document.querySelector("#spinner");

    // Asignar eventos
    inputEmail.addEventListener("blur", validar);
    inputCC.addEventListener("blur", validar);
    inputAsunto.addEventListener("blur", validar);
    inputMensaje.addEventListener("blur", validar);

    formulario.addEventListener("submit", enviarEmail); // ! importante, el evento submit del formulario

    btnReset.addEventListener("click", (e) => {
        e.preventDefault();

        resetFormulario();
    });

    function enviarEmail(e) {
        e.preventDefault(); // recuerda que el preventDefault es para el evento, no para el const btnSubmit
        spinner.classList.add("flex");
        spinner.classList.remove("hidden");
        setTimeout(() => {
            spinner.classList.remove("flex");
            spinner.classList.add("hidden");
            resetFormulario();

            // crear una alerta
            const alertaExito = document.createElement("P");
            alertaExito.classList.add(
                "bg-green-500",
                "text-white",
                "p-2",
                "text-center",
                "rounded-lg",
                "mt-10",
                "font-bold",
                "text-sm",
                "uppercase"
            );
            alertaExito.textContent = "Mensaje enviado correctamente...";
            formulario.appendChild(alertaExito);
            setTimeout(() => {
                alertaExito.remove(); // remueve el elemento del DOM
            }, 3000);
        }, 3000);
    }

    // function validarCC(e) {
    //     if (e.target.value.trim() === "") {
    //         email[e.target.name] = "";
    //         limpiarAlerta(e.target.parentElement);
    //         comprobarEmail();
    //         return;
    //     }

    //     if (e.target.id === "copy" && !validarEmail(e.target.value)) {
    //         mostrarAlerta(`El email no es valido`, e.target.parentElement);
    //         email[e.target.name] = "";
    //         comprobarEmail();
    //         return;
    //     }
    //     limpiarAlerta(e.target.parentElement);

    //     email[e.target.name] = e.target.value.trim().toLowerCase();

    //     comprobarEmail();
    // }

    function validar(e) {
        // el evento e al colocarla en el addeventlistener, ya esta presente aqui, por ello lo colocamos
        if (e.target.id !== "cc" && e.target.value.trim() === "") {
            // trim borra los espacios del final del string
            mostrarAlerta(
                `El campo ${e.target.id} es obligatorio`,
                e.target.parentElement
            ); // recuerda los parentesis pq lo mandas a llamar
            email[e.target.name] = "";
            comprobarEmail();
            return;
        }

        if (
            e.target.id === "cc" &&
            e.target.value !== "" &&
            !validarEmail(e.target.value)
        ) {
            mostrarAlerta(`El email no es valido`, e.target.parentElement);
            email[e.target.name] = e.target.value.trim().toLowerCase();
            comprobarEmail();
            return;
        }
        if (e.target.id === "email" && !validarEmail(e.target.value)) {
            mostrarAlerta(`El email no es valido`, e.target.parentElement);
            email[e.target.name] = "";
            comprobarEmail();
            return;
        }

        limpiarAlerta(e.target.parentElement);

        // * boton enviar disponible

        // Asignar los valores
        email[e.target.name] = e.target.value.trim().toLowerCase();
        // Comprobar el objeto de email
        console.log(email);
        comprobarEmail();
    }

    function mostrarAlerta(mensaje, referencia) {
        limpiarAlerta(referencia);

        // Generar alerta HTML
        const error = document.createElement("P"); // se recomienda colcoarlo en mayuscula
        error.textContent = mensaje; // no se usa innerHTML pq es propenso a sufrir web scripting... no escapa los datos, es menos seguro...
        error.classList.add("bg-red-600", "text-white", "p-2", "text-center");

        // Inyectar el error al formulario
        referencia.appendChild(error);
    }

    function limpiarAlerta(referencia) {
        // Comprueba si ya existe una alerta
        const alerta = referencia.querySelector(".bg-red-600"); // no olvides el punto al usar querySelector // acotas con "referencia" para borrar el elemento dentro de este mismo y no de todo el "document"
        if (alerta) {
            alerta.remove();
        }
    }

    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/; // las expresiones de la derecho son expresiones regulares
        const resultado = regex.test(email);
        console.log(resultado);
        return resultado;
    }

    function comprobarEmail() {
        if (
            email["email"] === "" ||
            email["asunto"] === "" ||
            email["mensaje"] === "" ||
            (email["cc"] !== "" && !validarEmail(email["cc"]))
        ) {
            btnSubmit.classList.add("opacity-50");
            btnSubmit.disabled = true;
            return;
        }

        btnSubmit.classList.remove("opacity-50");
        btnSubmit.disabled = false;
    }

    function resetFormulario() {
        // reiniciando el objeto (recuerda que también puedes hacerlo con punto en vez de corchete)
        email["email"] = "";
        email["cc"] = "";
        email["asunto"] = "";
        email["mensaje"] = "";

        formulario.reset();

        comprobarEmail();
    }
});
