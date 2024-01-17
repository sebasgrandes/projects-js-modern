import { datosCita, nuevaCita } from "../funciones.js";
import {
    mascotaInput,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    sintomasInput,
    formulario,
} from "../selectores.js";

export default class App {
    constructor() {
        this.initApp = this.initApp;
    }

    initApp() {
        formulario.addEventListener("submit", nuevaCita);
        // Eventos

        mascotaInput.addEventListener("change", datosCita);
        propietarioInput.addEventListener("change", datosCita);
        telefonoInput.addEventListener("change", datosCita);
        fechaInput.addEventListener("change", datosCita);
        horaInput.addEventListener("change", datosCita);
        sintomasInput.addEventListener("change", datosCita);
    }
}
